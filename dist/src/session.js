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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const crypto_1 = require("crypto");
const crypto_2 = require("crypto");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("constants");
const axios_2 = __importDefault(require("axios"));
const config_1 = __importStar(require("./config"));
const _1 = require(".");
class Session {
    constructor(session) {
        const { privateKey, publicKey } = crypto_1.generateKeyPairSync('rsa', { modulusLength: 1024 });
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.session = session;
        this.key = null;
        this.http = axios_2.default.create({
            proxy: config_1.getProxyInfo(),
            headers: this.getHeaders(),
        });
        this.http.interceptors.request.use((config) => {
            if (config.data) {
                const data = JSON.stringify(config.data);
                config.data = JSON.stringify({
                    session: this.session,
                    data: this.encryptDES(data)
                });
                config.headers = Object.assign({
                    campusSign: crypto_1.createHash('sha256').update(config.data).digest('hex'),
                }, config.headers);
            }
            return config;
        }, e => Promise.reject(e));
        this.http.interceptors.response.use(resp => {
            if (!resp.data.result_) {
                throw new Error(resp.data.message_);
            }
            else if (resp.data.data) {
                resp.data.data = JSON.parse(this.decryptDES(resp.data.data));
            }
            return resp;
        }, e => Promise.reject(e));
    }
    static async create(session) {
        const ss = new Session(session);
        await ss.init();
        return ss;
    }
    getHeaders() {
        return {
            'Content-Type': 'application/text',
            'User-Agent': config_1.default.USER_AGENT,
        };
    }
    decryptRSA(data) {
        const decrypted = crypto_2.privateDecrypt({
            key: this.privateKey,
            padding: constants_1.RSA_PKCS1_PADDING
        }, Buffer.from(data, 'base64'));
        return decrypted.toString();
    }
    decryptDES(data) {
        const decipher = crypto_2.createDecipheriv('des-ede3-cbc', this.key.slice(0, 24), '66666666');
        const decrypted = decipher.update(data, "base64", "utf8") + decipher.final('utf8');
        return decrypted;
    }
    encryptDES(data) {
        const cipher = crypto_2.createCipheriv('des-ede3-cbc', this.key.slice(0, 24), '66666666');
        const crypted = cipher.update(data, "utf8", "base64") + cipher.final("base64");
        return crypted;
    }
    get deviceId() {
        return config_1.default.DEVICE_ID || this.generateIMEI();
    }
    generateIMEI() {
        let seed = config_1.default.DEVICE_SEED;
        const rand = () => (seed = (seed * 9301 + 49297) % 233280) / (233280.0);
        const tac = '86';
        const code = [...Array(12)].map(() => rand() * 10 | 0).join('');
        const data = tac + code;
        const check = [].map.call(data, (val, i) => i & 1 ? val * 2 : val * 1).reduce((x, y) => x + ([].map.call((y + ''), x => x * 1).reduce((x, y) => x + y, 0)), 0) * 9 % 10;
        return data + check;
    }
    async init() {
        if (this.session)
            return;
        const resp = await axios_1.default.post("https://app.59wanmei.com/campus/cam_iface46/exchangeSecretkey.action", {
            key: this.publicKey.export({ type: 'spki', format: 'der' }).toString('base64')
        }, {
            headers: this.getHeaders(),
            proxy: config_1.getProxyInfo()
        });
        const { session, key } = JSON.parse(this.decryptRSA(resp.data));
        this.session = session;
        this.key = key;
    }
    request(config) {
        return this.http.request(config);
    }
    get(url, config) {
        return this.http.get(url, config);
    }
    post(url, data, config) {
        return this.http.post(url, data, config);
    }
    async sendSMS(option) {
        const send = {
            action: "registAndLogin",
            deviceId: this.deviceId,
            mobile: option.username,
            requestMethod: "cam_iface46/gainMatrixCaptcha.action",
            type: "sms",
        };
        await this.post('https://app.59wanmei.com/campus/cam_iface46/gainMatrixCaptcha.action', send);
        return true;
    }
    async authSMS(sms, option) {
        const data = {
            appCode: "M002",
            deviceId: this.deviceId,
            netWork: "wifi",
            qudao: "guanwang",
            requestMethod: "cam_iface46/registerUsersByTelAndLoginNew.action",
            shebeixinghao: config_1.default.MODEL_CODE,
            sms: sms,
            systemType: config_1.default.SYSTEM_TYPE,
            telephoneInfo: config_1.default.SYSTEM_VERSION,
            telephoneModel: config_1.default.MODEL,
            mobile: option.username,
            wanxiaoVersion: config_1.default.APP_VERSION
        };
        await this.post('https://app.59wanmei.com/campus/cam_iface46/registerUsersByTelAndLoginNew.action', data);
        return this.session;
    }
    async authenticateWithSMS(option) {
        await this.sendSMS(option);
        let i = 3;
        do {
            try {
                const sms = await _1.question("输入验证码>");
                await this.authSMS(sms, option);
                return this.session;
            }
            catch (error) {
                console.error(error.message);
            }
        } while (i--);
    }
    async authenticateWithPWD(option) {
        const data = {
            appCode: "M002",
            deviceId: this.deviceId,
            netWork: "wifi",
            password: [].map.call(option.password, x => this.encryptDES(x)),
            qudao: "guanwang",
            requestMethod: "cam_iface46/loginnew.action",
            shebeixinghao: config_1.default.MODEL_CODE,
            systemType: config_1.default.SYSTEM_TYPE,
            telephoneInfo: config_1.default.SYSTEM_VERSION,
            telephoneModel: config_1.default.MODEL,
            type: "1",
            userName: option.username,
            wanxiaoVersion: config_1.default.APP_VERSION
        };
        await this.post('https://app.59wanmei.com/campus/cam_iface46/loginnew.action', data);
        return this.session;
    }
    authenticateWithToken(option) {
        return this.session;
    }
    async authenticate(option) {
        switch (option.type) {
            case 'sms': return this.authenticateWithSMS(option);
            case 'password': return this.authenticateWithPWD(option);
            case 'token': return this.authenticateWithToken(option);
            default:
                throw new Error('未知登录类型: ' + option.type);
        }
    }
}
exports.Session = Session;
exports.default = Session;
//# sourceMappingURL=session.js.map