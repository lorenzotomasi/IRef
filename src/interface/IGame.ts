export interface IGame {
  game_id: string;
  home_team_id: string;
  away_team_id: string;
  home_team_color: string;
  away_team_color: string;
  date: Date;
  ufficial_start_time: string;
  start_time: string;
  end_time: string;
}
