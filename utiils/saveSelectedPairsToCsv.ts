import { ShiftRecord } from "../types";
import { Parser } from "json2csv";
import * as fs from "fs/promises";

export const saveSelectedPairsToCsv = async (
  selectedPairs: ShiftRecord[],
  outputPath: string,
) => {
  if (selectedPairs.length > 0) {
    const fields = ["caregiver", "user", "start_time", "end_time"];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(selectedPairs);
    await fs.writeFile(outputPath, csv);
  } else {
    throw new Error("マッチするシフトが見つかりません。");
  }
};
