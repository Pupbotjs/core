import type { FriendRequestEvent, GroupInviteEvent, GroupRequestEvent } from 'icqq';
export type AllRequestEvent = FriendRequestEvent | GroupRequestEvent | GroupInviteEvent;
/** 请求监听函数，打印框架日志 */
export declare function requestHandler(event: AllRequestEvent): void;
