@echo off
chcp 65001 >nul
echo.
echo  Iniciando servidor de desarrollo...
echo.

cd "C:\Users\Dopp\Documents\WEBS Leon\Protafolio Personal Git"
start http://localhost:5173
npm run dev
