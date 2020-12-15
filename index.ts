import {Helper,SendError,SendSuccess,Session} from './src'
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
        helper.run();
        await SendSuccess(config.TEXT_OK);
    }catch(error){
        await SendError(error.message,['```js',error.stack,'```'].join('\n'));
    }
    
})();