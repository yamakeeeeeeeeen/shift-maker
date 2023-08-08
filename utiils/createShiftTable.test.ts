import * as fs from "fs/promises";
import * as path from "path";
import { createShiftTable } from "./createShiftTable";

const TEST_DIR = "./test";
const outputFilePath = `${TEST_DIR}/output/shift.csv`;

const createAndCheckShiftTable = async (
  version: string,
  expectedCsv: string,
) => {
  const paths = {
    caregiver: `${TEST_DIR}/csv/${version}/caregiver.csv`,
    user: `${TEST_DIR}/csv/${version}/user.csv`,
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
    it("v1: 介護士とユーザーのCSVデータからシフトテーブルが適切に作成されること", async () => {
      const expected = `"caregiver","user","start_time","end_time"\n"Alice","User3","09:00","17:00"\n"Bob","User1","10:00","15:00"\n"Charlie","User2","14:00","20:00"`;
      await createAndCheckShiftTable("v1", expected);
    });

    it("v2: 全ての介護士とユーザーの組み合わせを確認し、なるべくあまりが出ないようにシフトテーブルが作成されること", async () => {
      const expected = `"caregiver","user","start_time","end_time"\n"Alice","User3","09:00","17:00"\n"Bob","User1","10:00","15:00"\n"Charlie","User2","14:00","20:00"\n"Daniel","User5","11:00","17:00"\n"Eric","User4","12:00","18:00"`;
      await createAndCheckShiftTable("v2", expected);
    });

    it("v3: 全ての介護士とユーザーの相性を考慮したシフトテーブルが作成されること（相性が良い組み合わせを作る）", async () => {
      const expected = `"caregiver","user","start_time","end_time"\n"Alice","User1","10:00","15:00"\n"Charlie","User2","14:00","20:00"\n"Daniel","User5","11:00","17:00"\n"Eric","User4","12:00","18:00"\n"Franks","User3","09:00","17:00"`;
      await createAndCheckShiftTable("v3", expected);
    });
  });
});
