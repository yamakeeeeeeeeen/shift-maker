import { ShiftRecord } from "../types";

export const getOptimalPairs = (
  remainingPairs: ShiftRecord[],
  currentPairs: ShiftRecord[] = [],
): ShiftRecord[] => {
  if (remainingPairs.length === 0) return currentPairs;

  const [nextPair, ...restPairs] = remainingPairs;

  // ペアなしで次のステップへ進む
  const withoutNextPair = getOptimalPairs(restPairs, currentPairs);

  const isPairAlreadyTaken = currentPairs.some(
    (pair) =>
      pair.caregiver === nextPair.caregiver || pair.user === nextPair.user,
  );

  // すでに取られているペアがあれば、withoutNextPairの結果を返す
  if (isPairAlreadyTaken) {
    return withoutNextPair;
  }

  // ペアを取って次のステップへ進む
  const withNextPair = getOptimalPairs(restPairs, [...currentPairs, nextPair]);

  // 最適なペアの組み合わせを選ぶ
  return withNextPair.length > withoutNextPair.length
    ? withNextPair
    : withoutNextPair;
};
