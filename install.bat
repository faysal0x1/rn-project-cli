@echo off
REM One-click installer for rn-project-cli
echo ========================================
echo React Native Project CLI - Installer
echo ========================================
echo.

REM Check if Node.js is available
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not found in PATH.
    echo Please install Node.js or add it to your PATH.
    pause
    exit /b 1
)

echo [1/3] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Failed to install local dependencies. Continuing anyway...
)

echo.
echo [2/3] Installing CLI globally...
call npm install -g .
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install CLI globally.
    echo Try running as Administrator: npm install -g .
    pause
    exit /b 1
)

echo.
echo [3/3] Verifying installation...
where rn-create >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] CLI installed successfully!
) else (
    echo [WARNING] CLI may not be in PATH. You can still use rn-create.bat
)
echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Usage:
echo   rn-create ^<project-name^> [--no-install] [--template ^<template^>]
echo.
echo Examples:
echo   rn-create my-app
echo   rn-create my-app --no-install
echo   rn-create my-app --template tabs
echo.
echo For WebStorm setup instructions, see README.md
echo.
pause
