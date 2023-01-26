import type { Client } from 'oicq';
import type { PupConf } from './config';
/** 监听上线事件，初始化 PupBot */
export declare function onlineHandler(this: Client, PupConf: PupConf): Promise<void>;
