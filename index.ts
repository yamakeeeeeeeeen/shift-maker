import { INPUT_PATH, OUTPUT_PATH } from "./constants/path";
import { createShiftTable } from "./utiils/createShiftTable";

const main = () => {
  createShiftTable({
    caregiver: INPUT_PATH.CAREGIVER,
    user: INPUT_PATH.USER,
    output: OUTPUT_PATH,
  }).catch((error) => {
    console.error(error);
  });
};

main();
