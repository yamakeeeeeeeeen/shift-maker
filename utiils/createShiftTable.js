"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShiftTable = void 0;
var fs = require("fs/promises");
var json2csv_1 = require("json2csv");
var formatTime_1 = require("./formatTime");
var readCsv_1 = require("./readCsv");
var path = require("path");
var createShiftTable = function (paths) { return __awaiter(void 0, void 0, void 0, function () {
    var outputDir, caregivers, users, pairs, _i, caregivers_1, caregiver, _a, users_1, user, result, selectedCaregivers, selectedUsers, _b, pairs_1, pair, fields, json2csv_2, csv;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                outputDir = path.dirname(paths.output);
                return [4 /*yield*/, fs.mkdir(outputDir, { recursive: true })];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, readCsv_1.readCsv)(paths.caregiver)];
            case 2:
                caregivers = _c.sent();
                return [4 /*yield*/, (0, readCsv_1.readCsv)(paths.user)];
            case 3:
                users = _c.sent();
                pairs = [];
                // 介護士とユーザーの可能なペアをすべて作成する
                for (_i = 0, caregivers_1 = caregivers; _i < caregivers_1.length; _i++) {
                    caregiver = caregivers_1[_i];
                    for (_a = 0, users_1 = users; _a < users_1.length; _a++) {
                        user = users_1[_a];
                        if (caregiver.start_time <= user.start_time &&
                            caregiver.end_time >= user.end_time) {
                            pairs.push({
                                caregiver: caregiver.name,
                                user: user.name,
                                start_time: (0, formatTime_1.formatTime)(user.start_time),
                                end_time: (0, formatTime_1.formatTime)(user.end_time),
                            });
                        }
                    }
                }
                // シフトの開始時間でペアをソートする
                pairs.sort(function (a, b) { return a.start_time.localeCompare(b.start_time); });
                result = [];
                selectedCaregivers = [];
                selectedUsers = [];
                for (_b = 0, pairs_1 = pairs; _b < pairs_1.length; _b++) {
                    pair = pairs_1[_b];
                    if (selectedCaregivers.includes(pair.caregiver) ||
                        selectedUsers.includes(pair.user)) {
                        continue;
                    }
                    selectedCaregivers.push(pair.caregiver);
                    selectedUsers.push(pair.user);
                    result.push(pair);
                }
                if (!(result.length > 0)) return [3 /*break*/, 5];
                fields = ["caregiver", "user", "start_time", "end_time"];
                json2csv_2 = new json2csv_1.Parser({ fields: fields });
                csv = json2csv_2.parse(result);
                return [4 /*yield*/, fs.writeFile(paths.output, csv)];
            case 4:
                _c.sent();
                return [3 /*break*/, 6];
            case 5: throw new Error("マッチするシフトが見つかりません。");
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createShiftTable = createShiftTable;
