"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceHandler = void 0;
const clipboardy_1 = __importDefault(require("clipboardy"));
const prompts_1 = __importDefault(require("prompts"));
const utils_1 = require("../../utils");
const logger_1 = require("../logger");
/** 设备锁验证监听处理函数 */
async function deviceHandler(device_mode, event) {
    const info = (msg, ...args) => {
        this.logger.warn(msg, ...args);
        logger_1.PupLogger.warn(msg, ...args);
    };
    const phone = utils_1.colors.cyan(event.phone);
    if (device_mode === 'sms') {
        info(`需要验证设备锁，按 \`Enter\` 键发送短信验证码到手机号 ${phone} 进行验证`);
        process.stdin.once('data', async () => {
            this.sendSmsCode();
            info(`短信验证码已发送至手机号 ${phone}，输入后按 \`Enter\` 键继续`);
            const { sms } = await (0, prompts_1.default)({
                type: 'number',
                name: 'sms',
                max: 999999,
                validate: (sms) => (!sms ? '短信验证码不为空' : true),
                message: `请输入短信验证码（${phone}）`
            });
            this.submitSmsCode(sms);
        });
    }
    else {
        clipboardy_1.default.writeSync(event.url);
        info(`需要扫描二维码验证设备锁，二维码链接已自动复制到剪切板，你也可以手动复制：\n`);
        console.log(utils_1.colors.cyan(event.url) + '\n');
        info(`扫码验证完成后，按 \`Enter\` 键继续...`);
        process.stdin.once('data', () => this.login());
    }
}
exports.deviceHandler = deviceHandler;
