"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJpEra = exports.getJpYear = exports.findEra = void 0;
var eras_1 = require("./eras");
exports.findEra = function (date) {
    var _a;
    var time = date.getTime();
    var era = eras_1.default.find(function (e) { return time >= (new Date(e.from)).getTime(); });
    return (_a = era === null || era === void 0 ? void 0 : era.name) !== null && _a !== void 0 ? _a : '';
};
exports.getJpYear = function (date) {
    var result;
    try {
        result = Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
            year: '2-digit',
            era: 'long'
        }).format(date).slice(0, -1);
        if (!isNaN(Number(result))) {
            result = exports.findEra(date) + result;
        }
    }
    catch (_a) {
        result = '該当なし';
    }
    return result;
};
exports.getJpEra = function (date) {
    var result;
    try {
        result = Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
            era: 'long'
        }).format(date).slice(0, 2);
        if (!isNaN(Number(result))) {
            result = exports.findEra(date) + result;
        }
    }
    catch (_a) {
        result = '不明';
    }
    return result;
};
