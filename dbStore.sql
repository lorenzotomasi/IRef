create TABLE player (
    player_id serial primary key,
    name VARCHAR(50) not null,
    surname VARCHAR(50) not null
);
create table team (
    team_id serial primary key,
    name VARCHAR(100) not null
);
create table game (
    game_id serial primary key,
    home_team_id serial not null,
    away_team_id serial not null,
    home_team_color VARCHAR(50),
    away_team_color VARCHAR(50),
    date timestamp not null,
    ufficial_start_time timestamp not null,
    start_time timestamp,
    end_time timestamp
);
create TABLE admonition (
    admonition_id serial primary key,
    game_id serial not null,
    player_id serial not null,
    team_id serial not null,
    motivation VARCHAR(100) not null,
    minute TIME not null,
    half_time INTEGER not null
);
create TABLE expulsion (
    expulsion_id serial primary key,
    game_id serial not null,
    player_id serial not null,
    team_id serial not null,
    motivation VARCHAR(100) not null,
    minute TIME not null,
    half_time INTEGER not null
);
create TABLE substitution (
    substitution_id serial primary key,
    game_id serial not null,
    in_player_id serial not null,
    out_player_id serial not null,
    team_id serial not null,
    minute TIME not null,
    half_time INTEGER not null
);