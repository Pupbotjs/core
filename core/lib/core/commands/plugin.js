"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePluginCommand = exports.PluginText = void 0;
const plugin_1 = require("../plugin");
const config_1 = require("../config");
const logger_1 = require("../logger");
const start_1 = require("../start");
const utils_1 = require("../../utils");
exports.PluginText = `
〓 PupBot 插件 〓
/plugin list
/plugin add <name>
/plugin rm <name>
/plugin on/off <name>
/plugin onall/offall/reloadall
/plugin reload <name>
/plugin update <?name>
/p = /plugin
`.trim();
async function handlePluginCommand(bot, params, reply) {
    if (!params.length) {
        return await reply(exports.PluginText);
    }
    const [secondCmd, pname] = params;
    if (secondCmd === 'list') {
        const { plugins: allPlugins } = await (0, plugin_1.searchAllPlugins)();
        const pinfo = allPlugins.map((pn) => {
            const name = (0, plugin_1.getPluginNameByPath)(pn);
            const plugin = start_1.plugins.get(name);
            return `${plugin ? '●' : '○'} ${name}${plugin ? ` (${plugin.version})` : ''}`;
        });
        const message = `
〓 PupBot 插件列表 〓
${pinfo.join('\n')}
共 ${pinfo.length} 个，启用 ${start_1.plugins.size} 个
`.trim();
        return reply(pinfo.length ? message : '〓 插件列表为空 〓');
    }
    if (secondCmd === 'onall') {
        const { plugins: ps, cnts: { all } } = await (0, plugin_1.searchAllPlugins)();
        if (all === 0) {
            return reply('〓 插件列表为空 〓');
        }
        if (ps.length === start_1.plugins.size) {
            return reply('〓 所有插件均已启用 〓');
        }
        let count = 0;
        ps.forEach(async (path, i) => {
            const pname = (0, plugin_1.getPluginNameByPath)(path);
            if (start_1.plugins.has(pname)) {
                // 过滤已经启用了的插件
                return count++;
            }
            const res = await (0, plugin_1.enablePlugin)(bot, config_1.PupConf, path);
            if (res === true) {
                count++;
            }
            else {
                reply(`〓 ${pname} 启用失败 〓\n${res}`);
            }
            if (i + 1 === all) {
                (0, config_1.savePupConf)();
                return reply(`〓 共启用 ${count} 个插件 〓`);
            }
        });
        return;
    }
    if (secondCmd === 'offall') {
        const size = start_1.plugins.size;
        if (!size) {
            return reply('〓 所有插件均已禁用 〓');
        }
        Array.from(start_1.plugins.entries()).forEach(async ([pname, plugin], i) => {
            const targetPluginPath = await (0, plugin_1.getPluginPathByName)(pname);
            if (targetPluginPath) {
                const res = await (0, plugin_1.disablePlugin)(bot, config_1.PupConf, plugin, targetPluginPath);
                if (res !== true) {
                    reply(`〓 ${pname} 禁用失败 〓\n${res}`);
                }
                start_1.plugins.delete(pname);
            }
            if (i + 1 === size) {
                (0, config_1.savePupConf)(start_1.plugins);
                return reply('〓 已禁用所有插件 〓');
            }
        });
        return;
    }
    if (secondCmd === 'reloadall') {
        const size = start_1.plugins.size;
        if (!size) {
            return reply('〓 所有插件均已禁用 〓');
        }
        Array.from(start_1.plugins.entries()).forEach(async ([pname, plugin], i) => {
            const targetPluginPath = await (0, plugin_1.getPluginPathByName)(pname);
            if (targetPluginPath) {
                const res = await (0, plugin_1.disablePlugin)(bot, config_1.PupConf, plugin, targetPluginPath);
                const res_1 = await (0, plugin_1.enablePlugin)(bot, config_1.PupConf, targetPluginPath);
                if (res !== true||res_1 !== true) {
                    reply(`〓 ${pname} 重载失败 〓\n${res}`);
                }
            }
            if (i + 1 === size) {
                (0, config_1.savePupConf)(start_1.plugins);
                return reply('〓 已重载所有插件 〓');
            }
        });
        return;
    }
    if(secondCmd === 'rm'){
               if (!pname) {
            return reply('/plugin rm <name>');
        }
        let shortName = pname;
        if (/^pupbot-plugin-/i.test(shortName)) {
            shortName = shortName.replace(/^pupbot-plugin-/i, '');
        }
        reply(`〓 正在移除 ${pname}... 〓`);
        try {
            if (await (0, utils_1.install)(`pupbot-plugin-${shortName}`, true)) {
                await reply(`〓 ${pname} 移除成功 〓`);
            }
            else {
                await reply(`〓 ${pname} 移除失败，详情查看日志 〓`);
            }
        }
        catch (e) {
            logger_1.PupLogger.error((0, utils_1.stringifyError)(e));
            await reply(`〓 ${pname} 移除失败 〓\n错误信息: ${(0, utils_1.stringifyError)(e)}`);
        }
        process.title = `PupBot ${start_1.pkg.version} ${config_1.PupConf.account}`;
    }
    if (secondCmd === 'update') {
        reply('〓 正在更新插件... 〓');
        const name = pname ? `${pname} ` : '';
        try {
            const upInfo = await (0, utils_1.update)(`pupbot-plugin-${pname || '*'}`);
            if (upInfo) {
                const info = Object.entries(upInfo)
                    .map(([k, v]) => `${k.replace('pupbot-plugin-', '插件: ')} => ${v.replace('^', '')}`)
                    .join('\n');
                const updated = pname ? `〓 ${name}已是最新版本 〓` : '〓 所有插件均为最新版本 〓';
                const msg = info
                    ? `〓 插件更新成功，更新内容如下 〓\n${info}\ntip: 需要重载插件才能生效`
                    : updated;
                await reply(msg);
            }
            else {
                await reply(`〓 ${name}更新失败，详情查看日志 〓`);
            }
        }
        catch (e) {
            logger_1.PupLogger.error((0, utils_1.stringifyError)(e));
            await reply(`〓 ${name}更新失败 〓\n错误信息: ${(0, utils_1.stringifyError)(e)}`);
        }
        process.title = `PupBot ${start_1.pkg.version} ${config_1.PupConf.account}`;
        return;
    }
    if (secondCmd === 'on') {
        if (!pname) {
            return reply('/plugin add <name>');
        }
        const targetPluginPath = await (0, plugin_1.getPluginPathByName)(pname);
        if (!targetPluginPath) {
            return reply(`〓 ${pname}: 插件不存在 〓`);
        }
        if (start_1.plugins.has(pname)) {
            return reply(`〓 ${pname}: 插件已启用 〓`);
        }
        const res = await (0, plugin_1.enablePlugin)(bot, config_1.PupConf, targetPluginPath);
        if (res === true) {
            if ((0, config_1.savePupConf)()) {
                return reply(`〓 ${pname} 启用成功 〓`);
            }
        }
        else {
            return reply(`〓 ${pname} 启用失败 〓\n${res}`);
        }
    }
    if (secondCmd === 'off') {
        if (!pname) {
            return reply('/plugin add <name>');
        }
        const plugin = start_1.plugins.get(pname);
        if (!plugin) {
            return reply(`〓 ${pname}: 插件不存在 〓`);
        }
        const targetPluginPath = await (0, plugin_1.getPluginPathByName)(pname);
        if (!targetPluginPath) {
            return reply(`〓 ${pname}: 插件不存在 〓`);
        }
        const res = await (0, plugin_1.disablePlugin)(bot, config_1.PupConf, plugin, targetPluginPath);
        if (res === true) {
            start_1.plugins.delete(pname);
            if ((0, config_1.savePupConf)()) {
                return reply(`〓 ${pname} 禁用成功 〓`);
            }
        }
        else {
            return reply(`〓 ${pname} 禁用失败 〓\n${res}`);
        }
    }
    if (secondCmd === 'reload') {
        if (!pname) {
            return reply('/plugin add <name>');
        }
        const plugin = start_1.plugins.get(pname);
        const targetPluginPath = await (0, plugin_1.getPluginPathByName)(pname);
        if (!targetPluginPath) {
            return reply(`〓 ${pname}: 插件不存在 〓`);
        }
        let res = false;
        if (!plugin) {
            res = await (0, plugin_1.enablePlugin)(bot, config_1.PupConf, targetPluginPath);
        }
        else {
            res = await (0, plugin_1.disablePlugin)(bot, config_1.PupConf, plugin, targetPluginPath);
            res = res && (await (0, plugin_1.enablePlugin)(bot, config_1.PupConf, targetPluginPath));
        }
        if (res === true) {
            if ((0, config_1.savePupConf)()) {
                return reply(`〓 ${pname} 重载成功 〓`);
            }
        }
        else {
            return reply(`〓 ${pname} 重载失败 〓\n${res}`);
        }
    }
    if (secondCmd === 'add') {
        if (!pname) {
            return reply('/plugin add <name>');
        }
        let shortName = pname;
        if (/^pupbot-plugin-/i.test(shortName)) {
            shortName = shortName.replace(/^pupbot-plugin-/i, '');
        }
        reply(`〓 正在安装 ${pname} 〓`);
        try {
            if (await (0, utils_1.install)(`pupbot-plugin-${shortName}`)) {
                await reply(`〓 ${pname} 安装成功 〓`);
            }
            else {
                await reply(`〓 ${pname} 安装失败，详情查看日志 〓`);
            }
        }
        catch (e) {
            logger_1.PupLogger.error((0, utils_1.stringifyError)(e));
            await reply(`〓 ${pname} 安装失败 〓\n错误信息: ${(0, utils_1.stringifyError)(e)}`);
        }
        process.title = `PupBot ${start_1.pkg.version} ${config_1.PupConf.account}`;
    }
}
exports.handlePluginCommand = handlePluginCommand;
