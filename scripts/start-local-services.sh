#!/bin/sh

set -eu

if ! docker info >/dev/null 2>&1; then
  if [ "$(uname -s)" = "Darwin" ]; then
    echo "Docker Desktop is not running. Opening it..."
    open -a Docker
  else
    echo "Docker is not running. Start Docker, then run this command again." >&2
    exit 1
  fi

  printf "Waiting for Docker"
  attempts=0
  while ! docker info >/dev/null 2>&1; do
    attempts=$((attempts + 1))
    if [ "$attempts" -ge 60 ]; then
      printf "\nDocker did not become ready within 60 seconds.\n" >&2
      exit 1
    fi
    printf "."
    sleep 1
  done
  printf " ready.\n"
fi

ensure_container() {
  service="$1"
  container="$2"

  if docker inspect "$container" >/dev/null 2>&1; then
    if [ "$(docker inspect -f '{{.State.Running}}' "$container")" != "true" ]; then
      docker start "$container" >/dev/null
    fi
  else
    docker compose up -d "$service"
  fi
}

ensure_container mongodb fitmart-mongodb
ensure_container redis fitmart-redis

printf "Waiting for Redis"
attempts=0
while ! docker exec fitmart-redis redis-cli ping >/dev/null 2>&1; do
  attempts=$((attempts + 1))
  if [ "$attempts" -ge 30 ]; then
    printf "\nRedis did not become ready within 30 seconds.\n" >&2
    exit 1
  fi
  printf "."
  sleep 1
done
printf " ready.\n"

echo "Local services are ready: MongoDB on 27017 and Redis on 6379."