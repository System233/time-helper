/*
 * 警告：配置参数请填写到Secret或环境变量，请勿在此填写敏感信息！！！
 */
interface Config{
    /* 登录UA */
    USER_AGENT: string,

    /* 打卡UA */
    USER_AGENT2:string,
    
    /* 登录类型 */
    TYPE:'sms'|'password'|'token',

    /* 登录态令牌（登录类型为token时使用） */
    TOKEN:string,
    
    /* 用户名/手机号 */
    USERNAME:string,
    
    /* 密码（登录类型为password时使用） */
    PASSWORD:string,

    /* 体温范围，例：35.6-36.9  */
    TEMP_RANGE:string;
    
    /* 打卡项目 */
    APP_ID:string,

    /* 设备型号 */
    MODEL:string,

    /* 设备代号 */
    MODEL_CODE:string,

    /* 系统版本 */
    SYSTEM_VERSION:string,

    /* 系统类型 */
    SYSTEM_TYPE:'android',
    
    /* Server酱SCKEY  http://sc.ftqq.com/3.version */
    SCKEY:string,

    /* 设备ID */
    DEVICE_ID:string,
    
    /* 设备ID随机种子，未设置`DEVICE_ID`时使用 */
    DEVICE_SEED:number,

    /* 代理主机 */
    PROXY_HOST:string,

    /* 代理端口 */
    PROXY_PORT:number,
    
    /* 完美校园版本，默认10525101*/
    APP_VERSION:number,

    /* 成功提示信息 */
    TEXT_OK:string
}
export const config:Config= {
    USER_AGENT: 'Dalvik/2.1.0 (Linux; U; Android 9; INE-AL00 Build/HUAWEIINE-AL00)',
    USER_AGENT2:'Mozilla/5.0 (Linux; Android 9; INE-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36 Wanxiao/5.2.5',
    TYPE:null,
    TOKEN:null,
    APP_ID:null,
    USERNAME:null,
    PASSWORD:null,
    MODEL:'HUAWEI INE-AL00',
    MODEL_CODE:'INE-AL00',
    SYSTEM_VERSION:'9',
    SYSTEM_TYPE:'android',
    SCKEY:null,
    DEVICE_ID:null,
    DEVICE_SEED:Math.random()*0xFFFF0000,
    PROXY_HOST:null,
    PROXY_PORT:null,
    APP_VERSION:10525101,
    TEXT_OK:'芜湖~打卡完成！',
    TEMP_RANGE:"35.4-36.9"
}
export function setupConfig(data:{[key in keyof typeof config]?:string}){
    return Object.assign(config,data);
}
export function getProxyInfo(){
    return (config.PROXY_HOST&&config.PROXY_PORT)&&{
            host:config.PROXY_HOST,
            port:config.PROXY_PORT*1,
        };
}
export function loadEnv(){
    Object.keys(config).forEach(key=>config[key]=process.env[key]||config[key]);
}
loadEnv();

export default config;