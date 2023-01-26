import type { Client, Forwardable, XmlElem } from 'oicq';
/** 制作合并转发消息，可自定义标题、内容、底部说明文字 */
export declare function makeForwardMsg(this: Client, msglist: Forwardable[] | Forwardable, title?: string, desc?: string, dm?: boolean): Promise<XmlElem>;
