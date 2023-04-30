import type { Client } from 'icqq';
import type { PupConf } from '../config';
export * from './qrCode';
export declare function bindLoginEvent(bot: Client, conf: PupConf): Promise<void>;
