DROP DATABASE IF EXISTS prac;
CREATE DATABASE prac;
\connect prac;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS films (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating real NOT NULL,
  director varchar(255) NOT NULL,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  title varchar(255) NOT NULL,
  about text NOT NULL,
  description text NOT NULL,
  image varchar(255) NOT NULL,
  cover varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  film_id uuid NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  daytime timestamptz NOT NULL,
  hall varchar(64) NOT NULL,
  rows integer NOT NULL,
  seats integer NOT NULL,
  price integer NOT NULL,
  taken text[] NOT NULL DEFAULT '{}'::text[]
);
