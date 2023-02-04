"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exitWithError = void 0;
const notice_1 = require("./notice");
/** 停止 PupBot 框架进程并输出规范化 PupBot 错误信息 */
function exitWithError(msg) {
    notice_1.notice.error(msg);
    process.exit(1);
}
exports.exitWithError = exitWithError;
