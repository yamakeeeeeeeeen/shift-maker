"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OUTPUT_PATH = exports.OUTPUT_DIR = exports.INPUT_PATH = void 0;
var inputDir = "./csv";
exports.INPUT_PATH = {
    CAREGIVER: "".concat(inputDir, "/caregiver.csv"),
    USER: "".concat(inputDir, "/user.csv"),
};
exports.OUTPUT_DIR = "./output";
exports.OUTPUT_PATH = "".concat(exports.OUTPUT_DIR, "/shift.csv");
