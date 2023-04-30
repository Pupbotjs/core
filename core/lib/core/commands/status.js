"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchStatus = exports.ArchMap = exports.SystemMap = void 0;
const node_os_1 = __importDefault(require("node:os"));
const package_json_1 = require("icqq/package.json");
const logger_1 = require("../logger");
const utils_1 = require("../../utils");
const bindSendMessage_1 = require("../bindSendMessage");
const start_1 = require("../start");
const plugin_1 = require("../plugin");
exports.SystemMap = {
    Linux: 'Linux',
    Darwin: 'OSX',
    Windows_NT: 'Win'
};
exports.ArchMap = {
    ia32: 'x86',
    arm: 'arm',
    arm64: 'arm64',
    x64: 'x64'
};
/** 运行状态指令处理函数 */
async function fetchStatus(bot) {
    const { cnts } = await (0, plugin_1.searchAllPlugins)();
    const runTime = (0, utils_1.formatDateDiff)(process.uptime() * 1000);
    const total = node_os_1.default.totalmem();
    const used = total - node_os_1.default.freemem();
    const rss = process.memoryUsage.rss();
    const per = (param) => ((param / total) * 100).toFixed(1);
    const { recv_msg_cnt, msg_cnt_per_min } = bot.stat;
    const nodeVersion = process.versions.node.split('.')[0];
    const arch = exports.ArchMap[process.arch] || process.arch;
    // TODO: 待 oicq2 修复"已发送消息"的统计数据，目前自己实现计数
    const message = `
〓 PupBot 状态 〓
昵称: ${bot.nickname}
账号: ${bot.uin}
列表: ${bot.fl.size} 好友，${bot.gl.size} 群
插件: 启用 ${start_1.plugins.size}，共 ${cnts.all}
消息: 收 ${recv_msg_cnt}，发 ${bindSendMessage_1.MessagCounts.value}
当前: ${msg_cnt_per_min} 条/分钟
启动: ${runTime}
框架: ${start_1.pkg.version}-${(0, utils_1.formatFileSize)(rss)}-${per(rss)}%
协议: icqq-v${package_json_1.version}-${logger_1.Devices[bot.config.platform]}
系统: ${exports.SystemMap[node_os_1.default.type()] || '其他'}-${arch}-node${nodeVersion}
内存: ${(0, utils_1.formatFileSize)(used)}/${(0, utils_1.formatFileSize)(total)}-${per(used)}%
`.trim();
    return message;
}
exports.fetchStatus = fetchStatus;
