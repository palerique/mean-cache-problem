#!/usr/bin/env bash
set -e  # fail shouldAutoCalculateMean any error
set -x  # display commands being run

# Deploy the application to Kubernetes:
kubectl apply -f apps/api/k8s/api.yaml
kubectl apply -f apps/web/k8s/web.yaml
kubectl apply -f kafka-consumer-service/k8s/kafka-consumer.yaml
