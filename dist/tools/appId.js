"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
(async () => {
    try {
        const ss = await src_1.Session.create(src_1.config.TYPE == 'token' && src_1.config.TOKEN);
        const token = await ss.authenticate({
            type: src_1.config.TYPE,
            username: src_1.config.USERNAME,
            password: src_1.config.PASSWORD,
            token: src_1.config.TOKEN
        });
        const helper = new src_1.Helper(token);
        const apps = await helper.getApps();
        await src_1.SendMessage("APPID列表", [
            "|打卡项目|APP_ID|",
            "| - | - |",
            ...apps.map(app => `|${app.name}|${src_1.getAppIdFromUrl(app.url)}|`)
        ].join('\n'));
    }
    catch (error) {
        await src_1.SendMessage(error.message, ['```js', error.stack, '```'].join('\n'));
        process.exit(-1);
    }
})().catch(console.error);
//# sourceMappingURL=appId.js.map