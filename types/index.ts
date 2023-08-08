export type ShiftRecord = {
  caregiver: string;
  user: string;
  start_time: string;
  end_time: string;
};

export type InputCsvRecord = {
  name: string;
  start_time: number;
  end_time: number;
  compatibility: string;
};

export type RecordTimeSlot = {
  name: string;
  start_time: string;
  end_time: string;
  compatibility: string;
};
