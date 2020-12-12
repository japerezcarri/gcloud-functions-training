'use strict';
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const { exit } = require('process');
const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

let redisHost = "10.6.197.139";
let redisPort = 6379;
let topic = undefined;
let topicId =  undefined;

function log(statement){
    console.log(`[DEPLOY] ${statement}.`);
}

function validations(){
    if (argv['redis-host'] !== undefined && argv['redis-host']!== true && argv['redis-host']!==''){
        redisHost = argv['redis-host'];
    }
    if (argv['redis-port'] !== undefined && argv['redis-port']!== true && argv['redis-port']!==''){
        redisHost = argv['redis-host'];
    }
    if (argv.topic !== undefined && argv.topic!== true && argv.topic !== ''){
        topic = argv.topic;
        topicId = topic.split("/");
        topicId = topicId[topicId.length-1];
    }

    if (topic === undefined && argv['only-getter'] !== true){
        throw new Error('Topic is required. Use --topic=[your-topic]');
    }
}

async function deploy(functionName, type){
    try{
        log(`Deploying ${functionName}`);
        
        let output = undefined;

        //Type 1= sub, 2= pub, 3= getter
        switch (type) {
            case 1:
                output = await exec(`gcloud functions deploy ${functionName} --runtime nodejs12 --trigger-topic ${topicId} --region us-east1 --vpc-connector redis-vcp --set-env-vars REDIS_HOST=${redisHost} --set-env-vars REDIS_PORT=${redisPort} --set-env-vars FUNCTION_NAME=${functionName}`);
                break;
            case 2:
                output = await exec(`gcloud functions deploy ${functionName} --runtime nodejs12 --trigger-http --allow-unauthenticated --region us-east1 --vpc-connector redis-vcp --set-env-vars TOPIC=${topic} --set-env-vars FUNCTION_NAME=${functionName}`);
                break;
            case 3:
                output = await exec(`gcloud functions deploy ${functionName} --runtime nodejs12 --trigger-http --allow-unauthenticated --region us-east1 --vpc-connector redis-vcp --set-env-vars REDIS_HOST=${redisHost} --set-env-vars REDIS_PORT=${redisPort} --set-env-vars FUNCTION_NAME=${functionName}`);
                break;
            default:
                throw new Error("Function type not recognized.")
                break;
        }

        log(`${functionName} deployment log`);
        console.log(output.stdout);
        log(`${functionName} deploymeny stderr log.`);
        console.log(output.stderr);
    }catch(error){
        log(`Error ocurred during ${functionName} deployment`);
        console.log(error);
        log("Rest of deployments stopped");
        exit();
    }
}

async function deployPubs(){
    log('Starting pubs deployment');
    await deploy('trainingPub', 2);
}

async function deploySubs(){
    log('Starting pubs deployment');
    await deploy('trainingSubAlert', 1);
    await deploy('trainingSubStats', 1);
}

async function deployGetters(){
    log('Starting getters deployment');
    await deploy('trainingStatGetter', 3);
}

async function rollBack(functionName){
    try{
        log(`Rolling back ${functionName}`);
        
        const output =  await exec(`gcloud functions delete ${functionName} --region us-east1 --quiet`);

        log(`${functionName} roll-back log`);
        console.log(output.stdout);
        log(`${functionName} roll-back stderr log.`);
        console.log(output.stderr);
    }catch(error){
        log(`Error ocurred during ${functionName} roll-back`);
        console.log(error);
        log("Rest of roll-backs stopped");
        exit();
    }
}

async function rollBackPubs(){
    log('Starting pubs roll-back');
    await rollBack('trainingPub');
}

async function rollBackSubs(){
    log('Starting pubs roll-back');
    await rollBack('trainingSubAlert');
    await rollBack('trainingSubStats');
}

async function rollBackGetters(){
    log('Starting getters roll-back');
    await rollBack('trainingStatGetter');
}

async function execDeploy(){
    if (argv['only-pub'] === true){
        log('Only pub deployment mode');
        await deployPubs();
        exit();
    }
    if (argv['only-sub'] === true){
        log('Only sub deployment mode');
        await deploySubs();
        exit();
    }
    if (argv['only-getter'] === true){
        log('Only getter deployment mode');
        await deployGetters();
        exit();
    }
    await deployPubs();
    await deploySubs();
    await deployGetters();
    exit();
}

async function execRollBack(){
    if (argv.rollback === true){
        if (argv['only-pub'] === true){
            await rollBackPubs();
            exit();
        }
        if (argv['only-sub'] === true){
            await rollBackSubs();
            exit();
        }
        if (argv['only-getter'] === true){
            await rollBackGetters();
            exit()
        }
        await rollBackPubs();
        await rollBackSubs();
        await rollBackGetters();
        exit();
    }
}

async function run(){
    try{
        await execRollBack();

        if (argv.build === true){
            log('Startig build');
            await exec('npm run build');
            log('Build finished');
        }else{
            log('Skipping build');
        }

        validations();
        await execDeploy();

    }catch(error){
        console.log(error);
    }
}

run();