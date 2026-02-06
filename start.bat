@echo off
REM ReMake Startup Script for Windows - FREE Firebase Tier

echo 🚀 Starting ReMake (FREE Firebase Tier)
echo =========================================
echo.

echo Checking Firebase login...
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not logged in to Firebase
    echo Please run: firebase login
    echo Then run this script again.
    pause
    exit /b 1
)
echo ✅ Firebase login OK
echo.

echo Setting Firebase project...
firebase use remakevle
echo ✅ Firebase project set
echo.

echo Checking emulator ports...
REM Check if ports are in use (simplified check)
netstat -an | find "8080" >nul 2>&1
if %errorlevel% equ 0 (
    echo ❌ Port 8080 (Firestore) is already in use
    echo Please close the application using this port
    pause
    exit /b 1
)
echo ✅ Ports available
echo.

echo Starting Firebase emulators...
echo This will start: Firestore (8080), Auth (9099), Storage (9199), Hosting (5001)
echo.
firebase emulators:start
echo.
echo If emulators started successfully, open a new terminal and run:
echo npm run dev
echo.
echo Then visit: http://localhost:3000
echo.

pause