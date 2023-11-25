import { isTimeSlotOverlapping } from "./isTimeSlotOverlapping";

describe("isTimeSlotOverlapping", () => {
  describe("正常系", () => {
    it("重複する時間帯の場合、trueを返す", () => {
      expect(isTimeSlotOverlapping("08:00 ~ 12:00", "10:00 ~ 14:00")).toBe(
        true,
      );
      expect(isTimeSlotOverlapping("14:00 ~ 18:00", "16:00 ~ 20:00")).toBe(
        true,
      );
    });

    it("重複しない時間帯の場合、falseを返す", () => {
      expect(isTimeSlotOverlapping("08:00 ~ 12:00", "12:00 ~ 16:00")).toBe(
        false,
      );
      expect(isTimeSlotOverlapping("14:00 ~ 18:00", "18:00 ~ 22:00")).toBe(
        false,
      );
    });

    it("エッジケースを処理する", () => {
      expect(isTimeSlotOverlapping("08:00 ~ 12:00", "12:01 ~ 16:00")).toBe(
        false,
      );
      expect(isTimeSlotOverlapping("08:00 ~ 12:00", "07:59 ~ 11:59")).toBe(
        true,
      );
    });
  });

  describe("異常系", () => {
    it("不正な形式の時間帯が渡された場合、エラーをスローする", () => {
      expect(() => isTimeSlotOverlapping("08:00 ~ 12:00", "invalid")).toThrow(
        "無効な時間形式: invalid",
      );
      expect(() => isTimeSlotOverlapping("invalid", "10:00 ~ 14:00")).toThrow(
        "無効な時間形式: invalid",
      );
    });

    it("パラメータが文字列でない場合、エラーをスローする", () => {
      expect(() => isTimeSlotOverlapping(123 as any, "10:00 ~ 14:00")).toThrow(
        "slot1 は文字列型でなければなりません",
      );
      expect(() => isTimeSlotOverlapping("08:00 ~ 12:00", null as any)).toThrow(
        "slot2 は文字列型でなければなりません",
      );
    });
  });
});
