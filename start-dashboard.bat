@echo off
setlocal enabledelayedexpansion

REM ============================================
REM GitHub Copilot Dashboard - Launcher
REM ============================================

title GitHub Copilot Dashboard

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║    GitHub Copilot Dashboard - Starting...          ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo ✗ ERROR: Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo Then try again.
    echo.
    pause
    exit /b 1
)

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0
set OUTPUT_DIR=%SCRIPT_DIR%.output

REM Check if .output directory exists
if not exist "%OUTPUT_DIR%" (
    echo ✗ ERROR: Production build not found
    echo Expected location: %OUTPUT_DIR%
    echo.
    echo Please ensure the .output directory exists.
    pause
    exit /b 1
)

REM Setup environment variables
set NODE_ENV=production
if not defined NUXT_SESSION_PASSWORD (
    for /f "tokens=1-5 delims=/: " %%d in ("%date% %time%") do (
        set NUXT_SESSION_PASSWORD=copilot-!random!-!random!-!random!
    )
)
set NUXT_PUBLIC_IS_DATA_MOCKED=true

REM Check for .env.local file
if exist "%SCRIPT_DIR%.env.local" (
    echo.
    echo ✓ Found .env.local - loading user credentials
    for /f "tokens=*" %%i in ('type "%SCRIPT_DIR%.env.local"') do (
        if not "%%i"=="" if not "%%i:~0,1%"=="#" (
            set "%%i"
        )
    )
    echo.
) else (
    echo.
    echo ⚠ No .env.local found - using mock data (sample data)
    echo.
    echo To use real GitHub data:
    echo 1. Create file: .env.local
    echo 2. Add line: NUXT_GITHUB_TOKEN=your_github_token
    echo 3. Save and restart this launcher
    echo.
    timeout /t 2 /nobreak
)

echo ℹ Starting dashboard server...
echo ℹ Opening dashboard at: http://localhost:3000
echo.

REM Start the server
node "%OUTPUT_DIR%\server\index.mjs"

if errorlevel 1 (
    echo.
    echo ✗ Server failed to start
    echo.
    pause
    exit /b 1
)

pause
