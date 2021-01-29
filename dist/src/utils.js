"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.question = exports.SendMessage = exports.getAppIdFromUrl = exports.SendMessageWithTempURL = exports.SendMessageWithQMSG = exports.SendMessageWithSC = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = require("querystring");
const readline_1 = require("readline");
const config_1 = __importDefault(require("./config"));
function SendMessageWithSC(key, msg) {
    return axios_1.default.post(`https://sc.ftqq.com/${key}.send`, querystring_1.stringify(msg));
}
exports.SendMessageWithSC = SendMessageWithSC;
function SendMessageWithQMSG(key, msg, qq) {
    return axios_1.default.post(`https://qmsg.zendee.cn/send/${key}`, querystring_1.stringify({ msg, qq }));
}
exports.SendMessageWithQMSG = SendMessageWithQMSG;
function SendMessageWithTempURL(url, key, title, content) {
    const xurl = url.replace(/{\s*title\s*}/, querystring_1.escape(title))
        .replace(/{\s*content\s*}/, querystring_1.escape(content))
        .replace(/{\s*key\s*}/, querystring_1.escape(key));
    return axios_1.default.get(xurl);
}
exports.SendMessageWithTempURL = SendMessageWithTempURL;
function getAppIdFromUrl(url) {
    return querystring_1.parse(url.slice(url.indexOf('?') + 1)).templateid;
}
exports.getAppIdFromUrl = getAppIdFromUrl;
async function SendMessage(title, content, safe) {
    if (config_1.default.SCKEY) {
        try {
            const resp = await SendMessageWithSC(config_1.default.SCKEY, { text: title, desp: content });
            const data = resp.data;
            if (data && data.errno) {
                throw new Error(`${data.errmsg}(${data.errno})`);
            }
        }
        catch (error) {
            console.error('Server酱推送失败:', error);
            if (safe) {
                console.error('推送内容：');
                console.error(title);
                console.error(content || '');
            }
        }
    }
    if (config_1.default.QMSG_KEY) {
        try {
            const resp = await SendMessageWithQMSG(config_1.default.QMSG_KEY, `${title}\n${content}`, config_1.default.QMSG_QQ);
            const data = resp.data;
            if (data && !data.success) {
                throw new Error(`${data.reason}(${data.code})`);
            }
        }
        catch (error) {
            console.error('QMSG推送失败:', error);
            if (safe) {
                console.error('推送内容：');
                console.error(title);
                console.error(content || '');
            }
        }
    }
    if (config_1.default.MSG_URL) {
        try {
            await SendMessageWithTempURL(config_1.default.MSG_URL, config_1.default.MSG_KEY, title, content);
        }
        catch (error) {
            console.error('自定义推送失败:', error);
            if (safe) {
                console.error('推送内容：');
                console.error(title);
                console.error(content || '');
            }
        }
    }
    if (safe) {
        console.log(title);
        console.log(content || '');
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