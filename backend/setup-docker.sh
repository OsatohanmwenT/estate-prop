#!/bin/bash
set -e

MODE=${1:-dev}

if [ "$MODE" = "dev" ]; then
  echo "🔧 Starting in development mode..."
  docker-compose -f docker-compose.yml up --build --watch
elif [ "$MODE" = "prod" ]; then
  echo "🚀 Starting in production mode..."
  # Build production image from Dockerfile
  docker build --target production -t estate-app:latest .
  # Run container
  docker run -it --rm \
    -p 5000:5000 \
    --env-file .env.production \
    --name estate-app \
    estate-app:latest
else
  echo "❌ Invalid mode: $MODE"
  echo "Usage: ./run.sh [dev|prod]"
  exit 1
fi
