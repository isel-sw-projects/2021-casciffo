#!/bin/bash
@echo off
cd casciffo-front-end
npm i
npm run build
set front-end "$pwd/build"

cd ..

cd casciffo-spring-backend

echo "Creating /build folder for static file serving..."

rm -r src/main/resources/build
mkdir src/main/resources/build

echo "Copying optimized production build from front-end to /build..."

cp -r "$front-end/*" "src/main/resources/build"

echo "Bundling the app..."

source env.sh
source gradlew build -x test


java -jar build/libs/casciffo-spring-backend-1.0.0-SNAPSHOT.jar
