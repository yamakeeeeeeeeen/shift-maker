import { checkFileExist } from "./checkFileExist";

describe("checkFileExist", () => {
  it("存在しないファイルパスを指定した場合、エラーを出力すること", async () => {
    await expect(checkFileExist("./notFound")).rejects.toThrow(
      "ファイルが見つかりません: ./notFound",
    );
  });
});
