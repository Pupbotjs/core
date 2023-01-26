import type { Client } from 'oicq';
import type { PupConf } from '../config';
export * from './qrCode';
export declare function bindLoginEvent(bot: Client, conf: PupConf): Promise<void>;
