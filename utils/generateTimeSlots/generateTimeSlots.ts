import {
  CustomerScheduleRecord,
  CustomerTimeSlots,
  Slot,
  SlotKey,
} from "../../schema";

const convertTimeToMinutes = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const convertMinutesToTime = (minutes: number): string => {
  const hour = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (minutes % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
};

const NIGHT_SHIFT_START = convertTimeToMinutes("00:00");
const NIGHT_SHIFT_END = convertTimeToMinutes("08:00");

export const generateTimeSlots = (
  customerScheduleData: CustomerScheduleRecord[],
): CustomerTimeSlots => {
  const timeSlots = {} as CustomerTimeSlots;

  for (const schedule of customerScheduleData) {
    let currentStartTime = convertTimeToMinutes(schedule.start_date);
    const end_time = convertTimeToMinutes(schedule.end_date);
    const customerId = schedule.customer_id;
    const slots: Slot = {
      pic1: "-",
      pic2: "-",
      pic3: "-",
      pic4: "-",
      pic5: "-",
    };

    let picCounter = 1;

    // Handle night shift
    if (
      currentStartTime >= NIGHT_SHIFT_START &&
      currentStartTime < NIGHT_SHIFT_END
    ) {
      const nightShiftEndTime = Math.min(NIGHT_SHIFT_END, end_time);
      slots.pic1 = `${convertMinutesToTime(
        currentStartTime,
      )} ~ ${convertMinutesToTime(nightShiftEndTime)}`;
      currentStartTime = nightShiftEndTime;
      picCounter++;
    }

    while (currentStartTime < end_time && picCounter <= 5) {
      let nextTime = currentStartTime + 240; // Adding 4 hours in minutes
      if (nextTime > end_time) {
        nextTime = end_time;
      }

      const slotKey = `pic${picCounter}` as SlotKey;
      slots[slotKey] = `${convertMinutesToTime(
        currentStartTime,
      )} ~ ${convertMinutesToTime(nextTime)}`;

      currentStartTime = nextTime;
      picCounter++;
    }

    timeSlots[customerId] = slots;
  }

  return timeSlots;
};
