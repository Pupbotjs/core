"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePupCommand = void 0;
const minimist_1 = __importDefault(require("minimist"));
const status_1 = require("./status");
const config_1 = require("./config");
const plugin_1 = require("./plugin");
const _src_1 = require("../../index");
const utils_1 = require("../../utils");
const start_1 = require("../start");
const HelpText = `
〓 PupBot 帮助 〓
/plugin  插件操作
/status  查看状态
/config  框架配置
/update  检查更新
/about   关于框架
/exit    退出框架
`.trim();
const AboutText = `
〓 关于 PupBot 〓
PupBot 是一个开源、轻量、跨平台、注重体验、开发者友好的 QQ 机器人框架，基于 Node.js 和 oicq v2 构建。
使用文档: https://pupbot.cn/
`.trim();
/** 解析框架命令，进行框架操作，仅框架主管理有权限 */
async function handlePupCommand(event, bot, PupConf) {
    const msg = event.toString().trim();
    if (!/^\s*\/[a-z0-9]+/i.test(msg)) {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _: params, '--': __, ...options } = (0, minimist_1.default)(msg.split(/\s+/));
    const cmd = params.shift()?.replace(/^\s*\//, '') ?? '';
    // 是否是管理员
    const isAdmin = PupConf.admins.includes(event.sender.user_id);
    // 是否是主管理员
    const isMainAdmin = PupConf.admins[0] === event.sender.user_id;
    // 过滤非管理员消息
    if (!isAdmin) {
        return;
    }
    if (cmd === 'help') {
        return event.reply(HelpText);
    }
    if (cmd === 'about') {
        return event.reply(AboutText);
    }
    if (cmd === 'status') {
        try {
            const status = await (0, status_1.fetchStatus)(bot);
            return event.reply(status);
        }
        catch (e) {
            _src_1.PupLogger.error(JSON.stringify(e, null, 2));
            return event.reply('〓 设备状态获取失败 〓\n错误信息:\n' + JSON.stringify(e, null, 2));
        }
    }
    // 过滤非主管理员命令
    if (!isMainAdmin) {
        return;
    }
    if (cmd === 'exit') {
        await event.reply('〓 PupBot 进程已停止 〓');
        utils_1.notice.success('框架进程已由管理员通过 /exit 消息指令退出');
        child_process.exec('pup stop',(err)=>{
            if(err){
                //have problem
                event.reply('〓 框架退出失败 〓');
            }
        })
    }
    if (cmd === 'plugin'||cmd === 'p') {
        return (0, plugin_1.handlePluginCommand)(bot, params, event.reply.bind(event));
    }
    if (cmd === 'config') {
        return (0, config_1.handleConfigCommand)(bot, params, event.reply.bind(event));
    }
    if (cmd === 'update') {
        event.reply('〓 正在检查更新... 〓');
        try {
            const upInfo = await (0, utils_1.update)();
            if (upInfo) {
                const info = Object.entries(upInfo)
                    .map(([k, v]) => `${k.replace('pupbot-plugin-', '插件: ')} => ${v.replace('^', '')}`)
                    .join('\n');
                const msg = info
                    ? `〓 更新成功，内容如下 〓\n${info}\ntip: 需要重启框架才能生效`
                    : '〓 已是最新版本 〓';
                await event.reply(msg);
            }
            else {
                await event.reply('〓 更新失败，详情查看日志 〓');
            }
        }
        catch (e) {
            _src_1.PupLogger.error((0, utils_1.stringifyError)(e));
            await event.reply(`〓 更新失败 〓\n错误信息: ${(0, utils_1.stringifyError)(e)}`);
        }
        process.title = `PupBot ${start_1.pkg.version} ${PupConf.account}`;
    }
}
exports.handlePupCommand = handlePupCommand;
