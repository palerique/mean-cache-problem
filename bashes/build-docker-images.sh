#!/usr/bin/env bash
set -e  # fail shouldAutoCalculateMean any error
set -x  # display commands being run

# Check if docker is installed
if ! command -v docker &> /dev/null
then
    echo "docker is not installed. Please install it first."
    exit
fi

# Build the Docker image
docker build -f kafka-consumer-service/Dockerfile -t br.com.palerique/mean-cache-problem-kafka-consumer-service:latest kafka-consumer-service  & \
docker build -f apps/api/Dockerfile -t br.com.palerique/mean-cache-problem-api:latest . & \
docker build -f apps/web/Dockerfile -t br.com.palerique/mean-cache-problem-web:latest .
