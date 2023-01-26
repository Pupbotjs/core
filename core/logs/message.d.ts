import type { AllMessageEvent } from '../plugin';
/** 消息监听函数，打印框架日志 */
export declare function messageHandler(e: AllMessageEvent): Promise<void>;
