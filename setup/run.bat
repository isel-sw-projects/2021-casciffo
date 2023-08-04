@echo off
set "dbuser=vp"
set "dbpwd=vp123456"
set "dbport=5432"
set "workDir=%~dp0.."

if "%~1"=="" (
    echo You can set the environment by running run.bat [env] where env can be "prod" or "test".
    echo Default is "test"
    goto :test_env
) else if "%~1"=="test" (
:test_env
    set "envd=test"
    set "appname=casciffo-test.jar"
    call :check_file_exists %envd% %appname%
    echo Running test app...
    set "port=9001"
    set "dbname=casciffo_db_test"
) else if "%~1"=="prod" (
    set "envd=prod"
    set "appname=casciffo.jar"
    call :check_file_exists %envd% %appname%
    echo Running production app...
    set "port=9000"
    set "dbname=casciffo_db"
)

set "app_path=%workDir%\deployments\%envd%\%appname%"

:args_loop
if "%~1"=="" goto continue
if /i "%~1"=="-p" (
    set "port=%~2"
    shift
)
if /i "%~1"=="-P" (
    set "dbport=%~2"
    shift
)
if /i "%~1"=="-d" (
    set "dbname=%~2"
    shift
)
if /i "%~1"=="-u" (
    set "dbuser=%~2"
    shift
)
if /i "%~1"=="-w" (
    set "dbpwd=%~2"
    shift
)
if /i "%~1"=="-h" (
    echo This script launches the CASCIFFO application with 5 optional and 1 mandatory settings, these are:
    echo   prod^|test    [MANDATORY]    The application environment, either prod or test, MUST be first argument.
    echo   -p            [OPTIONAL]      The port on which the app wil listen.
    echo   -P            [OPTIONAL]      The postgres listening port.
    echo   -d            [OPTIONAL]      The database name.
    echo   -u            [OPTIONAL]      The database user name.
    echo   -w            [OPTIONAL]      The password for the database user.
    echo For values with spaces use double quotation marks, i.e -u "user name one".
    echo An example with the default values on how to use the script can be:
    echo %~nx0 -p %port% -P %dbport% -d %dbname% -u %dbuser% -w %dbpwd%
    exit /b
)
shift
goto args_loop

:continue
echo Launching the app!
java -jar "%app_path%" --port %port% --db_name %dbname% --db_user %dbuser% --db_pwd %dbpwd% --db_port %dbport%
exit /b

:check_file_exists
if not exist "%workDir%\deployments\$~1\$~2" (
        echo File not found!
        echo Please run the respective bundle script!
        exit /b 1
)
exit /b