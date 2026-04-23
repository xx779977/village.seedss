@echo off
echo ========================================
echo     VILLAGE SEEDS WEBSITE STARTER
echo ========================================
echo.

echo Step 1: Navigating to project directory...
cd /d "C:\Users\abhi\OneDrive\Desktop\REAL ESTATE"
echo Current directory: %CD%
echo.

echo Step 2: Checking MongoDB connection...
netstat -ano | findstr :27017 >nul
if %errorlevel% == 0 (
    echo MongoDB is already running
) else (
    echo Starting MongoDB service...
    net start MongoDB
)
echo.

echo Step 3: Starting Village Seeds website server...
echo Server will start on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

node server-new.js

echo.
echo ========================================
echo     SERVER STOPPED
echo ========================================
echo.
echo To restart: Double-click this file again
echo Website URL: http://localhost:3000
echo.
pause
