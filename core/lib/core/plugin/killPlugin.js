"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.killPlugin = void 0;
/** 从 require 缓存中删除对应模块路径的插件缓存 */
function killPlugin(modulePath) {
    // 确保路径和 cache 中的 key 一致
    modulePath = require.resolve(modulePath);
    const mod = require.cache[modulePath];
    if (!mod) {
        return;
    }
    const idx = require.main?.children.indexOf(mod);
    if (idx >= 0) {
        require.main?.children.splice(idx, 1);
    }
    for (const fullpath in require.cache) {
        const modId = require.cache[fullpath]?.id;
        const valid = modId?.startsWith(mod.path);
        if (valid) {
            delete require.cache[fullpath];
        }
    }
    delete require.cache[modulePath];
}
exports.killPlugin = killPlugin;
