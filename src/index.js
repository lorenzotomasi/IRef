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
exports.__esModule = true;
var express = require("express");
var actions_on_google_1 = require("actions-on-google");
var uuid_1 = require("uuid");
var service_1 = require("./service/service");
var enviroment_1 = require("./enviroment/enviroment");
var app = express().use(express.json());
var dialog = actions_on_google_1.dialogflow({ debug: false });
// * Intent for starting a game
dialog.intent("StartGame", function (conv, param) {
    service_1.startGame();
    conv.ask("Inizio il tempo " + service_1.halfTime + " da " + service_1.gameTime + " minuti");
});
// * Welcome intent
dialog.intent("Welcome", function (conv, param) {
    conv.ask("Sono iref il tuo assistente arbitro virtuale");
});
// * Intent for making an ammonition
dialog.intent("Ammonition", function (conv, param) { return __awaiter(void 0, void 0, void 0, function () {
    var parameter, currentGame, currentTeam, expulsion, ammonitionList, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                parameter = param;
                return [4 /*yield*/, service_1.getCurrentGameInfo()];
            case 1:
                currentGame = _b.sent();
                enviroment_1.currentAmmonition.game_id = currentGame.game_id;
                expulsion = false;
                // * Initialized current ammonition
                enviroment_1.currentAmmonition.half_time = service_1.halfTime;
                enviroment_1.currentAmmonition.minute = service_1.currentGameTime;
                enviroment_1.currentAmmonition.admonition_id = uuid_1.v4();
                enviroment_1.currentAmmonition.id = enviroment_1.currentAmmonition.admonition_id;
                return [4 /*yield*/, service_1.getAdmonitionList()];
            case 2:
                ammonitionList = _b.sent();
                if (!(parameter.teamName.length == 0 &&
                    parameter.teamColor.length == 0 &&
                    parameter.teamNameLocation.length == 0 &&
                    enviroment_1.currentAmmonition.team_Id.length == 0)) return [3 /*break*/, 3];
                conv.ask("Non ho capito la squadra, ripetila");
                return [2 /*return*/];
            case 3:
                if (!currentGame.away_team_color.toLowerCase().startsWith(parameter.teamColor)) return [3 /*break*/, 5];
                return [4 /*yield*/, service_1.getCurrentTeamInfo(currentGame.away_team_id)];
            case 4:
                currentTeam = (_b.sent());
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, service_1.getCurrentTeamInfo(currentGame.home_team_id)];
            case 6:
                currentTeam = (_b.sent());
                _b.label = 7;
            case 7:
                enviroment_1.currentAmmonition.team_Id = currentTeam.team_id;
                _b.label = 8;
            case 8:
                // * Controllo presenza motivazione ammonizione
                if (parameter.motivation.length == 0 || parameter.motivation == null) {
                    conv.ask("Non ho capito la motivazione, ripetilo");
                    return [2 /*return*/];
                }
                else {
                    enviroment_1.currentAmmonition.motivation = parameter.motivation;
                }
                if (!(parameter.playerNumber == null)) return [3 /*break*/, 9];
                conv.ask("Non ho capito il numero del giocatore, ripetilo");
                conv.contexts.set(enviroment_1.askNumberAdmonitionContest.constest, 1);
                return [2 /*return*/];
            case 9:
                _a = enviroment_1.currentAmmonition;
                return [4 /*yield*/, service_1.getCurrentPlayerInfo(parameter.playerNumber)];
            case 10:
                _a.player_id = _b.sent();
                if (ammonitionList.find(function (x) { return x.player_id == enviroment_1.currentAmmonition.player_id; }) !=
                    null) {
                    expulsion = true;
                }
                _b.label = 11;
            case 11:
                // * Conferma ammonizione
                conv.ask("Hai ammonito il numero " + parameter.playerNumber + " del " + currentTeam.name + " al " + service_1.currentGameTime + " minuto per " + parameter.motivation + " " + (expulsion ? ", lo segno come espulso per doppia ammonizione" : ""));
                return [4 /*yield*/, service_1.postAdmonition(enviroment_1.currentAmmonition)];
            case 12:
                _b.sent();
                if (!expulsion) return [3 /*break*/, 14];
                return [4 /*yield*/, service_1.autoExpulsion(enviroment_1.currentAmmonition)];
            case 13:
                _b.sent();
                _b.label = 14;
            case 14:
                service_1.flushAdmonition();
                service_1.flushExpulsion();
                return [2 /*return*/];
        }
    });
}); });
// * Intent for making an expulsion
dialog.intent("Expulsion", function (conv, param) { return __awaiter(void 0, void 0, void 0, function () {
    var parameter, currentGame, currentTeam, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                parameter = param;
                return [4 /*yield*/, service_1.getCurrentGameInfo()];
            case 1:
                currentGame = _b.sent();
                enviroment_1.currentExpulsion.game_id = currentGame.game_id;
                // * Initialized current ammonition
                enviroment_1.currentExpulsion.half_time = service_1.halfTime;
                enviroment_1.currentExpulsion.minute = service_1.currentGameTime;
                enviroment_1.currentExpulsion.expulsion_id = uuid_1.v4();
                enviroment_1.currentExpulsion.id = enviroment_1.currentAmmonition.admonition_id;
                if (!(parameter.teamName.length == 0 &&
                    parameter.teamColor.length == 0 &&
                    parameter.teamNameLocation.length == 0 &&
                    enviroment_1.currentAmmonition.team_Id.length == 0)) return [3 /*break*/, 2];
                conv.ask("Non ho capito la squadra, ripetila");
                return [2 /*return*/];
            case 2:
                if (!currentGame.away_team_color.toLowerCase().startsWith(parameter.teamColor)) return [3 /*break*/, 4];
                return [4 /*yield*/, service_1.getCurrentTeamInfo(currentGame.away_team_id)];
            case 3:
                currentTeam = (_b.sent());
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, service_1.getCurrentTeamInfo(currentGame.home_team_id)];
            case 5:
                currentTeam = (_b.sent());
                _b.label = 6;
            case 6:
                enviroment_1.currentExpulsion.team_Id = currentTeam.team_id;
                _b.label = 7;
            case 7:
                // * Controllo presenza motivazione ammonizione
                if (parameter.motivation.length == 0 || parameter.motivation == null) {
                    conv.ask("Non ho capito la motivazione, ripetilo");
                    return [2 /*return*/];
                }
                else {
                    enviroment_1.currentExpulsion.motivation = parameter.motivation;
                }
                if (!(parameter.playerNumber == null)) return [3 /*break*/, 8];
                conv.ask("Non ho capito il numero del giocatore, ripetilo");
                return [2 /*return*/];
            case 8:
                _a = enviroment_1.currentExpulsion;
                return [4 /*yield*/, service_1.getCurrentPlayerInfo(parameter.playerNumber)];
            case 9:
                _a.player_id = _b.sent();
                _b.label = 10;
            case 10:
                // TODO controllare se è gia ammonito e salvare informazioni del giocatore
                // * Conferma ammonizione
                conv.ask("Hai espulso il numero " + parameter.playerNumber + " del " + currentTeam.name + " al " + service_1.currentGameTime + " minuto per " + parameter.motivation);
                service_1.postExpulsion(enviroment_1.currentExpulsion);
                return [2 /*return*/];
        }
    });
}); });
dialog.intent("Change", function (conv, param) { return __awaiter(void 0, void 0, void 0, function () {
    var parameter, currentGame, currentTeam, inPlayerNumber, outPlayerNumber;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                parameter = param;
                return [4 /*yield*/, service_1.getCurrentGameInfo()];
            case 1:
                currentGame = _a.sent();
                enviroment_1.currentChange.game_id = currentGame.game_id;
                inPlayerNumber = 0;
                outPlayerNumber = 0;
                // * Initialized current change
                enviroment_1.currentChange.half_time = service_1.halfTime;
                enviroment_1.currentChange.minute = service_1.currentGameTime;
                enviroment_1.currentChange.change_id = uuid_1.v4();
                enviroment_1.currentChange.id = enviroment_1.currentChange.change_id;
                if (!(parameter.teamName.length == 0 &&
                    parameter.teamColor.length == 0 &&
                    parameter.teamNameLocation.length == 0)) return [3 /*break*/, 2];
                conv.ask("Non ho capito la squadra, ripetila");
                return [2 /*return*/];
            case 2:
                if (!currentGame.away_team_color.toLowerCase().startsWith(parameter.teamColor)) return [3 /*break*/, 4];
                return [4 /*yield*/, service_1.getCurrentTeamInfo(currentGame.home_team_id)];
            case 3:
                currentTeam = (_a.sent());
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, service_1.getCurrentTeamInfo(currentGame.away_team_id)];
            case 5:
                currentTeam = (_a.sent());
                _a.label = 6;
            case 6:
                enviroment_1.currentChange.team_Id = currentTeam.team_id;
                _a.label = 7;
            case 7:
                // * Controllo presenza numero giocatore
                if (parameter.playerNumberIn == null && parameter.playerNumberOut == null) {
                    conv.ask("Non ho capito il numero del giocatore, ripetilo");
                    return [2 /*return*/];
                }
                else {
                    outPlayerNumber = parameter.playerNumberOut;
                    inPlayerNumber = parameter.playerNumberIn;
                }
                // * Conferma ammonizione
                conv.ask("\u00C8 uscito il " + outPlayerNumber + " per il " + inPlayerNumber + " dei " + parameter.teamColor);
                return [4 /*yield*/, service_1.postChange(enviroment_1.currentChange)];
            case 8:
                _a.sent();
                service_1.flushChange();
                return [2 /*return*/];
        }
    });
}); });
// * Support intent for knowing the currect number of a pleayer
dialog.intent("AskNumberAmmonition", function (conv, param) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = enviroment_1.currentAmmonition;
                return [4 /*yield*/, service_1.getCurrentPlayerInfo(parseInt(param.number))];
            case 1:
                _a.player_id = _b.sent();
                conv.ask("Ok " + enviroment_1.currentAmmonition.player_id);
                return [2 /*return*/];
        }
    });
}); });
// * Intent for nowing how much time is left
dialog.intent("TimeLeft", function (conv, param) {
    conv.ask("Mancano " + (service_1.gameTime - service_1.currentGameTime) + " minuti");
});
dialog.intent("CurrentTime", function (conv, param) {
    conv.ask("Siamo al " + service_1.currentGameTime + "esimo");
});
// * Intent for when the time is expired
dialog.intent("TimeExpired", function (conv, param) {
    conv.ask("Il tempo \u00E8 scaduto");
});
dialog.intent("ExtraTime", function (conv, param) {
    service_1.addExtraTime(param.extraTime);
    conv.ask("Aggiungo " + param.extraTime);
});
app.post("/", dialog);
app.listen(5050);
