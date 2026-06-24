// Singleton object to keep track of statistics
export interface AppStats {
  totalRequests: number;
  cacheHit: number;
  cacheMiss: number;
  localSearchHit: number;
  anthropicCalls: number;
  anthropicAvoided: number;
  estimatedTokenSavings: number;
}

const globalStats: AppStats = {
  totalRequests: 0,
  cacheHit: 0,
  cacheMiss: 0,
  localSearchHit: 0,
  anthropicCalls: 0,
  anthropicAvoided: 0,
  estimatedTokenSavings: 0,
};

export function getStats(): AppStats {
  return { ...globalStats };
}

export function recordRequest() {
  globalStats.totalRequests++;
}

export function recordCacheHit() {
  globalStats.cacheHit++;
  globalStats.anthropicAvoided++;
  globalStats.estimatedTokenSavings += 1500; // estimated
}

export function recordCacheMiss() {
  globalStats.cacheMiss++;
}

export function recordLocalSearchHit() {
  globalStats.localSearchHit++;
  globalStats.anthropicAvoided++;
  globalStats.estimatedTokenSavings += 1500; // estimated
}

export function recordAnthropicCall(savedTokensCount: number = 0) {
  globalStats.anthropicCalls++;
  globalStats.estimatedTokenSavings += savedTokensCount;
}
