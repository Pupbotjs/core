import type { Client } from 'icqq';
/** 登录错误事件监听处理函数 */
export declare function errorHandler(this: Client, { code, message }: {
    code: number;
    message: string;
}): void;
