#!/bin/sh

if [ -z "$1" ] && [ -z "$2" ] && [ -z "$3" ]
then
  echo "Setting spring properties with provided arguments"
  export SPRING_DATABASE_URL="$1"
  export SPRING_DATABASE_USERNAME="$2"
  export SPRING_DATABASE_PASSWORD="$3"
else
  echo "No arguments passed setting with default values..."
  export SPRING_DATABASE_URL="r2dbc:postgresql://ec2-54-78-127-245.eu-west-1.compute.amazonaws.com:5432/d7psk5rcl1gdgc"
  export SPRING_DATABASE_USERNAME="mmbfsxyutgdryx"
  export SPRING_DATABASE_PASSWORD="fc8374f857d28c648f8b984a56f5ac2407a7b069eaf631e8e43be82385a0aab1"
fi
