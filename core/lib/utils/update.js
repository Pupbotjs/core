"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const npm_check_updates_1 = __importDefault(require("npm-check-updates"));
const node_path_1 = __importDefault(require("node:path"));
const core_1 = require("../core");
const install_1 = require("./install");
/** 更新依赖 */
async function update(pkg) {
    const upInfo = await (0, npm_check_updates_1.default)({
        packageFile: node_path_1.default.join(core_1.CWD, 'package.json'),
        filter: pkg ?? ['@pupbot/*', 'pupbot', 'pupbot-*'],
        upgrade: true,
        jsonUpgraded: true
    });
    const res = await (0, install_1.install)();
    return res ? upInfo : false;
}
exports.update = update;
