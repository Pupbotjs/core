/// <reference types="node" />
import EventEmitter from 'node:events';
import fs from 'fs-extra';
import type { Client, DiscussMessageEvent, EventMap, GroupMessageEvent, PrivateMessageEvent } from 'icqq';
import type { AdminArray } from '../config';
import type { Logger } from 'log4js';
import type { ScheduledTask } from 'node-cron';
export type AnyFunc = (...args: any[]) => any;
export type FirstParam<Fn extends AnyFunc> = Fn extends (p: infer R) => any ? R : never;
export type AllMessageEvent = PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent;
export type OicqMessageHandler = (event: AllMessageEvent) => any;
export type MessageHandler = (event: AllMessageEvent, bot: Client) => any;
export type PrivateMessageHandler = (event: PrivateMessageEvent, bot: Client) => any;
export type GroupMessageHandler = (event: GroupMessageEvent, bot: Client) => any;
/**
 * 处理函数
 *
 * @param {Client} bot Bot 实例
 * @param {AdminArray} admins 管理员列表
 */
export type BotHandler = (bot: Client, admins: AdminArray) => any;
/**
 * 命令消息处理函数
 * @param {AllMessageEvent} event ociq 消息事件，包含了群聊、私聊与讨论组消息
 * @param {string[]} params 由 minimist 解析后的 `_` 值（不包含命令），可以看作命令的其余参数
 * @param {{[arg: string]: any}} options 由 minimist 解析后的值（不包含 `_` 和 `--`），可以看作命令选项
 */
