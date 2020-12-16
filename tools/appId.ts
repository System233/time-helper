import {getAppIdFromUrl, Helper,SendMessage,Session, config} from '../'
(async()=>{
    try{
        const ss=await Session.create(config.TYPE=='token'&&config.TOKEN);
        const token=await ss.authenticate({
            type:config.TYPE as any,
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
        await SendMessage(error.message,['```js',error.stack,'```'].join('\n'));
        process.exit(-1);
    }
    
})();