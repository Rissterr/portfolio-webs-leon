@echo off
chcp 65001 >nul
echo.
echo  Publicando tu portafolio...
echo.

cd "C:\Users\Dopp\Documents\WEBS Leon\Protafolio Personal Git"

git add .
git commit -m "Actualizacion %date% %time%"
git push

echo.
echo  Listo! Tu portafolio se esta publicando.
echo  En 1 minuto estara en vivo.
echo.
pause
