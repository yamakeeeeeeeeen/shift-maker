import { getOptimalPairs } from "./getOptimalPairs";
import { ShiftRecord } from "../types";

describe("getOptimalPairs", () => {
  it("remainingPairsが空の場合、currentPairsを返すこと", () => {
    const result = getOptimalPairs(
      [],
      [
        {
          caregiver: "Alice",
          user: "User1",
          start_time: "10:00",
          end_time: "15:00",
        },
      ],
    );
    expect(result).toEqual([
      {
        caregiver: "Alice",
        user: "User1",
        start_time: "10:00",
        end_time: "15:00",
      },
    ]);
  });

  it("remainingPairsにペアが1つだけの場合、そのペアを返すこと", () => {
    const result = getOptimalPairs([
      {
        caregiver: "Bob",
        user: "User2",
        start_time: "11:00",
        end_time: "16:00",
      },
    ]);
    expect(result).toEqual([
      {
        caregiver: "Bob",
        user: "User2",
        start_time: "11:00",
        end_time: "16:00",
      },
    ]);
  });

  it("すでに取られているペアを考慮しないこと", () => {
    const currentPairs: ShiftRecord[] = [
      {
        caregiver: "Alice",
        user: "User1",
        start_time: "10:00",
        end_time: "15:00",
      },
    ];
    const remainingPairs: ShiftRecord[] = [
      {
        caregiver: "Alice",
        user: "User2",
        start_time: "11:00",
        end_time: "16:00",
      },
      {
        caregiver: "Bob",
        user: "User3",
        start_time: "12:00",
        end_time: "17:00",
      },
    ];
    const result = getOptimalPairs(remainingPairs, currentPairs);
    expect(result).toEqual([
      {
        caregiver: "Alice",
        user: "User1",
        start_time: "10:00",
        end_time: "15:00",
      },
      {
        caregiver: "Bob",
        user: "User3",
        start_time: "12:00",
        end_time: "17:00",
      },
    ]);
  });

  it("最適なペアの組み合わせを選ぶこと", () => {
    const currentPairs: ShiftRecord[] = [];
    const remainingPairs: ShiftRecord[] = [
      {
        caregiver: "Alice",
        user: "User1",
        start_time: "10:00",
        end_time: "15:00",
      },
      {
        caregiver: "Bob",
        user: "User2",
        start_time: "11:00",
        end_time: "16:00",
      },
      {
        caregiver: "Charlie",
        user: "User3",
        start_time: "12:00",
        end_time: "17:00",
      },
    ];
    const result = getOptimalPairs(remainingPairs, currentPairs);
    expect(result).toHaveLength(3);
  });
});
