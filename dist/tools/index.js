"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appId = exports.token = exports.setup = exports.send = exports.main = void 0;
async function main() {
    return await Promise.resolve().then(() => __importStar(require("./main")));
}
exports.main = main;
async function send() {
    return await Promise.resolve().then(() => __importStar(require("./send")));
}
exports.send = send;
async function setup() {
    return await Promise.resolve().then(() => __importStar(require("./setup")));
}
exports.setup = setup;
async function token() {
    return await Promise.resolve().then(() => __importStar(require("./token")));
}
exports.token = token;
async function appId() {
    return await Promise.resolve().then(() => __importStar(require("./appId")));
}
exports.appId = appId;
//# sourceMappingURL=index.js.map