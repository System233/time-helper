import Axios, { AxiosInstance } from "axios";
import config, { getProxyInfo } from "./config"
import { AppInfoDto, LastSubmitData, SubmitData, UserInfoDto } from "./helper.dto";



export class API{
    http:AxiosInstance;
    host='https://reportedh5.17wanxiao.com';
    constructor(private token:string){
        this.http=Axios.create({
            headers:{
                'User-Agent':config.USER_AGENT2,
            },
            proxy:getProxyInfo()
        });
        this.http.interceptors.response.use(resp=>{
            const code=resp.data.code;
            if((typeof code=="number"&&code)){
                throw new Error(`${resp.data.msg}(${code})`);
            }else if(typeof code=="string"&&code!='10000'){
                throw new Error(`${resp.data.msg}：${resp.data.data}(${code})`);
            }
            return resp;
        },e=>Promise.reject(e))
    }

    private doDKData(path:string,data:any){
        return this.http.post(`${this.host}${path}`,data,{
            headers:{
                'Referer': `${this.host}/health/index.html?UAinfo=wanxiao&versioncode=${config.APP_VERSION}&businessType=epmpics&token=${this.token}&fromincollege=1`
            },
        })
    }
    private getDKData(path:string){
        return this.doDKData(path,`appClassify=DK&token=${this.token}`);
    }
    async getApps(){
        const resp=await this.getDKData('/api/clock/school/childApps');
        return resp.data.appList as AppInfoDto[];
    }
    async getUserInfo(){
        const resp=await this.getDKData('/api/clock/school/getUserInfo');
        return resp.data.userInfo as UserInfoDto;
    }
    async getLastData(id:string){
        const resp=await this.doDKData('/sass/api/epmpics',{
            businessType: "epmpics",
            jsonData: {
                templateid: id, 
                token: this.token
            },
            method: "userComeApp",
        });
        const data=JSON.parse(resp.data.data) as LastSubmitData;
        return data;
    }
    async submitData(data:SubmitData){
        const resp=await this.doDKData('/sass/api/epmpics',{
            businessType: "epmpics",
            jsonData: Object.assign({
                token: this.token,
                reportdate:Date.now()
            },data),
            method: "submitUpInfo",
        });
        return resp.data;
    }
}

export class Helper extends API{
    
    handleData(data:LastSubmitData){
        data.cusTemplateRelations.forEach(item=>{
            if(item.assembltype=="Temperature"){
                const [min,max]=config.TEMP_RANGE.split('-').map(parseFloat).sort();
                item.value=(min+(Math.random()*(max-min))).toFixed(1);
            }
        });
        return data;
    }

    async run(){
        const raw=await this.getLastData(config.APP_ID);
        const data=await this.handleData(raw);
        const {areaStr,customerid,deptStr,phonenum,stuNo,username,userid,cusTemplateRelations}=data;
        const updatainfo=cusTemplateRelations.map(({propertyname,value})=>({propertyname,value}));
        const submit:SubmitData={
            areaStr,customerid,deptStr,phonenum,stuNo,userid,username,
            deptid:deptStr.deptid,
            gpsType:1,
            source:'app',
            templateid:config.APP_ID,
            updatainfo,
        };
        await this.submitData(submit);
        return data;
    }
    setup(){

    }
}

export default Helper;