import * as fs from "fs/promises";
import * as path from "path";
import { createShiftTable } from "./createShiftTable";
import { describe } from "node:test";

const TEST_DIR = "./test";
const outputFilePath = `${TEST_DIR}/output/shift.csv`;

const createAndCheckShiftTable = async (
  version: string,
  expectedCsv: string,
) => {
  const paths = {
    caregiver: `${TEST_DIR}/csv/${version}/caregiver.csv`,
    user: `${TEST_DIR}/csv/${version}/user.csv`,
    compatibility: `${TEST_DIR}/csv/${version}/compatibility.csv`,
    output: outputFilePath,
  };

  // 出力ディレクトリを作成
  const outputDir = path.dirname(paths.output);
  await fs.mkdir(outputDir, { recursive: true });

  await createShiftTable(paths);

  // 出力ファイルを読み込み
  const outputCsv = await fs.readFile(paths.output, "utf8");

  // 出力が期待するCSVと一致しているかを確認
  expect(outputCsv).toBe(expectedCsv);
};

describe("createShiftTable", () => {
  afterAll(async () => {
    try {
      await fs.unlink(outputFilePath);
    } catch (error) {
      if ((error as any).code !== "ENOENT") {
        throw error;
      }
    }
  });

  describe("ユーザーの利用開始時間を元に結果がソートされていること", () => {
    describe("介護士とユーザーの相性がフラットな場合", () => {
      it("v1: 全ての介護士とユーザーの相性を考慮しないシフトテーブルが作成されること", async () => {
        const expected = `
"caregiver","user","start_time","end_time"
"Alice","User1","10:00","15:00"
"Bob","User3","09:00","17:00"
"Charlie","User2","14:00","20:00"
"Daniel","User4","12:00","18:00"
"Franks","User5","11:00","17:00"
`.trim();
        await createAndCheckShiftTable("v1", expected);
      });
    });

    describe("介護士とユーザーの相性にパターンがある場合", () => {
      it("v2: マッチング数の最大化よりも相性が優先してシフトテーブルが作成されること", async () => {
        const expected = `
"caregiver","user","start_time","end_time"
"Alice","User4","12:00","18:00"
"Bob","User1","10:00","15:00"
"Charlie","User2","14:00","20:00"
"Daniel","User5","11:00","17:00"
`.trim();
        await createAndCheckShiftTable("v2", expected);
      });

      it("v3: マッチング数の最大化をしつつ、その中でより相性の良い組み合わせでシフトテーブルが作成されること", async () => {
        const expected = `
"caregiver","user","start_time","end_time"
"Alice","User3","09:00","17:00"
"Bob","User1","10:00","15:00"
"Charlie","User2","14:00","20:00"
"Daniel","User4","12:00","18:00"
"Franks","User5","11:00","17:00"
`.trim();
        await createAndCheckShiftTable("v3", expected);
      });
    });
  });
});
