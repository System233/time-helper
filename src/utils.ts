import Axios from "axios";
import { parse, stringify,escape } from "querystring";
import { createInterface } from "readline";
import config from "./config";
interface Message{
    text:string;
    desp?:string;
}
export function SendMessageWithSC(key:string,msg:Message){
    return Axios.post(`https://sc.ftqq.com/${key}.send`,stringify(msg as any));
}
export function SendMessageWithQMSG(key:string,msg:string,qq?:string){
    return Axios.post(`https://qmsg.zendee.cn/send/${key}`,stringify({msg,qq}))
}
export function SendMessageWithTempURL(url:string,key:string,title:string,content:string){
    const xurl=url.replace(/{\s*title\s*}/,escape(title))
                .replace(/{\s*content\s*}/,escape(content))
                .replace(/{\s*key\s*}/,escape(key))
    return Axios.get(xurl);
}
export function getAppIdFromUrl(url:string){
    return parse(url.slice(url.indexOf('?')+1)).templateid;
}
export async function SendMessage(title:string,content?:string,safe?:boolean){
    if(config.SCKEY){
        try{
            const resp=await SendMessageWithSC(config.SCKEY,{text: title,desp: content});
            const data=resp.data;
            if(data&&data.errno){
                throw new Error(`${data.errmsg}(${data.errno})`);
            }
        }catch(error){
            console.error('Server酱推送失败:',error);
            if(safe){
                console.error('推送内容：');
                console.error(title);
                console.error(content||'');
            }
        }
    }
    if(config.QMSG_KEY){
        try{
            const resp=await SendMessageWithQMSG(config.QMSG_KEY,`${title}\n${content}`,config.QMSG_QQ);
            const data=resp.data;
            if(data&&!data.success){
                throw new Error(`${data.reason}(${data.code})`);
            }
        }catch(error){
            console.error('QMSG推送失败:',error);
            if(safe){
                console.error('推送内容：')
                console.error(title);
                console.error(content||'');
            }
        }
    }
    if(config.MSG_URL){
        try{
            await SendMessageWithTempURL(config.MSG_URL,config.MSG_KEY,title,content);
        }catch(error){
            console.error('自定义推送失败:',error);
            if(safe){
                console.error('推送内容：')
                console.error(title);
                console.error(content||'');
            }
        }
    }

    if(safe){
        console.log(title);
        console.log(content||'');
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