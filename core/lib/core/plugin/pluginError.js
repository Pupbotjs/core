"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PupPluginError = void 0;
const log4js_1 = __importDefault(require("log4js"));
const utils_1 = require("../../utils");
/** PupBot 插件错误类 */
class PupPluginError extends Error {
    constructor(name, message) {
        super();
        this.name = 'PupPluginError';
        this.pluginName = name;
        this.message = message ?? '';
    }
    log() {
        const logger = log4js_1.default.getLogger('plugin');
        const info = `插件 ${utils_1.colors.cyan(this.pluginName)} 抛出错误: ${this.message}`;
        logger.error(info);
        return this.message;
    }
}
exports.PupPluginError = PupPluginError;
