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
exports.Helper = exports.API = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importStar(require("./config"));
class API {
    constructor(token) {
        this.token = token;
        this.host = 'https://reportedh5.17wanxiao.com';
        this.http = axios_1.default.create({
            headers: {
                'User-Agent': config_1.default.USER_AGENT2,
            },
            proxy: config_1.getProxyInfo()
        });
        this.http.interceptors.response.use(resp => {
            const code = resp.data.code;
            if ((typeof code == "number" && code)) {
                return Promise.reject(new Error(`${resp.data.msg}(${code})`));
            }
            else if (typeof code == "string" && code != '10000') {
                return Promise.reject(new Error(`${resp.data.msg}：${resp.data.data}(${code})`));
            }
            return resp;
        }, e => Promise.reject(e));
    }
    doDKData(path, data) {
        return this.http.post(`${this.host}${path}`, data, {
            headers: {
                'Referer': `${this.host}/health/index.html?UAinfo=wanxiao&versioncode=${config_1.default.APP_VERSION}&businessType=epmpics&token=${this.token}&fromincollege=1`
            },
        });
    }
    getDKData(path) {
        return this.doDKData(path, `appClassify=DK&token=${this.token}`);
    }
    async getApps() {
        const resp = await this.getDKData('/api/clock/school/childApps');
        return resp.data.appList;
    }
    async getUserInfo() {
        const resp = await this.getDKData('/api/clock/school/getUserInfo');
        return resp.data.userInfo;
    }
    async getLastData(id) {
        const resp = await this.doDKData('/sass/api/epmpics', {
            businessType: "epmpics",
            jsonData: {
                templateid: id,
                token: this.token
            },
            method: "userComeApp",
        });
        const data = JSON.parse(resp.data.data);
        return data;
    }
    async submitData(data) {
        const resp = await this.doDKData('/sass/api/epmpics', {
            businessType: "epmpics",
            jsonData: Object.assign({
                token: this.token,
                reportdate: Date.now()
            }, data),
            method: "submitUpInfo",
        });
        return resp.data;
    }
}
exports.API = API;
class Helper extends API {
    handleData(data) {
        data.cusTemplateRelations.forEach(item => {
            if (item.assembltype == "Temperature") {
                const [min, max] = config_1.default.TEMP_RANGE.split('-').map(parseFloat).sort();
                item.value = (min + (Math.random() * (max - min))).toFixed(1);
            }
        });
        return data;
    }
    async run() {
        const raw = await this.getLastData(config_1.default.APP_ID);
        const data = await this.handleData(raw);
        const { areaStr, customerid, deptStr, phonenum, stuNo, username, userid, cusTemplateRelations } = data;
        const updatainfo = cusTemplateRelations.map(({ propertyname, value }) => ({ propertyname, value }));
        const submit = {
            areaStr, customerid, deptStr, phonenum, stuNo, userid, username,
            deptid: deptStr.deptid,
            gpsType: 1,
            source: 'app',
            templateid: config_1.default.APP_ID,
            updatainfo,
        };
        await this.submitData(submit);
        return data;
    }
}
exports.Helper = Helper;
exports.default = Helper;
//# sourceMappingURL=helper.js.map