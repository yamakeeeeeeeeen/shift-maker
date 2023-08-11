"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePairsWithScore = void 0;
var formatTime_1 = require("./formatTime");
var generatePairsWithScore = function (caregivers, users, compatibilityMap) {
    var _a;
    var pairs = [];
    for (var _i = 0, caregivers_1 = caregivers; _i < caregivers_1.length; _i++) {
        var caregiver = caregivers_1[_i];
        for (var _b = 0, users_1 = users; _b < users_1.length; _b++) {
            var user = users_1[_b];
            if (caregiver.start_time <= user.start_time &&
                caregiver.end_time >= user.end_time) {
                var pair = {
                    caregiver: caregiver.name,
                    user: user.name,
                    start_time: (0, formatTime_1.formatTime)(user.start_time),
                    end_time: (0, formatTime_1.formatTime)(user.end_time),
                };
                var score = ((_a = compatibilityMap[caregiver.name]) === null || _a === void 0 ? void 0 : _a[user.name]) || 0;
                pairs.push({ pair: pair, score: score });
            }
        }
    }
    pairs.sort(function (a, b) { return b.score - a.score; });
    return pairs;
};
exports.generatePairsWithScore = generatePairsWithScore;
