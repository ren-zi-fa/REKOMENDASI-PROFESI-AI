import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("ANTHROPIC_API_KEY is not set in environment variables");
}

// Ensure server-side use only
let anthropicInstance: Anthropic | null = null;

export const getAnthropicClient = () => {
  if (!anthropicInstance) {
    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "missing-key",
    });
  }
  return anthropicInstance;
};
