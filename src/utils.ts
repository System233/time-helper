import Axios from "axios";
import { parse, stringify } from "querystring";
import { createInterface } from "readline";
import config from "./config";
interface Message{
    text:string;
    desp?:string;
}
export function SendMessageWithKey(key:string,msg:Message){
    return Axios.post(`https://sc.ftqq.com/${key}.send`,stringify(msg as any));
}
export function getAppIdFromUrl(url:string){
    return parse(url.slice(url.indexOf('?')+1)).templateid;
}
export async function SendMessage(text:string,desp?:string){
    if(config.SCKEY){
        const resp= await SendMessageWithKey(config.SCKEY,{text,desp});
        return resp.data;
    }else{
        
        console.log(text,desp||'');
    }
}

export function question(msg?:string,timeout?:number){
    return new Promise<string>((resolve,reject)=>{

        const io=createInterface(process.stdin,process.stdout);
        io.question(msg,answer=>{
            resolve(answer);
            io.close();
        });
        if(timeout)
            setTimeout(reject,timeout);
    })
}