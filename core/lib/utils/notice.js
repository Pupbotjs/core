"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notice = void 0;
const colors_1 = require("./colors");
/** PupBot 规范化输出 */
exports.notice = {
    /** 输出 PupBot 规范化的提示消息 */
    info: (msg, newLine = false) => {
        console.log(`${newLine ? '\n' : ''}${colors_1.colors.cyan('info:')} ${msg}`);
    },
    /** 输出 PupBot 规范化的警告消息 */
    warn: (msg, newLine = false) => {
        console.log(`${newLine ? '\n' : ''}${colors_1.colors.yellow('warn:')} ${msg}`);
    },
    /** 输出 PupBot 规范化的成功消息 */
    success: (msg, newLine = false) => {
        console.log(`${newLine ? '\n' : ''}${colors_1.colors.green('sucess:')} ${msg}`);
    },
    /** 输出 PupBot 规范化的错误消息 */
    error: (msg, newLine = false) => {
        console.log(`${newLine ? '\n' : ''}${colors_1.colors.red('error:')} ${msg}`);
    }
};
