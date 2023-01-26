import type { Client } from 'oicq';
import type { PupConf } from '../config';
import type { PupPlugin } from './plugin';
/** 通过插件路径禁用单个插件  */
export declare function disablePlugin(bot: Client, PupConf: PupConf, plugin: PupPlugin, pluginPath: string): Promise<string | true>;
