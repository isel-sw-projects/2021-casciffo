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

rmdir /s webapp
mkdir webapp

echo
echo Copying optimized production build from front-end to /webapp...

xcopy /s "..\casciffo-front-end\build" "webapp"


echo Creating environment variables...
call env.bat

echo Bundling the app...
call gradlew clean build -x test
rename build/libs/casciffo-spring-backend-1.0.0.jar casciffo-1.0.0.jar

echo
echo Done!
echo You can run the app with the command java -jar build/libs/casciffo-1.0.0.jar
