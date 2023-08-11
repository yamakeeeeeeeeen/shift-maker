import { InputCsvRecord, ShiftRecord } from "../types";
import { formatTime } from "./formatTime";

export const generatePairsWithScore = (
  caregivers: InputCsvRecord[],
  users: InputCsvRecord[],
  compatibilityMap: { [key: string]: { [key: string]: number } },
): { pair: ShiftRecord; score: number }[] => {
  const pairs: { pair: ShiftRecord; score: number }[] = [];
  for (const caregiver of caregivers) {
    for (const user of users) {
      if (
        caregiver.start_time <= user.start_time &&
        caregiver.end_time >= user.end_time
      ) {
        const pair = {
          caregiver: caregiver.name,
          user: user.name,
          start_time: formatTime(user.start_time),
          end_time: formatTime(user.end_time),
        };
        const score = compatibilityMap[caregiver.name]?.[user.name] || 0;
        pairs.push({ pair, score });
      }
    }
  }
  pairs.sort((a, b) => b.score - a.score);
  return pairs;
};
