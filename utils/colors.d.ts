/** 控制台彩色字体 */
export declare const colors: {
    /** 浅灰色前景（默认背景） */
    gray: (msg: string) => string;
    /** 红色前景（默认背景） */
    red: (msg: string) => string;
    /** 绿色前景（默认背景） */
    green: (msg: string) => string;
    /** 黄色前景（默认背景） */
    yellow: (msg: string) => string;
    /** 蓝色前景（默认背景） */
    blue: (msg: string) => string;
    /** 紫色前景（默认背景） */
    magenta: (msg: string) => string;
    /** 青色前景（默认背景） */
    cyan: (msg: string) => string;
    /** 白色前景（默认背景） */
    white: (msg: string) => string;
};
export declare function escapeColor(colorText: string): string;
