@echo off
setlocal
echo NightEye Premium - Test Launcher
echo ----------------------------------------

:: Find Chrome
set "CHROME_PATH="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"

if not defined CHROME_PATH (
    :: Try finding in PATH
    for %%X in (chrome.exe) do (set FOUND=%%~$PATH:X)
    if defined FOUND set "CHROME_PATH=chrome.exe"
)

if not defined CHROME_PATH (
    echo Error: Google Chrome not found!
    echo Please ensure Chrome is installed.
    pause
    exit /b 1
)

echo Found Chrome at: "%CHROME_PATH%"

echo Closing existing Chrome instances...
taskkill /F /IM chrome.exe /T >nul 2>&1

:: Get absolute path to current directory without trailing slash
set "EXT_DIR=%~dp0"
:: Remove trailing backslash if present
if "%EXT_DIR:~-1%"=="\" set "EXT_DIR=%EXT_DIR:~0,-1%"

echo Launching Chrome with extension from: "%EXT_DIR%"
"%CHROME_PATH%" --load-extension="%EXT_DIR%" https://www.google.com

echo Done.
pause
