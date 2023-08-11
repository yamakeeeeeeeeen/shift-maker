import { createOutputDirectory } from "./createOutputDirectory";
import { readCsv } from "./readCsv";
import { readCompatibilityCsv } from "./readCompatibilityCsv";
import { generateCompatibilityMap } from "./generateCompatibilityMap";
import { generatePairsWithScore } from "./generatePairsWithScore";
import { backtrackPairing } from "./backtrackPairing";
import { saveSelectedPairsToCsv } from "./saveSelectedPairsToCsv";

export const createShiftTable = async (paths: {
  caregiver: string;
  user: string;
  compatibility: string;
  output: string;
}) => {
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

  const selectedPairs = backtrackPairing(pairsWithScore);

  await saveSelectedPairsToCsv(selectedPairs, paths.output);
};
