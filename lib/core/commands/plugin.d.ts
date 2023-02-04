import type { Client } from 'oicq';
import type { ReplyFunc } from './config';
export declare const PluginText: string;
export declare function handlePluginCommand(bot: Client, params: string[], reply: ReplyFunc): Promise<import("oicq").MessageRet | undefined>;
