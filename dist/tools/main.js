"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const formatField = (field) => {
    switch (field.assembltype) {
        case "Temperature":
            return field.value + "℃";
        default:
            return field.value;
    }
};
const formatArea = (areaStr) => {
    try {
        const data = JSON.parse(areaStr);
        return "地址：" + data.text + data.address;
    }
    catch (error) {
        return `地址解析错误(${error.message})：` + areaStr;
    }
};
const sendResult = async (data) => {
    let title = src_1.config.TEXT_OK;
    const check = data.cusTemplateRelations.filter(field => field.required == "true" && (field.value == '' || field.value == null));
    let checkMsg = [];
    if (check.length) {
        title += "需要更新表单",
            checkMsg = [
                "打卡表单可能已更新，请手动打卡填写新增字段：", check.map(field => `\`${field.decription}\``).join(',')
            ];
    }
    const message = [
        new Date().toLocaleString("zh-Hans", { timeZone: "Asia/Shanghai" }),
        ...checkMsg,
        '',
        formatArea(data.areaStr),
        '',
        "名称|值",
        "-|-",
        ...data.cusTemplateRelations.map(field => `${field.decription}|${formatField(field)}`),
        '',
    ].join('  \n');
    await src_1.SendMessage(title, message);
};
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
        const data = await helper.run();
        await sendResult(data);
    }
    catch (error) {
        await src_1.SendMessage(error.message, ['```js', error.stack, '```'].join('\n'));
        process.exit(-1);
    }
})().catch(console.error);
//# sourceMappingURL=main.js.map