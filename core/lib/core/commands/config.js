"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConfigCommand = exports.ModeMap = exports.OperationMap = exports.operations = exports.ConfigText = void 0;
const config_1 = require("../config");
const utils_1 = require("../../utils");
exports.ConfigText = `
〓 Pupbot 配置 〓
/config detail (配置详情)
/config admin add/rm <qq>
/config notice on/off
/config friend <operation>
/config group <operation>
/config me on/off
`.trim();
exports.operations = ['refuse', 'ignore', 'accept'];
exports.OperationMap = {
    refuse: '拒绝',
    accept: '同意',
    ignore: '忽略'
};
exports.ModeMap = {
    sms: '短信',
    password: '密码',
    qrcode: '扫码'
};
async function handleConfigCommand(bot, params, reply) {
    if (!params.length) {
        await reply(exports.ConfigText);
    }
    const [secondCmd, thirdCmd, value] = params;
    if (secondCmd === 'detail') {
        const { friend } = config_1.PupConf.notice;
        const subAdmins = config_1.PupConf.admins.slice(1);
        const detail = `
〓 PupBot 详细配置 〓
登录模式: ${exports.ModeMap[config_1.PupConf.login_mode] ?? '未知'}
设备锁模式: ${exports.ModeMap[config_1.PupConf.device_mode] ?? '未知'}
主管理员: ${config_1.PupConf.admins[0] ?? '未知'}
副管理员: ${subAdmins.length ? subAdmins.join(', ') : '空'}
通知状态: ${config_1.PupConf.notice.enable ? '开启' : '关闭'}
好友申请操作: ${exports.OperationMap[friend.request.action] ?? '未知'}
群聊邀请操作: ${exports.OperationMap[friend.request.action] ?? '未知'}
接收自己消息: ${config_1.PupConf.oicq_config.ignore_self}
`.trim();
        return reply(detail);
    }
    const mainAdmin = config_1.PupConf.admins[0];
    if (secondCmd === 'admin') {
        const qq = (0, utils_1.parseUin)(value);
        if (!qq) {
            return reply('/config admin add/rm <qq>');
        }
        else {
            const set = new Set(config_1.PupConf.admins.splice(1));
            if (thirdCmd === 'add') {
                if (set.has(qq) || qq === mainAdmin) {
                    return reply('〓 该账号已是 Bot 管理员 〓');
                }
                set.add(qq);
                config_1.PupConf.admins = [mainAdmin, ...set];
                if ((0, config_1.savePupConf)()) {
                    bot.emit('pup.admin', { admins: [...config_1.PupConf.admins] });
                    return reply('〓 Bot 管理员添加成功 〓');
                }
            }
            else if (thirdCmd === 'rm') {
                if (qq === mainAdmin) {
                    return reply('〓 无法删除 Bot 主管理员 〓');
                }
                if (!set.has(qq)) {
                    return reply('〓 该账号不是 Bot 管理员 〓');
                }
                set.delete(qq);
                config_1.PupConf.admins = [mainAdmin, ...set];
                if ((0, config_1.savePupConf)()) {
                    bot.emit('pup.admin', { admins: [...config_1.PupConf.admins] });
                    return reply('〓 Bot 管理员删除成功 〓');
                }
            }
        }
    }
    if (secondCmd === 'notice') {
        if (thirdCmd === 'on') {
            config_1.PupConf.notice.enable = true;
            if ((0, config_1.savePupConf)()) {
                reply('〓 事件通知已开启 〓');
            }
        }
        else if (thirdCmd === 'off') {
            config_1.PupConf.notice.enable = false;
            if ((0, config_1.savePupConf)()) {
                reply('〓 事件通知已关闭 〓');
            }
        }
    }
    if (secondCmd === 'group') {
        if (!exports.operations.includes(thirdCmd)) {
            return reply(`〓 操作无效，请检查 〓\n可选操作：${exports.operations.join(', ')}`);
        }
        config_1.PupConf.notice.group.request.action = thirdCmd;
        if ((0, config_1.savePupConf)()) {
            reply(`〓 已设置自动${exports.OperationMap[thirdCmd]}群聊邀请 〓`);
        }
    }
    if (secondCmd === 'friend') {
        if (!exports.operations.includes(thirdCmd)) {
            return reply(`〓 操作无效，请检查 〓\n可选操作：${exports.operations.join(', ')}`);
        }
        config_1.PupConf.notice.friend.request.action = thirdCmd;
        if ((0, config_1.savePupConf)()) {
            reply(`〓 已设置自动${exports.OperationMap[thirdCmd]}好友申请 〓`);
        }
    }
    if (secondCmd === 'me') {
        if (thirdCmd === 'on') {
            config_1.PupConf.oicq_config.ignore_self = true;
            if ((0, config_1.savePupConf)()) {
                reply('〓 接收自己消息开启 〓');
            }
        }
        else if (thirdCmd === 'off') {
            config_1.PupConf.oicq_config.ignore_self = false;
            if ((0, config_1.savePupConf)()) {
                reply('〓 接收自己消息关闭 〓');
            }
        }
    }
}
exports.handleConfigCommand = handleConfigCommand;
