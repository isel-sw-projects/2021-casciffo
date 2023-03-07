@echo off
set workDir=%cd%
set env="test"
set envpath=""

if "%~1"=="" (
    echo Setting up test app...
    set envpath="%workDir%\deployments\test"
    echo You can set the environment by running bundle-app.bat [env] where env can be "prod" or "test". 
    echo Default is "test"
	goto frontend 
) 
if "%~1"=="test" (
    echo Setting up test app...
    set envpath="%workDir%\deployments\test"
	goto frontend 
)
echo Setting up production app...
set envpath="%cd%\deployments\prod"
set env="prod"

:frontend
cd casciffo-front-end

echo Installing front-end modules...
call npm i

echo
echo Creating production build...
call npm run build

cd ../casciffo-spring-backend

echo
echo Creating /webapp folder for static file serving...
echo This will remove the previous /webapp folder.
echo If the folder already exists you'll be prompted with Are you sure? [y/n] - This confirms whether you'll want to remove the folder
echo To ensure the correct procedure we encourage you to say y.
rmdir /s "%envpath%\webapp"
mkdir "%envpath%\webapp"

echo
echo Copying optimized production build from front-end to /webapp...


robocopy /e /move "..\casciffo-front-end\build" "%envpath%\webapp"


echo Creating environment variables...
call env.bat

echo Bundling the app...
call gradlew clean build -x test


move "build\libs\casciffo-spring-backend-1.0.0.jar" "%envpath%"

cd %workDir%

if %env%=="test" (
    ren "%envpath%\casciffo-spring-backend-1.0.0.jar" "casciffo-test.jar"
    echo
    echo Done!
    echo Head over to the deployments/test and run the app with the run.bat!
    goto done
)

ren "%envpath%\casciffo-spring-backend-1.0.0.jar" "casciffo.jar"
echo
echo Done!
echo Head over to the deployments/prod and run the app with the run.bat!

:done 
