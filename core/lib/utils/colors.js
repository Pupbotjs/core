"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeColor = exports.colors = void 0;
/** 控制台彩色字体 */
exports.colors = {
    /** 浅灰色前景（默认背景） */
    gray: colorful(90),
    /** 红色前景（默认背景） */
    red: colorful(31),
    /** 绿色前景（默认背景） */
    green: colorful(32),
    /** 黄色前景（默认背景） */
    yellow: colorful(33),
    /** 蓝色前景（默认背景） */
    blue: colorful(34),
    /** 紫色前景（默认背景） */
    magenta: colorful(35),
    /** 青色前景（默认背景） */
    cyan: colorful(36),
    /** 白色前景（默认背景） */
    white: colorful(37)
};
function escapeColor(colorText) {
    // eslint-disable-next-line no-control-regex
    return colorText.replace(/\u001b\[\d+m/gu, '');
}
exports.escapeColor = escapeColor;
/**
 * 控制台彩色字体
 *
 * @param {number} code - ANSI escape code
 */
function colorful(code) {
    return (msg) => `\u001b[${code}m${msg}\u001b[0m`;
}
