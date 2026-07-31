@echo off
echo ================================================
echo GitHub Copilot API Server with Usage Viewer
echo ================================================
echo.

if not exist node_modules (
    echo Installing dependencies...
    bun install
    echo.
)

echo Starting server...
echo The usage viewer page will open automatically after the server starts
echo.

start "" "http://localhost:4141/dashboard"
bun run dev

pause
