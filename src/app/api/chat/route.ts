import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { getContextContent } from "@/lib/context-loader";
import { buildSystemPrompt } from "@/lib/prompts";
import { responseCache, generatePromptHash } from "@/lib/cache";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;

    // 1. Check prompt cache
    const promptHash = generatePromptHash(userQuery);
    const cachedResponse = responseCache.get(promptHash);

    if (cachedResponse) {
      // Return cached JSON response
      return new NextResponse(
        new ReadableStream({
          start(controller) {
            // Simulate streaming for the cache hit to keep client logic consistent
            const chunk = JSON.stringify(cachedResponse);
            controller.enqueue(new TextEncoder().encode(chunk));
            controller.close();
          },
        }),
        { headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    // 2. Load context and build prompt
    const contextContent = getContextContent();
    const systemPrompt = buildSystemPrompt(contextContent);

    // 3. Call Anthropic with streaming, timeout, and retry setup
    // Using standard abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    let retries = 0;
    const maxRetries = 2;

    while (retries <= maxRetries) {
      try {
        const client = getAnthropicClient();
        const stream = await client.messages.create(
          {
            model: "claude-sonnet-4-6",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [
              {
                role: "user",
                content: userQuery,
              },
            ],
            stream: true,
          },
          {
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        // 4. Return standard ReadableStream
        const readableStream = new ReadableStream({
          async start(controller) {
            let fullResponse = "";
            try {
              for await (const chunk of stream) {
                if (chunk.type === "content_block_delta" && "text" in chunk.delta) {
                  const text = chunk.delta.text;
                  fullResponse += text;
                  controller.enqueue(new TextEncoder().encode(text));
                }
              }
              
              // 5. Cache the final response if it's valid JSON
              try {
                // Ensure it's valid JSON before caching
                let jsonString = fullResponse;
                const match = fullResponse.match(/\{[\s\S]*\}/);
                if (match) {
                  jsonString = match[0];
                }
                const parsed = JSON.parse(jsonString);
                if (parsed && parsed.kode) {
                  responseCache.set(promptHash, parsed);
                }
              } catch (e) {
                console.warn("Failed to parse Claude output for caching", e);
              }
              
              controller.close();
            } catch (err) {
              controller.error(err);
            }
          },
        });

        return new NextResponse(readableStream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
          },
        });
      } catch (error: any) {
        retries++;
        if (retries > maxRetries) {
          clearTimeout(timeoutId);
          console.error("Anthropic API Error:", error);
          return NextResponse.json(
            { error: "Failed to generate response after retries." },
            { status: 500 }
          );
        }
        // Small delay before retry
        await new Promise((res) => setTimeout(res, 1000 * retries));
      }
    }
  } catch (error: any) {
    console.error("Route Handler Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
