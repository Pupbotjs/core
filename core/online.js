"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineHandler = void 0;
const bindSendMessage_1 = require("./bindSendMessage");
const utils_1 = require("../utils");
const notice_1 = require("./notice");
const commands_1 = require("./commands");
const logger_1 = require("./logger");
const plugin_1 = require("./plugin");
const logs_1 = require("./logs");
//const {segment} = require("oicq");
/** log flag，防止掉线重新上线触发 online 事件时重复 bind */
let hasOnline = false;
/** 监听上线事件，初始化 PupBot */
async function onlineHandler(PupConf) {
    if (hasOnline) {
        return;
    }
    hasOnline = true;
    const error = (msg, ...args) => {
        this.logger.error(msg, ...args);
        logger_1.PupLogger.error(msg, ...args);
    };
    const info = (msg, ...args) => {
        this.logger.info(msg, ...args);
        logger_1.PupLogger.info(msg, ...args);
    };
    info(utils_1.colors.green(`${this.nickname}(${this.uin}) 上线成功！`));
    /** 全局错误处理函数 */
    const handleGlobalError = (e) => {
        if (e instanceof plugin_1.PupPluginError) {
            e.log();
        }
        else {
            error((0, utils_1.stringifyError)(e));
        }
    };
    // 捕获全局 Rejection，防止框架崩溃
    process.on('unhandledRejection', handleGlobalError);
    // 捕获全局 Exception，防止框架崩溃
    process.on('uncaughtException', handleGlobalError);
    // 绑定发送消息，打印发送日志
    (0, bindSendMessage_1.bindSendMessage)(this);
    // 监听消息，打印日志，同时处理框架命令
    this.on('message', (event) => {
        (0, logs_1.messageHandler)(event);
        (0, commands_1.handlePupCommand)(event, this, PupConf);
    });
    // 监听通知、请求，打印框架日志
    this.on('notice', logs_1.noticeHandler);
    this.on('request', logs_1.requestHandler);
    // 设置消息通知
    (0, notice_1.configNotice)(this);
    // 检索并加载插件
    const { all, cnt, npm, local, plugins } = await (0, plugin_1.loadPlugins)(this, PupConf);
    const plugiInfo = `共检索到 ${all} 个插件 (${local} 个本地，${npm} 个 npm)`;
    info(utils_1.colors.cyan(`${plugiInfo}, 启用 ${cnt} 个：${utils_1.colors.green(plugins.join(', '))}`));
    // 初始化完成
    logger_1.PupLogger.info(utils_1.colors.gray('框架初始化完成'));
    logger_1.PupLogger.info(utils_1.colors.gray('开始处理消息...'));
    // 上线通知，通知 Bot 主管理
    if (!PupConf.admins[0]) {
        error(utils_1.colors.red('主管理员必须添加 Bot 为好友，否则无法正常控制 Bot 和发送消息通知'));
    }
    else {
        const mainAdmin = this.pickFriend(PupConf.admins[0]);
        await (0, utils_1.wait)(600);
        await mainAdmin.sendMsg(`上线成功，启用了 ${cnt} 个插件\n发送 /help 查看 PupBot 帮助`);
        //await mainAdmin.sendMsg(segment.image('ef690f6ff313bdcf02b373ea6af7743d1420-60-60.jpg'));
    }
}
exports.onlineHandler = onlineHandler;
