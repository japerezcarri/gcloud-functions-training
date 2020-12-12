/**
 * Used before function triggered by HTTP POST request.
 * Verifies the req.bovy and prevents the execution of the next funtion
 * if req.body is found to be empty.
 * 
 * @param req req HTTP request context.
 * @param res res HTTP request context.
 * @param next next function to be executed.
 */
async function checkBody(req: any, res:any, next: any) {
    try{
        if (req.body !== undefined){
            res.set("Access-Control-Allow-Origin", "*");
            res.set("Access-Control-Allow-Headers", "Content-Type");
            if (req.method === "OPTIONS") {
                res.set("Access-Control-Allow-Methods", "POST");
                res.set("Access-Control-Max-Age", "3600");
                return res.status(204).end();
            }
            return await next(req, res);
        }else{
            return res.status(422).end();
        }
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}


/**
 * Used before function triggered by a pubsub message on a topic.
 * Parses the data in the pubsub message object to a string and passes it as
 * the body string to be used in the next function.
 * 
 * @param message The pubsub message object.
 * @param context The pubsub context object.
 * @param cb The pubsub cb object.
 * @param next The next function to be executed.
 * @param extra The extra params/objects need for the next function to be executed.
 */
async function parsePubSubBody(message: any, context: any, cb: any, next: any, extra: any) {
    try{
        const body= Buffer.from(message.data, "base64").toString();
        return await next(body, context, cb, extra);
    }catch(error){
        console.log(error);
    }
}

/**
 * Used before function triggered by HTTP GET Request.
 * Checks whether req.query.id is set, if it is not set prevents 
 * the function from executing.
 * 
 * @param req req HTTP request context.
 * @param res res HTTP request context.
 * @param next The next function to be evaluated.
 * @param extra The extra params/objects need for the next function to be executed.
 */

async function checkIfQueryProvided(req: any, res: any, next: any, extra: any){
    try{
        res.set("Access-Control-Allow-Origin", "*");
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === "OPTIONS") {
            res.set("Access-Control-Allow-Methods", "GET");
            res.set("Access-Control-Max-Age", "3600");
            return res.status(204).end();
        }
        if (req.query.id !== undefined && req.query!== ""){
            return next(req, res, extra);
        }else{
            return res.status(422).end();
        }
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

export {
    checkBody,
    parsePubSubBody,
    checkIfQueryProvided
};