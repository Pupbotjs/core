"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const icqq_1 = require("icqq");
const logger_1 = require("../logger");
/** 登录错误事件监听处理函数 */
function errorHandler({ code, message }) {
    const error = (msg, ...args) => {
        this.logger.error(msg, ...args);
        logger_1.PupLogger.error(msg, ...args);
    };
    if (code === icqq_1.LoginErrorCode.AccountFrozen) {
        error(`Bot 账号 ${this.uin} 被冻结，请在解除冻结后再尝试登录`);
        process.exit(0);
    }
    if (code === icqq_1.LoginErrorCode.WrongPassword) {
        error('账号密码错误，请通过 `pup init --force` 重新生成正确的配置文件');
        process.exit(0);
    }
    if (code === icqq_1.LoginErrorCode.TooManySms) {
        error('验证码发送过于频繁，请稍后再试');
        process.exit(0);
    }
    if (code === icqq_1.LoginErrorCode.WrongSmsCode) {
        error('短信验证码错误，验证失败，请重新尝试');
        process.exit(0);
    }
    error(`登录错误，错误码: ${code}，错误信息: ${message}`);
}
exports.errorHandler = errorHandler;
