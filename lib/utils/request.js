"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = exports.axios = void 0;
const axios_1 = __importDefault(require("axios"));
exports.axios = axios_1.default;
const node_https_1 = __importDefault(require("node:https"));
const ChromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/108.0.0.0';
const http = axios_1.default.create({
    headers: { 'User-Agent': ChromeUA },
    timeout: 8000,
    validateStatus: () => true,
    httpsAgent: new node_https_1.default.Agent({
        rejectUnauthorized: false
    })
});
exports.http = http;
