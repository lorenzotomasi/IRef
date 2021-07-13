import { IAmmonition } from "../interface/IAmmonition";
import { IChange } from "../interface/IChange";
import { IExpulsion } from "../interface/IExpulsion";

export let currentGameId = "7FB48972-457A-7085-BB08-CD4D47706419";

export const BASE_URL = "http://localhost:3000/";

export let currentAmmonition: IAmmonition = {
  id: null,
  admonition_id: null,
  game_id: null,
  half_time: null,
  minute: null,
  motivation: null,
  player_id: null,
  team_Id: null,
};

export let currentExpulsion: IExpulsion = {
  id: null,
  expulsion_id: null,
  game_id: null,
  half_time: null,
  minute: null,
  motivation: null,
  player_id: null,
  team_Id: null,
};

export let currentChange: IChange = {
  id: null,
  change_id: null,
  game_id: null,
  half_time: null,
  minute: null,
  in_player_id: null,
  out_player_id: null,
  team_Id: null,
};

export const askNumberAdmonitionContest = {
  constest: "AskNumberAmmonition",
};

export const askNumberExpulsion = {
  constest: "AskNumberExpulsion",
};
