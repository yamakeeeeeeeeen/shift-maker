import { createOutputDirectory } from "./createOutputDirectory";
import { readCsv } from "./readCsv";
import { readCompatibilityCsv } from "./readCompatibilityCsv";
import { generateCompatibilityMap } from "./generateCompatibilityMap";
import { generatePairsWithScore } from "./generatePairsWithScore";
import { saveSelectedPairsToCsv } from "./saveSelectedPairsToCsv";
import { scorePrioritizedPairing } from "./scorePrioritizedPairing";

export const createShiftTable = async (paths: {
  caregiver: string;
  user: string;
  compatibility: string;
  output: string;
}) => {
  // 処理開始のタイムスタンプを取得
  const startTime = Date.now();

  await createOutputDirectory(paths.output);

  const caregivers = await readCsv(paths.caregiver);
  const users = await readCsv(paths.user);
  const compatibilityMap = generateCompatibilityMap(
    await readCompatibilityCsv(paths.compatibility),
  );

  const pairsWithScore = generatePairsWithScore(
    caregivers,
    users,
    compatibilityMap,
  );

  const selectedPairs = scorePrioritizedPairing(pairsWithScore);

  await saveSelectedPairsToCsv(selectedPairs, paths.output);

  // 処理終了のタイムスタンプを取得
  const endTime = Date.now();
  console.log(`処理時間: ${endTime - startTime}ミリ秒`);
};
