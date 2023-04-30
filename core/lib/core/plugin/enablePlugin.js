"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enablePlugin = void 0;
const utils_1 = require("../../utils");
const getPluginNameByPath_1 = require("./getPluginNameByPath");
const logger_1 = require("../logger");
const pluginError_1 = require("./pluginError");
const start_1 = require("../start");
/** 通过插件模块路径启用单个插件 */
async function enablePlugin(bot, PupConf, pluginPath) {
    const error = (msg, ...args) => {
        bot.logger.error(msg, ...args);
        logger_1.PupLogger.error(msg, ...args);
    };
    const info = (msg, ...args) => {
        bot.logger.info(msg, ...args);
        logger_1.PupLogger.info(msg, ...args);
    };
    logger_1.PupLogger.debug('enablePlugin: ' + pluginPath);
    const pluginName = (0, getPluginNameByPath_1.getPluginNameByPath)(pluginPath);
    const pn = utils_1.colors.green(pluginName);
    try {
        const { plugin } = (await require(pluginPath));
        if (plugin && plugin?.mountPupBotClient) {
            try {
                await plugin.mountPupBotClient(bot, [...PupConf.admins]);
                start_1.plugins.set(pluginName, plugin);
                info(`插件 ${pn} 启用成功`);
                return true;
            }
            catch (e) {
                start_1.plugins.delete(pluginName);
                if (e instanceof pluginError_1.PupPluginError) {
                    return e.log();
                }
                else {
                    const msg = (0, utils_1.stringifyError)(e);
                    error(`插件 ${pn} 启用过程中发生错误: \n${msg}`);
                    return msg;
                }
            }
        }
        else {
            start_1.plugins.delete(pluginName);
            const info = utils_1.colors.red(`插件 ${pn} 没有导出 \`PupPlugin\` 类实例的 \`plugin\` 属性`);
            error(info);
            return (0, utils_1.escapeColor)(info);
        }
    }
    catch (e) {
        start_1.plugins.delete(pluginName);
        if (e instanceof pluginError_1.PupPluginError) {
            return e.log();
        }
        else {
            const msg = (0, utils_1.stringifyError)(e);
            error(`插件 ${pn} 导入过程中发生错误: \n${msg}`);
            return msg;
        }
    }
}
exports.enablePlugin = enablePlugin;
