"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = exports.getProxyInfo = exports.setupConfig = exports.config = void 0;
exports.config = {
    USER_AGENT: 'Dalvik/2.1.0 (Linux; U; Android 9; INE-AL00 Build/HUAWEIINE-AL00)',
    USER_AGENT2: 'Mozilla/5.0 (Linux; Android 9; INE-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36 Wanxiao/5.2.5',
    TYPE: null,
    TOKEN: null,
    APP_ID: null,
    USERNAME: null,
    PASSWORD: null,
    MODEL: 'HUAWEI INE-AL00',
    MODEL_CODE: 'INE-AL00',
    SYSTEM_VERSION: '9',
    SYSTEM_TYPE: 'android',
    SCKEY: null,
    DEVICE_ID: null,
    DEVICE_SEED: Math.random() * 0xFFFF0000,
    PROXY_HOST: null,
    PROXY_PORT: null,
    APP_VERSION: 10525101,
    TEXT_OK: '芜湖~打卡完成！',
    TEMP_RANGE: "35.4-36.9"
};
function setupConfig(data) {
    return Object.assign(exports.config, data);
}
exports.setupConfig = setupConfig;
function getProxyInfo() {
    return (exports.config.PROXY_HOST && exports.config.PROXY_PORT) && {
        host: exports.config.PROXY_HOST,
        port: exports.config.PROXY_PORT * 1,
    };
}
exports.getProxyInfo = getProxyInfo;
function loadEnv() {
    Object.keys(exports.config).forEach(key => exports.config[key] = process.env[key] || exports.config[key]);
}
exports.loadEnv = loadEnv;
loadEnv();
exports.default = exports.config;
//# sourceMappingURL=config.js.map