/**
 * Compute tied ranks for a sorted (descending) array of participants.
 * Same score → same rank. Next rank skips (e.g., 1,1,3).
 */
export function computeRanks(sorted: { score: number }[]): number[] {
  const ranks: number[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].score === sorted[i - 1].score) {
      ranks.push(ranks[i - 1]);
    } else {
      ranks.push(i + 1);
    }
  }
  return ranks;
}
