"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jpFormat = void 0;
var utils_1 = require("./utils");
exports.jpFormat = function (_o, c) {
    var proto = c.prototype;
    var oldFormat = proto.format;
    proto.format = function (formatStr) {
        var _this = this;
        var result = formatStr.replace(/\[([^\]]+)]|r+|/g, function (match) {
            switch (match) {
                case 'rrrr':
                    return utils_1.getJpYear(_this.toDate());
                case 'rr':
                    return utils_1.getJpEra(_this.toDate());
                default:
                    return match;
            }
        });
        return oldFormat.bind(this)(result);
    };
};
