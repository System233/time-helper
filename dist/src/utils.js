"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.question = exports.SendMessage = exports.getAppIdFromUrl = exports.SendMessageWithKey = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = require("querystring");
const readline_1 = require("readline");
const config_1 = __importDefault(require("./config"));
function SendMessageWithKey(key, msg) {
    return axios_1.default.post(`https://sc.ftqq.com/${key}.send`, querystring_1.stringify(msg));
}
exports.SendMessageWithKey = SendMessageWithKey;
function getAppIdFromUrl(url) {
    return querystring_1.parse(url.slice(url.indexOf('?') + 1)).templateid;
}
exports.getAppIdFromUrl = getAppIdFromUrl;
async function SendMessage(text, desp) {
    if (config_1.default.SCKEY) {
        const resp = await SendMessageWithKey(config_1.default.SCKEY, { text, desp });
        return resp.data;
    }
    else {
        console.log(text);
        console.log(desp || '');
    }
}
exports.SendMessage = SendMessage;
function question(msg, timeout) {
    return new Promise((resolve, reject) => {
        const io = readline_1.createInterface(process.stdin, process.stdout);
        io.question(msg, answer => {
            resolve(answer);
            io.close();
        });
        if (timeout)
            setTimeout(reject, timeout);
    });
}
exports.question = question;
//# sourceMappingURL=utils.js.map