export type MessageCmdHandler = (event: AllMessageEvent, params: string[], options: {
    [arg: string]: any;
}) => any;
export interface PupPluginConf {
    debug?: boolean;
    enableGroups?: number[];
    enableFriends?: number[];
}
export declare class PupPlugin extends EventEmitter {
    /** 插件名称 */
    name: string;
    /** 插件版本 */
    version: string;
    /** 插件数据存放目录，`框架目录/data/plugins/<name>` 注意这里的 name 是实例化的时候传入的 name */
    dataDir: string;
    /** 向框架输出日志记录器，是 log4js 的实例 */
    logger: Logger;
    /** 挂载的 Bot 实例 */
    bot: Client | null;
    /** 插件配置 */
    config: PupPluginConf;
    private _mounted;
    private _unmounted;
    private _admins;
    private _cronTasks;
    private _handlers;
    /**
     * PupBot 插件类
     *
     * @param {string} name 插件名称，建议英文，插件数据目录以此结尾
     * @param {string} version 插件版本，如 1.0.0，建议 require `package.json` 的版本号统一管理
     */
    constructor(name: string, version: string, conf?: PupPluginConf);
    /**
     * 抛出一个 PupBot 插件标准错误，会被框架捕获并输出到日志
     *
     * @param {string} message 错误信息
     */
    throwPluginError(message: string): void;
    /**
     * 检测是否已经挂载 bot 实例，未挂载抛出插件错误
     */
    private checkMountStatus;
    /**
     * 框架管理变动事件处理函数
     */
    private adminChangeHandler;
    /**
     * 添加监听函数
     */
    private addHandler;
    /**
     * 取消所有监听
     */
    private removeAllHandler;
    /**
     * 清理所有定时任务
     */
    private clearCronTasks;
    /** 目标群或者好友是否被启用，讨论组当作群聊处理 */
    private isTargetOn;
    /**
     * **插件请勿调用**，PupBot 框架调用此函数启用插件
     * @param {Client} bot oicq Client 实例
     * @param {AdminArray} admins 框架管理员列表
     * @return {Promise<PupPlugin>} 插件实例 Promise
     */
    mountPupBotClient(bot: Client, admins: AdminArray): Promise<PupPlugin>;
    /**
     * **插件请勿调用**，PupBot 框架调用此函数禁用插件
     * @param {Client} bot oicq Client 实例
     * @param {AdminArray} admins 框架管理员列表
     */
    unmountPupBotClient(bot: Client, admins: AdminArray): Promise<void>;
    /**
     * 从插件数据目录加载保存的数据（储存为 JSON 格式，读取为普通 JS 对象）
     * @param {string} filepath 保存文件路径，默认为插件数据目录下的 `config.json`
     * @param {fs.ReadOptions | undefined} options 加载配置的选项
     */
    loadConfig(filepath?: string, options?: fs.ReadOptions | undefined): any;
    /**
     * 将数据保存到插件数据目录（传入普通 JS 对象，储存为 JSON 格式）
     * @param {any} data 待保存的普通 JS 对象
     * @param {string} filepath 保存文件路径，默认为，默认为插件数据目录下的 `config.json`
     * @param {fs.ReadOptions | undefined} options 写入配置的选项
     * @return {boolean} 是否写入成功
     */
    saveConfig(data: any, filepath?: string, options?: fs.WriteOptions | undefined): boolean;
    /**
     * 添加消息监听函数，包括好友私聊、群消息以及讨论组消息，通过 `message_type` 判断消息类型。
     * @param {MessageHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onMessage(handler: MessageHandler): void;
    /**
     * 添加群聊消息监听函数，等价于 plugin.on('message.group', handler) 。
     * @param {GroupMessageHandler} handler 群聊消息处理函数
     */
    onGroupMessage(handler: MessageHandler): void;
    /**
     * 添加私聊消息监听函数，等价于 plugin.on('message.private', handler) 。
     * @param {PrivateMessageHandler} handler 私聊消息处理函数
     */
    onPrivateMessage(handler: PrivateMessageHandler): void;
    /**
     * 消息匹配函数，传入字符串或正则，或字符串和正则的数组，进行精确匹配，匹配成功则调用函数
     * @param {string | RegExp | (string | RegExp)[]} matches 待匹配的内容，字符串或者正则，对整个消息进行匹配
     * @param {MessageHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onMatch(matches: string | RegExp | (string | RegExp)[], handler: MessageHandler): void;
    /**
     * 管理员消息匹配函数，传入字符串或正则，或字符串和正则的数组，进行精确匹配，匹配成功则调用函数
     * @param {string | RegExp | (string | RegExp)[]} matches 待匹配的内容，字符串或者正则，对整个消息进行匹配
     * @param {MessageHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onAdminMatch(matches: string | RegExp | (string | RegExp)[], handler: MessageHandler): void;
    /**
     * 添加命令监听函数，通过 `message_type` 判断消息类型。如果只需要监听特定的消息类型，请使用 `on` 监听，比如 `on('message.group')`
     * @param {string | RegExp | (string | RegExp)[]} cmds 监听的命令，可以是字符串或正则表达式，或字符串和正则的数组
     * @param {MessageCmdHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onPrivateMatch(matches: string | RegExp | (string | RegExp)[], handler: MessageHandler): void;
    /**
     * 添加命令监听函数，通过 `message_type` 判断消息类型。如果只需要监听特定的消息类型，请使用 `on` 监听，比如 `on('message.group')`
     * @param {string | RegExp | (string | RegExp)[]} cmds 监听的命令，可以是字符串或正则表达式，或字符串和正则的数组
     * @param {MessageCmdHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onGroupMatch(matches: string | RegExp | (string | RegExp)[], handler: MessageHandler): void;
    /**
     * 添加命令监听函数，通过 `message_type` 判断消息类型。如果只需要监听特定的消息类型，请使用 `on` 监听，比如 `on('message.group')`
     * @param {string | RegExp | (string | RegExp)[]} cmds 监听的命令，可以是字符串或正则表达式，或字符串和正则的数组
     * @param {MessageCmdHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onCmd(cmds: string | RegExp | (string | RegExp)[], handler: MessageCmdHandler): void;
    /**
     * 添加管理员命令监听函数，通过 `message_type` 判断消息类型。如果只需要监听特定的消息类型，请使用 `on` 监听，比如 `on('message.group')`
     * @param {string | RegExp | (string | RegExp)[]} cmds 监听的命令，可以是字符串或正则表达式，或字符串和正则的数组
     * @param {MessageCmdHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onAdminCmd(cmds: string | RegExp | (string | RegExp)[], handler: MessageCmdHandler): void;
    /**
     * 插件被启用时执行，所有的插件实例调用相关的逻辑请写到传入的函数里
     * @param {BotHandler} func 插件被挂载后的执行函数
     */
    onMounted(func: BotHandler): void;
    /**
     * 插件被禁用时执行，所有的插件实例调用相关的逻辑请写到传入的函数里
     * @param {BotHandler} func 插件被取消挂载后的执行函数
     */
    onUnmounted(func: BotHandler): void;
    /**
     * 打印消息到控制台
     */
    log(...args: any[]): void;
    /**
     * 打印消息到控制台，用于插件调试，仅在 debug 以及更低的 log lever 下可见
     */
    debug(...args: any[]): void;
    /**
     * 定时任务( [秒], 分, 时, 日, 月, 星期 ) `[*] * * * * *`
     *
     * @param {string} cronExpression corntab 表达式
     * @param {BotHandler} fn 定时触发的函数
     * @return {ScheduledTask} 定时任务
     */
    cron(cronExpression: string, fn: BotHandler): ScheduledTask;
    /**
     * 框架管理员列表 (getter)，插件会自动监听变动事件，并保证列表是实时最新的
     */
    get admins(): AdminArray;
    /**
     * 框架主管理员 (getter)，插件会自动监听变动事件，并保证列表是实时最新的
     */
    get mainAdmin(): number;
    /**
     * 框架副管理员列表 (getter)，插件会自动监听变动事件，并保证列表是实时最新的
     */
    get subAdmins(): number[];
}
/**
 * PupBot 插件类
 */
