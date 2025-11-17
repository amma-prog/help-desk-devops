@echo off
REM Script d'arrêt pour Windows 11
REM Arrête l'application Help Desk

echo ========================================
echo Help Desk - Arrêt des services
echo ========================================
echo.

cd /d "%~dp0.."

echo Arrêt des services...
docker-compose -f infra/docker-compose.yml down

echo.
echo ========================================
echo Services arrêtés avec succès
echo ========================================
echo.

pause
