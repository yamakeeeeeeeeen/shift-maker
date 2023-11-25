import {
  CompatibilityRecord,
  compatibilitySchema,
  CustomerRecord,
  CustomerScheduleRecord,
  customerScheduleSchema,
  customerSchema,
  EmployeeRecord,
  employeeSchema,
  InputCompatibilityRecord,
  InputCustomerRecord,
  InputCustomerScheduleRecord,
  inputCustomerScheduleSchema,
  inputCustomerSchema,
  InputEmployeeRecord,
  inputEmployeeSchema,
} from "../../schema";
import * as fs from "fs/promises";
import { parse as csvParse } from "csv-parse";
import { parse } from "valibot";

export const readCompatibilityCsv = async (
  path: string,
): Promise<CompatibilityRecord[]> => {
  const records = await readCsv<InputCompatibilityRecord>(path);

  const convertToCompatibilityRecord = (
    row: InputCompatibilityRecord,
  ): CompatibilityRecord => {
    try {
      return parse(compatibilitySchema, row);
    } catch (error) {
      throw error;
    }
  };

  return records.map(convertToCompatibilityRecord);
};

export const readCustomerCsv = async (
  path: string,
): Promise<CustomerRecord[]> => {
  const records = await readCsv<InputCustomerRecord>(path);

  const convertToCustomerRecord = (
    row: InputCustomerRecord,
  ): CustomerRecord => {
    try {
      const { moving_addition, billable_hours, ...rest } = parse(
        inputCustomerSchema,
        row,
      );
      const r = {
        ...rest,
        moving_addition: stringToBoolean(moving_addition),
        billable_hours: Number(billable_hours),
      };
      return parse(customerSchema, r);
    } catch (error) {
      throw error;
    }
  };

  return records.map(convertToCustomerRecord);
};

export const readCustomerScheduleCsv = async (
  path: string,
): Promise<CustomerScheduleRecord[]> => {
  const records = await readCsv<InputCustomerScheduleRecord>(path);

  const convertToCustomerScheduleRecord = (
    row: InputCustomerScheduleRecord,
  ): CustomerScheduleRecord => {
    try {
      const { customer_id, meal, bathing, ...rest } = parse(
        inputCustomerScheduleSchema,
        row,
      );
      const r = {
        ...rest,
        customer_id: customer_id,
        meal: stringToBoolean(meal),
        bathing: stringToBoolean(bathing),
      };
      return parse(customerScheduleSchema, r);
    } catch (error) {
      throw error;
    }
  };

  return records.map(convertToCustomerScheduleRecord);
};

export const readEmployeeCsv = async (
  path: string,
): Promise<EmployeeRecord[]> => {
  const records = await readCsv<InputEmployeeRecord>(path);

  const convertToEmployeeRecord = (
    row: InputEmployeeRecord,
  ): EmployeeRecord => {
    try {
      const { is_night_shift, has_driver_license, ...rest } = parse(
        inputEmployeeSchema,
        row,
      );
      const r = {
        ...rest,
        is_night_shift: stringToBoolean(is_night_shift),
        has_driver_license: stringToBoolean(has_driver_license),
      };
      return parse(employeeSchema, r);
    } catch (error) {
      throw error;
    }
  };

  return records.map(convertToEmployeeRecord);
};

const checkFileExist = async (path: string) => {
  try {
    await fs.lstat(path);
  } catch (error) {
    throw new Error(`ファイルが見つかりません: ${path}`);
  }
};

const stringToBoolean = (value: string): boolean => value === "true";

async function readCsv<T>(path: string): Promise<T[]> {
  await checkFileExist(path);
  const input = await fs.readFile(path, "utf8");

  return new Promise<T[]>((resolve, reject) => {
    csvParse(
      input,
      {
        columns: true,
        skip_empty_lines: true,
      },
      (err, output) => {
        if (err) reject(err);
        else resolve(output);
      },
    );
  });
}
