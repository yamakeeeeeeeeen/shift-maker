export const generateCompatibilityMap = (
  compatibility: string[][],
): { [key: string]: { [key: string]: number } } => {
  const map: { [key: string]: { [key: string]: number } } = {};

  const headerRow = compatibility[0];
  for (const row of compatibility.slice(1)) {
    for (let i = 1; i < row.length; i++) {
      const score = Number(row[i]);

      if (isNaN(score)) {
        throw new Error(`互換性スコアが不正です: ${row[i]}`);
      }

      const caregiverName = headerRow[i];
      if (!map[caregiverName]) {
        map[caregiverName] = {};
      }
      map[caregiverName][row[0]] = score;
    }
  }

  return map;
};
