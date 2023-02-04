"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUin = exports.ensureArray = exports.stringifyError = exports.getTargetId = exports.time = exports.randomItem = exports.randomInt = exports.qs = exports.md5 = exports.wait = exports.dayjs = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
exports.dayjs = dayjs_1.default;
const node_crypto_1 = __importDefault(require("node:crypto"));
/**
 * 异步延时函数
 * @param {number} ms 等待毫秒数
 * @return {Promise<void>}
 */
async function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
exports.wait = wait;
/**
 * MD5 加密
 * @param {BinaryLike} text 待 MD5 加密数据，可以是 `string` 字符串
 * @param {BinaryToTextEncoding | undefined} encoding 返回数据编码，不传返回 `Buffer`，可传 `hex` 等返回字符串
 * @return {Buffer | string} MD5 加密后的数据
 */
function md5(text, encoding) {
    const hash = node_crypto_1.default.createHash('md5').update(text);
    if (encoding) {
        return hash.digest(encoding);
    }
    return hash.digest();
}
exports.md5 = md5;
/**
 * JS 对象转换成 `urlencoded` 格式字符串 { name: 'Bob', age: 18 } => name=Bob&age=18
 * @param {Record<number | string, any>} obj JS 对象
 * @return {string} 转换后的字符串
 */
function qs(obj) {
    return new URLSearchParams(obj).toString();
}
exports.qs = qs;
/**
 * 生成随机整数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @return {number} 随机范围内的整数
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.randomInt = randomInt;
/**
 * 取数组内随机一项
 * @param {Array<T>} array 待操作数组
 * @return {T} 随机范围内的整数
 */
function randomItem(array) {
    return array[randomInt(0, array.length - 1)];
}
exports.randomItem = randomItem;
/**
 * 取格式化时间，默认当前时间，使用 dayjs 的 format 函数封装
 * @param {string | undefined} format 格式化模板，默认'YYYY-MM-DD HH:mm'
 * @param {Date | undefined} date 待格式化的时间，默认当前时间
 * @return {string} 格式化后的时间字符串
 */
function time(format, date) {
    return (0, dayjs_1.default)(date ?? new Date()).format(format ?? 'YYYY-MM-DD HH:mm');
}
exports.time = time;
/**
 * 取消息来源的目标 id，私聊取好友QQ，群聊取群号，讨论组取讨论组号
 * @param {AllMessageEvent} event 消息事件参数
 * @return {number} 目标 id
 */
function getTargetId(event) {
    switch (event.message_type) {
        case 'private':
            return event.sender.user_id;
        case 'group':
            return event.group_id;
        case 'discuss':
            return event.discuss_id;
    }
}
exports.getTargetId = getTargetId;
/**
 * 错误 stringify
 * @param {any} error 待处理错误
 * @return {string} stringify 结果
 */
function stringifyError(error) {
    if (typeof error === 'object') {
        return error?.message ?? JSON.stringify(error, null, 2);
    }
    else {
        return String(error);
    }
}
exports.stringifyError = stringifyError;
/**
 * 确保是数组
 * @param {T | T[]} value 确保是数组的值
 * @return {T[]} 数组结果
 */
function ensureArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    else {
        return [value];
    }
}
exports.ensureArray = ensureArray;
/**
 * 解析 qq，支持艾特，可以是 `114514` 或者是 `{at:114514}`
 *
 * @param {string} qqLikeStr 待解析的字符串
 * @return {number} 解析结果
 */
function parseUin(qqLikeStr) {
    let qq = 0;
    try {
        if (/^\{at:\d+\}$/.test(qqLikeStr)) {
            qq = Number(/^\{at:(\d+)\}$/.exec(qqLikeStr)[1]);
        }
        else if (/^\d+$/.test(qqLikeStr)) {
            qq = Number(/^(\d+)$/.exec(qqLikeStr)[1]);
        }
    }
    catch { }
    return qq;
}
exports.parseUin = parseUin;
