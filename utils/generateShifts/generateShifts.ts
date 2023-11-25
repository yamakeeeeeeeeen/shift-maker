import {
  readCompatibilityCsv,
  readCustomerCsv,
  readCustomerScheduleCsv,
  readEmployeeCsv,
} from "../readCsv/readCsv";
import { generateTimeSlots } from "../generateTimeSlots/generateTimeSlots";
import { assignShifts } from "../assignShifts/assignShifts";
import { exportShiftsToCsv } from "../exportShiftsToCsv/exportShiftsToCsv";
import { CustomerTimeSlots, ExtendedCustomerTimeSlots } from "../../schema";

export const generateShifts = async () => {
  try {
    const [
      compatibilityData,
      customerData,
      customerScheduleData,
      employeeData,
    ] = await Promise.all([
      readCompatibilityCsv("./csv/compatibility.csv"),
      readCustomerCsv("./csv/customer.csv"),
      readCustomerScheduleCsv("./csv/customer_schedule.csv"),
      readEmployeeCsv("./csv/employee.csv"),
    ]);

    const customerTimeSlots = generateTimeSlots(customerScheduleData);

    const extendedCustomerTimeSlots = generateExtendedCustomerTimeSlots(
      customerTimeSlots,
      customerScheduleData,
    );
    const {} = extendedCustomerTimeSlots;

    const shifts = assignShifts(
      extendedCustomerTimeSlots,
      employeeData,
      customerData,
      compatibilityData,
    );

    console.log("shifts", shifts);

    exportShiftsToCsv(shifts, "./output/shifts.csv");
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

type CustomerScheduleRecord = {
  customer_id: string;
  customer_name: string;
  start_date: string;
  end_date: string;
  service_type: string;
  greeted: string;
  sending: string;
  meal: boolean;
  bathing: boolean;
};

const generateExtendedCustomerTimeSlots = (
  customerTimeSlots: CustomerTimeSlots,
  customerScheduleData: CustomerScheduleRecord[],
): ExtendedCustomerTimeSlots => {
  const extendedCustomerTimeSlots: ExtendedCustomerTimeSlots = {};

  for (const customerId in customerTimeSlots) {
    const customerInfo = customerScheduleData.find(
      (record) => record.customer_id === customerId,
    );
    if (!customerInfo) {
      throw new Error(
        `Customer with ID ${customerId} not found in schedule data`,
      );
    }

    extendedCustomerTimeSlots[customerId] = {
      timeSlots: customerTimeSlots[customerId],
      service_type: customerInfo.service_type,
      greeted: customerInfo.greeted,
      sending: customerInfo.sending,
      meal: customerInfo.meal,
      bathing: customerInfo.bathing,
    };
  }

  return extendedCustomerTimeSlots;
};
