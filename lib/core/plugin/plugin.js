"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PupPlugin = void 0;
const node_events_1 = __importDefault(require("node:events"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const log4js_1 = __importDefault(require("log4js"));
const minimist_1 = __importDefault(require("minimist"));
const node_cron_1 = __importDefault(require("node-cron"));
const node_path_1 = __importDefault(require("node:path"));
const utils_1 = require("../../utils");
const pluginError_1 = require("./pluginError");
const events_1 = require("../events");
const _src_1 = require("../../index");
class PupPlugin extends node_events_1.default {
    /**
     * PupBot 插件类
     *
     * @param {string} name 插件名称，建议英文，插件数据目录以此结尾
     * @param {string} version 插件版本，如 1.0.0，建议 require `package.json` 的版本号统一管理
     */
    constructor(name, version, conf) {
        super();
        /** 向框架输出日志记录器，是 log4js 的实例 */
        this.logger = log4js_1.default.getLogger('plugin');
        /** 挂载的 Bot 实例 */
        this.bot = null;
        /** 插件配置 */
        this.config = {};
        this._mounted = () => { };
        this._unmounted = () => { };
        this._cronTasks = [];
        this._handlers = new Map();
        this.name = name ?? 'null';
        this.version = version ?? 'null';
        this.dataDir = node_path_1.default.join(_src_1.PluginDataDir, this.name);
        this.config = conf ?? {};
        if (!conf?.debug) {
            // 正式环境下确保插件的数据目录存在
            fs_extra_1.default.ensureDirSync(this.dataDir);
        }
        this.debug('create PupPlugin instance');
    }
    /**
     * 抛出一个 PupBot 插件标准错误，会被框架捕获并输出到日志
     *
     * @param {string} message 错误信息
     */
    throwPluginError(message) {
        throw new pluginError_1.PupPluginError(this.name, message);
    }
    /**
     * 检测是否已经挂载 bot 实例，未挂载抛出插件错误
     */
    checkMountStatus() {
        if (!this.bot) {
            this.throwPluginError('Bot 实例此时还未挂载。请在 onMounted 与 onUnmounted 中进行调用。');
        }
    }
    /**
     * 框架管理变动事件处理函数
     */
    adminChangeHandler(event) {
        this._admins = event.admins;
    }
    /**
     * 添加监听函数
     */
    addHandler(eventName, handler) {
        const handlers = this._handlers.get(eventName);
        this._handlers.set(eventName, handlers ? [...handlers, handler] : [handler]);
    }
    /**
     * 取消所有监听
     */
    removeAllHandler() {
        this.debug('removeAllHandler');
        for (const [eventName, handlers] of this._handlers) {
            handlers.forEach((handler) => this.bot.off(eventName, handler));
        }
    }
    /**
     * 清理所有定时任务
     */
    clearCronTasks() {
        this.debug('clearCronTasks');
        this._cronTasks.forEach((task) => task.stop());
    }
    /** 目标群或者好友是否被启用，讨论组当作群聊处理 */
    isTargetOn(event) {
        const { enableFriends, enableGroups } = this.config;
        const isPrivate = event.message_type === 'private';
        const isGroup = event.message_type === 'group';
        const isDiscuss = event.message_type === 'discuss';
        const isUserEnable = isPrivate && enableFriends?.includes(event.sender.user_id);
        const isGroupEnable = (isGroup && enableGroups?.includes(event.group_id)) ||
            (isDiscuss && enableGroups?.includes(event.discuss_id));
        if (isPrivate && (!enableFriends || isUserEnable)) {
            return true;
        }
        if (!isPrivate && (!enableGroups || isGroupEnable)) {
            return true;
        }
        return false;
    }
    /**
     * **插件请勿调用**，PupBot 框架调用此函数启用插件
     * @param {Client} bot oicq Client 实例
     * @param {AdminArray} admins 框架管理员列表
     * @return {Promise<PupPlugin>} 插件实例 Promise
     */
    async mountPupBotClient(bot, admins) {
        this.debug('mountPupBotClient');
        // 挂载 Bot
        this.bot = bot;
        // 初始化管理员
        this._admins = [...admins];
        // 监听框架管理变动
        bot.on('pup.admins', this.adminChangeHandler);
        try {
            this.debug('_mounted');
            // 调用 onMounted 挂载的函数
            const res = this._mounted(bot, [...this._admins]);
            // 如果是 Promise 等待其执行完
            if (res instanceof Promise)
                await res;
        }
        catch (e) {
            this.throwPluginError('onMounted 发生错误: \n' + JSON.stringify(e, null, 2));
        }
        this.debug('add all oicq events listeners');
        // 插件监听 ociq 的所有事件
        events_1.OicqEvents.forEach((evt) => {
            const handler = (e) => {
                if (events_1.MessageEvents.includes(evt)) {
                    const event = e;
                    if (this.isTargetOn(event)) {
                        this.emit(evt, event);
                    }
                }
                else {
                    this.emit(evt, e);
                }
            };
            // 插件收到事件时，将事件及数据 emit 给插件里定义的处理函数
            bot.on(evt, handler);
            // 收集监听函数
            this.addHandler(evt, handler);
        });
        return this;
    }
    /**
     * **插件请勿调用**，PupBot 框架调用此函数禁用插件
     * @param {Client} bot oicq Client 实例
     * @param {AdminArray} admins 框架管理员列表
     */
    async unmountPupBotClient(bot, admins) {
        this.debug('unmountPupBotClient');
        // 取消监听框架管理变动
        bot.off('pup.admins', this.adminChangeHandler);
        try {
            this.debug('_unmounted');
            // 调用 onUnmounted 挂载的函数
            const res = this._unmounted(bot, admins);
            // 如果是 Promise 等待其执行完
            if (res instanceof Promise)
                await res;
        }
        catch (e) {
            this.throwPluginError('onUnmounted 发生错误: \n' + JSON.stringify(e, null, 2));
        }
        this.removeAllHandler();
        this.clearCronTasks();
        this.bot = null;
    }
    /**
     * 从插件数据目录加载保存的数据（储存为 JSON 格式，读取为普通 JS 对象）
     * @param {string} filepath 保存文件路径，默认为插件数据目录下的 `config.json`
     * @param {fs.ReadOptions | undefined} options 加载配置的选项
     */
    loadConfig(filepath = node_path_1.default.join(this.dataDir, 'config.json'), options = {}) {
        this.debug('loadConfig');
        try {
            return fs_extra_1.default.readJsonSync(filepath, options);
        }
        catch (e) {
            this.logger.error(JSON.stringify(e, null, 2));
            return {};
        }
    }
    /**
     * 将数据保存到插件数据目录（传入普通 JS 对象，储存为 JSON 格式）
     * @param {any} data 待保存的普通 JS 对象
     * @param {string} filepath 保存文件路径，默认为，默认为插件数据目录下的 `config.json`
     * @param {fs.ReadOptions | undefined} options 写入配置的选项
     * @return {boolean} 是否写入成功
     */
    saveConfig(data, filepath = node_path_1.default.join(this.dataDir, 'config.json'), options = {}) {
        this.debug('saveConfig');
        try {
            fs_extra_1.default.writeJsonSync(filepath, data, { spaces: 2, ...options });
            return true;
        }
        catch (e) {
            this.logger.error(JSON.stringify(e, null, 2));
            return false;
        }
    }
    /**
     * 添加消息监听函数，包括好友私聊、群消息以及讨论组消息，通过 `message_type` 判断消息类型。
     * @param {MessageHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onMessage(handler) {
        this.checkMountStatus();
        const oicqHandler = (e) => {
            if (this.isTargetOn(e)) {
                handler(e, this.bot);
            }
        };
        this.bot.on('message', oicqHandler);
        this.addHandler('message', oicqHandler);
    }
    /**
     * 添加群聊消息监听函数，等价于 plugin.on('message.group', handler) 。
     * @param {GroupMessageHandler} handler 群聊消息处理函数
     */
    onGroupMessage(handler) {
        this.checkMountStatus();
        const oicqHandler = (e) => {
            if (this.isTargetOn(e)) {
                handler(e, this.bot);
            }
        };
        this.bot.on('message.group', oicqHandler);
        this.addHandler('message.group', oicqHandler);
    }
    /**
     * 添加私聊消息监听函数，等价于 plugin.on('message.private', handler) 。
     * @param {PrivateMessageHandler} handler 私聊消息处理函数
     */
    onPrivateMessage(handler) {
        this.checkMountStatus();
        const oicqHandler = (e) => {
            if (this.isTargetOn(e)) {
                handler(e, this.bot);
            }
        };
        this.bot.on('message.private', oicqHandler);
        this.addHandler('message.private', oicqHandler);
    }
    /**
     * 消息匹配函数，传入字符串或正则，或字符串和正则的数组，进行精确匹配，匹配成功则调用函数
     * @param {string | RegExp | (string | RegExp)[]} matches 待匹配的内容，字符串或者正则，对整个消息进行匹配
     * @param {MessageHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onMatch(matches, handler) {
        this.checkMountStatus();
        const matchList = (0, utils_1.ensureArray)(matches);
        const oicqHandler = (e) => {
            if (this.isTargetOn(e)) {
                for (const match of matchList) {
                    const reg = match instanceof RegExp ? match : new RegExp(`^${match}$`);
                    if (reg.test(e.toString())) {
                        handler(e, this.bot);
                        break;
                    }
                }
            }
        };
        this.bot.on('message', oicqHandler);
        this.addHandler('message', oicqHandler);
    }
    /**
     * 管理员消息匹配函数，传入字符串或正则，或字符串和正则的数组，进行精确匹配，匹配成功则调用函数
     * @param {string | RegExp | (string | RegExp)[]} matches 待匹配的内容，字符串或者正则，对整个消息进行匹配
     * @param {MessageHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onAdminMatch(matches, handler) {
        this.checkMountStatus();
        const matchList = (0, utils_1.ensureArray)(matches);
        const oicqHandler = (e) => {
            if (this.isTargetOn(e)) {
                if (this.admins.includes(e.sender.user_id)) {
                    for (const match of matchList) {
                        const reg = match instanceof RegExp ? match : new RegExp(`^${match}$`);
                        if (reg.test(e.toString())) {
                            handler(e, this.bot);
                            break;
                        }
                    }
                }
            }
        };
        this.bot.on('message', oicqHandler);
        this.addHandler('message', oicqHandler);
    }
        /**
     * 私聊消息匹配函数，传入字符串或正则，或字符串和正则的数组，进行精确匹配，匹配成功则调用函数
     * @param {string | RegExp | (string | RegExp)[]} matches 待匹配的内容，字符串或者正则，对整个消息进行匹配
     * @param {MessageHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
     onPrivateMatch(matches, handler) {
            this.checkMountStatus();
            const matchList = (0, utils_1.ensureArray)(matches);
            const oicqHandler = (e) => {
                if (this.isTargetOn(e)) {
                    for (const match of matchList) {
                        const reg = match instanceof RegExp ? match : new RegExp(`^${match}$`);
                        if (reg.test(e.toString())) {
                            handler(e, this.bot);
                            break;
                        }
                    }
                }
            };
            this.bot.on('message.private', oicqHandler);
            this.addHandler('message.private', oicqHandler);
        }
            /**
     * 群聊消息匹配函数，传入字符串或正则，或字符串和正则的数组，进行精确匹配，匹配成功则调用函数
     * @param {string | RegExp | (string | RegExp)[]} matches 待匹配的内容，字符串或者正则，对整个消息进行匹配
     * @param {MessageHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onGroupMatch(matches, handler) {
        this.checkMountStatus();
        const matchList = (0, utils_1.ensureArray)(matches);
        const oicqHandler = (e) => {
            if (this.isTargetOn(e)) {
                for (const match of matchList) {
                    const reg = match instanceof RegExp ? match : new RegExp(`^${match}$`);
                    if (reg.test(e.toString())) {
                        handler(e, this.bot);
                        break;
                    }
                }
            }
        };
        this.bot.on('message.group', oicqHandler);
        this.addHandler('message.group', oicqHandler);
    }
    /**
     * 添加命令监听函数，通过 `message_type` 判断消息类型。如果只需要监听特定的消息类型，请使用 `on` 监听，比如 `on('message.group')`
     * @param {string | RegExp | (string | RegExp)[]} cmds 监听的命令，可以是字符串或正则表达式，或字符串和正则的数组
     * @param {MessageCmdHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onCmd(cmds, handler) {
        this.checkMountStatus();
        const oicqHandler = (e) => {
            if (this.isTargetOn(e)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _: params, '--': __, ...options } = (0, minimist_1.default)(e.toString().trim().split(/\s+/));
                const inputCmd = params.shift() ?? '';
                const cmdList = (0, utils_1.ensureArray)(cmds);
                for (const cmd of cmdList) {
                    const reg = cmd instanceof RegExp ? cmd : new RegExp(`^${cmd}$`);
                    if (reg.test(inputCmd)) {
                        handler(e, params, options);
                        break;
                    }
                }
            }
        };
        this.bot.on('message', oicqHandler);
        this.addHandler('message', oicqHandler);
    }
    /**
     * 添加管理员命令监听函数，通过 `message_type` 判断消息类型。如果只需要监听特定的消息类型，请使用 `on` 监听，比如 `on('message.group')`
     * @param {string | RegExp | (string | RegExp)[]} cmds 监听的命令，可以是字符串或正则表达式，或字符串和正则的数组
     * @param {MessageCmdHandler} handler 消息处理函数，包含群消息，讨论组消息和私聊消息
     */
    onAdminCmd(cmds, handler) {
        this.checkMountStatus();
        const oicqHandler = (e) => {
            if (this.isTargetOn(e)) {
                if (this.admins.includes(e.sender.user_id)) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { _: params, '--': __, ...options } = (0, minimist_1.default)(e.toString().trim().split(/\s+/));
                    const inputCmd = params.shift() ?? '';
                    const cmdList = (0, utils_1.ensureArray)(cmds);
                    for (const cmd of cmdList) {
                        const reg = cmd instanceof RegExp ? cmd : new RegExp(`^${cmd}$`);
                        if (reg.test(inputCmd)) {
                            handler(e, params, options);
                            break;
                        }
                    }
                }
            }
        };
        this.bot.on('message', oicqHandler);
        this.addHandler('message', oicqHandler);
    }
    /**
     * 插件被启用时执行，所有的插件实例调用相关的逻辑请写到传入的函数里
     * @param {BotHandler} func 插件被挂载后的执行函数
     */
    onMounted(func) {
        this.debug('onMounted');
        this._mounted = func;
    }
    /**
     * 插件被禁用时执行，所有的插件实例调用相关的逻辑请写到传入的函数里
     * @param {BotHandler} func 插件被取消挂载后的执行函数
     */
    onUnmounted(func) {
        this.debug('onUnmounted');
        this._unmounted = func;
    }
    /**
     * 打印消息到控制台
     */
    log(...args) {
        const mapFn = (e) => (typeof e === 'object' ? JSON.stringify(e, null, 2) : e);
        const msg = args.map(mapFn).join(', ');
        this.logger.log(`${this.name}: ${msg}`);
    }
    /**
     * 打印消息到控制台，用于插件调试，仅在 debug 以及更低的 log lever 下可见
     */
    debug(...args) {
        const mapFn = (e) => (typeof e === 'object' ? JSON.stringify(e, null, 2) : e);
        const msg = args.map(mapFn).join(', ');
        this.logger.debug(`${this.name}: ${msg}`);
    }
    /**
     * 定时任务( [秒], 分, 时, 日, 月, 星期 ) `[*] * * * * *`
     *
     * @param {string} cronExpression corntab 表达式
     * @param {BotHandler} fn 定时触发的函数
     * @return {ScheduledTask} 定时任务
     */
    cron(cronExpression, fn) {
        this.checkMountStatus();
        // 检验 cron 表达式有效性
        const isSytaxOK = node_cron_1.default.validate(cronExpression);
        if (!isSytaxOK) {
            this.throwPluginError('无效的 cron 表达式');
        }
        // 创建 cron 任务
        const task = node_cron_1.default.schedule(cronExpression, () => fn(this.bot, this._admins));
        this._cronTasks.push(task);
        return task;
    }
    /**
     * 框架管理员列表 (getter)，插件会自动监听变动事件，并保证列表是实时最新的
     */
    get admins() {
        this.checkMountStatus();
        return [...(this._admins || [])];
    }
    /**
     * 框架主管理员 (getter)，插件会自动监听变动事件，并保证列表是实时最新的
     */
    get mainAdmin() {
        this.checkMountStatus();
        return [...(this._admins || [])][0];
    }
    /**
     * 框架副管理员列表 (getter)，插件会自动监听变动事件，并保证列表是实时最新的
     */
    get subAdmins() {
        this.checkMountStatus();
        return (this._admins || []).slice(1);
    }
}
exports.PupPlugin = PupPlugin;

