import * as fs from "fs/promises";
import { parse } from "csv-parse";
import { convertTime } from "./convertTime";

type TimeSlot = {
  name: string;
  start_time: number;
  end_time: number;
};
type RecordTimeSlot = {
  name: string;
  start_time: string;
  end_time: string;
};

export const readCsv = async (path: string): Promise<TimeSlot[]> => {
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
  }));
};
