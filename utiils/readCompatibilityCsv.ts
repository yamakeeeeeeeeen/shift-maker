import * as fs from "fs/promises";
import { parse } from "csv-parse";

export const readCompatibilityCsv = async (
  path: string,
): Promise<string[][]> => {
  if (!(await fs.lstat(path))) {
    throw new Error(`ファイルが見つかりません: ${path}`);
  }

  const input = await fs.readFile(path, "utf8");
  return new Promise((resolve, reject) => {
    parse(
      input,
      {
        trim: true,
        skip_empty_lines: true,
      },
      (err, output) => {
        if (err) reject(err);
        else resolve(output);
      },
    );
  });
};
