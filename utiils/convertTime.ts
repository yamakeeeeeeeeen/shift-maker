// Convert time string (e.g. 08:00) to minutes from 00:00
export const convertTime = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};
