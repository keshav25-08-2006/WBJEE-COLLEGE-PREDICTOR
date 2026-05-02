import type { Chance } from '../types/index.js';

export function getChance(userRank: number, closingRank: number): Chance {
  if (userRank <= closingRank * 0.7) return 'Safe';
  if (userRank <= closingRank * 0.9) return 'Moderate';
  return 'Risky';
}

export function ciIncludes(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}
