import { generateTimeSlots } from "./generateTimeSlots";
import { CustomerScheduleRecord } from "../../schema";

const initialCustomerScheduleDataItem: CustomerScheduleRecord = {
  id: 1,
  customer_id: 1,
  customer_name: "",
  start_date: "00:00",
  end_date: "12:00",
  service_type: "",
  greeted: "",
  sending: "",
  meal: true,
  bathing: true,
};

describe("generateTimeSlots", () => {
  it("夜勤の時間帯が含まれる場合", () => {
    const customerScheduleData: CustomerScheduleRecord[] = [
      {
        ...initialCustomerScheduleDataItem,
        start_date: "00:00",
        end_date: "12:00",
      },
    ];
    const result = generateTimeSlots(customerScheduleData);
    expect(result[1].pic1).toBe("00:00 ~ 08:00");
    expect(result[1].pic2).toBe("08:00 ~ 12:00");
  });

  it("通常の時間帯のみの場合", () => {
    const customerScheduleData: CustomerScheduleRecord[] = [
      {
        ...initialCustomerScheduleDataItem,
        start_date: "08:00",
        end_date: "16:00",
      },
    ];
    const result = generateTimeSlots(customerScheduleData);
    expect(result[1].pic1).toBe("08:00 ~ 12:00");
    expect(result[1].pic2).toBe("12:00 ~ 16:00");
  });

  xit("不正なデータの場合", () => {
    const customerScheduleData: CustomerScheduleRecord[] = [
      {
        ...initialCustomerScheduleDataItem,
        start_date: "16:00",
        end_date: "08:00",
      },
    ];
    const result = generateTimeSlots(customerScheduleData);
    // TODO: 期待する結果が不明なため、こちらは適切に設定してください。
  });
});
