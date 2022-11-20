@echo off
cd casciffo-front-end
npm i
npm run build
set front-end=%cd%

cd ..

cd casciffo-spring-backend

gradlew build -x tests

copyx
