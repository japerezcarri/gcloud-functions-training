"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
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
function trainingSubStats(body, context, cb, redisClient) {
    return __awaiter(this, void 0, void 0, function () {
        var message, redisSet, redisScard, redisSadd, numberSent, numberReceived, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    message = JSON.parse(body);
                    redisSet = util_1.promisify(redisClient.set).bind(redisClient);
                    redisScard = util_1.promisify(redisClient.scard).bind(redisClient);
                    redisSadd = util_1.promisify(redisClient.sadd).bind(redisClient);
                    //Set with the IDs of messages sent by user message.fromUserId
                    return [4 /*yield*/, redisSadd("U_" + message.fromUserId + "_M_S", message.messageId)];
                case 1:
                    //Set with the IDs of messages sent by user message.fromUserId
                    _a.sent();
                    //Set with the IDs of messages received by user message.toUserId
                    return [4 /*yield*/, redisSadd("U_" + message.toUserId + "_M_R", message.messageId)];
                case 2:
                    //Set with the IDs of messages received by user message.toUserId
                    _a.sent();
                    return [4 /*yield*/, redisScard("U_" + message.fromUserId + "_M_S")];
                case 3:
                    numberSent = _a.sent();
                    return [4 /*yield*/, redisScard("U_" + message.toUserId + "_M_R")];
                case 4:
                    numberReceived = _a.sent();
                    //Key holding the number of messages sent from user message.fromUserId
                    return [4 /*yield*/, redisSet("U_" + message.fromUserId + "_N_S", numberSent.toString())];
                case 5:
                    //Key holding the number of messages sent from user message.fromUserId
                    _a.sent();
                    //Key holding the number of received by user message.toUserId
                    return [4 /*yield*/, redisSet("U_" + message.toUserId + "_N_R", numberReceived.toString())];
                case 6:
                    //Key holding the number of received by user message.toUserId
                    _a.sent();
                    return [2 /*return*/, cb()];
                case 7:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [2 /*return*/, cb(error_1)];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.default = trainingSubStats;
