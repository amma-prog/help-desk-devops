# Guide Complet : Importer Help Desk sur Windows 11

Ce guide vous explique comment cloner et lancer l'application Help Desk sur votre PC Windows 11.

## Prérequis Vérifiés ✅

Vous avez déjà installé :
- Git
- Docker Desktop
- Node.js
- Python

## ÉTAPE 1 : Cloner le Projet depuis GitHub

### 1.1 Ouvrir PowerShell ou Command Prompt

1. Appuyez sur **Windows + R**
2. Tapez `powershell` et appuyez sur **Entrée**

### 1.2 Naviguer vers le dossier où vous voulez le projet

```powershell
# Exemple : créer un dossier Projets sur le Bureau
cd C:\Users\VotreNomUtilisateur\Desktop
mkdir Projets
cd Projets
```

### 1.3 Cloner le dépôt GitHub

**Option A : Si vous avez créé un dépôt GitHub personnel**

```powershell
git clone https://github.com/votre-username/help-desk-devops.git
cd help-desk-devops
```

**Option B : Utiliser le projet fourni (sans GitHub)**

Si vous n'avez pas de dépôt GitHub, je vais vous créer un fichier ZIP à télécharger.

### 1.4 Vérifier que le projet est bien cloné

```powershell
dir
```

Vous devriez voir un dossier `help-desk-devops` avec les sous-dossiers : `backend`, `frontend`, `docs`, `infra`.

---

## ÉTAPE 2 : Vérifier Docker Desktop

### 2.1 Lancer Docker Desktop

1. Appuyez sur **Windows**
2. Tapez `Docker Desktop` et lancez l'application
3. Attendez que Docker soit prêt (vous verrez une icône Docker dans la barre des tâches)

### 2.2 Vérifier que Docker fonctionne

Dans PowerShell, tapez :

```powershell
docker --version
docker-compose --version
```

Vous devriez voir les versions affichées.

---

## ÉTAPE 3 : Lancer l'Application avec Docker Compose

### 3.1 Naviguer vers le dossier du projet

```powershell
cd C:\Users\VotreNomUtilisateur\Desktop\Projets\help-desk-devops
```

### 3.2 Lancer les services

```powershell
docker-compose -f infra/docker-compose.yml up -d
```

**Explication :**
- `docker-compose` : Outil pour lancer plusieurs conteneurs
- `-f infra/docker-compose.yml` : Fichier de configuration
- `up` : Démarrer les services
- `-d` : Mode détaché (ne pas afficher les logs en direct)

### 3.3 Attendre le démarrage (2-3 minutes)

Les services vont se télécharger et démarrer :
- PostgreSQL (base de données)
- Backend (API FastAPI)
- Frontend (React avec Nginx)

### 3.4 Vérifier que tout fonctionne

```powershell
docker-compose -f infra/docker-compose.yml ps
```

Vous devriez voir 3 conteneurs avec le statut `Up` :

```
NAME                    STATUS
helpdesk-postgres       Up 2 minutes
helpdesk-backend        Up 2 minutes
helpdesk-frontend       Up 2 minutes
```

---

## ÉTAPE 4 : Accéder à l'Application

### 4.1 Ouvrir votre navigateur

Ouvrez **Google Chrome**, **Firefox** ou **Edge**.

### 4.2 Accéder aux services

Tapez ces adresses dans la barre d'adresse :

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend** | http://localhost:3000 | Interface utilisateur |
| **Backend API** | http://localhost:8000 | API REST |
| **Swagger UI** | http://localhost:8000/docs | Documentation interactive |

### 4.3 Se connecter

**Page de connexion :**
- Allez sur http://localhost:3000
- Vous verrez un formulaire de connexion

**Identifiants de démonstration :**
- Email : `admin@helpdesk.local`
- Mot de passe : `admin123`

Cliquez sur **Se connecter**.

---

## ÉTAPE 5 : Tester l'Application

### 5.1 Tableau de Bord

Après connexion, vous verrez :
- Liste des tickets
- Bouton "+ Nouveau Ticket"
- Filtre par statut

### 5.2 Créer un Ticket

1. Cliquez sur **+ Nouveau Ticket**
2. Remplissez :
   - **Titre** : "Mon premier ticket"
   - **Description** : "Ceci est un test"
   - **Priorité** : Sélectionnez une priorité
3. Cliquez sur **Créer le ticket**

