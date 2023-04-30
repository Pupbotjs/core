import type { Client } from 'icqq';
import type { PupConf } from '../config';
/** 检索并加载 node_modules 和 plugins 目录下的插件 */
export declare function loadPlugins(bot: Client, PupConf: PupConf): Promise<{
    plugins: string[];
    all: number;
    npm: number;
    local: number;
    cnt: number;
}>;
