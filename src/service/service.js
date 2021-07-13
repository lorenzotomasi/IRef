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
exports.addExtraTime = exports.flushChange = exports.flushExpulsion = exports.flushAdmonition = exports.getAdmonitionList = exports.autoExpulsion = exports.postExpulsion = exports.postChange = exports.postAdmonition = exports.getCurrentPlayer = exports.getCurrentPlayerInfo = exports.getCurrentTeamInfo = exports.getCurrentGameInfo = exports.startGame = exports.halfTime = exports.timer = exports.gameTime = exports.currentGameTime = void 0;
var axios_1 = require("axios");
var enviroment_1 = require("../enviroment/enviroment");
var uuid_1 = require("uuid");
exports.currentGameTime = 0;
exports.gameTime = 45;
exports.timer = null;
exports.halfTime = 1;
var extraTime = 0;
function startGame() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            exports.timer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var temp;
                return __generator(this, function (_a) {
                    console.log("" + exports.currentGameTime);
                    temp = exports.gameTime + parseInt(extraTime.toString());
                    if (exports.currentGameTime >= temp) {
                        clearInterval(exports.timer);
                        console.log("Tempo scaduto");
                        exports.halfTime++;
                        extraTime = 0;
                        exports.currentGameTime = 0;
                        return [2 /*return*/];
                    }
                    exports.currentGameTime++;
                    return [2 /*return*/];
                });
            }); }, 1000);
            return [2 /*return*/];
        });
    });
}
exports.startGame = startGame;
function getCurrentGameInfo() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get(enviroment_1.BASE_URL + "game?game_id=" + enviroment_1.currentGameId)];
                case 1: return [2 /*return*/, (_a.sent()).data[0]];
            }
        });
    });
}
exports.getCurrentGameInfo = getCurrentGameInfo;
function getCurrentTeamInfo(UUID) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get(enviroment_1.BASE_URL + "team?team_id=" + UUID)];
                case 1: return [2 /*return*/, (_a.sent()).data[0]];
            }
        });
    });
}
exports.getCurrentTeamInfo = getCurrentTeamInfo;
function getCurrentPlayerInfo(playerNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var result, player, game;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get(enviroment_1.BASE_URL + "game-player?game_id=" + enviroment_1.currentGameId)];
                case 1:
                    result = (_a.sent()).data[0];
                    return [4 /*yield*/, axios_1["default"].get(enviroment_1.BASE_URL + "game?game_id=" + enviroment_1.currentGameId)];
                case 2:
                    game = (_a.sent())
                        .data;
                    // * Check if home or away team
                    if (game.away_team_id == enviroment_1.currentAmmonition.team_Id) {
                        player = result.away_team_player.find(function (x) { return x.number == playerNumber; });
                    }
                    else {
                        player = result.home_team_player.find(function (x) { return x.number == playerNumber; });
                    }
                    return [2 /*return*/, player.player_id];
            }
        });
    });
}
exports.getCurrentPlayerInfo = getCurrentPlayerInfo;
function getCurrentPlayer(playerNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var result, player, game;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get(enviroment_1.BASE_URL + "game-player?game_id=" + enviroment_1.currentGameId)];
                case 1:
                    result = (_a.sent()).data[0];
                    return [4 /*yield*/, axios_1["default"].get(enviroment_1.BASE_URL + "game?game_id=" + enviroment_1.currentGameId)];
                case 2:
                    game = (_a.sent())
                        .data;
                    // * Check if home or away team
                    if (game.away_team_id == enviroment_1.currentAmmonition.team_Id) {
                        player = result.away_team_player.find(function (x) { return x.number == playerNumber; });
                    }
                    else {
                        player = result.home_team_player.find(function (x) { return x.number == playerNumber; });
                    }
                    return [2 /*return*/, player];
            }
        });
    });
}
exports.getCurrentPlayer = getCurrentPlayer;
function postAdmonition(admonition) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].post(enviroment_1.BASE_URL + "admonition", admonition)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.postAdmonition = postAdmonition;
function postChange(change) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].post(enviroment_1.BASE_URL + "change", change)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.postChange = postChange;
function postExpulsion(expulsion) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].post(enviroment_1.BASE_URL + "expulsion", expulsion)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.postExpulsion = postExpulsion;
function autoExpulsion(currentAmmonition) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    enviroment_1.currentExpulsion.expulsion_id = uuid_1.v4();
                    enviroment_1.currentExpulsion.id = enviroment_1.currentExpulsion.expulsion_id;
                    enviroment_1.currentExpulsion.game_id = currentAmmonition.game_id;
                    enviroment_1.currentExpulsion.half_time = currentAmmonition.half_time;
                    enviroment_1.currentExpulsion.player_id = currentAmmonition.player_id;
                    enviroment_1.currentExpulsion.team_Id = currentAmmonition.team_Id;
                    enviroment_1.currentExpulsion.minute = currentAmmonition.minute;
                    enviroment_1.currentExpulsion.motivation = "Doppia ammonizione";
                    return [4 /*yield*/, postExpulsion(enviroment_1.currentExpulsion)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.autoExpulsion = autoExpulsion;
function getAdmonitionList() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get(enviroment_1.BASE_URL + "admonition")];
                case 1: return [4 /*yield*/, (_a.sent()).data];
                case 2: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
exports.getAdmonitionList = getAdmonitionList;
function flushAdmonition() {
    enviroment_1.currentAmmonition.admonition_id = null;
    enviroment_1.currentAmmonition.id = null;
    enviroment_1.currentAmmonition.game_id = null;
    enviroment_1.currentAmmonition.half_time = null;
    enviroment_1.currentAmmonition.player_id = null;
    enviroment_1.currentAmmonition.team_Id = null;
    enviroment_1.currentAmmonition.minute = null;
    enviroment_1.currentAmmonition.motivation = null;
}
exports.flushAdmonition = flushAdmonition;
function flushExpulsion() {
    enviroment_1.currentAmmonition.admonition_id = null;
    enviroment_1.currentAmmonition.id = null;
    enviroment_1.currentAmmonition.game_id = null;
    enviroment_1.currentAmmonition.half_time = null;
    enviroment_1.currentAmmonition.player_id = null;
    enviroment_1.currentAmmonition.team_Id = null;
    enviroment_1.currentAmmonition.minute = null;
    enviroment_1.currentAmmonition.motivation = null;
}
exports.flushExpulsion = flushExpulsion;
function flushChange() {
    enviroment_1.currentChange.change_id = null;
    enviroment_1.currentChange.id = null;
    enviroment_1.currentChange.game_id = null;
    enviroment_1.currentChange.half_time = null;
    enviroment_1.currentChange.in_player_id = null;
    enviroment_1.currentChange.out_player_id = null;
    enviroment_1.currentChange.team_Id = null;
    enviroment_1.currentChange.minute = null;
}
exports.flushChange = flushChange;
function addExtraTime(extraTimeAdd) {
    extraTime = extraTimeAdd;
}
exports.addExtraTime = addExtraTime;
