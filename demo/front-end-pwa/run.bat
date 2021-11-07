@echo off
call npm run-script build
call serve -s build