import type { AllMessageEvent } from '../plugin';
import type { Client } from 'oicq';
import type { PupConf } from '../config';
/** 解析框架命令，进行框架操作，仅框架主管理有权限 */
export declare function handlePupCommand(event: AllMessageEvent, bot: Client, PupConf: PupConf): Promise<import("../../index").MessageRet | undefined>;
