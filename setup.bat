@echo off
REM MicroBlog Setup Script for Windows
REM This script installs all dependencies and provides setup instructions

echo ==============================
echo  MicroBlog - Setup Script
echo ==============================
echo.

REM Check Node.js installation
where node >nul 2>nul
if errorlevel 1 (
    echo Error: Node.js not found. Please install Node.js v14 or higher
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i

echo Node.js %NODE_VERSION%
echo npm %NPM_VERSION%
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
cd ..
echo Backend dependencies installed
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo Frontend dependencies installed
echo.

echo ==============================
echo Setup Complete!
echo ==============================
echo.
echo To run the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm start
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm start
echo.
echo Then open: http://localhost:3000
echo.
pause
