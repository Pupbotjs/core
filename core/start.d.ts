import type { PupPlugin } from './plugin';
export declare const plugins: Map<string, PupPlugin>;
export declare const pkg: any;
/** 通过 `config.json` 配置文件启动框架 */
export declare function start(): void;
