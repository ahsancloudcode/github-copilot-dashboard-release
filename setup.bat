@echo off
REM Generate random password for NUXT_SESSION_PASSWORD
REM This script creates .env-copy with MOCK DATA enabled by default

setlocal enabledelayedexpansion

echo Generating .env-copy with random password...

REM Generate 32 random characters
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set random_string=!mydate!!mytime!%RANDOM%

REM Create .env.local with MOCK DATA ENABLED
(
    echo # GitHub Copilot Prompts Dashboard - Configuration
    echo # Auto-generated: %date% %time%
    echo.
    echo # Session Password (Auto-generated - Required^)
    echo NUXT_SESSION_PASSWORD=!random_string!
    echo.
    echo # Data Source - MOCK DATA ENABLED by default
    echo # Change to 'false' only if you have valid GitHub token
    echo NUXT_PUBLIC_IS_DATA_MOCKED=true
    echo.
    echo # GitHub API Token (Optional - only for real data^)
    echo # Get from: https://github.com/settings/tokens
    echo NUXT_GITHUB_TOKEN=
    echo.
    echo # Organization Name (Optional^)
    echo NUXT_PUBLIC_GITHUB_ORG=
) > .env.local

echo.
echo [OK] .env.local created successfully!
echo.
echo Session Password: !random_string!
echo Mock Data: ENABLED (using demo data)
echo.
echo Next steps:
echo   1. Run: npm install
echo   2. Run: npm run dev
echo   3. Open: http://localhost:3000/
echo.
echo Tips:
echo   - Dashboard uses MOCK DATA by default (perfect for testing^)
echo   - To use real GitHub data, edit .env.local and add token
echo   - Then set NUXT_PUBLIC_IS_DATA_MOCKED=false
echo   - Get token: https://github.com/settings/tokens
