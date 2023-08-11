import { ShiftRecord } from "../types";

export const scorePrioritizedPairing = (
  pairsWithScore: { pair: ShiftRecord; score: number }[],
): ShiftRecord[] => {
  const usedCaregivers = new Set<string>();
  const usedUsers = new Set<string>();
  const result: ShiftRecord[] = [];

  // スコアで降順にソート
  pairsWithScore.sort((a, b) => b.score - a.score);

  for (const { pair } of pairsWithScore) {
    // 既にマッチングされていない場合のみマッチングを追加
    if (!usedCaregivers.has(pair.caregiver) && !usedUsers.has(pair.user)) {
      result.push(pair);
      usedCaregivers.add(pair.caregiver);
      usedUsers.add(pair.user);
    }
  }

  return result;
};
