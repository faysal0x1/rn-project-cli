@echo off
REM React Native Project Creator - Batch wrapper for WebStorm
REM Usage: rn-create.bat <project-name> [--no-install] [--template <template-name>]

setlocal enabledelayedexpansion

set PROJECT_NAME=%~1
if "%PROJECT_NAME%"=="" (
    echo React Native Project Creator
    echo Usage: rn-create.bat ^<project-name^> [--no-install] [--template ^<template^>]
    echo.
    echo Examples:
    echo   rn-create.bat my-app
    echo   rn-create.bat my-app --no-install
    echo   rn-create.bat my-app --template tabs
    exit /b 0
)

REM Check if Node.js CLI is installed globally
where rn-create >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    REM Use global CLI if available
    rn-create %*
    exit /b %ERRORLEVEL%
)

REM Fallback to direct npx call
set NPX_PATH="C:\Program Files\PhpWebStudy-Data\env\node\npx.cmd"

REM Build command
set CMD=%NPX_PATH% --yes create-expo-app@latest %PROJECT_NAME%

REM Parse arguments
set HAS_NO_INSTALL=0
set TEMPLATE_VALUE=
set NEXT_IS_TEMPLATE=0

for %%A in (%*) do (
    if !NEXT_IS_TEMPLATE! EQU 1 (
        set TEMPLATE_VALUE=%%A
        set NEXT_IS_TEMPLATE=0
    ) else (
        if "%%A"=="--no-install" (
            set HAS_NO_INSTALL=1
        )
        if "%%A"=="--template" (
            set NEXT_IS_TEMPLATE=1
        )
    )
)

if !HAS_NO_INSTALL! EQU 1 (
    set CMD=!CMD! --no-install
)

if not "!TEMPLATE_VALUE!"=="" (
    set CMD=!CMD! --template !TEMPLATE_VALUE!
)

echo Creating React Native/Expo project: %PROJECT_NAME%
%CMD%

endlocal
