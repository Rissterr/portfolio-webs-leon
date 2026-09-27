@echo off
cd /d "C:\Users\Dopp\Documents\TRABAJO\Webs\Protafolio Personal Git"
start "Claude Code Preview" cmd /c "npx vite preview --port 4174"
timeout /t 2 /nobreak >nul
start http://localhost:4174
