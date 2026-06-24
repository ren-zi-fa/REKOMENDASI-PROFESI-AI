import fs from "fs";
import path from "path";

// Simple singleton to keep cache of the context.md file
let globalContextCache: string | null = null;
let lastLoadTime: number = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache to automatically reload if file changes frequently, or we can use fs.watch

export function getContextContent(): string {
  const contextPath = path.join(process.cwd(), "context.md");
  
  // Try to load from cache
  if (globalContextCache && (Date.now() - lastLoadTime < CACHE_TTL)) {
    return globalContextCache;
  }

  try {
    const fileContent = fs.readFileSync(contextPath, "utf-8");
    globalContextCache = fileContent;
    lastLoadTime = Date.now();
    return globalContextCache;
  } catch (error) {
    console.error("Failed to load context.md", error);
    return "";
  }
}

// Function to force reload (if needed)
export function reloadContext(): void {
  globalContextCache = null;
}
