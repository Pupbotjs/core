import type { Client, MessageRet, Sendable } from 'oicq';
export declare const ConfigText: string;
export type Operation = 'refuse' | 'ignore' | 'accept';
export declare const operations: readonly ["refuse", "ignore", "accept"];
export declare const OperationMap: {
    readonly refuse: "拒绝";
    readonly accept: "同意";
    readonly ignore: "忽略";
};
export declare const ModeMap: {
    readonly sms: "短信";
    readonly password: "密码";
    readonly qrcode: "扫码";
};
export type ReplyFunc = (content: Sendable, quote?: boolean | undefined) => Promise<MessageRet>;
export declare function handleConfigCommand(bot: Client, params: string[], reply: ReplyFunc): Promise<MessageRet | undefined>;
