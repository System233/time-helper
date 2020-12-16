import { createHash, createPublicKey, generateKeyPairSync, KeyObject } from "crypto";
import {createCipheriv, createDecipheriv, createPrivateKey, privateDecrypt} from "crypto"

import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import { RSA_PKCS1_PADDING } from "constants";
import Axios from "axios";

import config, { getProxyInfo } from "./config"
import { question } from ".";
export interface AuthData{
    username: string;
    password?:string;
    token?: string;
}

export interface AuthOption extends AuthData{
    type: 'sms'|'token'|'password';
}

export class Session{
    privateKey:KeyObject;
    publicKey:KeyObject;
    session:string;
    key:string;
    http:AxiosInstance;
    static async create(session?:string){
        const ss=new Session(session);
        await ss.init();
        return ss;
    }
    getHeaders(){
        return {
            'Content-Type': 'application/text',
            'User-Agent': config.USER_AGENT,
        }
    }
    private constructor(session?:string){
        const {privateKey,publicKey}=generateKeyPairSync('rsa',{modulusLength:1024});
        this.publicKey=publicKey;
        this.privateKey=privateKey;
        this.session=session;
        this.key=null;
        this.http=Axios.create({
            proxy:getProxyInfo(),
            headers:this.getHeaders(),
        });
        
        this.http.interceptors.request.use((config)=>{
            if(config.data){
                const data=JSON.stringify(config.data);
                config.data=JSON.stringify({
                    session:this.session,
                    data:this.encryptDES(data)
                })
                config.headers=Object.assign(
                    {
                        campusSign:createHash('sha256').update(config.data).digest('hex'),
                    },
                    config.headers
                )
            }
            return config;
        },e=>Promise.reject(e));
        this.http.interceptors.response.use(resp=>{
            if(!resp.data.result_){
                throw new Error(resp.data.message_)
            }
            else if(resp.data.data){
                resp.data.data=JSON.parse(this.decryptDES(resp.data.data));
            }
            return resp;
        },e=>Promise.reject(e))
    }
    
    decryptRSA(data:string){
        const decrypted=privateDecrypt({
            key:this.privateKey,
            padding:RSA_PKCS1_PADDING
        },Buffer.from(data,'base64'));
        return decrypted.toString();
    }
    decryptDES(data:string){
        const decipher=createDecipheriv('des-ede3-cbc',this.key.slice(0,24),'66666666');
        const decrypted=decipher.update(data,"base64","utf8")+decipher.final('utf8');
        return decrypted;
    }
    encryptDES(data:string){
        const cipher=createCipheriv('des-ede3-cbc',this.key.slice(0,24),'66666666');
        const crypted=cipher.update(data,"utf8","base64")+cipher.final("base64");
        return crypted;
    }
    get deviceId(){
        return config.DEVICE_ID||this.generateIMEI();
    }
    
    generateIMEI(){
        let seed=config.DEVICE_SEED;
        const rand=()=>(seed = ( seed * 9301 + 49297 ) % 233280)/ ( 233280.0 );
        const tac='86';
        const code=[...Array(12)].map(()=>rand()*10|0).join('');
        const data=tac+code;
        const check=[].map.call(data,(val,i)=>i&1?val*2:val*1).reduce((x,y)=>x+([].map.call((y+''),x=>x*1).reduce((x,y)=>x+y,0)),0)*9%10;
        return data+check;
    }
    private async init(){
        if(this.session)
            return;
        const resp=await axios.post<string>("https://app.59wanmei.com/campus/cam_iface46/exchangeSecretkey.action",{
            key:this.publicKey.export({type:'spki',format:'der'}).toString('base64')
        },{
            headers:this.getHeaders(),
            proxy:getProxyInfo()
        });
        const {session,key}=JSON.parse(this.decryptRSA(resp.data));
        this.session=session;
        this.key=key;
    }
    request(config:AxiosRequestConfig){
        return this.http.request(config);
    }
    get(url:string,config?:AxiosRequestConfig){
        return this.http.get(url,config);
    }
    post(url:string,data?:any,config?:AxiosRequestConfig){
        return this.http.post(url,data,config);
    }
    async sendSMS(option:AuthData){

        const send={
            action: "registAndLogin",
            deviceId: this.deviceId,
            mobile:  option.username,
            requestMethod: "cam_iface46/gainMatrixCaptcha.action",
            type: "sms",
        }
        await this.post('https://app.59wanmei.com/campus/cam_iface46/gainMatrixCaptcha.action',send);
        return true;
    }
    
    async authSMS(sms:string,option:AuthData){

        const data={
            appCode: "M002",
            deviceId: this.deviceId,
            netWork: "wifi",
            qudao: "guanwang",
            requestMethod: "cam_iface46/registerUsersByTelAndLoginNew.action",
            shebeixinghao: config.MODEL_CODE,
            sms: sms,
            systemType: config.SYSTEM_TYPE,
            telephoneInfo: config.SYSTEM_VERSION,
            telephoneModel: config.MODEL,
            mobile: option.username,
            wanxiaoVersion: config.APP_VERSION
        };
        await this.post('https://app.59wanmei.com/campus/cam_iface46/registerUsersByTelAndLoginNew.action',data);
        return this.session;
    }
    async authenticateWithSMS(option:AuthData){
        await this.sendSMS(option);
        do{
            try {
                
                const sms=await question("输入验证码>");
                await this.authSMS(sms,option);
                return this.session;
            } catch (error) {
                console.error(error.message);
            }
            
        }while(1);
    }
    
    async authenticateWithPWD(option:AuthData){
        const data={
            appCode: "M002",
            deviceId: this.deviceId,
            netWork: "wifi",
            password: [].map.call(option.password,x=>this.encryptDES(x)),
            qudao: "guanwang",
            requestMethod: "cam_iface46/loginnew.action",
            shebeixinghao: config.MODEL_CODE,
            systemType: config.SYSTEM_TYPE,
            telephoneInfo: config.SYSTEM_VERSION,
            telephoneModel: config.MODEL,
            type: "1",
            userName: option.username,
            wanxiaoVersion: config.APP_VERSION
        };
        await this.post('https://app.59wanmei.com/campus/cam_iface46/loginnew.action',data);
        return this.session;
    }
    authenticateWithToken(option:AuthData){
        return this.session;
    }

    async authenticate(option:AuthOption){
        switch(option.type){
            case 'sms':return this.authenticateWithSMS(option);
            case 'password':return this.authenticateWithPWD(option);
            case 'token':return this.authenticateWithToken(option);
            default:
                throw new Error('未知登录类型: '+option.type);
        }
    }
}

export default Session;