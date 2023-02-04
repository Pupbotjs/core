/** PupBot 规范化输出 */
export declare const notice: {
    /** 输出 PupBot 规范化的提示消息 */
    info: (msg: string, newLine?: boolean) => void;
    /** 输出 PupBot 规范化的警告消息 */
    warn: (msg: string, newLine?: boolean) => void;
    /** 输出 PupBot 规范化的成功消息 */
    success: (msg: string, newLine?: boolean) => void;
    /** 输出 PupBot 规范化的错误消息 */
    error: (msg: string, newLine?: boolean) => void;
};
