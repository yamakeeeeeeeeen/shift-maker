import * as fs from "fs/promises";

export const checkFileExist = async (path: string) => {
  try {
    await fs.lstat(path);
  } catch (error) {
    throw new Error(`ファイルが見つかりません: ${path}`);
  }
};
