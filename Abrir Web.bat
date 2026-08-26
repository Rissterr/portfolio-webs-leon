@echo off
cd /d "C:\Users\Dopp\.gemini\antigravity-ide\scratch\portfolio-dev"
start "Antigravity Dev" cmd /c "npm run dev"
timeout /t 3 /nobreak >nul
start http://localhost:5173
