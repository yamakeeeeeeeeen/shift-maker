import { formatTime } from "./formatTime";

describe("formatTime", () => {
  test("分が時間に変換されること", () => {
    expect(formatTime(480)).toBe("08:00"); // 8 hours * 60 minutes
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(1439)).toBe("23:59"); // 23 hours * 60 minutes + 59 minutes
  });
});
