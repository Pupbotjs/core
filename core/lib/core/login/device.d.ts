import type { Client } from 'icqq';
import type { PupConf } from '../config';
/** 设备锁验证监听处理函数 */
export declare function deviceHandler(this: Client, device_mode: PupConf['device_mode'], event: {
    url: string;
    phone: string;
}): Promise<void>;
