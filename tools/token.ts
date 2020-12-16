import { Session, config, SendMessageWithKey } from "../";

(async()=>{
    try {
        if(!config.SCKEY){
            throw new Error('SCKEY未配置！')
        }
        const ss=await Session.create(config.TYPE=='token'&&config.TOKEN);
        const token=await ss.authenticate({
            type:config.TYPE as any,
            username:config.USERNAME,
            password:config.PASSWORD,
            token:config.TOKEN
        });
        await SendMessageWithKey(config.SCKEY,{
            text:"Token配置",
            desp: [
                "|名称|值|",
                "|-|-|",
                "|TYPE|token|",
                `|TOKEN|${token}|`,
            ].join('\n')
        })
    } catch (error) {
        console.error(error);
        process.exit(-1);
    }
})();