### 5.3 Voir les Détails

1. Cliquez sur le ticket créé
2. Vous verrez :
   - Les détails du ticket
   - Un formulaire pour ajouter des commentaires
   - Possibilité de changer le statut

---

## ÉTAPE 6 : Arrêter l'Application

Quand vous avez terminé, arrêtez les services :

```powershell
docker-compose -f infra/docker-compose.yml down
```

**Pour supprimer aussi les données :**

```powershell
docker-compose -f infra/docker-compose.yml down -v
```

---

## ÉTAPE 7 : Développement Local (Optionnel)

Si vous voulez modifier le code et développer localement :

### 7.1 Backend (FastAPI)

```powershell
# Naviguer vers le dossier backend
cd backend

# Créer un environnement virtuel Python
python -m venv venv

# Activer l'environnement (Windows)
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
uvicorn app.main:app --reload --port 8000
```

Le backend sera accessible à http://localhost:8000

### 7.2 Frontend (React)

**Dans une autre fenêtre PowerShell :**

```powershell
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install --legacy-peer-deps

# Lancer le serveur de développement
npm run dev
```

Le frontend sera accessible à http://localhost:5173

---

## Dépannage

### Problème : Docker Desktop ne démarre pas

**Solution :**
1. Redémarrez votre PC
2. Lancez Docker Desktop à nouveau
3. Vérifiez que la virtualisation est activée dans le BIOS

### Problème : Port 3000 ou 8000 déjà utilisé

**Solution :**
```powershell
# Trouver le processus utilisant le port
netstat -ano | findstr :3000

# Terminer le processus (remplacer PID par le numéro)
taskkill /PID <PID> /F
```

### Problème : "docker-compose not found"

**Solution :**
```powershell
# Vérifier que Docker Desktop est bien lancé
docker --version
docker-compose --version

# Si ça ne marche pas, réinstallez Docker Desktop
```

### Problème : Les conteneurs ne démarrent pas

**Solution :**
```powershell
# Voir les logs d'erreur
docker-compose -f infra/docker-compose.yml logs

# Reconstruire les images
docker-compose -f infra/docker-compose.yml build --no-cache
docker-compose -f infra/docker-compose.yml up -d
```

### Problème : Impossible de se connecter

**Solution :**
1. Vérifiez que les 3 conteneurs sont en cours d'exécution : `docker-compose -f infra/docker-compose.yml ps`
2. Attendez 30 secondes après le lancement
3. Rafraîchissez la page (Ctrl + F5)
4. Essayez les identifiants : admin@helpdesk.local / admin123

---

## Commandes Utiles

### Voir les logs

```powershell
# Tous les logs
docker-compose -f infra/docker-compose.yml logs

# Logs du backend uniquement
docker-compose -f infra/docker-compose.yml logs backend

# Logs du frontend uniquement
docker-compose -f infra/docker-compose.yml logs frontend

# Logs en direct (Ctrl+C pour arrêter)
docker-compose -f infra/docker-compose.yml logs -f
```

### Redémarrer les services

```powershell
# Arrêter et redémarrer
docker-compose -f infra/docker-compose.yml restart

# Arrêter complètement
docker-compose -f infra/docker-compose.yml down

# Redémarrer avec reconstruction
docker-compose -f infra/docker-compose.yml down
docker-compose -f infra/docker-compose.yml up -d
```

### Accéder à un conteneur

```powershell
# Accéder au backend
docker-compose -f infra/docker-compose.yml exec backend bash

# Accéder à la base de données
docker-compose -f infra/docker-compose.yml exec postgres psql -U helpdesk_user -d helpdesk_db
```

---

## Prochaines Étapes

1. **Explorez l'application :** Créez plusieurs tickets, testez les commentaires
2. **Consultez la documentation :** Lisez les fichiers dans le dossier `docs/`
3. **Modifiez le code :** Lancez le développement local (Étape 7)
4. **Créez un dépôt GitHub :** Poussez votre code sur GitHub

---

## Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. Vérifiez que Docker Desktop est lancé
2. Vérifiez les logs : `docker-compose -f infra/docker-compose.yml logs`
3. Consultez la section "Dépannage" ci-dessus
4. Redémarrez les services : `docker-compose -f infra/docker-compose.yml down && docker-compose -f infra/docker-compose.yml up -d`

---

**Bon développement ! 🚀**
