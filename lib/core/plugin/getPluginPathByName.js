"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginPathByName = void 0;
const getPluginNameByPath_1 = require("./getPluginNameByPath");
const searchPlugins_1 = require("./searchPlugins");
/** 通过插件名定位插件路径的函数 */
async function getPluginPathByName(pluginName) {
    const { plugins } = await (0, searchPlugins_1.searchAllPlugins)();
    const pluginPath = plugins.find((p) => (0, getPluginNameByPath_1.getPluginNameByPath)(p) === pluginName);
    return pluginPath;
}
exports.getPluginPathByName = getPluginPathByName;
