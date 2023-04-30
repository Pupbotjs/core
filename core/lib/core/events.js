"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PupEvents = exports.OicqEvents = exports.SyncEvents = exports.NoticeEvents = exports.MessageEvents = exports.RequestEvents = exports.SystemEvents = void 0;
exports.SystemEvents = [
    'system.login.qrcode',
    'system.login.slider',
    'system.login.device',
    'system.login.error',
    'system.online',
    'system.offline.network',
    'system.offline.kickoff',
    'system.offline'
];
exports.RequestEvents = [
    'request.friend.add',
    'request.friend.single',
    'request.friend',
    'request.group.add',
    'request.group.invite',
    'request.group',
    'request'
];
exports.MessageEvents = [
    'message.private',
    'message.private.friend',
    'message.private.group',
    'message.private.other',
    'message.private.self',
    'message.group',
    'message.group.normal',
    'message.group.anonymous',
    'message.discuss',
    'message'
];
exports.NoticeEvents = [
    'notice.friend.increase',
    'notice.friend.decrease',
    'notice.friend.recall',
    'notice.friend.poke',
    'notice.group.increase',
    'notice.group.decrease',
    'notice.group.recall',
    'notice.group.admin',
    'notice.group.ban',
    'notice.group.transfer',
    'notice.group.poke',
    'notice.friend',
    'notice.group',
    'notice'
];
exports.SyncEvents = [
    'sync.message',
    'sync.read.private',
    'sync.read.group',
    'sync.read'
];
/** oicq v2 标准事件列表 */
exports.OicqEvents = [
    ...exports.SystemEvents,
    ...exports.RequestEvents,
    ...exports.MessageEvents,
    ...exports.NoticeEvents,
    ...exports.SyncEvents,
    'internal.sso',
    'internal.input',
    'guild.message'
];
/** PupBot 标准事件列表 */
exports.PupEvents = ['pup.admins'];
