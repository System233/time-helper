"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const inquirer_1 = __importDefault(require("inquirer"));
(async () => {
    console.log('\x1B[36m%s\x1B[0m', '[打卡参数配置向导]');
    const ss = await src_1.Session.create();
    let helper;
    const toAuthData = (anwser) => [].reduce.call(Object.keys(anwser), (obj, key) => Object.assign(obj, { [key.toLowerCase()]: anwser[key] }), {});
    const test = async (anwser, message) => {
        try {
            const option = toAuthData(anwser);
            if (anwser.TYPE == 'sms') {
                await ss.authSMS(anwser.TOKEN, option);
            }
            else {
                await ss.authenticate(option);
            }
            const h = new src_1.Helper(ss.session);
            if (await h.getApps()) {
                helper = h;
                return true;
            }
        }
        catch (error) {
            return '验证失败：' + error.message;
        }
        return message || false;
    };
    const config = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'TYPE',
            message: '选择登录方式',
            choices: [
                {
                    name: '短信',
                    value: 'sms'
                },
                {
                    name: '密码',
                    value: 'password'
                },
                {
                    name: '令牌',
                    value: 'token'
                }
            ]
        },
        {
            type: 'input',
            name: 'USERNAME',
            message: '输入用户名/手机号',
            when: (anwser) => anwser.TYPE != 'token',
            validate: (value, anwser) => {
                if (anwser.TYPE == 'sms') {
                    return ss.sendSMS(toAuthData(Object.assign({}, anwser, { USERNAME: value })));
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'TOKEN',
            message: '输入验证码',
            when: (anwser) => anwser.TYPE == 'sms',
            validate: async (value, anwser) => await test(Object.assign({}, anwser, { TOKEN: value }))
        },
        {
            type: 'input',
            name: 'PASSWORD',
            message: '输入密码',
            when: (anwser) => anwser.TYPE == 'password',
            validate: async (value, anwser) => await test(Object.assign({}, anwser, { PASSWORD: value }))
        },
        {
            type: 'input',
            name: 'TOKEN',
            message: '输入令牌',
            when: (anwser) => anwser.TYPE == 'token',
            validate: async (value, anwser) => await test(Object.assign({}, anwser, { TOKEN: value }))
        },
        {
            type: 'list',
            name: 'APP_ID',
            message: '选择打卡项目',
            choices: async (anwser) => (await helper.getApps()).map(app => ({
                name: app.name,
                value: src_1.getAppIdFromUrl(app.url)
            }))
        },
        {
            type: 'input',
            name: 'SCKEY',
            message: 'Server酱SCKEY(不需要则跳过)',
            validate: async (value, anwser) => {
                const resp = await src_1.SendMessageWithKey(value, { text: '测试标题', desp: '测试内容' });
                return resp.data.error_message || true;
            }
        }
    ]);
    if (config.TYPE == "sms") {
        Object.assign(config, {
            TYPE: 'token',
            TOKEN: ss.session
        });
    }
    config.TOKEN = ss.session;
    console.log('JSON配置', config, '\n');
    console.log('您的Secret配置：');
    Object.entries(config).forEach(([key, value]) => console.log(key, '=', value));
    if (config.TYPE == "token") {
        console.warn('\x1B[33m%s\x1B[0m', '注意：当前配置使用令牌进行签到，但目前尚不清楚令牌的有效期。若令牌在短时间内频繁失效请换用账号密码登录。');
    }
})().catch(console.error);
//# sourceMappingURL=setup.js.map