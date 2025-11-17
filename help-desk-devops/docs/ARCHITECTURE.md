# Architecture Technique

## Vue d'ensemble

L'application Help Desk est construite selon une architecture **Microservices/Orientée Services** avec une séparation claire entre le Frontend et le Backend.

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React/TS)                  │
│                   (Port 3000)                           │
│  - Authentification                                     │
│  - Tableau de bord                                      │
│  - Gestion des tickets                                  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST (JSON)
┌────────────────────▼────────────────────────────────────┐
│                  Backend (FastAPI)                      │
│                   (Port 8000)                           │
│  - API RESTful                                          │
│  - Authentification JWT                                 │
│  - Logique métier                                       │
└────────────────────┬────────────────────────────────────┘
                     │ SQL (Transactions)
┌────────────────────▼────────────────────────────────────┐
│                 PostgreSQL Database                     │
│                   (Port 5432)                           │
│  - Users                                                │
│  - Tickets                                              │
│  - Comments                                             │
└─────────────────────────────────────────────────────────┘
```

## Composants

### Frontend (React/TypeScript)

**Technologie :** React 18 + TypeScript + Vite

**Responsabilités :**
- Interface utilisateur
- Gestion de l'état (Zustand)
- Appels API
- Authentification côté client
- Routage (React Router)

**Structure :**
```
frontend/
├── src/
│   ├── components/       # Composants réutilisables
│   ├── pages/           # Pages principales
│   ├── services/        # Services API et store
│   ├── types/           # Types TypeScript
│   ├── styles/          # Fichiers CSS
│   ├── App.tsx          # Composant principal
│   └── main.tsx         # Point d'entrée
├── Dockerfile           # Image Docker
├── nginx.conf           # Configuration Nginx
└── package.json
```

### Backend (FastAPI)

**Technologie :** Python 3.11 + FastAPI + SQLAlchemy

**Responsabilités :**
- API RESTful
- Authentification JWT
- Gestion de la base de données
- Validation des données
- Logique métier

**Structure :**
```
backend/
├── app/
│   ├── main.py          # Application FastAPI
│   ├── database.py      # Configuration DB
│   ├── models.py        # Modèles SQLAlchemy
│   ├── schemas.py       # Schémas Pydantic
│   ├── auth.py          # Authentification JWT
│   └── routes/          # Endpoints API
│       ├── auth.py      # Routes d'authentification
│       └── tickets.py   # Routes de tickets
├── tests/               # Tests unitaires
├── Dockerfile
└── requirements.txt
```

### Base de Données (PostgreSQL)

**Technologie :** PostgreSQL 15

**Tables :**
- **users** : Utilisateurs de l'application
- **tickets** : Tickets de support
- **comments** : Commentaires sur les tickets

**Relations :**
```
users
  ├── tickets (1:N) - creator_id
  ├── tickets (1:N) - assigned_to_id
  └── comments (1:N) - author_id

tickets
  ├── users (N:1) - creator_id
  ├── users (N:1) - assigned_to_id
  └── comments (1:N) - ticket_id

comments
  ├── tickets (N:1) - ticket_id
  └── users (N:1) - author_id
```

## Flux d'Authentification

1. L'utilisateur se connecte via le formulaire de login
2. Le Frontend envoie les identifiants au Backend (`POST /api/auth/login`)
3. Le Backend vérifie les identifiants et génère un JWT
4. Le Frontend stocke le JWT dans le localStorage
5. Le JWT est inclus dans les headers `Authorization: Bearer <token>` pour les requêtes suivantes
6. Le Backend valide le JWT pour chaque requête protégée

## Flux de Création de Ticket

1. L'utilisateur remplit le formulaire de création de ticket
2. Le Frontend envoie les données au Backend (`POST /api/tickets/`)
3. Le Backend valide les données avec Pydantic
4. Le Backend crée le ticket dans la base de données
5. Le Backend retourne le ticket créé
6. Le Frontend met à jour la liste des tickets

## Sécurité

### Authentification
- JWT (JSON Web Tokens) avec signature HS256
- Tokens expirables (30 minutes par défaut)
- Stockage sécurisé du token côté client

### Autorisation
- Contrôle d'accès basé sur les rôles (Admin/User)
- Vérification des permissions pour chaque endpoint
- Utilisateurs ne peuvent modifier que leurs propres tickets

### Validation des Données
- Validation côté client (React)
- Validation côté serveur (Pydantic)
- Longueurs minimales/maximales
- Types de données stricts

### Hachage des Mots de Passe
- Algorithme bcrypt
- Salt automatique
- Vérification sécurisée

### CORS
- Configuration stricte des origines autorisées
- Méthodes HTTP limitées
- Headers sécurisés

## Déploiement

### Docker Compose (Développement/Staging)

```bash
docker-compose -f infra/docker-compose.yml up -d
```

### Kubernetes (Production - Futur)

Des fichiers Kubernetes seront ajoutés dans `infra/kubernetes/` pour le déploiement en production.

## Performance

### Frontend
- Lazy loading des routes
- Code splitting avec Vite
- Gzip compression avec Nginx
- Cache des ressources statiques

### Backend
- Connection pooling PostgreSQL
- Indexes sur les colonnes fréquemment interrogées
- Pagination des listes
- Caching des requêtes

### Base de Données
- Indexes sur les clés étrangères
- Indexes sur les colonnes de filtrage
- Partitioning des tables volumineuses (futur)

## Monitoring et Logging

### Backend
- Logs structurés
- Endpoint `/health` pour les health checks
- Métriques Prometheus (futur)

### Frontend
- Logs de débogage en développement
- Rapports d'erreurs (futur)

## Évolutivité

L'architecture est conçue pour être évolutive :
- Séparation Frontend/Backend permet le scaling indépendant
- Base de données centralisée
- API RESTful standard
- Support de Kubernetes pour orchestration

## Prochaines Évolutions

- Authentification OAuth2/OpenID Connect
- Notifications en temps réel (WebSockets)
- Recherche full-text
- Intégration avec systèmes externes
- Métriques et monitoring avancés
