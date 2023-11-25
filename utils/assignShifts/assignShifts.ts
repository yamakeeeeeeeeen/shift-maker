import {
  CompatibilityRecord,
  CustomerRecord,
  CustomerTimeSlots,
  DetailedAssignment,
  EmployeeRecord,
  ExtendedCustomerTimeSlots,
  SlotKey,
} from "../../schema";
import { isTimeSlotOverlapping } from "../isTimeSlotOverlapping/isTimeSlotOverlapping";

export const assignShifts = (
  customerTimeSlots: ExtendedCustomerTimeSlots,
  employees: EmployeeRecord[],
  customers: CustomerRecord[],
  compatibilities: CompatibilityRecord[],
): DetailedAssignment => {
  // 顧客ごとのシフト割り当てを行う
  const assignment: DetailedAssignment = {};
  // 従業員の利用回数をカウントするオブジェクト
  const employeeUsageCount: { [id: number]: number } = {};
  // 従業員ごとのシフトのマップ
  const employeeTimeSlotMap: { [id: number]: string[] } = {};

  for (const customerId in customerTimeSlots) {
    // 顧客IDに対応する顧客を取得
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }

    // 顧客名を生成
    const customerName = `${customer?.name}(${customerId})`;
    // 顧客ごとの割り当てを初期化
    assignment[customerName] = {};
    for (const pic in customerTimeSlots[customerId].timeSlots) {
      // PICに対応するタイムスロットを取得
      const timeSlot = customerTimeSlots[customerId].timeSlots[pic as SlotKey];
      let assignedEmployee: EmployeeRecord | undefined;

      if (timeSlot !== "-") {
        // 利用可能な従業員をフィルタリング
        const availableEmployees = employees.filter((e) =>
          isEmployeeAvailableForTimeSlot(e.id, timeSlot, employeeTimeSlotMap),
        );

        // シフトの割り当てを行う
        assignedEmployee = selectEmployeeForShift(
          availableEmployees,
          customerId,
          pic as SlotKey,
          timeSlot,
          employeeUsageCount,
          compatibilities,
        );

        if (assignedEmployee) {
          // 割り当てられた従業員とシフトを記録
          assignment[customerName][
            pic
          ] = `${timeSlot} | ${assignedEmployee.name}(${assignedEmployee.id})`;

          // 従業員の利用回数とシフトを更新
          updateEmployeeUsageAndTimeSlot(
            assignedEmployee,
            timeSlot,
            employeeUsageCount,
            employeeTimeSlotMap,
          );
        } else {
          // 割り当てられた従業員がいない場合の処理
          assignment[customerName][pic] = `${timeSlot} | 担当無し`;
        }
      } else {
        // シフトが存在しない場合の処理
        assignment[customerName][pic] = timeSlot;
      }
    }
  }

  // 割り当てられたシフトを返す
  return assignment;
};

const MAX_WORK_HOURS_PER_DAY = 8;
// 従業員のシフトが利用可能かどうかをチェックする
export const isEmployeeAvailableForTimeSlot = (
  employeeId: string,
  timeSlot: string,
  employeeTimeSlotMap: { [id: string]: string[] },
): boolean => {
  // 既存のシフトを取得する。存在しない場合は空配列を使用する
  const existingSlots = employeeTimeSlotMap[employeeId] || [];
  // 既存のシフトに新しいシフトを追加して、総労働時間を計算する
  const totalWorkedHours = calculateWorkedHours([...existingSlots, timeSlot]);

  return (
    totalWorkedHours <= MAX_WORK_HOURS_PER_DAY && // 総労働時間が1日の最大労働時間以下であることを確認
    !existingSlots.some((slot) => isTimeSlotOverlapping(slot, timeSlot)) // 既存のシフトと新しいシフトが重複していないことを確認
  );
};

// 従業員が夜勤に適格かどうかをチェックする
export const isEmployeeEligibleForNightShift = (
  employee: EmployeeRecord,
): boolean => {
  return employee.is_night_shift;
};

// シフトのための従業員を選択する
export const selectEmployeeForShift = (
  availableEmployees: EmployeeRecord[],
  customerId: string,
  pic: SlotKey,
  timeSlot: string,
  employeeUsageCount: { [id: string]: number },
  compatibilities: CompatibilityRecord[],
): EmployeeRecord | undefined => {
  // 相性が 'bad' の従業員をフィルタリング
  const compatibleEmployees = availableEmployees.filter((e) => {
    const compatibility = compatibilities.find(
      (c) => c.customer_id === customerId && c.employee_id === e.id,
    );
    return compatibility ? compatibility.compatibility !== "bad" : true;
  });

  if (pic === "pic1" && timeSlot.startsWith("00:00")) {
    // PICが"pic1"でかつシフトが"00:00"から始まる場合
    return compatibleEmployees.find((e) => isEmployeeEligibleForNightShift(e)); // 夜勤に適格な従業員を返す
  } else {
    return compatibleEmployees.sort(
      // 利用回数が少ない順にソートして最初の従業員を返す
      (a, b) =>
        (employeeUsageCount[a.id] || 0) - (employeeUsageCount[b.id] || 0),
    )[0];
  }
};

const updateEmployeeUsageAndTimeSlot = (
  assignedEmployee: EmployeeRecord,
  timeSlot: string,
  employeeUsageCount: { [id: string]: number },
  employeeTimeSlotMap: { [id: string]: string[] },
): void => {
  employeeUsageCount[assignedEmployee.id] =
    (employeeUsageCount[assignedEmployee.id] || 0) + 1;
  employeeTimeSlotMap[assignedEmployee.id] = [
    ...(employeeTimeSlotMap[assignedEmployee.id] || []),
    timeSlot,
  ];
};

const calculateWorkedHours = (timeSlots: string[]): number => {
  return timeSlots.reduce((accum, timeSlot) => {
    const [start, end] = timeSlot
      .split(" ~ ")
      .map((t) => parseInt(t.split(":")[0], 10));
    return accum + (end - start);
  }, 0);
};
