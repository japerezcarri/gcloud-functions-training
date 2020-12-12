import trainingPub from "./pubs/trainingPub";
import trainingSubAlert from "./subs/trainingSubAlert";
import trainingSubStats from "./subs/trainingSubStats";
import trainingStatGetter from "./getters/trainingStatGetter";

import { checkBody, parsePubSubBody, checkIfQueryProvided } from "./middlewares";
import { createClient, RedisClient } from "redis";
import { promisify } from "util";

const functionName = process.env.FUNCTION_NAME || "";
const redisDependantFunctions = ["trainingSubAlert", "trainingSubStats", "trainingStatGetter"];
let redisClient: RedisClient;
let redisReady = false;

if (redisDependantFunctions.includes(functionName)){
    const port: number = parseInt(process.env.REDIS_PORT || "6379");
    const host = process.env.REDIS_HOST;
    redisClient = createClient(port, host);
    redisClient.on("error", (error)=>{console.log("[REDIS] ERROR: ", error); redisReady= false;});
    redisClient.on("ready", (error)=>{console.log("[REDIS] ERROR: ", error); redisReady= true;});
    redisClient.on("end", (error)=>{console.log("[REDIS] ERROR: ", error); redisReady= false;});
    redisClient.on("reconnecting", (error)=>{console.log("[REDIS] ERROR: ", error); redisReady= false;});
    redisClient.on("connect", (error)=>{console.log("[REDIS] ERROR: ", error); redisReady= false;});
}

async function redisCheck() {
    let attempts = 0;
    while (attempts < 100 && !redisReady){
        console.log(`[REDIS] Attempt #${attempts}`);
        try{
            await promisify(redisClient.get).bind(redisClient)("DOES_NOT_EXIST_K");
            if (attempts < 100){
                console.log("[REDIS] READY.")
                redisReady = true;
                break;
            }
        }catch(error){
            console.log(`[REDIS] ERROR --- ${attempts} `, error);
            await new Promise<void>(resolve =>setTimeout(()=>resolve(),20));
        }
        attempts++;
    }
}

exports.trainingSubAlert = async (message: any, context: any, cb: any)=>{ await redisCheck(); return await parsePubSubBody(message, context, cb, trainingSubAlert, redisClient);};
exports.trainingSubStats = async (message: any, context: any, cb: any)=>{ await redisCheck(); return await parsePubSubBody(message, context, cb, trainingSubStats, redisClient);};
exports.trainingStatGetter = async (req:any, res:any) => {await redisCheck(); return await checkIfQueryProvided(req, res, trainingStatGetter, redisClient);};
exports.trainingPub = async (req:any, res:any) => {return await checkBody(req, res, trainingPub);};