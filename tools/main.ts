import {Helper, SendMessage, Session, config} from '../'
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
        const data=await helper.run();
        const temp=data.cusTemplateRelations.find(x=>x.assembltype=="Temperature");
        const message=[new Date().toLocaleString(),`体温：${temp.value}℃`].join('  \n');
        await SendMessage(config.TEXT_OK,message);
    }catch(error){
        await SendMessage(error.message,['```js',error.stack,'```'].join('\n'));
        process.exit(-1);
    }
    
})();