import { SendMessage } from "./src"

(async()=>{
    try {
        const data=await SendMessage(process.argv[2],process.argv.slice(3).join());
        console.log(data);
    } catch (error) {
        console.error(error);
        process.exit(-1);
    }
})();