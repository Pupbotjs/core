import type { Client } from 'oicq';
import type { PupConf } from '../config';
/** 通过插件模块路径启用单个插件 */
export declare function enablePlugin(bot: Client, PupConf: PupConf, pluginPath: string): Promise<string | true>;
