import type { Client, EventMap } from 'icqq';
/** 监听处理所有通知，打印框架日志 */
export declare function noticeHandler(this: Client, event: Parameters<EventMap['notice.friend']>[0] | Parameters<EventMap['notice.group']>[0]): void;
