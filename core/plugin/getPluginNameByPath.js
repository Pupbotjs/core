"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginNameByPath = void 0;
const node_os_1 = __importDefault(require("node:os"));
const isWin = node_os_1.default.platform() === 'win32';
/** 通过模块路径获取插件名称，如果是 `npm` 插件，则自动去掉 `pupbot-plugin-` 前缀 */
function getPluginNameByPath(path) {
    const paths = path.split(isWin ? '\\' : '/');
    return paths[paths.length - 1].replace(/^pupbot-plugin-/i, '');
}
exports.getPluginNameByPath = getPluginNameByPath;
