import Fuse, { FuseResult } from 'fuse.js';
import { getProfessionContext, ProfessionData } from './profession-loader';

let fuseInstance: Fuse<ProfessionData> | null = null;

export function searchProfession(query: string): FuseResult<ProfessionData>[] {
  if (!fuseInstance) {
    const data = getProfessionContext();
    fuseInstance = new Fuse(data, {
      keys: ['name', 'aliases'],
      threshold: 0.3,
      includeScore: true,
      shouldSort: true,
    });
  }

  return fuseInstance.search(query);
}

// Looser search just for gathering candidates for Claude
export function getTopCandidates(query: string, max: number = 5): ProfessionData[] {
  if (!fuseInstance) {
    searchProfession(""); // initialize
  }
  
  // Use a temporary looser fuse instance or just rely on the existing one if 0.3 is enough.
  // Actually, 0.3 might filter out too much. Let's create a loose instance if we need to.
  const data = getProfessionContext();
  const looseFuse = new Fuse(data, {
    keys: ['name', 'aliases'],
    threshold: 0.6, // very loose
    includeScore: true,
  });

  const results = looseFuse.search(query);
  return results.slice(0, max).map(r => r.item);
}

// Convert fuse score (0.0 = perfect match, 1.0 = no match) to confidence score (1.0 = 100%, 0.0 = 0%)
export function fuseScoreToConfidence(score?: number): number {
  if (score === undefined) return 0;
  // A threshold of 0.3 means scores are roughly 0.0 to 0.3.
  // 0.0 -> 1.0, 0.3 -> 0.7 maybe?
  // Let's do a linear mapping: confidence = 1.0 - score
  return Math.max(0, 1.0 - score);
}
