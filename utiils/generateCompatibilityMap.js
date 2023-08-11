"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCompatibilityMap = void 0;
var generateCompatibilityMap = function (compatibility) {
    var map = {};
    var headerRow = compatibility[0];
    for (var _i = 0, _a = compatibility.slice(1); _i < _a.length; _i++) {
        var row = _a[_i];
        for (var i = 1; i < row.length; i++) {
            var score = Number(row[i]);
            if (isNaN(score)) {
                throw new Error("\u4E92\u63DB\u6027\u30B9\u30B3\u30A2\u304C\u4E0D\u6B63\u3067\u3059: ".concat(row[i]));
            }
            var caregiverName = headerRow[i];
            if (!map[caregiverName]) {
                map[caregiverName] = {};
            }
            map[caregiverName][row[0]] = score;
        }
    }
    return map;
};
exports.generateCompatibilityMap = generateCompatibilityMap;
