@ECHO OFF

if "%~1"=="" goto WrongArgs
if "%~2"=="" goto WrongArgs
if "%~3"=="" goto WrongArgs

:CorrectArgs
echo Setting spring properties with provided arguments
setx SPRING_DATABASE_URL %1
setx SPRING_DATABASE_USERNAME %2
setx SPRING_DATABASE_PASSWORD %3
goto Done

:WrongArgs
echo No arguments passed setting with default values...
setx SPRING_DATABASE_URL "r2dbc:postgresql://localhost:5432/casciffo_db"
setx SPRING_DATABASE_USERNAME "postgres"
setx SPRING_DATABASE_PASSWORD "postgres"

:Done
