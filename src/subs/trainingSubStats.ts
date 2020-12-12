import { RedisClient } from "redis";
import { TrainingMessage } from "../models/training";
import { promisify } from "util";

/**
 * Takes the incomming message from the pubsub trigger and
 * updates the list of messages sent and received from the users involed in the message.
 * It also set the keys U_{message.fromUserId}_N_S and U_{message.fromUserId}_N_R
 * storing the number of messages sent by the user message.fromUserId and 
 * the number of messages received by the user message.toUserId.
 * 
 * @param body Parsed pubsub message data as string.
 * @param context The pubsub context object.
 * @param cb The pubsub callback object.
 * @param redisClient Required redis client.
 */
export default async function trainingSubStats(body:string, context:any, cb: any, redisClient: RedisClient) {
    try{
        const message: TrainingMessage = JSON.parse(body);
        const redisSet = promisify(redisClient.set).bind(redisClient);
        const redisScard = promisify(redisClient.scard).bind(redisClient);
        const redisSadd: any = promisify(redisClient.sadd).bind(redisClient);

        //Set with the IDs of messages sent by user message.fromUserId
        await redisSadd(`U_${message.fromUserId}_M_S`,message.messageId);
        //Set with the IDs of messages received by user message.toUserId
        await redisSadd(`U_${message.toUserId}_M_R`, message.messageId);

        const numberSent =  await redisScard(`U_${message.fromUserId}_M_S`);
        const numberReceived = await redisScard(`U_${message.toUserId}_M_R`);

        //Key holding the number of messages sent from user message.fromUserId
        await redisSet(`U_${message.fromUserId}_N_S`, numberSent.toString());
        //Key holding the number of received by user message.toUserId
        await redisSet(`U_${message.toUserId}_N_R`, numberReceived.toString());

        return cb();
    }catch(error){
        console.log(error);
        return cb(error);
    }
}