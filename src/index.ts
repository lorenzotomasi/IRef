import express = require("express");
import { dialogflow } from "actions-on-google";
import { IAmmonition } from "./interface/IAmmonition";
import { IGame } from "./interface/IGame";
import { ITeam } from "./interface/ITeam";
import { IResponse, IResponseChanage } from "./interface/IResponse";
import { IGamePlayer, IGamePlayerInfo } from "./interface/IGamePlayer";
import { v4 as uuidv4 } from "uuid";
import {
  addExtraTime,
  autoExpulsion,
  currentGameTime,
  flushAdmonition,
  flushChange,
  flushExpulsion,
  gameTime,
  getAdmonitionList,
  getCurrentGameInfo,
  getCurrentPlayer,
  getCurrentPlayerInfo,
  getCurrentTeamInfo,
  halfTime,
  postAdmonition,
  postChange,
  postExpulsion,
  startGame,
} from "./service/service";
import {
  askNumberAdmonitionContest,
  currentAmmonition,
  currentChange,
  currentExpulsion,
} from "./enviroment/enviroment";

const app = express().use(express.json());

const dialog = dialogflow({ debug: false });

// * Intent for starting a game
dialog.intent("StartGame", (conv, param) => {
  startGame();
  conv.ask(`Inizio il tempo ${halfTime} da ${gameTime} minuti`);
});

// * Welcome intent
dialog.intent("Welcome", (conv, param) => {
  conv.ask(`Sono iref il tuo assistente arbitro virtuale`);
});

// * Intent for making an ammonition
dialog.intent("Ammonition", async (conv, param) => {
  var parameter: IResponse = param as unknown as IResponse;
  let currentGame = await getCurrentGameInfo();
  currentAmmonition.game_id = currentGame.game_id;
  let currentTeam: ITeam;
  let expulsion = false;

  // * Initialized current ammonition
  currentAmmonition.half_time = halfTime;
  currentAmmonition.minute = currentGameTime;
  currentAmmonition.admonition_id = uuidv4();
  currentAmmonition.id = currentAmmonition.admonition_id;

  let ammonitionList = await getAdmonitionList();
  // Controllo presenza team
  if (
    parameter.teamName.length == 0 &&
    parameter.teamColor.length == 0 &&
    parameter.teamNameLocation.length == 0 &&
    currentAmmonition.team_Id.length == 0
  ) {
    conv.ask(`Non ho capito la squadra, ripetila`);
    return;
  } else {
    // * Controllo team home o away
    if (
      currentGame.away_team_color.toLowerCase().startsWith(parameter.teamColor)
    ) {

      currentTeam = (await getCurrentTeamInfo(
        currentGame.away_team_id
      )) as ITeam;
    } else {
      currentTeam = (await getCurrentTeamInfo(
        currentGame.home_team_id
      )) as ITeam;
    }
    currentAmmonition.team_Id = currentTeam.team_id;
  }
  // * Controllo presenza motivazione ammonizione
  if (parameter.motivation.length == 0 || parameter.motivation == null) {
    conv.ask(`Non ho capito la motivazione, ripetilo`);
    return;
  } else {
    currentAmmonition.motivation = parameter.motivation;
  }
  // * Controllo presenza numero giocatore
  if (parameter.playerNumber == null) {
    conv.ask(`Non ho capito il numero del giocatore, ripetilo`);
    conv.contexts.set(askNumberAdmonitionContest.constest, 1);
    return;
  } else {
    currentAmmonition.player_id = await getCurrentPlayerInfo(
      parameter.playerNumber
    );
    if (
      ammonitionList.find((x) => x.player_id == currentAmmonition.player_id) !=
      null
    ) {
      expulsion = true;
    }
  }
  // * Conferma ammonizione
  conv.ask(
    `Hai ammonito il numero ${parameter.playerNumber} del ${
      currentTeam.name
    } al ${currentGameTime} minuto per ${parameter.motivation} ${
      expulsion ? ", lo segno come espulso per doppia ammonizione" : ""
    }`
  );
  await postAdmonition(currentAmmonition);
  if (expulsion) {
    await autoExpulsion(currentAmmonition);
  }
  flushAdmonition();
  flushExpulsion();
});

