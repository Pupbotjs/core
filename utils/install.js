"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
const core_1 = require("../core");
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
// 安装 node 依赖
async function install(pkg) {
    const promiseExec = (0, node_util_1.promisify)(node_child_process_1.exec);
    const cmd = `npm install ${pkg ?? ''}`;
    const { stderr } = await promiseExec(cmd);
    if (stderr) {
        if (/npm ERR/i.test(stderr)) {
            core_1.PupLogger.error(stderr);
            return false;
        }
    }
    return true;
}
exports.install = install;
