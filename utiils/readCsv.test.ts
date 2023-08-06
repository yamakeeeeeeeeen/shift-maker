import * as fs from "fs/promises";
import { parse } from "csv-parse";
import { readCsv } from "./readCsv";

jest.mock("fs/promises");
jest.mock("csv-parse");

describe("readCsv", () => {
  it("CSVファイルを読み込み、パースしたデータを返すこと", async () => {
    // CSVデータをモック化
    const csvData = `name,start_time,end_time\nJohn,08:00,17:00\nJane,09:00,18:00`;

    // fs.readFileをモック化してモックのCSVデータを返すようにする
    (fs.readFile as jest.Mock).mockResolvedValue(csvData);

    // parse関数をモック化してCSVデータをJSONにパースするようにする
    (parse as jest.Mock).mockImplementation((_data, _options, callback) => {
      callback(null, [
        { name: "John", start_time: "08:00", end_time: "17:00" },
        { name: "Jane", start_time: "09:00", end_time: "18:00" },
      ]);
    });

    const result = await readCsv("someFile.csv");

    expect(fs.readFile).toHaveBeenCalledTimes(1);
    expect(fs.readFile).toHaveBeenCalledWith("someFile.csv", "utf8");

    expect(parse).toHaveBeenCalledTimes(1);
    expect(parse).toHaveBeenCalledWith(
      csvData,
      {
        columns: true,
        skip_empty_lines: true,
      },
      expect.any(Function),
    );

    expect(result).toEqual([
      { name: "John", start_time: 480, end_time: 1020 },
      { name: "Jane", start_time: 540, end_time: 1080 },
    ]);
  });
});
