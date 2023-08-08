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
exports.getOptimalPairs = void 0;
var getOptimalPairs = function (remainingPairs, currentPairs) {
    if (currentPairs === void 0) { currentPairs = []; }
    if (remainingPairs.length === 0)
        return currentPairs;
    var nextPair = remainingPairs[0], restPairs = remainingPairs.slice(1);
    // ペアなしで次のステップへ進む
    var withoutNextPair = (0, exports.getOptimalPairs)(restPairs, currentPairs);
    var isPairAlreadyTaken = currentPairs.some(function (pair) {
        return pair.caregiver === nextPair.caregiver || pair.user === nextPair.user;
    });
    // すでに取られているペアがあれば、withoutNextPairの結果を返す
    if (isPairAlreadyTaken) {
        return withoutNextPair;
    }
    // ペアを取って次のステップへ進む
    var withNextPair = (0, exports.getOptimalPairs)(restPairs, __spreadArray(__spreadArray([], currentPairs, true), [nextPair], false));
    // 最適なペアの組み合わせを選ぶ
    return withNextPair.length > withoutNextPair.length
        ? withNextPair
        : withoutNextPair;
};
exports.getOptimalPairs = getOptimalPairs;
