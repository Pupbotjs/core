import type { Client } from 'icqq';
export declare const SystemMap: Record<string, string>;
export declare const ArchMap: Record<string, string>;
/** 运行状态指令处理函数 */
export declare function fetchStatus(bot: Client): Promise<string>;
