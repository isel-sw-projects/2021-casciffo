#!/bin/bash
@echo off
cd casciffo-front-end

echo "Installing front-end modules..."
npm i

echo "Creating production build..."
npm run build

set front-end "$pwd/build"

cd ..

cd casciffo-spring-backend

echo "Creating /build folder for static file serving..."

rm -r src/main/resources/build
mkdir src/main/resources/build

echo "Copying optimized production build from front-end to /build..."

cp -r "$front-end/*" "src/main/resources/build"


echo "Creating environment variables..."
source env.sh

echo "Bundling the app..."
source .\gradlew clean build -x test

echo "Launching app!"
java -jar build/libs/casciffo-spring-backend-1.0.0-SNAPSHOT.jar
