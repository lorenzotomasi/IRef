import axios from "axios";
import {
  BASE_URL,
  currentAmmonition,
  currentChange,
  currentExpulsion,
  currentGameId,
} from "../enviroment/enviroment";
import { IAmmonition } from "../interface/IAmmonition";
import { IGame } from "../interface/IGame";
import { IGamePlayer, IGamePlayerInfo } from "../interface/IGamePlayer";
import { ITeam } from "../interface/ITeam";
import { v4 as uuidv4 } from "uuid";
import { IExpulsion } from "../interface/IExpulsion";
import { IChange } from "../interface/IChange";

export let currentGameTime = 0;
export let gameTime = 45;
export let timer = null;
export let halfTime = 1;
let extraTime = 0;

export async function startGame() {
  timer = setInterval(async () => {
    console.log(`${currentGameTime}`);
    let temp = gameTime + parseInt(extraTime.toString());
    if (currentGameTime >= temp) {
      clearInterval(timer);
      console.log("Tempo scaduto");
      halfTime++;
      extraTime = 0;
      currentGameTime = 0;
      return;
    }
    currentGameTime++;
  }, 1000);
}

export async function getCurrentGameInfo(): Promise<IGame> {
  return (await axios.get(`${BASE_URL}game?game_id=${currentGameId}`)).data[0];
}

export async function getCurrentTeamInfo(UUID: string): Promise<ITeam> {
  return (await axios.get(`${BASE_URL}team?team_id=${UUID}`)).data[0];
}

export async function getCurrentPlayerInfo(
  playerNumber: number
): Promise<string> {
  // * Get gamePlayerList
  let result = (
    await axios.get(`${BASE_URL}game-player?game_id=${currentGameId}`)
  ).data[0] as unknown as IGamePlayer;
  let player: IGamePlayerInfo;

  // * Get gameInfo

  let game = (await axios.get(`${BASE_URL}game?game_id=${currentGameId}`))
    .data as unknown as IGame;

  // * Check if home or away team
  if (game.away_team_id == currentAmmonition.team_Id) {
    player = result.away_team_player.find((x) => x.number == playerNumber);
  } else {
    player = result.home_team_player.find((x) => x.number == playerNumber);
  }
  return player.player_id;
}

export async function getCurrentPlayer(
  playerNumber: number
): Promise<IGamePlayerInfo> {
  // * Get gamePlayerList
  let result = (
    await axios.get(`${BASE_URL}game-player?game_id=${currentGameId}`)
  ).data[0] as unknown as IGamePlayer;
  let player: IGamePlayerInfo;

  // * Get gameInfo

  let game = (await axios.get(`${BASE_URL}game?game_id=${currentGameId}`))
    .data as unknown as IGame;

  // * Check if home or away team
  if (game.away_team_id == currentAmmonition.team_Id) {
    player = result.away_team_player.find((x) => x.number == playerNumber);
  } else {
    player = result.home_team_player.find((x) => x.number == playerNumber);
  }
  return player;
}

export async function postAdmonition(admonition: IAmmonition) {
  return await axios.post(`${BASE_URL}admonition`, admonition);
}

export async function postChange(change: IChange) {
  return await axios.post(`${BASE_URL}change`, change);
}

export async function postExpulsion(expulsion: IExpulsion) {
  return await axios.post(`${BASE_URL}expulsion`, expulsion);
}

export async function autoExpulsion(currentAmmonition: IAmmonition) {
  currentExpulsion.expulsion_id = uuidv4();
  currentExpulsion.id = currentExpulsion.expulsion_id;
  currentExpulsion.game_id = currentAmmonition.game_id;
  currentExpulsion.half_time = currentAmmonition.half_time;
  currentExpulsion.player_id = currentAmmonition.player_id;
  currentExpulsion.team_Id = currentAmmonition.team_Id;
  currentExpulsion.minute = currentAmmonition.minute;
  currentExpulsion.motivation = "Doppia ammonizione";
  await postExpulsion(currentExpulsion);
  return;
}

export async function getAdmonitionList() {
  return (await (
    await axios.get(`${BASE_URL}admonition`)
  ).data) as unknown as IAmmonition[];
}

export function flushAdmonition() {
  currentAmmonition.admonition_id = null;
  currentAmmonition.id = null;
  currentAmmonition.game_id = null;
  currentAmmonition.half_time = null;
  currentAmmonition.player_id = null;
  currentAmmonition.team_Id = null;
  currentAmmonition.minute = null;
  currentAmmonition.motivation = null;
}

export function flushExpulsion() {
  currentAmmonition.admonition_id = null;
  currentAmmonition.id = null;
  currentAmmonition.game_id = null;
  currentAmmonition.half_time = null;
  currentAmmonition.player_id = null;
  currentAmmonition.team_Id = null;
  currentAmmonition.minute = null;
  currentAmmonition.motivation = null;
}

export function flushChange() {
  currentChange.change_id = null;
  currentChange.id = null;
  currentChange.game_id = null;
  currentChange.half_time = null;
  currentChange.in_player_id = null;
  currentChange.out_player_id = null;
  currentChange.team_Id = null;
  currentChange.minute = null;
}

export function addExtraTime(extraTimeAdd: number) {
  extraTime = extraTimeAdd;
}
