set port=9001
if "%~1"=="" (
    echo You can set a default port by running run.bat [portNum] 
	echo e.g run.bat 9001 
	echo The default port for test env is 9001
	goto launch 
)
set port=%1

:launch
echo Launching the app on port %1!
call java -jar casciffo-1.0.0.jar --port=%port%
