"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
(async () => {
    try {
        if (!src_1.config.SCKEY) {
            throw new Error('SCKEY未配置！');
        }
        const ss = await src_1.Session.create(src_1.config.TYPE == 'token' && src_1.config.TOKEN);
        const token = await ss.authenticate({
            type: src_1.config.TYPE,
            username: src_1.config.USERNAME,
            password: src_1.config.PASSWORD,
            token: src_1.config.TOKEN
        });
        await src_1.SendMessageWithKey(src_1.config.SCKEY, {
            text: "Token配置",
            desp: [
                "|名称|值|",
                "|-|-|",
                "|TYPE|token|",
                `|TOKEN|${token}|`,
            ].join('\n')
        });
    }
    catch (error) {
        console.error(error);
        process.exit(-1);
    }
})().catch(console.error);
//# sourceMappingURL=token.js.map