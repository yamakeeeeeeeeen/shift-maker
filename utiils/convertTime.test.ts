import { convertTime } from "./convertTime";

describe("convertTime", () => {
  test("時間が分に変換されること", () => {
    expect(convertTime("08:00")).toBe(480); // 8 hours * 60 minutes
    expect(convertTime("00:00")).toBe(0);
    expect(convertTime("23:59")).toBe(1439); // 23 hours * 60 minutes + 59 minutes
  });
});
