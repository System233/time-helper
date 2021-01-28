"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
(async () => {
    try {
        const data = await src_1.SendMessage(process.argv[2], process.argv.slice(3).join());
        if (data && data.errno) {
            console.error(`Error(${data.errno})：`, data.errmsg);
            process.exit(data.errno);
        }
    }
    catch (error) {
        console.error(error);
        process.exit(-1);
    }
})().catch(console.error);
//# sourceMappingURL=send.js.map