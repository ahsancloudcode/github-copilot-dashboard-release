@echo off
REM Generate random password for NUXT_SESSION_PASSWORD
REM This script creates a secure .env-copy file

setlocal enabledelayedexpansion

echo Generating .env-copy with random password...

REM Generate 32 random characters
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set random_string=!mydate!!mytime!%RANDOM%

REM Create .env-copy with generated password
(
    echo # GitHub Copilot Prompts Dashboard - Configuration
    echo # Auto-generated: %date% %time%
    echo.
    echo # Session Password (Auto-generated - Required^)
    echo NUXT_SESSION_PASSWORD=!random_string!
    echo.
    echo # GitHub API Token (Optional^)
    echo # Get from: https://github.com/settings/tokens
    echo NUXT_GITHUB_TOKEN=
    echo.
    echo # Organization Name (Optional^)
    echo NUXT_PUBLIC_GITHUB_ORG=
    echo.
    echo # Data Source (Optional - set to 'true' for demo mode^)
    echo NUXT_PUBLIC_IS_DATA_MOCKED=false
) > .env-copy

echo ✓ .env-copy created with password: !random_string!
echo.
echo Next steps:
echo   1. (Optional^) Edit .env-copy to add GitHub token
echo   2. Run: npm install
echo   3. Run: npm run dev
echo   4. Open: http://localhost:3001/
