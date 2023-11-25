import {
  readCompatibilityCsv,
  readCustomerCsv,
  readCustomerScheduleCsv,
  readEmployeeCsv,
} from "./readCsv";

describe("readCsv", () => {
  describe("readCompatibilityCsv", () => {
    it("CSVを読み込めること", async () => {
      expect(
        await readCompatibilityCsv("./test/csv/compatibility.csv"),
      ).toStrictEqual([
        {
          compatibility: "good",
          customer_id: "1",
          employee_id: "1",
          id: "1",
        },
        {
          compatibility: "bad",
          customer_id: "1",
          employee_id: "2",
          id: "2",
        },
        {
          compatibility: "bad",
          customer_id: "1",
          employee_id: "3",
          id: "3",
        },
        {
          compatibility: "bad",
          customer_id: "1",
          employee_id: "4",
          id: "4",
        },
        {
          compatibility: "good",
          customer_id: "1",
          employee_id: "5",
          id: "5",
        },
        {
          compatibility: "bad",
          customer_id: "1",
          employee_id: "6",
          id: "6",
        },
        {
          compatibility: "bad",
          customer_id: "1",
          employee_id: "7",
          id: "7",
        },
        {
          compatibility: "bad",
          customer_id: "1",
          employee_id: "8",
          id: "8",
        },
        {
          compatibility: "bad",
          customer_id: "1",
          employee_id: "9",
          id: "9",
        },
        {
          compatibility: "bad",
          customer_id: "1",
          employee_id: "10",
          id: "10",
        },
        {
          compatibility: "bad",
          customer_id: "2",
          employee_id: "1",
          id: "11",
        },
        {
          compatibility: "good",
          customer_id: "2",
          employee_id: "2",
          id: "12",
        },
        {
          compatibility: "bad",
          customer_id: "2",
          employee_id: "3",
          id: "13",
        },
        {
          compatibility: "bad",
          customer_id: "2",
          employee_id: "4",
          id: "14",
        },
        {
          compatibility: "bad",
          customer_id: "2",
          employee_id: "5",
          id: "15",
        },
        {
          compatibility: "good",
          customer_id: "2",
          employee_id: "6",
          id: "16",
        },
        {
          compatibility: "bad",
          customer_id: "2",
          employee_id: "7",
          id: "17",
        },
        {
          compatibility: "bad",
          customer_id: "2",
          employee_id: "8",
          id: "18",
        },
        {
          compatibility: "bad",
          customer_id: "2",
          employee_id: "9",
          id: "19",
        },
        {
          compatibility: "good",
          customer_id: "2",
          employee_id: "10",
          id: "20",
        },
        {
          compatibility: "bad",
          customer_id: "3",
          employee_id: "1",
          id: "21",
        },
        {
          compatibility: "bad",
          customer_id: "3",
          employee_id: "2",
          id: "22",
        },
        {
          compatibility: "good",
          customer_id: "3",
          employee_id: "3",
          id: "23",
        },
        {
          compatibility: "bad",
          customer_id: "3",
          employee_id: "4",
          id: "24",
        },
        {
          compatibility: "bad",
          customer_id: "3",
          employee_id: "5",
          id: "25",
        },
        {
          compatibility: "bad",
          customer_id: "3",
          employee_id: "6",
          id: "26",
        },
        {
          compatibility: "good",
          customer_id: "3",
          employee_id: "7",
          id: "27",
        },
        {
          compatibility: "bad",
          customer_id: "3",
          employee_id: "8",
          id: "28",
        },
        {
          compatibility: "bad",
          customer_id: "3",
          employee_id: "9",
          id: "29",
        },
        {
          compatibility: "bad",
          customer_id: "3",
          employee_id: "10",
          id: "30",
        },
      ]);
    });
  });

  describe("readCustomerCsv", () => {
    it("CSVを読み込めること", async () => {
      expect(await readCustomerCsv("./test/csv/customer.csv")).toStrictEqual([
        {
          id: "1",
          name: "後藤拓磨",
          disability_severity: "高",
          moving_addition: true,
          billable_hours: 90,
        },
        {
          id: "2",
          name: "山本真理子",
          disability_severity: "中",
          moving_addition: false,
          billable_hours: 80,
        },
        {
          id: "3",
          name: "佐々木健一",
          disability_severity: "低",
          moving_addition: true,
          billable_hours: 85,
        },
      ]);
    });
  });

  describe("readCustomerScheduleCsv", () => {
    it("CSVを読み込めること", async () => {
      expect(
        await readCustomerScheduleCsv("./test/csv/customer_schedule.csv"),
      ).toStrictEqual([
        {
          id: "1",
          customer_id: "1",
          customer_name: "後藤拓磨",
          start_date: "00:00",
          end_date: "24:00",
          service_type: "身・移・身",
          greeted: "自宅",
          sending: "自宅",
          meal: true,
          bathing: true,
        },
        {
          id: "2",
          customer_id: "2",
          customer_name: "山本真理子",
          start_date: "09:00",
          end_date: "15:00",
          service_type: "身",
          greeted: "自宅",
          sending: "自宅",
          meal: false,
          bathing: false,
        },
        {
          id: "3",
          customer_id: "3",
          customer_name: "佐々木健一",
          start_date: "09:00",
          end_date: "20:00",
          service_type: "身・移・身",
          greeted: "自宅",
          sending: "自宅",
          meal: true,
          bathing: false,
        },
      ]);
    });
  });

  describe("readEmployeeCsv", () => {
    it("CSVを読み込めること", async () => {
      expect(await readEmployeeCsv("./test/csv/employee.csv")).toStrictEqual([
        {
          id: "1",
          name: "田中太郎",
          is_night_shift: true,
          has_driver_license: true,
        },
        {
          id: "2",
          name: "佐藤花子",
          is_night_shift: false,
          has_driver_license: true,
        },
        {
          id: "3",
          name: "鈴木一郎",
          is_night_shift: true,
          has_driver_license: false,
        },
        {
          id: "4",
          name: "高橋純",
          is_night_shift: true,
          has_driver_license: true,
        },
        {
          id: "5",
          name: "伊藤静香",
          is_night_shift: false,
          has_driver_license: false,
        },
        {
          id: "6",
          name: "山田健二",
          is_night_shift: true,
          has_driver_license: true,
        },
        {
          id: "7",
          name: "中村真理",
          is_night_shift: false,
          has_driver_license: true,
        },
        {
          id: "8",
          name: "小林桜",
          is_night_shift: true,
          has_driver_license: false,
        },
        {
          id: "9",
          name: "加藤悠",
          is_night_shift: true,
          has_driver_license: true,
        },
        {
          id: "10",
          name: "渡辺直人",
          is_night_shift: false,
          has_driver_license: true,
        },
      ]);
    });
  });
});
