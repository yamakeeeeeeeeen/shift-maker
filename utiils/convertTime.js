"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTime = void 0;
// Convert time string (e.g. 08:00) to minutes from 00:00
var convertTime = function (time) {
    var _a = time.split(":").map(Number), hour = _a[0], minute = _a[1];
    return hour * 60 + minute;
};
exports.convertTime = convertTime;
