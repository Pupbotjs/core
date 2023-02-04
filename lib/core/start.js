"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.pkg = exports.plugins = void 0;
const oicq_1 = require("oicq");
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_path_1 = __importDefault(require("node:path"));
const login_1 = require("./login");
const utils_1 = require("../utils");
const path_1 = require("./path");
const logger_1 = require("./logger");
const config_1 = require("./config");
const logs_1 = require("./logs");
const online_1 = require("./online");
exports.plugins = new Map();
exports.pkg = require(node_path_1.default.join(__dirname, '../../package.json'));
/** 通过 `config.json` 配置文件启动框架 */
function start() {
    // 设置终端标题
    process.title = `PupBot ${exports.pkg.version} `;
    // 打印 PupBot logo
    console.log(`\n${utils_1.colors.cyan(utils_1.LOGO)}\n`);
    if (!fs_extra_1.default.existsSync(path_1.ConfigPath)) {
        (0, utils_1.exitWithError)('配置文件 `config.json` 不存在');
    }
    /** 捕获 Ctrl C 中断退出 */
    process.on('SIGINT', () => {
        utils_1.notice.success(utils_1.colors.yellow('已退出 PupBot'), true);
        process.exit(0);
    });
    try {
        // 读取框架账号配置文件 `config.json`
        const conf = require(path_1.ConfigPath);
        // 载入配置到内存
        Object.assign(config_1.PupConf, conf);
        // 终端标题加上账号
        process.title = `PupBot ${exports.pkg.version} ${config_1.PupConf.account}`;
        console.log(`欢迎使用 PupBot，轻量、高效、跨平台 的机器人框架\n`);
        console.log('使用文档: ' + utils_1.colors.green('https://pupbot.cn'));
        console.log('框架版本: ' + utils_1.colors.green(`@pupbot/core ${exports.pkg.version}`));
        console.log('配置文件: ' + utils_1.colors.green(`${path_1.ConfigPath}\n`));
        const { log_level = 'info', oicq_config = {} } = config_1.PupConf;
        if (!config_1.PupConf?.account) {
            (0, utils_1.exitWithError)('无效的配置文件：`config.json`');
        }
        if (!config_1.PupConf?.admins || config_1.PupConf?.admins?.length <= 0) {
            (0, utils_1.exitWithError)('配置文件 `config.json` 中至少配置一个主管理员');
        }
        // 缺省 oicq 配置
        // 未指定协议时，默认使用 iPad 协议作为 oicq 登录协议
        oicq_config.platform = oicq_config?.platform ?? 5;
        // ociq 数据及缓存保存在 data/oicq 下
        oicq_config.data_dir = path_1.OicqDataDir;
        // oicq 默认日志等级为 info
        oicq_config.log_level = oicq_config?.log_level ?? 'info';
        // 指定默认 ffmpeg 和 ffprobe 命令为全局路径
        oicq_config.ffmpeg_path = oicq_config?.ffmpeg_path || 'ffmpeg';
        oicq_config.ffprobe_path = oicq_config?.ffprobe_path || 'ffprobe';
        // 重定向日志，oicq 的日志输出到日志文件，PupBot 的日志输出到 console
        (0, logger_1.redirectLog)(log_level, oicq_config, config_1.PupConf.account);
        // 确保 PupBot 框架相关目录存在
        fs_extra_1.default.ensureDirSync(path_1.LogDir);
        fs_extra_1.default.ensureDirSync(path_1.PluginDir);
        fs_extra_1.default.ensureDirSync(path_1.PluginDataDir);
        const protocol = logger_1.Devices[oicq_config.platform] || '未知';
        logger_1.PupLogger.info(utils_1.colors.gray(`使用 ${protocol} 作为 Bot 登录协议`));
        logger_1.PupLogger.info(utils_1.colors.gray(`开始登录 Bot 账号 ${config_1.PupConf.account}...`));
        logger_1.PupLogger.info(utils_1.colors.gray(`正在查找可用登录服务器...`));
        // 初始化实例
        const bot = (0, oicq_1.createClient)(config_1.PupConf.account, oicq_config);
        // 取消监听函数个数限制
        bot.setMaxListeners(Infinity);
        // 监听上线事件
        bot.on('system.online', online_1.onlineHandler.bind(bot, config_1.PupConf));
        // 监听设备锁、滑块和登录错误的事件
        (0, login_1.bindLoginEvent)(bot, conf);
        // 监听下线事件
        bot.on('system.offline', logs_1.offlineHandler);
        // 通过配置文件里指定的模式登录账号
        if (conf.login_mode === 'qrcode') {
            bot.on('system.login.qrcode', login_1.qrCodeHandler).login();
        }
        else {
            const plainPwd = Buffer.from(conf.password || '', 'base64').toString();
            bot.login((0, utils_1.md5)(plainPwd));
        }
    }
    catch (e) {
        logger_1.PupLogger.error((0, utils_1.stringifyError)(e));
        (0, utils_1.exitWithError)('无效的配置文件：`config.json`');
    }
}
exports.start = start;
