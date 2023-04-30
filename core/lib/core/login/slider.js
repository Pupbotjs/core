"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliderHandler = void 0;
const clipboardy_1 = __importDefault(require("clipboardy"));
const utils_1 = require("../../utils");
const logger_1 = require("../logger");
/** 滑块事件监听处理函数 */
function sliderHandler({ url, isFirst }) {
    const info = (msg, ...args) => {
        this.logger.warn(msg, ...args);
        logger_1.PupLogger.warn(msg, ...args);
    };
    if (isFirst) {
        try{clipboardy_1.default.writeSync(url);}catch(e){}
        info(`需要验证滑块并抓取 ticket，(抓取教程自行搜索)，链接已自动复制到剪切板，你也可以手动复制：\n`);
        console.log(utils_1.colors.cyan(url) + '\n');
        info(`输入 ticket 后，按 \`Enter\` 键继续: \n`);
    }
    const inputTicket = () => {
        process.stdin.once('data', (data) => {
            const ticket = String(data).trim();
            if (!ticket) {
                return inputTicket();
            }
            this.submitSlider(ticket);
        });
    };
    inputTicket();
}
exports.sliderHandler = sliderHandler;
