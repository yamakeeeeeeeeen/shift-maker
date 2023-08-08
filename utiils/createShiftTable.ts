import * as fs from "fs/promises";
import * as path from "path";
import { Parser } from "json2csv";

import { formatTime } from "./formatTime";
import { readCsv } from "./readCsv";
import { getOptimalPairs } from "./getOptimalPairs";
import { ShiftRecord } from "../types";

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
  const preferredPairs: ShiftRecord[] = [];

  // 介護士とユーザーの可能なペアをすべて作成する
  for (const caregiver of caregivers) {
    for (const user of users) {
      if (
        caregiver.start_time <= user.start_time &&
        caregiver.end_time >= user.end_time
      ) {
        const pair = {
          caregiver: caregiver.name,
          user: user.name,
          start_time: formatTime(user.start_time),
          end_time: formatTime(user.end_time),
        };

        // 相性が良い場合はpreferredPairsに追加
        if (user.compatibility && user.compatibility.includes(caregiver.name)) {
          preferredPairs.push(pair);
        } else {
          pairs.push(pair);
        }
      }
    }
  }

  // 相性が良い組み合わせを優先的に試す
  const resultFromPreferred = getOptimalPairs(preferredPairs);
  // 他の組み合わせも試してマッチングの総数を最大化する
  const resultFromAll = getOptimalPairs(pairs, resultFromPreferred);

  const result =
    resultFromAll.length > resultFromPreferred.length
      ? resultFromAll
      : resultFromPreferred;

  if (result.length > 0) {
    const fields = ["caregiver", "user", "start_time", "end_time"];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(result);
    await fs.writeFile(paths.output, csv);
  } else {
    throw new Error("マッチするシフトが見つかりません。");
  }
};
