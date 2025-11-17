# Guide d'Installation

Ce guide vous explique comment installer et lancer l'application Help Desk en développement ou en production.

## Prérequis

- **Docker** et **Docker Compose** (pour le déploiement containerisé)
- **Git** (pour cloner le dépôt)
- **Node.js 18+** (pour le développement local du Frontend)
- **Python 3.11+** (pour le développement local du Backend)

## Installation Rapide avec Docker Compose

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-organisation/help-desk-devops.git
cd help-desk-devops
```

### 2. Démarrer les services

```bash
docker-compose -f infra/docker-compose.yml up -d
```

### 3. Vérifier le statut

```bash
docker-compose -f infra/docker-compose.yml ps
```

### 4. Accéder à l'application

- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:8000
- **Swagger UI :** http://localhost:8000/docs

### 5. Identifiants de démonstration

- **Email :** admin@helpdesk.local
- **Mot de passe :** admin123

## Installation en Développement Local

### Backend (FastAPI)

#### 1. Configurer l'environnement

```bash
cd backend
cp .env.example .env
```

#### 2. Créer un environnement virtuel Python

```bash
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

#### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

#### 4. Configurer la base de données

Assurez-vous que PostgreSQL est en cours d'exécution sur `localhost:5432`.

#### 5. Lancer le serveur

```bash
uvicorn app.main:app --reload --port 8000
```

Le serveur sera accessible à http://localhost:8000

### Frontend (React)

#### 1. Configurer l'environnement

```bash
cd frontend
cp .env.example .env.local
```

#### 2. Installer les dépendances

```bash
npm install --legacy-peer-deps
```

#### 3. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible à http://localhost:3000

## Configuration de la Base de Données

### Avec Docker

La base de données PostgreSQL est automatiquement initialisée avec les utilisateurs de démonstration.

### En Développement Local

#### 1. Installer PostgreSQL

```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Windows
# Télécharger depuis https://www.postgresql.org/download/windows/
```

#### 2. Créer la base de données

```bash
createdb helpdesk_db
```

#### 3. Créer l'utilisateur

```bash
createuser helpdesk_user
```

#### 4. Définir le mot de passe

```bash
psql -c "ALTER USER helpdesk_user WITH PASSWORD 'helpdesk_password';"
```

#### 5. Accorder les permissions

```bash
psql -c "GRANT ALL PRIVILEGES ON DATABASE helpdesk_db TO helpdesk_user;"
```

## Vérification de l'Installation

### Vérifier la santé du Backend

```bash
curl http://localhost:8000/health
```

Réponse attendue :
```json
{"status": "ok"}
```

### Vérifier l'accès à l'API Swagger

Visitez http://localhost:8000/docs dans votre navigateur.

### Vérifier la connexion Frontend

Visitez http://localhost:3000 dans votre navigateur et essayez de vous connecter avec les identifiants de démonstration.

## Dépannage

### Erreur de connexion à la base de données

**Symptôme :** `psycopg2.OperationalError: could not connect to server`

**Solution :**
1. Vérifier que PostgreSQL est en cours d'exécution
2. Vérifier les paramètres de connexion dans `.env`
3. Vérifier que l'utilisateur et la base de données existent

### Port déjà utilisé

**Symptôme :** `Address already in use`

**Solution :**
```bash
# Trouver le processus utilisant le port
lsof -i :8000  # Backend
lsof -i :3000  # Frontend

# Terminer le processus
kill -9 <PID>
```

### Erreur d'authentification

**Symptôme :** `Invalid email or password`

**Solution :**
1. Vérifier les identifiants (admin@helpdesk.local / admin123)
2. Réinitialiser la base de données si nécessaire

## Arrêter les services

```bash
docker-compose -f infra/docker-compose.yml down
```

Pour supprimer aussi les volumes (données) :

```bash
docker-compose -f infra/docker-compose.yml down -v
```

## Prochaines étapes

- Consulter la [Spécification API](API_SPECIFICATION.md)
- Consulter la [Documentation Architecture](ARCHITECTURE.md)
- Consulter le [Guide de Contribution](CONTRIBUTION.md)
