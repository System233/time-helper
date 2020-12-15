import Axios from "axios";
import { stringify } from "querystring";
import { createInterface } from "readline";
import config from "./config";
interface Message{
    text:string;
    desp?:string;
}
export function SendMessageWithKey(key:string,msg:Message){
    return Axios.post(`https://sc.ftqq.com/${key}.send`,stringify(msg as any));
}
export function SendMessage(text:string,desp?:string){
    if(config.SCKEY){
        return SendMessageWithKey(config.SCKEY,{text,desp});
    }else{
        
        console.log(text,desp||'');
    }
}
export function SendError(text:string,desp?:string){
    return SendMessage(`错误：${text}`,desp);
}
export function SendSuccess(text:string,desp?:string){
    return SendMessage(`成功：${text}`,desp);
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