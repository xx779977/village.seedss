@echo off
echo Starting Village Seeds Backend Server...
echo.
echo Please make sure you have Node.js installed
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please make sure you are in the correct directory
    pause
    exit /b 1
)

echo package.json found
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo Dependencies installed successfully
    echo.
)

REM Start the server
echo Starting server on port 3000...
echo.
echo Server will be available at: http://localhost:3000
echo API endpoints: http://localhost:3000/api/products
echo.
echo Press Ctrl+C to stop the server
echo.

npm start

pause
