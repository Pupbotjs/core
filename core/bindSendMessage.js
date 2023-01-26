"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindSendMessage = exports.MessagCounts = void 0;
const utils_1 = require("../utils");
const logger_1 = require("./logger");
/** 记录已发送的消息数 */
exports.MessagCounts = {
    value: 0
};
/** 重写消息发送函数，记录发送消息数并打印日志 */
async function bindSendMessage(bot) {
    bot.gl.forEach(({ group_id, group_name = '未知' }) => {
        const group = bot.pickGroup(group_id);
        const sendMsg = group.sendMsg.bind(group);
        const head = `↑ [群:${group_id}(${group_name})]`;
        group.sendMsg = async (content, source, anony) => {
            logger_1.PupLogger.info(utils_1.colors.gray(`${head} ${content.toString()}`));
            // 已发送消息计数
            exports.MessagCounts.value++;
            return sendMsg(content, source, anony);
        };
    });
    bot.fl.forEach(({ user_id, nickname = '未知' }) => {
        const friend = bot.pickFriend(user_id);
        const sendMsg = friend.sendMsg.bind(friend);
        const head = `↑ [私:${user_id}(${nickname})]`;
        friend.sendMsg = async (content, source) => {
            logger_1.PupLogger.info(utils_1.colors.gray(`${head} ${content.toString()}`));
            // 已发送消息计数
            exports.MessagCounts.value++;
            return sendMsg(content, source);
        };
    });
    bot.on('notice.group.increase', ({ group, user_id }) => {
        if (user_id !== bot.uin) {
            return;
        }
        const { group_id, name = '未知' } = group;
        const sendMsg = group.sendMsg.bind(group);
        const head = `↑ [群:${group_id}(${name})]`;
        group.sendMsg = async (content, source, anony) => {
            logger_1.PupLogger.info(utils_1.colors.gray(`${head} ${content.toString()}`));
            // 已发送消息计数
            exports.MessagCounts.value++;
            return sendMsg(content, source, anony);
        };
    });
    bot.on('notice.friend.increase', ({ friend }) => {
        const { user_id, nickname = '未知' } = friend;
        const sendMsg = friend.sendMsg.bind(friend);
        const head = `↑ [私:${user_id}(${nickname})]`;
        friend.sendMsg = async (content, source) => {
            logger_1.PupLogger.info(utils_1.colors.gray(`${head} ${content.toString()}`));
            // 已发送消息计数
            exports.MessagCounts.value++;
            return sendMsg(content, source);
        };
    });
}
exports.bindSendMessage = bindSendMessage;
