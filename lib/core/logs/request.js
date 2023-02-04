"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestHandler = void 0;
const logger_1 = require("../logger");
const utils_1 = require("../../utils");
/** 请求监听函数，打印框架日志 */
function requestHandler(event) {
    const { request_type, sub_type, user_id, nickname } = event;
    let message = '';
    const userInfo = `${nickname}(${user_id})`;
    if (request_type === 'friend') {
        // 好友通知
        const { comment, source } = event;
        if (sub_type === 'add') {
            message = `+ [好友申请:${userInfo}-${source}-${comment}]`;
        }
        else if (sub_type === 'single') {
            message = `+ [单项好友:${userInfo}-${source}-${comment}]`;
        }
    }
    else if (request_type === 'group') {
        // 群通知
        const { group_id, group_name } = event;
        const groupInfo = `${group_name}(${group_id})`;
        if (sub_type === 'add') {
            message = `+ [申请进群:${groupInfo}-${userInfo}]`;
        }
        else if (sub_type === 'invite') {
            const { role } = event;
            message = `+ [邀请进群:${groupInfo}-${userInfo}-${role}]`;
        }
    }
    logger_1.PupLogger.info(utils_1.colors.gray(message));
}
exports.requestHandler = requestHandler;
