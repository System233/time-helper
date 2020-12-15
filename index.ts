import {Helper,SendMessage,Session} from './src'
import config from './src/config'
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
        await helper.run();
        await SendMessage(config.TEXT_OK,new Date().toLocaleString());
    }catch(error){
        await SendMessage(error.message,['```js',error.stack,'```'].join('\n'));
        process.exit(-1);
    }
    
})();