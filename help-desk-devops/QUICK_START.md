# Démarrage Rapide - Help Desk

## Pour Windows 11 (Méthode Rapide)

### Étape 1 : Cloner le projet

```powershell
# Ouvrir PowerShell et aller dans le dossier où vous voulez le projet
cd C:\Users\VotreNomUtilisateur\Desktop

# Cloner le projet
git clone https://github.com/votre-username/help-desk-devops.git
cd help-desk-devops
```

### Étape 2 : Lancer Docker Desktop

1. Appuyez sur **Windows**
2. Tapez `Docker Desktop`
3. Lancez l'application
4. Attendez que Docker soit prêt

### Étape 3 : Lancer l'application

**Option A : Avec le script (Plus facile)**

Double-cliquez sur : `scripts/start-windows.bat`

**Option B : Avec PowerShell**

```powershell
docker-compose -f infra/docker-compose.yml up -d
```

### Étape 4 : Accéder à l'application

Ouvrez votre navigateur et allez à :

**http://localhost:3000**

### Étape 5 : Se connecter

- Email : `admin@helpdesk.local`
- Mot de passe : `admin123`

---

## Pour Arrêter

**Option A : Avec le script**

Double-cliquez sur : `scripts/stop-windows.bat`

**Option B : Avec PowerShell**

```powershell
docker-compose -f infra/docker-compose.yml down
```

---

## Accès aux Services

| Service | URL |
| :--- | :--- |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Documentation API | http://localhost:8000/docs |

---

## Besoin d'Aide ?

Consultez le guide complet : `GUIDE_WINDOWS_11.md`

---

**C'est tout ! L'application est prête à l'emploi ! 🚀**
