@echo off
echo Checking Node.js installation...

REM Check common Node.js installation paths
if exist "C:\Program Files\nodejs\node.exe" (
    echo Found Node.js at C:\Program Files\nodejs
    setx PATH "%PATH%;C:\Program Files\nodejs" /M
    echo Added to PATH. Please restart Command Prompt.
) else if exist "C:\Program Files (x86)\nodejs\node.exe" (
    echo Found Node.js at C:\Program Files (x86)\nodejs
    setx PATH "%PATH%;C:\Program Files (x86)\nodejs" /M
    echo Added to PATH. Please restart Command Prompt.
) else (
    echo Node.js not found. Please install from https://nodejs.org
)

pause
