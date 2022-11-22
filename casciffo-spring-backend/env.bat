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
setx SPRING_DATABASE_URL "r2dbc:postgresql://ec2-54-78-127-245.eu-west-1.compute.amazonaws.com:5432/d7psk5rcl1gdgc"
setx SPRING_DATABASE_USERNAME "mmbfsxyutgdryx"
setx SPRING_DATABASE_PASSWORD "fc8374f857d28c648f8b984a56f5ac2407a7b069eaf631e8e43be82385a0aab1"

:Done
