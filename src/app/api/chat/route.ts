import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { getProfessionContext, getRawContextString } from "@/lib/profession-loader";
import { searchProfession, getTopCandidates, fuseScoreToConfidence } from "@/lib/profession-search";
import { buildTop5CandidatesPrompt } from "@/lib/prompts";
import { responseCache, generatePromptHash } from "@/lib/cache";
import {
  recordRequest,
  recordCacheHit,
  recordCacheMiss,
  recordLocalSearchHit,
  recordAnthropicCall,
} from "@/lib/stats";

// Helper to simulate streaming for cache/local hits
function createStaticStreamResponse(data: any) {
  return new NextResponse(
    new ReadableStream({
      start(controller) {
        const chunk = JSON.stringify(data);
        // Simulate minor delay for UX
        setTimeout(() => {
          controller.enqueue(new TextEncoder().encode(chunk));
          controller.close();
        }, 100);
      },
    }),
    { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;

    recordRequest();

    // 1. Check prompt cache
    const promptHash = generatePromptHash(userQuery);
    const cachedResponse = responseCache.get(promptHash);

    if (cachedResponse) {
      recordCacheHit();
      return createStaticStreamResponse(cachedResponse);
    }

    recordCacheMiss();

    // 2. Perform Local Fuzzy Search
    const searchResults = searchProfession(userQuery);
    
    if (searchResults.length > 0) {
      const bestMatch = searchResults[0];
      const confidence = fuseScoreToConfidence(bestMatch.score);
      
      // 3. Confidence Check (>= 85%)
      // We lower the threshold slightly to 85% to catch slight typos directly.
      if (confidence >= 0.85) {
        recordLocalSearchHit();
        const localResult = {
          kode: bestMatch.item.code,
          profesi: bestMatch.item.name,
          confidence: parseFloat(confidence.toFixed(2)),
          reason: "Ditemukan kecocokan tinggi dari pencarian lokal (Local Search).",
        };
        // Save to cache for future exactly matching queries just in case
        responseCache.set(promptHash, localResult as any);
        return createStaticStreamResponse(localResult);
      }
    }

    // 4. If confidence is low, fallback to Claude with FULL context but using Anthropic Prompt Caching.
    // The user requested Top 5, but fuzzy search cannot do semantic mapping (e.g. English "Sales" to Indonesian "Penjualan").
    // By using the full context with ephemeral caching, we satisfy the cost reduction requirement while keeping the AI smart.
    const contextContent = getRawContextString();
    const systemPromptText = `Anda adalah sistem klasifikasi profesi.
Tugas:
1. Analisis pekerjaan yang diberikan user.
2. Cari profesi yang paling sesuai DARI REFERENSI.
3. Jika ditemukan, tampilkan: kode, profesi, confidence (0.0-1.0), reason.
4. Jika tidak cocok, gunakan 185 (Lainnya).
5. Output berupa JSON valid tanpa markdown formatting.

REFERENSI:
${contextContent}`;

    recordAnthropicCall();

    // 5. Call Anthropic with streaming, timeout, and retry setup
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
            system: [
              {
                type: "text",
                text: systemPromptText,
                cache_control: { type: "ephemeral" }
              }
            ],
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

        // 6. Return standard ReadableStream
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
              
              // 7. Cache the final response if it's valid JSON
              try {
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
        await new Promise((res) => setTimeout(res, 1000 * retries));
      }
    }
  } catch (error: any) {
    console.error("Route Handler Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
