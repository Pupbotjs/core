/** 检索 `node_modules` 中可用的插件模块 */
export declare function searchNpmPlugin(): Promise<string[]>;
/** 检索 `plugins` 中可用的插件模块 */
export declare function searchLocalPlugin(): Promise<string[]>;
/** 搜索本地所有插件，包括 `npm` 安装的插件和 `plugins` 目录下的插件，以及对应插件的数量信息 */
export declare function searchAllPlugins(): Promise<{
    /** npm 插件 */
    npmPlugins: string[];
    /** 本地插件 */
    localPlugins: string[];
    /** 所有插件 */
    plugins: string[];
    /** 数目信息 */
    cnts: {
        /** `npm` 插件数量 */
        npm: number;
        /** 本地 `plugins` 目录下的插件数量 */
        local: number;
        /** 所有插件数量 */
        all: number;
    };
}>;