// * Intent for making an expulsion
dialog.intent("Expulsion", async (conv, param) => {
  var parameter: IResponse = param as unknown as IResponse;
  let currentGame = await getCurrentGameInfo();
  currentExpulsion.game_id = currentGame.game_id;
  let currentTeam: ITeam;

  // * Initialized current ammonition
  currentExpulsion.half_time = halfTime;
  currentExpulsion.minute = currentGameTime;
  currentExpulsion.expulsion_id = uuidv4();
  currentExpulsion.id = currentAmmonition.admonition_id;

  // Controllo presenza team
  if (
    parameter.teamName.length == 0 &&
    parameter.teamColor.length == 0 &&
    parameter.teamNameLocation.length == 0 &&
    currentAmmonition.team_Id.length == 0
  ) {
    conv.ask(`Non ho capito la squadra, ripetila`);
    return;
  } else {
    // * Controllo team home o away
    if (
      currentGame.away_team_color.toLowerCase().startsWith(parameter.teamColor)
    ) {
      currentTeam = (await getCurrentTeamInfo(
        currentGame.away_team_id
      )) as ITeam;
    } else {
      currentTeam = (await getCurrentTeamInfo(
        currentGame.home_team_id
      )) as ITeam;
    }
    currentExpulsion.team_Id = currentTeam.team_id;
  }
  // * Controllo presenza motivazione ammonizione
  if (parameter.motivation.length == 0 || parameter.motivation == null) {
    conv.ask(`Non ho capito la motivazione, ripetilo`);
    return;
  } else {
    currentExpulsion.motivation = parameter.motivation;
  }
  // * Controllo presenza numero giocatore
  if (parameter.playerNumber == null) {
    conv.ask(`Non ho capito il numero del giocatore, ripetilo`);
    return;
  } else {
    currentExpulsion.player_id = await getCurrentPlayerInfo(
      parameter.playerNumber
    );
  }

  // TODO controllare se è gia ammonito e salvare informazioni del giocatore
  // * Conferma ammonizione
  conv.ask(
    `Hai espulso il numero ${parameter.playerNumber} del ${currentTeam.name} al ${currentGameTime} minuto per ${parameter.motivation}`
  );
  postExpulsion(currentExpulsion);
});

dialog.intent("Change", async (conv, param) => {
  var parameter: IResponseChanage = param as unknown as IResponseChanage;
  let currentGame = await getCurrentGameInfo();
  currentChange.game_id = currentGame.game_id;
  let currentTeam: ITeam;
  var inPlayerNumber = 0;
  var outPlayerNumber = 0;

  // * Initialized current change
  currentChange.half_time = halfTime;
  currentChange.minute = currentGameTime;
  currentChange.change_id = uuidv4();
  currentChange.id = currentChange.change_id;

  // Controllo presenza team
  if (
    parameter.teamName.length == 0 &&
    parameter.teamColor.length == 0 &&
    parameter.teamNameLocation.length == 0
  ) {
    conv.ask(`Non ho capito la squadra, ripetila`);
    return;
  } else {
    // * Controllo team home o away
    if (
      currentGame.away_team_color.toLowerCase().startsWith(parameter.teamColor)
    ) {
      currentTeam = (await getCurrentTeamInfo(
        currentGame.home_team_id
      )) as ITeam;
    } else {
      currentTeam = (await getCurrentTeamInfo(
        currentGame.away_team_id
      )) as ITeam;
    }
    currentChange.team_Id = currentTeam.team_id;
  }
  // * Controllo presenza numero giocatore
  if (parameter.playerNumberIn == null && parameter.playerNumberOut == null) {
    conv.ask(`Non ho capito il numero del giocatore, ripetilo`);
    return;
  } else {
    outPlayerNumber = parameter.playerNumberOut;
    inPlayerNumber = parameter.playerNumberIn;
  }
  // * Conferma ammonizione
  conv.ask(
    `È uscito il ${outPlayerNumber} per il ${inPlayerNumber} dei ${parameter.teamColor}`
  );

  await postChange(currentChange);
  flushChange();
});

// * Support intent for knowing the currect number of a pleayer
dialog.intent("AskNumberAmmonition", async (conv, param) => {
  currentAmmonition.player_id = await getCurrentPlayerInfo(
    parseInt(param.number as string)
  );
  conv.ask(`Ok ${currentAmmonition.player_id}`);
});

// * Intent for nowing how much time is left
dialog.intent("TimeLeft", (conv, param) => {
  conv.ask(`Mancano ${gameTime - currentGameTime} minuti`);
});

dialog.intent("CurrentTime", (conv, param) => {
  conv.ask(`Siamo al ${currentGameTime}esimo`);
});

// * Intent for when the time is expired
dialog.intent("TimeExpired", (conv, param) => {
  conv.ask(`Il tempo è scaduto`);
});

dialog.intent("ExtraTime", (conv, param) => {
  addExtraTime(param.extraTime as number);
  conv.ask(`Aggiungo ${param.extraTime}`);
});

app.post("/", dialog);

app.listen(5050);
