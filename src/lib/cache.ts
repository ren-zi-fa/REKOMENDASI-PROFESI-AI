import { LRUCache } from "lru-cache";
import { ClassificationResult } from "../types";

// Setup LRU cache for 24 hours TTL
export const responseCache = new LRUCache<string, ClassificationResult>({
  max: 500, // max 500 cached responses
  ttl: 1000 * 60 * 60 * 24, // 24 hours
});

// A simple helper function to generate hash/keys for the prompt cache
export function generatePromptHash(userMessage: string, contextVersion: string = "v1"): string {
  // Simple base64 encoding or just string concatenation can work for small inputs
  // For larger scale, use crypto module. Using simple lowercasing as key here since it's just the profession name
  return `${contextVersion}:${userMessage.trim().toLowerCase()}`;
}
