CREATE DATABASE prac;
\connect prac;

CREATE TABLE IF NOT EXISTS films (
  id uuid PRIMARY KEY,
  rating real,
  director varchar(255),
  tags text[] DEFAULT '{}'::text[],
  title varchar(255),
  about text,
  description text,
  image varchar(255),
  cover varchar(255)
);

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY,
  film_id uuid NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  daytime timestamptz,
  hall varchar(64),
  rows integer,
  seats integer,
  price integer,
  taken text[] DEFAULT '{}'::text[]
);
