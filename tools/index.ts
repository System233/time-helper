
import inquirer from 'inquirer';
import {getAppIdFromUrl, Helper,SendMessage,Session, config, SendMessageWithSC, FieldItemDto, LastSubmitData, AreaStrDto,GetAreaInfo, RandomLocation } from '../src'



const formatField=(field:FieldItemDto)=>{
    switch(field.assembltype){
        case "Temperature":
            return field.value+"℃";
        default:
            return field.value;
    }
}
const formatArea=(areaStr:string)=>{
    try {
        const data=JSON.parse(areaStr) as AreaStrDto;
        return `地址：${data.text+data.address} ${data.pois}`
    } catch (error) {
        return `地址解析错误(${error.message})：`+areaStr;
    }
}

const sendResult=async(data:LastSubmitData)=>{
    let title=config.TEXT_OK;
    const check=data.cusTemplateRelations.filter(field=>field.required=="true"&&(field.value==''||field.value==null));
    let checkMsg=[];
    if(check.length){
        title+="需要更新表单",
        checkMsg=[
            "打卡表单可能已更新，请手动打卡填写新增字段：",check.map(field=>`\`${field.decription}\``).join(',')
        ]
    }
    const message=[
        new Date().toLocaleString("zh-Hans",{timeZone:"Asia/Shanghai"}),
        ...checkMsg,
        '',
        formatArea(data.areaStr),
        '',
        "名称|值",
        "-|-",
        ...data.cusTemplateRelations.map(field=>`${field.decription}|${formatField(field)}`),
        '',
    ].join('  \n');
    await SendMessage(title,message);
}
export const main=async():Promise<void>=>{
    try{
        const ss=await Session.create(config.TYPE=='token'&&config.TOKEN);
        const token=await ss.authenticate({
            type:config.TYPE,
            username:config.USERNAME,
            password:config.PASSWORD,
            token:config.TOKEN
        });

        const helper= new Helper(token);
        const data=await helper.run();
        await sendResult(data);
    }catch(error){
        await SendMessage(error.message,['```js',error.stack,'```'].join('\n'),true);
        process.exitCode=-1
    }
    
};

export const token=async():Promise<void>=>{
    try{
        const ss=await Session.create(config.TYPE=='token'&&config.TOKEN);
        const token=await ss.authenticate({
            type:config.TYPE,
            username:config.USERNAME,
            password:config.PASSWORD,
            token:config.TOKEN
        });
        const helper= new Helper(token);
        const apps=await helper.getApps();

        await SendMessage("APPID列表",
        [
            "|打卡项目|APP_ID|",
            "| - | - |",
            ...apps.map(app=>`|${app.name}|${getAppIdFromUrl(app.url)}|`)
        ].join('\n'));
        
    }catch(error){
        await SendMessage(error.message,['```js',error.stack,'```'].join('\n'),true);
        process.exitCode=-1
    }
    
};


export const appId=async():Promise<void>=>{
    try{
        const ss=await Session.create(config.TYPE=='token'&&config.TOKEN);
        const token=await ss.authenticate({
            type:config.TYPE,
            username:config.USERNAME,
            password:config.PASSWORD,
            token:config.TOKEN
        });
        const helper= new Helper(token);
        const apps=await helper.getApps();

        await SendMessage("APPID列表",
        [
            "|打卡项目|APP_ID|",
            "| - | - |",
            ...apps.map(app=>`|${app.name}|${getAppIdFromUrl(app.url)}|`)
        ].join('\n'));
        
    }catch(error){
        await SendMessage(error.message,['```js',error.stack,'```'].join('\n'),true);
        process.exitCode=-1
    }
    
}

export const send=async():Promise<void>=>{
    try {
        await SendMessage(process.argv[2],process.argv.slice(3).join(),true);
    } catch (error) {
        console.error(error);
        process.exitCode=-1
    }
}

