import type { Client } from 'oicq';
interface SliderEvent {
    url: string;
    isFirst: boolean;
}
/** 滑块事件监听处理函数 */
export declare function sliderHandler(this: Client, { url, isFirst }: SliderEvent): void;
export {};
