import * as fs from "fs/promises";
import { parse } from "csv-parse";

import { convertTime } from "./convertTime";
import { InputCsvRecord, RecordTimeSlot } from "../types";

export const readCsv = async (path: string): Promise<InputCsvRecord[]> => {
  const input = await fs.readFile(path, "utf8");
  const records: RecordTimeSlot[] = await new Promise((resolve, reject) => {
    parse(
      input,
      {
        columns: true,
        skip_empty_lines: true,
      },
      (err, output) => {
        if (err) reject(err);
        else resolve(output);
      },
    );
  });

  return records.map((row) => ({
    name: row.name,
    start_time: convertTime(row.start_time),
    end_time: convertTime(row.end_time),
    compatibility: row.compatibility,
  }));
};
