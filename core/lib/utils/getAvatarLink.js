"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupAvatarLink = exports.getQQAvatarLink = void 0;
/** 通过 QQ 号获取头像链接 */
function getQQAvatarLink(qq, size = 640) {
    return `https://q.qlogo.cn/headimg_dl?dst_uin=${qq}&spec=${size}`;
}
exports.getQQAvatarLink = getQQAvatarLink;
/** 通过群号获取群头像链接 */
function getGroupAvatarLink(group, size = 640) {
    return `https://p.qlogo.cn/gh/${group}/${group}/${size}`;
}
exports.getGroupAvatarLink = getGroupAvatarLink;
