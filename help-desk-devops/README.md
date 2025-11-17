# Help Desk - Système de Gestion de Tickets

Une application complète de gestion de tickets (Help Desk) développée avec une architecture DevOps collaborative, incluant un Backend FastAPI, un Frontend React/TypeScript, et un pipeline CI/CD sécurisé.

## 📋 Table des Matières

- [Objectif](#objectif)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du Projet](#structure-du-projet)
- [Équipe et Rôles](#équipe-et-rôles)
- [Pipeline CI/CD](#pipeline-cicd)
- [Sécurité](#sécurité)

## 🎯 Objectif

Développer un système de gestion de tickets (Help Desk) permettant aux utilisateurs de soumettre des tickets, aux agents de les gérer (assignation, statut, commentaires), et d'assurer une traçabilité complète des actions.

## 🏗️ Architecture

L'application adopte une architecture **Microservices/Orientée Services** avec une séparation claire entre le Frontend et le Backend (API).

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React/TS)                  │
│                   (Port 3000)                           │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────┐
│                  Backend (FastAPI)                      │
│                   (Port 8000)                           │
└────────────────────┬────────────────────────────────────┘
                     │ SQL
┌────────────────────▼────────────────────────────────────┐
│                 PostgreSQL Database                     │
│                   (Port 5432)                           │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Technologies

| Composant | Technologie | Justification |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript + Vite | Performance, écosystème riche, typage fort |
| **Backend** | Python 3.11 + FastAPI | Performances élevées, documentation API auto, typage fort |
| **Base de Données** | PostgreSQL 15 | Robustesse, fiabilité, standards DevOps |
| **Conteneurisation** | Docker | Portabilité et reproductibilité |
| **Orchestration** | Docker Compose | Orchestration locale |
| **CI/CD** | GitHub Actions | Intégration native, pipelines automatisés |
| **Sécurité** | Bandit, Trivy, OWASP ZAP | Tests de sécurité automatisés |

## 📦 Installation

### Prérequis

- Docker et Docker Compose
- Git
- Node.js 18+ (pour le développement local)
- Python 3.11+ (pour le développement local)

### Lancement avec Docker Compose

```bash
# Cloner le dépôt
git clone https://github.com/votre-organisation/help-desk-devops.git
cd help-desk-devops

# Démarrer les services
docker-compose -f infra/docker-compose.yml up -d

# Vérifier le statut
docker-compose -f infra/docker-compose.yml ps
```

L'application sera accessible à :
- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:8000
- **Swagger UI :** http://localhost:8000/docs

### Lancement en Développement Local

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🚀 Utilisation

### Accès à l'Application

1. Ouvrez http://localhost:3000 dans votre navigateur
2. Connectez-vous avec les identifiants par défaut :
   - **Email :** admin@helpdesk.local
   - **Mot de passe :** admin123

### Fonctionnalités Principales

- **Authentification :** Connexion sécurisée avec JWT
- **Création de Tickets :** Soumettre de nouveaux tickets
- **Tableau de Bord :** Vue d'ensemble des tickets
- **Gestion des Tickets :** Assigner, modifier le statut, ajouter des commentaires
- **Historique :** Traçabilité complète des actions

## 📁 Structure du Projet

```
/help-desk-devops
├── .github/
│   └── workflows/           # Configuration CI/CD (GitHub Actions)
├── backend/
│   ├── app/
│   │   ├── main.py         # Point d'entrée FastAPI
│   │   ├── models.py       # Modèles de données (SQLAlchemy)
│   │   ├── schemas.py      # Schémas Pydantic
│   │   ├── database.py     # Configuration de la base de données
│   │   ├── auth.py         # Authentification JWT
│   │   └── routes/
│   │       ├── auth.py     # Endpoints d'authentification
│   │       ├── tickets.py  # Endpoints de tickets
│   │       └── users.py    # Endpoints d'utilisateurs
│   ├── tests/              # Tests unitaires et d'intégration
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # Composants React réutilisables
│   │   ├── pages/          # Pages principales
│   │   ├── services/       # Services API
│   │   ├── types/          # Types TypeScript
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
├── docs/                   # Documentation
├── infra/
│   ├── docker-compose.yml  # Orchestration locale
│   └── kubernetes/         # Fichiers Kubernetes (futur)
├── scripts/                # Scripts utilitaires
├── .gitignore
└── README.md
```

## 👥 Équipe et Rôles

L'équipe est composée de 5 membres, chacun ayant un rôle spécialisé :

| Rôle | Responsabilités |
| :--- | :--- |
| **Développeur Backend** | API FastAPI, base de données, authentification |
| **Développeur Frontend** | Interface utilisateur React, intégration API |
| **Ingénieur DevOps** | CI/CD, Docker, infrastructure, déploiement |
| **Ingénieur Qualité & Test** | Tests, sécurité, qualité du code |
| **Documentaliste & Support** | Documentation, guides utilisateur, support |

## 🔄 Pipeline CI/CD

Le pipeline CI/CD est configuré via GitHub Actions et comprend les étapes suivantes :

1. **Build & Lint :** Vérification de la qualité du code
2. **Tests :** Exécution des tests unitaires et d'intégration
3. **Sécurité :** Analyse des vulnérabilités (SAST, SCA, Scan Docker)
4. **Docker Build :** Construction des images conteneurisées
5. **Déploiement :** Déploiement sur l'environnement cible

## 🔒 Sécurité

### Tests de Sécurité Intégrés

- **SAST (Bandit) :** Analyse statique du code Python
- **SCA (Dependabot) :** Analyse des dépendances
- **Scan Docker (Trivy) :** Scan des vulnérabilités dans les images
- **DAST (OWASP ZAP) :** Scan dynamique de l'application déployée

### Bonnes Pratiques

- Authentification JWT sécurisée
- Validation des entrées
- Hachage des mots de passe (bcrypt)
- CORS configuré correctement
- Variables d'environnement pour les secrets

## 📚 Documentation Supplémentaire

- [Guide d'Installation Détaillé](docs/INSTALLATION.md)
- [Spécification API](docs/API_SPECIFICATION.md)
- [Guide de Contribution](docs/CONTRIBUTION.md)
- [Architecture Technique](docs/ARCHITECTURE.md)

## 📝 Licence

Ce projet est sous licence MIT.

## 📧 Contact

Pour toute question ou suggestion, veuillez contacter l'équipe DevOps.
