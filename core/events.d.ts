import type { Client, EventMap } from 'oicq';
export declare const SystemEvents: readonly ["system.login.qrcode", "system.login.slider", "system.login.device", "system.login.error", "system.online", "system.offline.network", "system.offline.kickoff", "system.offline"];
export declare const RequestEvents: readonly ["request.friend.add", "request.friend.single", "request.friend", "request.group.add", "request.group.invite", "request.group", "request"];
export declare const MessageEvents: readonly ["message.private", "message.private.friend", "message.private.group", "message.private.other", "message.private.self", "message.group", "message.group.normal", "message.group.anonymous", "message.discuss", "message"];
export declare const NoticeEvents: readonly ["notice.friend.increase", "notice.friend.decrease", "notice.friend.recall", "notice.friend.poke", "notice.group.increase", "notice.group.decrease", "notice.group.recall", "notice.group.admin", "notice.group.ban", "notice.group.transfer", "notice.group.poke", "notice.friend", "notice.group", "notice"];
export declare const SyncEvents: readonly ["sync.message", "sync.read.private", "sync.read.group", "sync.read"];
/** oicq v2 标准事件列表 */
export declare const OicqEvents: (keyof EventMap<Client>)[];
/** PupBot 标准事件列表 */
export declare const PupEvents: readonly ["pup.admins"];
