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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var trainingPub_1 = __importDefault(require("./pubs/trainingPub"));
var trainingSubAlert_1 = __importDefault(require("./subs/trainingSubAlert"));
var trainingSubStats_1 = __importDefault(require("./subs/trainingSubStats"));
var trainingStatGetter_1 = __importDefault(require("./getters/trainingStatGetter"));
var middlewares_1 = require("./middlewares");
var redis_1 = require("redis");
var util_1 = require("util");
var functionName = process.env.FUNCTION_NAME || "";
var redisDependantFunctions = ["trainingSubAlert", "trainingSubStats", "trainingStatGetter"];
var redisClient;
var redisReady = false;
if (redisDependantFunctions.includes(functionName)) {
    var port = parseInt(process.env.REDIS_PORT || "6379");
    var host = process.env.REDIS_HOST;
    redisClient = redis_1.createClient(port, host);
    redisClient.on("error", function (error) { console.log("[REDIS] ERROR: ", error); redisReady = false; });
    redisClient.on("ready", function (error) { console.log("[REDIS] ERROR: ", error); redisReady = true; });
    redisClient.on("end", function (error) { console.log("[REDIS] ERROR: ", error); redisReady = false; });
    redisClient.on("reconnecting", function (error) { console.log("[REDIS] ERROR: ", error); redisReady = false; });
    redisClient.on("connect", function (error) { console.log("[REDIS] ERROR: ", error); redisReady = false; });
}
function redisCheck() {
    return __awaiter(this, void 0, void 0, function () {
        var attempts, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempts = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempts < 100 && !redisReady)) return [3 /*break*/, 7];
                    console.log("[REDIS] Attempt #" + attempts);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, util_1.promisify(redisClient.get).bind(redisClient)("DOES_NOT_EXIST_K")];
                case 3:
                    _a.sent();
                    if (attempts < 100) {
                        console.log("[REDIS] READY.");
                        redisReady = true;
                        return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.log("[REDIS] ERROR --- " + attempts + " ", error_1);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, 20); })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    attempts++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.trainingSubAlert = function (message, context, cb) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, redisCheck()];
        case 1:
            _a.sent();
            return [4 /*yield*/, middlewares_1.parsePubSubBody(message, context, cb, trainingSubAlert_1.default, redisClient)];
        case 2: return [2 /*return*/, _a.sent()];
    }
}); }); };
exports.trainingSubStats = function (message, context, cb) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, redisCheck()];
        case 1:
            _a.sent();
            return [4 /*yield*/, middlewares_1.parsePubSubBody(message, context, cb, trainingSubStats_1.default, redisClient)];
        case 2: return [2 /*return*/, _a.sent()];
    }
}); }); };
exports.trainingStatGetter = function (req, res) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, redisCheck()];
        case 1:
            _a.sent();
            return [4 /*yield*/, middlewares_1.checkIfQueryProvided(req, res, trainingStatGetter_1.default, redisClient)];
        case 2: return [2 /*return*/, _a.sent()];
    }
}); }); };
exports.trainingPub = function (req, res) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, middlewares_1.checkBody(req, res, trainingPub_1.default)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
