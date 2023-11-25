// 時間帯が重複するかどうかを判断する関数
export const isTimeSlotOverlapping = (
  slot1: string,
  slot2: string,
): boolean => {
  validateStringType(slot1, "slot1");
  validateStringType(slot2, "slot2");

  const [start1, end1] = slot1.split(" ~ ").map(convertTimeToMinutes);
  const [start2, end2] = slot2.split(" ~ ").map(convertTimeToMinutes);

  return !(end1 <= start2 || end2 <= start1);
};

// 引数が文字列型であるか確認するヘルパー関数
const validateStringType = (arg: unknown, argName: string): void => {
  if (typeof arg !== "string") {
    throw new Error(`${argName} は文字列型でなければなりません`);
  }
};

// 時間（HH:MM）を分に変換するヘルパー関数
const convertTimeToMinutes = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  if (isNaN(hour) || isNaN(minute)) {
    throw new Error(`無効な時間形式: ${time}`);
  }
  return hour * 60 + minute;
};
