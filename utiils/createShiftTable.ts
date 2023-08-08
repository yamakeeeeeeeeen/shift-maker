import * as fs from "fs/promises";
import { Parser } from "json2csv";

import { formatTime } from "./formatTime";
import { readCsv } from "./readCsv";
import * as path from "path";

type ShiftRecord = {
  caregiver: string;
  user: string;
  start_time: string;
  end_time: string;
};

export const createShiftTable = async (paths: {
  caregiver: string;
  user: string;
  output: string;
}) => {
  // 出力ディレクトリの作成
  const outputDir = path.dirname(paths.output);
  await fs.mkdir(outputDir, { recursive: true });

  const caregivers = await readCsv(paths.caregiver);
  const users = await readCsv(paths.user);

  const pairs: ShiftRecord[] = [];

  // 介護士とユーザーの可能なペアをすべて作成する
  for (const caregiver of caregivers) {
    for (const user of users) {
      if (
        caregiver.start_time <= user.start_time &&
        caregiver.end_time >= user.end_time
      ) {
        pairs.push({
          caregiver: caregiver.name,
          user: user.name,
          start_time: formatTime(user.start_time),
          end_time: formatTime(user.end_time),
        });
      }
    }
  }

  // シフトの開始時間でペアをソートする
  pairs.sort((a, b) => a.start_time.localeCompare(b.start_time));

  // 最適なペアをフィルタリングする
  const result: ShiftRecord[] = [];
  const selectedCaregivers: string[] = [];
  const selectedUsers: string[] = [];
  for (const pair of pairs) {
    if (
      selectedCaregivers.includes(pair.caregiver) ||
      selectedUsers.includes(pair.user)
    ) {
      continue;
    }
    selectedCaregivers.push(pair.caregiver);
    selectedUsers.push(pair.user);
    result.push(pair);
  }

  if (result.length > 0) {
    const fields = ["caregiver", "user", "start_time", "end_time"];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(result);
    await fs.writeFile(paths.output, csv);
  } else {
    throw new Error("マッチするシフトが見つかりません。");
  }
};
