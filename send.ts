import { SendMessage } from "./src"

(async()=>{
    try {
        console.log(process.argv)
        const resp=await SendMessage(process.argv[2],process.argv.slice(3).join());
        console.log(resp.data)
    } catch (error) {
        console.error(error)
    }
})();