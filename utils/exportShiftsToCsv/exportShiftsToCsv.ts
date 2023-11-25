import fs from "fs";
import { DetailedAssignment } from "../../schema";

const CSV_HEADER = "id,Customer,pic1,pic2,pic3,pic4,pic5";

export const exportShiftsToCsv = (
  shifts: DetailedAssignment,
  filePath: string,
): void => {
  // Initialize ID counter starting from 1
  let id_counter = 1;

  // Convert shifts to new CSV format
  const csvRows = [CSV_HEADER];

  for (const [customerName, timeSlotData] of Object.entries(shifts)) {
    let row = `${id_counter},${customerName}`;

    for (let i = 1; i <= 5; i++) {
      const timeSlot = `pic${i}`;
      const assignedEmployee = timeSlotData[timeSlot] || "";
      row += `,${assignedEmployee}`;
    }
    csvRows.push(row);
    id_counter++; // Increment the ID for the next row
  }

  const csvContent = csvRows.join("\n");

  // Save to CSV file
  fs.writeFileSync(filePath, csvContent);
};
