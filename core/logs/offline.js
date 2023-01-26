"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offlineHandler = void 0;
const logger_1 = require("../logger");
const utils_1 = require("../../utils");
/** 下线监听函数，打印框架日志 */
function offlineHandler({ message }) {
    logger_1.PupLogger.fatal(utils_1.colors.magenta(message));
}
exports.offlineHandler = offlineHandler;
