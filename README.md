## GCP Functions PubSub + Redis
### Juan David Conrado Pertuz

4 functions are created as follows:

* trainingPub - HTTP triggered function that publishes to defined topic.
* trainingSubAlert - PubSub triggered function that saves to Redis the message as a string.
* trainingSubStats - PubSub triggered function that saves to Redis the amount of messages sent/received by each user.
* trainingStatGetter - HTTP triggered function that given an id argument, retrieves the # of messages sent/received by the user identified with id according to Redis Keys.

### Deployment

For the deployment of this functions, it is created a command line script, in order to run the deployment
execute the following command while on the root of the directory (where the package.json is):

    node deploy.js --topic=[topic-name] [--options]

**Note**: It can also be executed by using npm run deploy -- --topic=[topic-name] [--options]

#### Options available:

* --build: Will execute the npm run build command before deployment.
* --rollback: Will delete the previous functions from gcloud.
* --only-pub: Will only run roll-backs or deployments for 'trainingPub'.
* --only-sub: Will only run roll-backs or deployments for 'trainingSubAlert' and 'trainingSubStats'.
* --only-getter: Will only run roll-backs or deployments for 'trainingStatGetter'.
* --redis-host=[host]: Will set the Redis Host for the client used in functions.
* --redis-port=[port]: Will set the Redis port for the client used in functions.
* --vpc-connector=[connector-name]: Will set the vpc-connector for the functions.

#### Message:
The message received by the 'trainingPub' function has the following structure:

```
interface TrainingMessage{
    messageId: number,
    messageTitle: string,
    messageContent: string,
    createdAt: Date,
    toUserId: number,
    fromUserId: number
}
```
It will be cheked that the req.body contains the given object properties.