export const setup=async():Promise<void>=>{
    console.log('\x1B[36m%s\x1B[0m','[打卡参数配置向导]');
    const ss=await Session.create();
    let helper:Helper;
    const toAuthData=(anwser)=>[].reduce.call(Object.keys(anwser),(obj,key:string)=>Object.assign(obj,{[key.toLowerCase()]:anwser[key]}),{});
    const test=async(anwser,message?:string)=>{
        try {
            const option=toAuthData(anwser);
            if(anwser.TYPE=='sms'){
                await ss.authSMS(anwser.TOKEN,option);
            }else{
                await ss.authenticate(option);
            }
            const h=new Helper(ss.session);
            if(await h.getApps()){
                helper=h;
                return true;
            }
        } catch (error) {
            return '验证失败：'+error.message
        }
        return message||false;
    }
    const config=await inquirer.prompt(
        [
            {
                type:'list',
                name:'TYPE',
                message:'选择登录方式',
                choices:[
                    {
                        name:'短信',
                        value:'sms'
                    },
                    {
                        name:'密码',
                        value:'password'
                    },
                    {
                        name:'令牌',
                        value:'token'
                    }
                ]
            },
            {
                type:'input',
                name:'USERNAME',
                message:'输入用户名/手机号',
                when:(anwser)=>anwser.TYPE!='token',
                validate:(value,anwser)=>{
                    if(anwser.TYPE=='sms'){
                        return ss.sendSMS(toAuthData(Object.assign({},anwser,{USERNAME:value})));
                    }
                    return true;
                }
            },
            {
                type:'input',
                name:'TOKEN',
                message:'输入验证码',
                when:(anwser)=>anwser.TYPE=='sms',
                validate:async(value,anwser)=>await test(Object.assign({},anwser,{TOKEN:value}))
            },
            {
                type:'input',
                name:'PASSWORD',
                message:'输入密码',
                when:(anwser)=>anwser.TYPE=='password',
                validate:async(value,anwser)=>await test(Object.assign({},anwser,{PASSWORD:value}))
            },
            {
                type:'input',
                name:'TOKEN',
                message:'输入令牌',
                when:(anwser)=>anwser.TYPE=='token',
                validate:async(value,anwser)=>await test(Object.assign({},anwser,{TOKEN:value}))
            },
            {
                type:'list',
                name:'APP_ID',
                message:'选择打卡项目',
                choices:async ()=>(await helper.getApps()).map(app=>({
                        name:app.name,
                        value:getAppIdFromUrl(app.url)
                }))
            },
            {
                type:'input',
                name:'SCKEY',
                message:'Server酱SCKEY(不需要则跳过)',
                validate:async(value)=>{
                    const resp=await SendMessageWithSC(value,{text:'测试标题',desp:'测试内容'})
                    return resp.data.error_message||true;
                }
            }
        ]
    );
    if(config.TYPE=="sms"){
        Object.assign(config,{
            TYPE:'token',
            TOKEN:ss.session
        });
    }
    config.TOKEN=ss.session;
    console.log('JSON配置',config,'\n');
    console.log('您的Secret配置：');
    Object.entries(config).forEach(([key,value])=>console.log(key,'=',value));

    if(config.TYPE=="token"){
        console.warn('\x1B[33m%s\x1B[0m','注意：当前配置使用令牌进行签到，但目前尚不清楚令牌的有效期。若令牌在短时间内频繁失效请换用账号密码登录。')
    }
}


export const geo=async():Promise<void>=>{
    
    if(config.LOCATION){
        const [lng,lat,radius]=config.LOCATION.split(',').map(x=>parseFloat(x)||0);
        const infos=await Promise.all([...Array(10)].map(()=>RandomLocation(lng,lat,radius))
                      .map(([x,y])=>GetAreaInfo(x,y)));
        const message=infos.map(info=>`${info.lng},${info.lat},${info.address},${info.pois}`).join('\n');
        await SendMessage('随机位置生成测试',message)
    }else{
        await SendMessage('随机位置生成测试',"失败：没有设置LOCATION参数",true)
    }
}