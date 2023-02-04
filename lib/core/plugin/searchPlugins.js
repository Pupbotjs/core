"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAllPlugins = exports.searchLocalPlugin = exports.searchNpmPlugin = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
const node_path_1 = __importDefault(require("node:path"));
const path_1 = require("../path");
/** 检索 `node_modules` 中可用的插件模块 */
async function searchNpmPlugin() {
    return searchPlugins(path_1.NodeModulesDir, 'pupbot-plugin-*');
}
exports.searchNpmPlugin = searchNpmPlugin;
/** 检索 `plugins` 中可用的插件模块 */
async function searchLocalPlugin() {
    return searchPlugins(path_1.PluginDir, '*');
}
exports.searchLocalPlugin = searchLocalPlugin;
/** 通过目录和 `glob` 匹配模式检索插件 */
const searchPlugins = async (cwd, pattern) => {
    const plugins = await (0, fast_glob_1.default)(pattern, { cwd, onlyDirectories: true });
    return plugins.map((dir) => node_path_1.default.join(cwd, dir));
};
/** 搜索本地所有插件，包括 `npm` 安装的插件和 `plugins` 目录下的插件，以及对应插件的数量信息 */
async function searchAllPlugins() {
    const npmPlugins = await searchNpmPlugin();
    const localPlugins = await searchLocalPlugin();
    const plugins = [...npmPlugins, ...localPlugins];
    const npm = npmPlugins.length;
    const local = localPlugins.length;
    const all = plugins.length;
    return {
        /** npm 插件 */
        npmPlugins,
        /** 本地插件 */
        localPlugins,
        /** 所有插件 */
        plugins,
        /** 数目信息 */
        cnts: {
            /** `npm` 插件数量 */
            npm,
            /** 本地 `plugins` 目录下的插件数量 */
            local,
            /** 所有插件数量 */
            all
        }
    };
}
exports.searchAllPlugins = searchAllPlugins;