export interface PupPlugin extends EventEmitter {
    /** 监听 oicq 标准事件以及 PupBot 标准事件，需要自行取消监听 */
    on<T extends keyof EventMap>(event: T, listener: EventMap<this>[T]): this;
    /** 监听自定义事件或其他插件触发的事件，需要自行取消监听 */
    on<S extends string | symbol>(event: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
    /** 单次监听 oicq 标准事件以及 PupBot 标准事件，需要自行取消监听 */
    once<T extends keyof EventMap>(event: T, listener: EventMap<this>[T]): this;
    /** 单次监听自定义事件或其他插件触发的事件，需要自行取消监听 */
    once<S extends string | symbol>(event: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
    /** 取消监听 oicq 标准事件以及 PupBot 标准事件 */
    off<T extends keyof EventMap>(event: T, listener: EventMap<this>[T]): this;
    /** 取消监听自定义事件或其他插件触发的事件 */
    off<S extends string | symbol>(event: S & Exclude<S, keyof EventMap>, listener: (this: this, ...args: any[]) => void): this;
    /** @deprecated 请使用 on 进行事件监听 */
    addListener: never;
    /** @deprecated 请使用 off 取消事件监听 */
    removeAllListeners: never;
    /** @deprecated 不推荐使用 */
    getMaxListeners: never;
    /** @deprecated 不推荐使用 */
    rawListeners: never;
    /** @deprecated 不推荐使用 */
    // setMaxListeners: never;
    /** @deprecated 不推荐使用 */
    eventNames: never;
    /** @deprecated 不推荐使用 */
    listenerCount: never;
    /** @deprecated 不推荐使用 */
    listeners: never;
    /** @deprecated *不推荐使用 /
    removeListener: never
    /** @deprecated 不推荐使用 */
    prependListener: never;
    /** @deprecated 不推荐使用 */
    prependOnceListener: never;
}
