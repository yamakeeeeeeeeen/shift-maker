import { ShiftRecord } from "../types";

export const backtrackPairing = (
  pairsWithScore: { pair: ShiftRecord; score: number }[],
): ShiftRecord[] => {
  let bestPairing: ShiftRecord[] = [];

  const backtrack = (
    currentPairIndex: number,
    currentPairing: ShiftRecord[],
    usedCaregivers: Set<string>,
    usedUsers: Set<string>,
  ): void => {
    if (currentPairIndex === pairsWithScore.length) {
      if (currentPairing.length > bestPairing.length) {
        bestPairing = [...currentPairing];
      }
      return;
    }

    const { pair } = pairsWithScore[currentPairIndex];

    if (!usedCaregivers.has(pair.caregiver) && !usedUsers.has(pair.user)) {
      usedCaregivers.add(pair.caregiver);
      usedUsers.add(pair.user);
      backtrack(
        currentPairIndex + 1,
        [...currentPairing, pair],
        usedCaregivers,
        usedUsers,
      );
      usedCaregivers.delete(pair.caregiver);
      usedUsers.delete(pair.user);
    }

    backtrack(currentPairIndex + 1, currentPairing, usedCaregivers, usedUsers);
  };

  backtrack(0, [], new Set(), new Set());

  return bestPairing;
};
