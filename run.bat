@echo off
cd casciffo-front-end
npm i
npm run build
set front-end=%cd%

cd ..

cd casciffo-spring-backend

rmdir src/main/resources/public
mkdir src/main/resources/public
copyx %front-end%/build/* src/main/resources/public

gradlew build -x test

java -jar build/libs/casciffo-spring-backend-1.0.0-SNAPSHOT.jar
