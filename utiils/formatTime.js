"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = void 0;
// Convert minutes to time string (e.g. 08:00)
var formatTime = function (minutes) {
    var hour = Math.floor(minutes / 60);
    var minute = minutes % 60;
    return "".concat(hour.toString().padStart(2, "0"), ":").concat(minute
        .toString()
        .padStart(2, "0"));
};
exports.formatTime = formatTime;
