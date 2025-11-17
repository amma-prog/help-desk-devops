@echo off
REM Script de démarrage pour Windows 11
REM Lance l'application Help Desk avec Docker Compose

echo ========================================
echo Help Desk - Démarrage sur Windows 11
echo ========================================
echo.

REM Vérifier que Docker est installé
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR : Docker n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Docker Desktop
    pause
    exit /b 1
)

REM Vérifier que Docker Desktop est lancé
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERREUR : Docker Desktop n'est pas lancé
    echo Veuillez lancer Docker Desktop avant de continuer
    pause
    exit /b 1
)

echo ✓ Docker est prêt
echo.

REM Naviguer vers le dossier du projet
cd /d "%~dp0.."

echo Démarrage des services...
echo.

REM Démarrer les services
docker-compose -f infra/docker-compose.yml up -d

if errorlevel 1 (
    echo ERREUR : Impossible de démarrer les services
    pause
    exit /b 1
)

echo.
echo ========================================
echo Services en cours de démarrage...
echo ========================================
echo.
echo Attendez 2-3 minutes pour que tout soit prêt
echo.

REM Attendre que les services soient prêts
timeout /t 5 /nobreak

REM Afficher le statut
echo.
echo Statut des services :
docker-compose -f infra/docker-compose.yml ps

echo.
echo ========================================
echo Accédez à l'application :
echo ========================================
echo.
echo Frontend  : http://localhost:3000
echo Backend   : http://localhost:8000
echo Swagger   : http://localhost:8000/docs
echo.
echo Identifiants de démonstration :
echo Email     : admin@helpdesk.local
echo Mot de passe : admin123
echo.
echo ========================================
echo.

REM Ouvrir le navigateur
start http://localhost:3000

pause
