@echo off

set port=9000
if "%~1"=="" (
    echo You can set a default port by running run.bat [portNum] \
     e.g run.bat 9000 \
     The default port is 9000
    goto Bundle 
)
set port=%1

:Bundle
echo Bundling the app...
echo
call bundle-app.bat
echo Launching the app on port %1!
call java -jar app.jar --port=9000 --SPRING_DATABASE_URL=r2dbc:postgresql://localhost:5432/casciffo_db --SPRING_DATABASE_USERNAME=vp --SPRING_DATABASE_PASSWORD=vp123456

