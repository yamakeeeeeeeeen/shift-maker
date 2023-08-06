import * as fs from "fs/promises";
import { Parser } from "json2csv";

import { formatTime } from "./formatTime";
import { readCsv } from "./readCsv";
import * as path from "path";

export const createShiftTable = async (paths: {
  caregiver: string;
  user: string;
  output: string;
}) => {
  // 出力ディレクトリを作成
  const outputDir = path.dirname(paths.output);
  await fs.mkdir(outputDir, { recursive: true });

  const caregivers = await readCsv(paths.caregiver);
  let users = await readCsv(paths.user);

  const result = [];

  for (const caregiver of caregivers) {
    let matchedUserIndex = -1;
    for (let i = 0; i < users.length; i++) {
      if (
        caregiver.start_time <= users[i].start_time &&
        caregiver.end_time >= users[i].end_time
      ) {
        result.push({
          caregiver: caregiver.name,
          user: users[i].name,
          start_time: formatTime(users[i].start_time),
          end_time: formatTime(users[i].end_time),
        });
        matchedUserIndex = i;
        break;
      }
    }
    if (matchedUserIndex !== -1) {
      users = users.filter((_, index) => index !== matchedUserIndex);
    }
  }

  if (result.length > 0) {
    const fields = ["caregiver", "user", "start_time", "end_time"];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(result);
    await fs.writeFile(paths.output, csv);
  } else {
    throw new Error("No matching shift found.");
  }
};
