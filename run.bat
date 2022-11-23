@echo off

echo Bundling the app...
echo
call bundle-app.bat
echo Launching the app!
call java -jar build/libs/casciffo-spring-backend-1.0.0-SNAPSHOT.jar
