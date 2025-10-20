import "dotenv/config";
import {buildApp} from './app.js';

const port= Number(process.env.PORT ?? 3333);
const start = async ()=>{
    const app = await buildApp()
    try{
        await app.listen({port, host:'0.0.0.0'})
        console.log('API está em https://localhost:${port}')
    }catch(err){
        app.log.error(err);
        process.exit(1);
    }
};