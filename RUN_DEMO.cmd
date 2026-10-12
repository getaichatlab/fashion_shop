@echo off
cd /d "%~dp0"
if not exist ".next\BUILD_ID" call npm.cmd run build
if errorlevel 1 (
  pause
  exit /b 1
)
call npm.cmd run start
pause
