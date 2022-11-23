@echo off
cd casciffo-front-end

echo Installing front-end modules...
call npm i

echo
echo Creating production build...
call npm run build

cd ..

cd casciffo-spring-backend

echo
echo Creating /build folder for static file serving...

rmdir /s src\main\resources\build
mkdir src\main\resources\build

echo
echo Copying optimized production build from front-end to /build...

xcopy /s "..\casciffo-front-end\build" "src\main\resources\build"


echo Creating environment variables...
call env.bat

echo Bundling the app...
call gradlew clean build -x test

echo
echo cleaning build files...
rmdir /s src\main\resources\build

echo
echo Done!
echo You can run the app with the command java -jar build/libs/casciffo-spring-backend-1.0.0-SNAPSHOT.jar
