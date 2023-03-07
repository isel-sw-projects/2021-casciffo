set port=9000
if "%~1"=="" (
    echo You can set a default port by running run.bat [portNum] 
	echo e.g run.bat 9000 
	echo The default port is 9000
	goto launch 
)
set port=%1

:launch
echo Launching the app on port %1!
call java -jar casciffo-1.0.0.jar --port=%port%
