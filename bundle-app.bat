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
echo Creating /webapp folder for static file serving...
echo This will remove the previous /webapp folder.
echo If the folder already exists you'll be prompted with Are you sure? [y/n] - This confirms whether you'll want to remove the folder
echo To ensure the correct procedure we encourage you to say y.
rmdir /s webapp
mkdir webapp

echo
echo Copying optimized production build from front-end to /webapp...

robocopy /e /move "..\casciffo-front-end\build" "webapp"


echo Creating environment variables...
call env.bat

echo Bundling the app...
call gradlew clean build -x test
ren "build\libs\casciffo-spring-backend-1.0.0.jar" "casciffo-1.0.0.jar"

echo
echo Done!
echo While in the main directory (where you can see both module folders of casciffo)
echo You can run the app with the command java -jar casciffo-spring-backend\build\libs\casciffo-1.0.0.jar
