#!/usr/bin/env bash
docker compose build backend-base
docker compose build backend
docker compose --env-file ./backend/.env up --no-build