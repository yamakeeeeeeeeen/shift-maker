import * as fs from "fs/promises";
import * as path from "path";
import { createShiftTable } from "./createShiftTable";

const TEST_DIR = "./test";

describe("createShiftTable", () => {
  const outputFilePath = `${TEST_DIR}/output/shift.csv`;

  // テスト終了後に出力ファイルを削除
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
      const paths = {
        caregiver: `${TEST_DIR}/csv/v1/caregiver.csv`,
        user: `${TEST_DIR}/csv/v1/user.csv`,
        output: outputFilePath,
      };

      // 出力ディレクトリを作成
      const outputDir = path.dirname(paths.output);
      await fs.mkdir(outputDir, { recursive: true });

      await createShiftTable(paths);

      // 出力ファイルを読み込み
      const outputCsv = await fs.readFile(paths.output, "utf8");

      // 期待するCSV文字列（末尾の改行を削除）
      const expectedCsv = `"caregiver","user","start_time","end_time"\n"Alice","User3","09:00","17:00"\n"Bob","User1","10:00","15:00"\n"Charlie","User2","14:00","20:00"`;

      // 出力が期待するCSVと一致しているかを確認
      expect(outputCsv).toBe(expectedCsv);
    });

    it("v2: 全ての介護士とユーザーの組み合わせを確認し、なるべくあまりが出ないようにシフトテーブルが作成されること", async () => {
      const paths = {
        caregiver: `${TEST_DIR}/csv/v2/caregiver.csv`,
        user: `${TEST_DIR}/csv/v2/user.csv`,
        output: outputFilePath,
      };

      // 出力ディレクトリを作成
      const outputDir = path.dirname(paths.output);
      await fs.mkdir(outputDir, { recursive: true });

      await createShiftTable(paths);

      // 出力ファイルを読み込み
      const outputCsv = await fs.readFile(paths.output, "utf8");

      // 期待するCSV文字列（末尾の改行を削除）
      const expectedCsv = `"caregiver","user","start_time","end_time"\n"Alice","User3","09:00","17:00"\n"Bob","User1","10:00","15:00"\n"Charlie","User2","14:00","20:00"\n"Daniel","User5","11:00","17:00"\n"Eric","User4","12:00","18:00"`;

      // 出力が期待するCSVと一致しているかを確認
      expect(outputCsv).toBe(expectedCsv);
    });

    it("v3: 全ての介護士とユーザーの相性を考慮したシフトテーブルが作成されること（相性が良い組み合わせを作る）", async () => {
      const paths = {
        caregiver: `${TEST_DIR}/csv/v3/caregiver.csv`,
        user: `${TEST_DIR}/csv/v3/user.csv`,
        output: outputFilePath,
      };

      // 出力ディレクトリを作成
      const outputDir = path.dirname(paths.output);
      await fs.mkdir(outputDir, { recursive: true });

      await createShiftTable(paths);

      // 出力ファイルを読み込み
      const outputCsv = await fs.readFile(paths.output, "utf8");

      // 期待するCSV文字列（末尾の改行を削除）
      const expectedCsv = `"caregiver","user","start_time","end_time"\n"Alice","User1","10:00","15:00"\n"Charlie","User2","14:00","20:00"\n"Daniel","User5","11:00","17:00"\n"Eric","User4","12:00","18:00"\n"Franks","User3","09:00","17:00"`;

      // 出力が期待するCSVと一致しているかを確認
      expect(outputCsv).toBe(expectedCsv);
    });
  });
});
