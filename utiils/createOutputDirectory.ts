import * as path from "path";
import * as fs from "fs/promises";

export const createOutputDirectory = async (outputPath: string) => {
  try {
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    throw new Error(
      `出力ディレクトリの作成に失敗しました: ${(error as any).message}`,
    );
  }
};
