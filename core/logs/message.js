"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageHandler = void 0;
const utils_1 = require("../../utils");
const logger_1 = require("../logger");
const config_1 = require("../config");
const TypeMap = {
    private: '私',
    group: '群',
    discuss: '组'
};
/** 消息监听函数，打印框架日志 */
async function messageHandler(e) {
    const { sender, message_type } = e;
    const type = TypeMap[e.message_type];
    const nick = `${sender.nickname}(${sender.user_id})`;
    let head = '';
    if (message_type === 'private') {
        // 私聊消息
        head = `↓ [${type}:${nick}]`;
    }
    else if (message_type === 'discuss') {
        // 讨论组消息
        const discuss = `${e.discuss_name}(${e.discuss_id})`;
        head = `↓ [${type}:${discuss}:${nick}]`;
    }
    else {
        // 群聊消息
        const group = `${e.group_name}(${e.group_id})`;
        head = `↓ [${type}:${group}-${nick}]`;
    }
    const message = config_1.PupConf.message_mode === 'detail' ? e.toString() : e.raw_message;
    logger_1.PupLogger.info(`${utils_1.colors.gray(head)} ${message}`);
}
exports.messageHandler = messageHandler;
