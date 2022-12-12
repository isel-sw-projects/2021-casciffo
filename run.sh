#!/bin/bash
@echo off
local port=9000

if [ -z "$1" ]
then 
    port=$1
else
    echo "You can set a default port by running run.bat [portNum]" 
    echo "e.g ./run.bat 9000"
    echo "The default port is 9000"
fi

cd "Bundling the app..."
./bundle-app.sh

cd casciffo-spring-backend
echo "Launching the app on port $port!"
java -jar build/libs/casciffo-1.0.0.jar --port=$port
