"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backtrackPairing = void 0;
var backtrackPairing = function (pairsWithScore) {
    var bestPairing = [];
    var backtrack = function (currentPairIndex, currentPairing, usedCaregivers, usedUsers) {
        if (currentPairIndex === pairsWithScore.length) {
            if (currentPairing.length > bestPairing.length) {
                bestPairing = __spreadArray([], currentPairing, true);
            }
            return;
        }
        var pair = pairsWithScore[currentPairIndex].pair;
        if (!usedCaregivers.has(pair.caregiver) && !usedUsers.has(pair.user)) {
            usedCaregivers.add(pair.caregiver);
            usedUsers.add(pair.user);
            backtrack(currentPairIndex + 1, __spreadArray(__spreadArray([], currentPairing, true), [pair], false), usedCaregivers, usedUsers);
            usedCaregivers.delete(pair.caregiver);
            usedUsers.delete(pair.user);
        }
        backtrack(currentPairIndex + 1, currentPairing, usedCaregivers, usedUsers);
    };
    backtrack(0, [], new Set(), new Set());
    return bestPairing;
};
exports.backtrackPairing = backtrackPairing;
