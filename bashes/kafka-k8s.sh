#!/usr/bin/env bash
set -x  # display commands being run

# Install Kafka
helm install kafka bitnami/kafka --wait

echo "Waiting for kafka to be ready..."

while : ; do
  echo "Checking kafka pods..."
  runningPods=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=kafka" -o jsonpath="{.items[*].status.conditions[?(@.type=='Ready')].status}")
  if [[ ${runningPods} =~ "False" ]]; then
    echo "Some kafka pods are not yet ready, sleeping for 10 seconds..."
    sleep 10
  else
    echo "All kafka pods are running and ready."
    break
  fi
done

kafkaPwd=$(kubectl get secret --namespace default kafka -o jsonpath="{.data.kafka-password}")
KAFKA_PASSWORD="$(echo "$kafkaPwd" | base64 --decode)"
export KAFKA_PASSWORD
echo "base 64 kafka password $kafkaPwd"
echo "plain kafka password $KAFKA_PASSWORD"

kubectl create secret generic kafka-password --from-literal=KAFKA_PASSWORD="$KAFKA_PASSWORD"

kubectl apply -f k8s/kafka-topic-viewer.yaml

kubectl port-forward --namespace default svc/kafka 9092:9092 &
kubectl port-forward --namespace default svc/kafka-topic-viewer 8000:8000 &
