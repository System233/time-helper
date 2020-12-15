import { SendMessage } from "./src"

(async()=>{
    try {
        const data=await SendMessage(process.argv[2],process.argv.slice(3).join());
        if(data&&data.errno){
            console.error(`Error(${data.errno})：`,data.errmsg);
            process.exit(data.errno);
        }
    } catch (error) {
        console.error(error);
        process.exit(-1);
    }
})();