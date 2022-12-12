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

echo "Creating /webapp folder for static file serving..."

rm -r webapp
mkdir webapp

echo "Copying optimized production build from front-end to /webapp..."

cp -r "$front-end/*" "webapp"


echo "Creating environment variables..."
source env.sh

echo "Bundling the app..."
source .\gradlew clean build -x test
mv build/libs/casciffo-spring-backend-1.0.0.jar build/libs/casciffo-1.0.0.jar

echo
echo "Done!"
echo "You can run the app with the command java -jar build/libs/casciffo-1.0.0.jar"