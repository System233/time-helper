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
    /**
     * 百度地图AK，可以不设置，用默认的
     * 实测可以乱设，百度好像不校验权限
     */
    BMAP_AK: string;
    /**
     * 随机定位：经度,纬度,半径(可选)
     *  到此处拾取坐标：http://api.map.baidu.com/lbsapi/getpoint/index.html
     *  半径1约一米，与纬度有关
     *  例：
     *      111.25445,12.51515
     *      123.456789,32.1654,100
     *
     *  注意：在国内，各个地图的经纬度坐标不通用，当前解析服务是百度的，所以建议用百度地图拾取坐标。
     */
    LOCATION: string;
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
    BMAP_AK?: string;
    LOCATION?: string;
};
export declare function getProxyInfo(): {
    host: string;
    port: number;
};
export declare function loadEnv(): void;
export default config;
//# sourceMappingURL=config.d.ts.map