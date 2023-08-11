import { InputCsvRecord, RecordTimeSlot } from "../types";
import * as fs from "fs/promises";
import { parse } from "csv-parse";
import { convertTime } from "./convertTime";

const isValidTime = (time: string): boolean => {
  const timePattern = /^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return timePattern.test(time);
};

export const readCsv = async (path: string): Promise<InputCsvRecord[]> => {
  if (!(await fs.lstat(path))) {
    throw new Error(`ファイルが見つかりません: ${path}`);
  }

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

  for (const record of records) {
    if (!isValidTime(record.start_time) || !isValidTime(record.end_time)) {
      throw new Error(
        `CSVに不正なレコード形式が含まれています。名前: ${record.name}, 開始時間: ${record.start_time}, 終了時間: ${record.end_time}`,
      );
    }
  }

  return records.map((row) => ({
    name: row.name,
    start_time: convertTime(row.start_time),
    end_time: convertTime(row.end_time),
  }));
};
