import { RedisClient } from "redis";
import { TrainingMessage } from "../models/training";
import { promisify } from "util";

/**
 * Takes the incomming message from the pubsub trigger and
 * sets a redis key M_{message.id}_A representing the message object.
 * 
 * @param body Parsed pubsub message data as string.
 * @param context The pubsub context object.
 * @param cb The pubsub cb object.
 * @param redisClient Redis Client Instance.
 */
export default async function trainingSubAlert(body:string, context:any, cb: any, redisClient: RedisClient) {
    try{
        const message: TrainingMessage = JSON.parse(body);
        await promisify(redisClient.set).bind(redisClient)(`M_${message.messageId}_A`, body);
        return cb();
    }catch(error){
        console.log(error);
        return cb(error);
    }
}