@echo off
REM GitHub Copilot Dashboard - Auto Setup & Run Script
REM This script automatically downloads, configures, and runs the dashboard
REM Works seamlessly when installed via VS Code Extension

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   GitHub Copilot Dashboard - One-Click Setup                  ║
echo ║   Powered by github-copilot-prompts Extension                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo Please download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Detect if we're already in the release repo
if exist ".output\server\index.mjs" (
    echo ✅ Release repository detected!
    call :configure_and_run
    exit /b 0
)

REM Create temporary directory for download
set TEMP_DIR=%TEMP%\copilot-dashboard-setup-%RANDOM%
mkdir "%TEMP_DIR%" 2>nul

echo 📥 Downloading GitHub Copilot Dashboard Release...
echo    Repository: https://github.com/ahsancloudcode/github-copilot-dashboard-release
echo.

REM Clone the repository
cd /d "%TEMP_DIR%"
git clone https://github.com/ahsancloudcode/github-copilot-dashboard-release . 2>nul

if errorlevel 1 (
    echo ❌ Failed to download repository!
    echo Please ensure:
    echo   1. Git is installed: https://git-scm.com/
    echo   2. You have internet connection
    echo.
    pause
    exit /b 1
)

echo ✅ Repository downloaded successfully!
echo.

REM Check for pre-built server
if not exist ".output.zip" (
    echo ❌ Pre-built server not found!
    echo Please download the release with .output.zip file
    pause
    exit /b 1
)

echo 📦 Extracting pre-built server...
powershell -NoProfile -Command "Expand-Archive -Path '.output.zip' -DestinationPath '.' -Force" 2>nul

if not exist ".output\server\index.mjs" (
    echo ❌ Failed to extract server!
    pause
    exit /b 1
)

echo ✅ Server extracted successfully!
echo.

call :configure_and_run
exit /b 0

:configure_and_run
echo.
echo 🔧 Configuration Setup
echo ════════════════════════════════════════
echo.

REM Check if .env.local already exists
if exist ".env.local" (
    echo ✅ .env.local found! Using existing configuration...
    echo.
) else (
    echo Creating .env.local configuration...
    echo.
    
    REM Generate session password
    for /f "tokens=1-4 delims=:/.,-" %%a in ('wmic os get LocalDateTime ^| findstr [0-9]') do (
        set TIMESTAMP=%%a%%b%%c%%d
    )
    set SESSION_PASSWORD=cpwd_%TIMESTAMP%_!random!!random!
    
    REM Create .env.local
    (
        echo NUXT_SESSION_PASSWORD=!SESSION_PASSWORD!
        echo NUXT_PUBLIC_GITHUB_ORG=your-github-org
        echo NUXT_GITHUB_TOKEN=
        echo NUXT_PUBLIC_IS_DATA_MOCKED=false
        echo NUXT_PUBLIC_SCOPE=organization
    ) > .env.local
    
    echo.
    echo 📝 Configuration file created: .env.local
    echo.
    echo ⚠️  IMPORTANT - Add your GitHub credentials:
    echo ────────────────────────────────────────────
    echo.
    echo 1. Get GitHub Token:
    echo    a. Go to: https://github.com/settings/tokens
    echo    b. Click: Generate new token (classic)
    echo    c. Select scopes: copilot, manage_billing:copilot, read:org, read:enterprise
    echo    d. Copy the token
    echo.
    echo 2. Edit .env.local:
    echo    a. Open: .env.local (in your project folder)
    echo    b. Replace "your-github-org" with your organization name
    echo    c. Paste your GitHub token in NUXT_GITHUB_TOKEN
    echo.
    echo 3. Save and restart this script
    echo.
    echo Note: Generated session password: !SESSION_PASSWORD!
    echo.
    
    REM Ask user to configure
    set /p CONTINUE="Have you added your GitHub credentials? (yes/no): "
    if /i not "!CONTINUE!"=="yes" (
        echo ℹ️  To test without GitHub token, set NUXT_PUBLIC_IS_DATA_MOCKED=true in .env.local
        echo.
    )
)

REM Verify .env.local has GitHub token (unless in mock mode)
if not exist ".env.local" (
    echo ❌ .env.local not found!
    pause
    exit /b 1
)

REM Check for NUXT_GITHUB_TOKEN
findstr /M "NUXT_GITHUB_TOKEN" .env.local >nul
if errorlevel 1 (
    echo ⚠️  NUXT_GITHUB_TOKEN not found in .env.local
)

echo.
echo 🚀 Starting GitHub Copilot Dashboard...
echo.
echo ════════════════════════════════════════
echo Dashboard will open at: http://localhost:3000
echo Repository: https://github.com/ahsancloudcode/github-copilot-dashboard-release
echo ════════════════════════════════════════
echo.

REM Start the dashboard
timeout /t 2 /nobreak

REM Open browser
start http://localhost:3000 >nul 2>&1

REM Run the server
if exist ".output\server\index.mjs" (
    node .output\server\index.mjs
) else (
    echo ❌ Server not found at .output\server\index.mjs
    pause
    exit /b 1
)

exit /b 0
