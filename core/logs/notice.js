"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noticeHandler = void 0;
const logger_1 = require("../logger");
const utils_1 = require("../../utils");
/** 监听处理所有通知，打印框架日志 */
function noticeHandler(event) {
    const { user_id, sub_type } = event;
    let message = '';
    if (event.notice_type === 'friend') {
        // 好友通知
        if (sub_type === 'decrease') {
            // 好友减少
            message = `- [好友减少:${event.nickname}(${user_id})]`;
        }
        else if (sub_type === 'increase') {
            // 好友增加
            message = `+ [新增好友:${event.nickname}(${user_id})]`;
        }
        else if (sub_type === 'poke') {
            // 好友戳一戳
            const { target_id, operator_id, friend } = event;
            const isOperatorSelf = operator_id === this.uin;
            const isTargetSelf = target_id === this.uin;
            // 触发方
            const operator = isOperatorSelf
                ? `${this.nickname}(${this.uin})`
                : `${friend.nickname || '未知'}(${friend.user_id})`;
            // 被戳方
            const target = isTargetSelf
                ? `${this.nickname}(${this.uin})`
                : `${friend.nickname || '未知'}(${friend.user_id})`;
            message = `↓ [私聊戳:${operator}->${target}]`;
        }
        else if (sub_type === 'recall') {
            // 私聊撤回
            const { friend, operator_id, message_id } = event;
            const isOperatorSelf = operator_id === this.uin;
            const friendinfo = `${friend.nickname || '未知'}(${friend.user_id})`;
            // 触发方
            const operator = isOperatorSelf ? `${this.nickname}(${this.uin})` : friendinfo;
            message = `↓ [私聊撤回:${friendinfo}] [${operator}:${message_id}]`;
        }
    }
    else if (event.notice_type === 'group') {
        // 群通知
        const groupInfo = `${event.group.name}(${event.group.gid})`;
        if (sub_type === 'admin') {
            // 群管理变动
            const { set } = event;
            if (set) {
                message = `+ [新增群管:${groupInfo}-${user_id}]`;
            }
            else {
                message = `- [取消群管:${groupInfo}-${user_id}]`;
            }
        }
        else if (sub_type === 'ban') {
            // 群禁言
            const { duration, operator_id } = event;
            const isBan = duration !== 0;
            const label = isBan ? '+ [禁言' : '- [解禁';
            const desc = `${groupInfo}-${operator_id}->${user_id}${isBan ? `-${duration}分钟` : ''}`;
            message = `${label}:${desc}]`;
        }
        else if (sub_type === 'decrease') {
            // 群人数减少
            const { operator_id } = event;
            message = `- [退群:${groupInfo}-${operator_id || '主动'}->${user_id}]`;
        }
        else if (sub_type === 'increase') {
            // 群人数增加
            message = `+ [进群:${groupInfo}-${user_id}]`;
        }
        else if (sub_type === 'poke') {
            // 群戳一戳
            const { target_id, operator_id } = event;
            const isOperatorSelf = operator_id === this.uin;
            const isTargetSelf = target_id === this.uin;
            // 触发方
            const operator = isOperatorSelf ? `${this.nickname}(${this.uin})` : operator_id;
            // 被戳方
            const target = isTargetSelf ? `${this.nickname}(${this.uin})` : target_id;
            message = `↓ [群聊戳:${groupInfo}-${operator}->${target}]`;
        }
        else if (sub_type === 'recall') {
            // 群聊撤回
            const { operator_id, message_id } = event;
            const isOperatorSelf = operator_id === this.uin;
            // 触发方
            const operator = isOperatorSelf ? `${this.nickname}(${this.uin})` : operator_id;
            message = `↓ [群聊撤回:${groupInfo}-${operator_id}] [${operator}:${message_id}]`;
        }
        else if (sub_type === 'transfer') {
            // 群聊转让
            const { operator_id } = event;
            const isOperatorSelf = operator_id === this.uin;
            // 触发方
            const operator = isOperatorSelf ? `${this.nickname}(${this.uin})` : operator_id;
            message = `↓ [群转让:${groupInfo}] [${operator}->${user_id}]`;
        }
    }
    logger_1.PupLogger.info(utils_1.colors.gray(message));
}
exports.noticeHandler = noticeHandler;
