@echo off
echo Rebuilding client application...

rem Navigate to client directory
cd client

rem Install dependencies if needed
echo Installing dependencies...
call npm install

rem Build the application
echo Building the application...
call npm run build

echo Build completed!

rem Return to root directory
cd ..

echo Client application has been rebuilt successfully.
pause
