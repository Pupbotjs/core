import type { Client } from 'oicq';
/** 记录已发送的消息数 */
export declare const MessagCounts: {
    value: number;
};
/** 重写消息发送函数，记录发送消息数并打印日志 */
export declare function bindSendMessage(bot: Client): Promise<void>;
