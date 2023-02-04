"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPlugins = void 0;
const enablePlugin_1 = require("./enablePlugin");
const getPluginNameByPath_1 = require("./getPluginNameByPath");
const searchPlugins_1 = require("./searchPlugins");
/** 检索并加载 node_modules 和 plugins 目录下的插件 */
async function loadPlugins(bot, PupConf) {
    // 检索本地所有插件（node_modukles 里 `pupbot-plugin-` 开头的插件 和 plugins 下的插件）
    const { plugins, cnts } = await (0, searchPlugins_1.searchAllPlugins)();
    const { all, npm, local } = cnts;
    let cnt = 0;
    const enablePlugns = [];
    for (const pluginPath of plugins) {
        const pluginName = (0, getPluginNameByPath_1.getPluginNameByPath)(pluginPath);
        // 跳过未设置启用的插件
        if (!PupConf.plugins.includes(pluginName)) {
            continue;
        }
        const isOK = await (0, enablePlugin_1.enablePlugin)(bot, PupConf, pluginPath);
        // 启用成功时，启用插件数加一
        if (isOK) {
            cnt++;
            enablePlugns.push(pluginName);
        }
    }
    return { plugins: enablePlugns, all, npm, local, cnt };
}
exports.loadPlugins = loadPlugins;
