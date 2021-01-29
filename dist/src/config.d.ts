interface Config {
    USER_AGENT: string;
    USER_AGENT2: string;
    TYPE: 'sms' | 'password' | 'token';
    TOKEN: string;
    USERNAME: string;
    PASSWORD: string;
    TEMP_RANGE: string;
    APP_ID: string;
    MODEL: string;
    MODEL_CODE: string;
    SYSTEM_VERSION: string;
    SYSTEM_TYPE: 'android';
    SCKEY: string;
    DEVICE_ID: string;
    DEVICE_SEED: number;
    PROXY_HOST: string;
    PROXY_PORT: number;
    APP_VERSION: number;
    TEXT_OK: string;
    QMSG_KEY: string;
    QMSG_QQ: string;
    MSG_KEY: string;
    MSG_URL: string;
}
export declare const config: Config;
export declare function setupConfig(data: {
    [key in keyof typeof config]?: string;
}): Config & {
    USER_AGENT?: string;
    USER_AGENT2?: string;
    TYPE?: string;
    TOKEN?: string;
    USERNAME?: string;
    PASSWORD?: string;
    TEMP_RANGE?: string;
    APP_ID?: string;
    MODEL?: string;
    MODEL_CODE?: string;
    SYSTEM_VERSION?: string;
    SYSTEM_TYPE?: string;
    SCKEY?: string;
    DEVICE_ID?: string;
    DEVICE_SEED?: string;
    PROXY_HOST?: string;
    PROXY_PORT?: string;
    APP_VERSION?: string;
    TEXT_OK?: string;
    QMSG_KEY?: string;
    QMSG_QQ?: string;
    MSG_KEY?: string;
    MSG_URL?: string;
};
export declare function getProxyInfo(): {
    host: string;
    port: number;
};
export declare function loadEnv(): void;
export default config;
//# sourceMappingURL=config.d.ts.map