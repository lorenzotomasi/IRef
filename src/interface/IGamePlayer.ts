export interface IGamePlayer {
  game_id: string;
  home_team_player: IGamePlayerInfo[];
  away_team_player: IGamePlayerInfo[];
}

export interface IGamePlayerInfo {
  number: number;
  player_id: string;
  starting_player: boolean;
  capitan: boolean | null;
}
