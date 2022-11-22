@echo off
cd casciffo-front-end

echo Installing front-end modules...
call npm i

echo Creating production build...
call npm run build

set front-end="%cd%/build"

cd ..

cd casciffo-spring-backend

echo Creating /build folder for static file serving...

rmdir /s src/main/resources/build
mkdir src/main/resources/build

echo Copying optimized production build from front-end to /build...

xcopy /s "%front-end%" "src/main/resources/build"


echo Creating environment variables...
call env.bat

echo Bundling the app...
call gradlew clean build -x test

echo Launching the app!
call java -jar build/libs/casciffo-spring-backend-1.0.0-SNAPSHOT.jar
