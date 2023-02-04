"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePupConf = exports.PupConf = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("./path");
const logger_1 = require("./logger");
const start_1 = require("./start");
exports.PupConf = {};
/** 保存 PupBot 框架配置到配置文件`config.json` */
const savePupConf = (_plugins) => {
    try {
        exports.PupConf.plugins = [...(_plugins ?? start_1.plugins).keys()];
        (0, fs_extra_1.writeJsonSync)(path_1.ConfigPath, exports.PupConf, { encoding: 'utf-8', spaces: 2 });
        return true;
    }
    catch (e) {
        logger_1.PupLogger.error(JSON.stringify(e, null, 2));
        return false;
    }
};
exports.savePupConf = savePupConf;
