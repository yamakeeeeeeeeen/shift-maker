import {
  assignShifts,
  isEmployeeAvailableForTimeSlot,
  isEmployeeEligibleForNightShift,
  selectEmployeeForShift,
} from "./assignShifts";
import {
  CompatibilityRecord,
  CustomerRecord,
  CustomerTimeSlots,
  EmployeeRecord,
  ExtendedCustomerTimeSlots,
} from "../../schema";

const compatibilityRecords: CompatibilityRecord[] = [
  { id: "1", customer_id: "1", employee_id: "1", compatibility: "good" },
  { id: "2", customer_id: "1", employee_id: "2", compatibility: "bad" },
  // 他のレコードもこちらに追加可能です
];

describe("assignShifts", () => {
  const sampleEmployees: EmployeeRecord[] = [
    { id: "1", name: "Alice", is_night_shift: true, has_driver_license: false },
    { id: "2", name: "Bob", is_night_shift: false, has_driver_license: true },
  ];

  const sampleCustomers: CustomerRecord[] = [
    {
      id: "1",
      name: "Customer1",
      disability_severity: "高",
      moving_addition: true,
      billable_hours: 40,
    },
    {
      id: "2",
      name: "Customer2",
      disability_severity: "中",
      moving_addition: false,
      billable_hours: 35,
    },
  ];

  it("夜勤シフトの割り当て", () => {
    const customerTimeSlots: ExtendedCustomerTimeSlots = {
      1: {
        timeSlots: {
          pic1: "00:00 ~ 08:00",
          pic2: "-",
          pic3: "-",
          pic4: "-",
          pic5: "-",
        },
        service_type: "",
        greeted: "",
        sending: "",
        meal: true,
        bathing: true,
      },
    };
    const result = assignShifts(
      customerTimeSlots,
      sampleEmployees,
      sampleCustomers,
      compatibilityRecords,
    );
    expect(result["Customer1(1)"].pic1).toBe("00:00 ~ 08:00 | Alice(1)");
  });

  it("通常のシフトの割り当て", () => {
    const customerTimeSlots: ExtendedCustomerTimeSlots = {
      2: {
        timeSlots: {
          pic1: "08:00 ~ 12:00",
          pic2: "12:00 ~ 16:00",
          pic3: "-",
          pic4: "-",
          pic5: "-",
        },
        service_type: "",
        greeted: "",
        sending: "",
        meal: true,
        bathing: true,
      },
    };
    const result = assignShifts(
      customerTimeSlots,
      sampleEmployees,
      sampleCustomers,
      compatibilityRecords,
    );
    expect(result["Customer2(2)"].pic1).toBe("08:00 ~ 12:00 | Alice(1)");
    expect(result["Customer2(2)"].pic2).toBe("12:00 ~ 16:00 | Bob(2)"); // 次に使用回数が少ない従業員
  });

  // TODO: 従業員が足りない場合のテストケース追加
  it("従業員が足りない場合は担当無しと出力される", () => {
    const customerTimeSlots: ExtendedCustomerTimeSlots = {
      1: {
        timeSlots: {
          pic1: "00:00 ~ 08:00",
          pic2: "08:00 ~ 12:00",
          pic3: "12:00 ~ 16:00",
          pic4: "16:00 ~ 20:00",
          pic5: "20:00 ~ 24:00",
        },
        service_type: "",
        greeted: "",
        sending: "",
        meal: true,
        bathing: true,
      },
    };
    const result = assignShifts(
      customerTimeSlots,
      sampleEmployees.slice(0, 1),
      sampleCustomers,
      compatibilityRecords,
    ); // 従業員を1人だけにする
    expect(result["Customer1(1)"].pic1).toBe("00:00 ~ 08:00 | Alice(1)");
    expect(result["Customer1(1)"].pic2).toBe("08:00 ~ 12:00 | 担当無し");
  });
});

describe("isEmployeeAvailableForTimeSlot", () => {
  it("従業員が新しい時間帯で利用可能な場合", () => {
    const employeeTimeSlotMap = { 1: ["08:00 ~ 12:00"] };
    const result = isEmployeeAvailableForTimeSlot(
      "1",
      "12:00 ~ 16:00",
      employeeTimeSlotMap,
    );
    expect(result).toBe(true);
  });

  it("従業員が既に別の重複する時間帯で割り当てられている場合", () => {
    const employeeTimeSlotMap = { 1: ["08:00 ~ 12:00"] };
    const result = isEmployeeAvailableForTimeSlot(
      "1",
      "10:00 ~ 14:00",
      employeeTimeSlotMap,
    );
    expect(result).toBe(false);
  });
});

describe("isEmployeeEligibleForNightShift", () => {
  it("夜勤可能な従業員は夜勤に割り当てられる", () => {
    const employee = {
      id: "1",
      name: "Alice",
      is_night_shift: true,
      has_driver_license: false,
    };
    expect(isEmployeeEligibleForNightShift(employee)).toBe(true);
  });

  it("夜勤可能でない従業員は夜勤に割り当てられない", () => {
    const employee = {
      id: "2",
      name: "Bob",
      is_night_shift: false,
      has_driver_license: true,
    };
    expect(isEmployeeEligibleForNightShift(employee)).toBe(false);
  });
});

describe("selectEmployeeForShift", () => {
  const sampleEmployees: EmployeeRecord[] = [
    { id: "1", name: "Alice", is_night_shift: true, has_driver_license: false },
    { id: "2", name: "Bob", is_night_shift: false, has_driver_license: true },
    {
      id: "3",
      name: "Charlie",
      is_night_shift: false,
      has_driver_license: false,
    },
  ];

  const employeeUsageCount = { 1: 2, 2: 1, 3: 0 };

  it("夜勤の時間帯で夜勤可能な従業員が選ばれる", () => {
    const result = selectEmployeeForShift(
      sampleEmployees,
      "1",
      "pic1",
      "00:00 ~ 08:00",
      employeeUsageCount,
      compatibilityRecords,
    );
    expect(result).toEqual(sampleEmployees[0]); // Alice
  });

  it("夜勤の時間帯で夜勤不可な従業員は選ばれない", () => {
    const employees = sampleEmployees.slice(1); // Aliceを除外
    const result = selectEmployeeForShift(
      employees,
      "1",
      "pic1",
      "00:00 ~ 08:00",
      employeeUsageCount,
      compatibilityRecords,
    );
    expect(result).toBeUndefined();
  });

  it("組み合わせの回数が最も少ない従業員が選ばれる", () => {
    const result = selectEmployeeForShift(
      sampleEmployees,
      "1",
      "pic2",
      "08:00 ~ 12:00",
      employeeUsageCount,
      compatibilityRecords,
    );
    expect(result).toEqual(sampleEmployees[2]); // Charlie
  });
});
