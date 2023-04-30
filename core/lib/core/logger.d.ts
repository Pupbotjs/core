import log4js from 'log4js';
import type { Config } from 'icqq';
/** 1:安卓手机 2:aPad 3:安卓手表 4:MacOS 5:iPad */
export declare const Devices: readonly ["", "aPhone", "aPad", "aWatch", "MacOS", "iPad"];
export declare const PupLogger: log4js.Logger;
export declare const PluginLogger: log4js.Logger;
export declare const LogTypeMap: {
    readonly all: "gray";
    readonly mark: "gray";
    readonly trace: "white";
    readonly debug: "cyan";
    readonly info: "green";
    readonly warn: "yellow";
    readonly error: "red";
    readonly fatal: "magenta";
    readonly off: "magenta";
};
/** 重定向 oicq 日志输出到日志文件 */
export declare function redirectLog(pupLogLevel: string | undefined, oicq_config: Config, account: number): void;
