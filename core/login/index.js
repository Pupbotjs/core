"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindLoginEvent = void 0;
const device_1 = require("./device");
const slider_1 = require("./slider");
const error_1 = require("./error");
__exportStar(require("./qrCode"), exports);
async function bindLoginEvent(bot, conf) {
    bot.on('system.login.device', device_1.deviceHandler.bind(bot, conf.device_mode));
    bot.on('system.login.slider', ({ url }) => slider_1.sliderHandler.call(bot, { isFirst: true, url }));
    bot.on('system.login.error', error_1.errorHandler);
}
exports.bindLoginEvent = bindLoginEvent;
