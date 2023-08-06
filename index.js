"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("./constants/path");
var createShiftTable_1 = require("./utiils/createShiftTable");
var main = function () {
    (0, createShiftTable_1.createShiftTable)({
        caregiver: path_1.INPUT_PATH.CAREGIVER,
        user: path_1.INPUT_PATH.USER,
        output: path_1.OUTPUT_PATH,
    }).catch(function (error) {
        console.error(error);
    });
};
main();
