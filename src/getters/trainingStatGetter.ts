import { RedisClient } from "redis";
import { promisify } from "util";

/**
 * When provided with a req.query.id, returns the stats about the
 * user with id req.query.id, if it cannot find any stat about the id provided
 * will return 404 - User not found.
 * 
 * @param req req HTTP request object.
 * @param res res HTTP response object.
 * @param redisClient Redis Client Instance.
 */
export default async function trainingStatGetter(req:any, res:any, redisClient: RedisClient) {
    try{
        const redisGet = promisify(redisClient.get).bind(redisClient);
        const countSent = await redisGet(`U_${req.query.id}_N_S`);
        const countReceived = await redisGet(`U_${req.query.id}_N_R`);
        if(countReceived !== null || countSent !== null){
            res.status(200);
            return res.json(
                {
                    user:{
                        id: req.query.id,
                        messagesSent: countSent,
                        messagesReceived: countReceived
                    }
                }
            );
        }else{
            return res.status(404).send("User id not found");
        }
    }catch(error){
        console.log(error);
        return res.status(500).send(error);
    }
}