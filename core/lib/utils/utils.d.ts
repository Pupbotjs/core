/// <reference types="node" />
/// <reference types="node" />
import dayjs from 'dayjs';
import type { AllMessageEvent } from '../core';
import type { BinaryLike, BinaryToTextEncoding } from 'node:crypto';
export { dayjs };
/**
 * 异步延时函数
 * @param {number} ms 等待毫秒数
 * @return {Promise<void>}
 */
export declare function wait(ms: number): Promise<void>;
/**
 * MD5 加密
 * @param {BinaryLike} text 待 MD5 加密数据，可以是 `string` 字符串
 * @param {BinaryToTextEncoding | undefined} encoding 返回数据编码，不传返回 `Buffer`，可传 `hex` 等返回字符串
 * @return {Buffer | string} MD5 加密后的数据
 */
export declare function md5(text: BinaryLike, encoding?: BinaryToTextEncoding): string | Buffer;
/**
 * JS 对象转换成 `urlencoded` 格式字符串 { name: 'Bob', age: 18 } => name=Bob&age=18
 * @param {Record<number | string, any>} obj JS 对象
 * @return {string} 转换后的字符串
 */
export declare function qs(obj: Record<number | string, any>): string;
/**
 * 生成随机整数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @return {number} 随机范围内的整数
 */
export declare function randomInt(min: number, max: number): number;
/**
 * 取数组内随机一项
 * @param {Array<T>} array 待操作数组
 * @return {T} 随机范围内的整数
 */
export declare function randomItem<T = any>(array: [T, ...T[]]): T;
/**
 * 取格式化时间，默认当前时间，使用 dayjs 的 format 函数封装
 * @param {string | undefined} format 格式化模板，默认'YYYY-MM-DD HH:mm'
 * @param {Date | undefined} date 待格式化的时间，默认当前时间
 * @return {string} 格式化后的时间字符串
 */
export declare function time(format?: string, date?: Date): string;
/**
 * 取消息来源的目标 id，私聊取好友QQ，群聊取群号，讨论组取讨论组号
 * @param {AllMessageEvent} event 消息事件参数
 * @return {number} 目标 id
 */
export declare function getTargetId(event: AllMessageEvent): number;
/**
 * 错误 stringify
 * @param {any} error 待处理错误
 * @return {string} stringify 结果
 */
export declare function stringifyError(error: any): string;
/**
 * 确保是数组
 * @param {T | T[]} value 确保是数组的值
 * @return {T[]} 数组结果
 */
export declare function ensureArray<T = any>(value: T | T[]): T[];
/**
 * 解析 qq，支持艾特，可以是 `1141284758` 或者是 `{at:1141284758}`
 *
 * @param {string} qqLikeStr 待解析的字符串
 * @return {number} 解析结果
 */
export declare function parseUin(qqLikeStr: string): number;
