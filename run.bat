@echo off

set port=9000
if "%~1"=="" (
    echo You can set a default port by running run.bat [portNum] 
    echo e.g run.bat 9000 
    echo The default port is 9000
    goto Bundle 
)
set port=%1

:Bundle
echo Bundling the app...
echo
call bundle-app.bat
cd casciffo-spring-backend
echo Launching the app on port %port%!
call java -jar \build\libs\casciffo-1.0.0.jar --port=%port%
