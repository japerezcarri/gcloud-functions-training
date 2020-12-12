import { PubSub, Topic } from "@google-cloud/pubsub";
import { TrainingMessage } from "../models/training";

const topic = process.env.TOPIC;
let pubsub: Topic;
if (topic !== undefined){
    pubsub = new PubSub().topic(topic);
}

/**
 * Publishes message to defiend topic on ENV var TOPIC.
 * 
 * @param req HTTP request object.
 * @param res HTTP response object.
 * @param req.body Training Message Options.
 */
export default async function trainingPub(req:any, res:any) {
    try{
        const message: TrainingMessage =  req.body;
        if (message.fromUserId == undefined || message.toUserId == undefined){
            throw new Error("User ID FROM and TO are required.");
        }
        if (message.messageId == undefined || message.messageId<0){
            throw new Error("Invalid message ID.");
        }
        message.messageTitle = message.messageTitle ? message.messageTitle.trim() : "";
        message.messageContent = message.messageContent || `User ${message.fromUserId} sent a message.`;
        message.createdAt = new Date();

        let pubsubResponse = await pubsub.publish(Buffer.from(JSON.stringify(message), "utf-8"));
        pubsubResponse = `Message published - ${pubsubResponse}`;
        console.log(pubsubResponse);
        return res.status(200).send(pubsubResponse);
    }catch(error){
        console.log(error);
        return res.status(500).send(error);
    }
}