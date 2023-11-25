import {
  boolean,
  literal,
  nullable,
  number,
  object,
  Output,
  record,
  string,
  union,
} from "valibot";

export const inputCompatibilitySchema = object({
  id: string(),
  employee_id: string(),
  customer_id: string(),
  compatibility: union([literal("good"), literal("bad")]),
});
export type InputCompatibilityRecord = Output<typeof inputCompatibilitySchema>;
export const compatibilitySchema = inputCompatibilitySchema;
export type CompatibilityRecord = Output<typeof compatibilitySchema>;

export const inputCustomerSchema = object({
  id: string(),
  name: string(),
  disability_severity: nullable(
    union([literal("高"), literal("中"), literal("低")]),
  ),
  moving_addition: string(),
  billable_hours: string(),
});
export type InputCustomerRecord = Output<typeof inputCustomerSchema>;
export const customerSchema = object({
  id: string(),
  name: string(),
  disability_severity: nullable(
    union([literal("高"), literal("中"), literal("低")]),
  ),
  moving_addition: boolean(),
  billable_hours: number(),
});
export type CustomerRecord = Output<typeof customerSchema>;

export const inputCustomerScheduleSchema = object({
  id: string(),
  customer_id: string(),
  customer_name: string(),
  start_date: string(),
  end_date: string(),
  service_type: string(),
  greeted: string(),
  sending: string(),
  meal: string(),
  bathing: string(),
});
export type InputCustomerScheduleRecord = Output<
  typeof inputCustomerScheduleSchema
>;
export const customerScheduleSchema = object({
  id: string(),
  customer_id: string(),
  customer_name: string(),
  start_date: string(),
  end_date: string(),
  service_type: string(),
  greeted: string(),
  sending: string(),
  meal: boolean(),
  bathing: boolean(),
});
export type CustomerScheduleRecord = Output<typeof customerScheduleSchema>;

export const inputEmployeeSchema = object({
  id: string(),
  name: string(),
  is_night_shift: string(),
  has_driver_license: string(),
});
export type InputEmployeeRecord = Output<typeof inputEmployeeSchema>;
export const employeeSchema = object({
  id: string(),
  name: string(),
  is_night_shift: boolean(),
  has_driver_license: boolean(),
});
export type EmployeeRecord = Output<typeof employeeSchema>;

export const slotKeySchema = union([
  literal("pic1"),
  literal("pic2"),
  literal("pic3"),
  literal("pic4"),
  literal("pic5"),
]);
export type SlotKey = Output<typeof slotKeySchema>;
export const slotSchema = object({
  pic1: string(),
  pic2: string(),
  pic3: string(),
  pic4: string(),
  pic5: string(),
});
export type Slot = Output<typeof slotSchema>;
export const customerTimeSlotsSchema = record(string(), slotSchema);
export type CustomerTimeSlots = Output<typeof customerTimeSlotsSchema>;
export const extendedCustomerTimeSlotsSchema = record(
  string(),
  object({
    timeSlots: record(string(), string()), // "HH:mm ~ HH:mm" 形式の文字列
    service_type: string(),
    greeted: string(),
    sending: string(),
    meal: boolean(),
    bathing: boolean(),
  }),
);
export type ExtendedCustomerTimeSlots = Output<
  typeof extendedCustomerTimeSlotsSchema
>;

export const detailedAssignmentSchema = record(
  string(),
  record(string(), string()), // "start_time ~ end_time | employee.name(employee.id)" 形式の文字列
);
export type DetailedAssignment = Output<typeof detailedAssignmentSchema>;
