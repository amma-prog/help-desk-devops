# Spécification API

## Vue d'ensemble

L'API Help Desk est une API RESTful construite avec FastAPI. Elle fournit des endpoints pour gérer l'authentification, les tickets et les commentaires.

**URL de base :** `http://localhost:8000/api`

**Documentation interactive :** `http://localhost:8000/docs` (Swagger UI)

## Authentification

Tous les endpoints (sauf `/auth/login` et `/auth/register`) nécessitent un token JWT dans le header `Authorization`.

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentification

#### Inscription

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "User Name"
}
```

**Réponse (201 Created) :**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "User Name",
  "is_active": true,
  "is_admin": false,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### Connexion

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@helpdesk.local",
  "password": "admin123"
}
```

**Réponse (200 OK) :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "admin@helpdesk.local",
    "username": "admin",
    "full_name": "Administrator",
    "is_active": true,
    "is_admin": true,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
}
```

### Tickets

#### Créer un ticket

```http
POST /api/tickets/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Problème de connexion",
  "description": "Je n'arrive pas à me connecter à l'application",
  "priority": "high"
}
```

**Réponse (201 Created) :**
```json
{
  "id": 1,
  "title": "Problème de connexion",
  "description": "Je n'arrive pas à me connecter à l'application",
  "status": "open",
  "priority": "high",
  "creator_id": 2,
  "assigned_to_id": null,
  "created_at": "2024-01-01T10:00:00",
  "updated_at": "2024-01-01T10:00:00",
  "resolved_at": null,
  "creator": {...},
  "assigned_to": null,
  "comments": []
}
```

#### Lister les tickets

```http
GET /api/tickets/?skip=0&limit=10&status=open
Authorization: Bearer <access_token>
```

**Paramètres de requête :**
- `skip` (int) : Nombre de tickets à ignorer (défaut: 0)
- `limit` (int) : Nombre de tickets à retourner (défaut: 10, max: 100)
- `status` (string) : Filtrer par statut (open, in_progress, resolved, closed)

**Réponse (200 OK) :**
```json
[
  {
    "id": 1,
    "title": "Problème de connexion",
    "status": "open",
    "priority": "high",
    "creator_id": 2,
    "assigned_to_id": null,
    "created_at": "2024-01-01T10:00:00",
    "updated_at": "2024-01-01T10:00:00",
    "creator": {...},
    "assigned_to": null
  }
]
```

#### Obtenir un ticket

```http
GET /api/tickets/{ticket_id}
Authorization: Bearer <access_token>
```

**Réponse (200 OK) :**
```json
{
  "id": 1,
  "title": "Problème de connexion",
  "description": "Je n'arrive pas à me connecter à l'application",
  "status": "open",
  "priority": "high",
  "creator_id": 2,
  "assigned_to_id": null,
  "created_at": "2024-01-01T10:00:00",
  "updated_at": "2024-01-01T10:00:00",
  "resolved_at": null,
  "creator": {...},
  "assigned_to": null,
  "comments": [...]
}
```

#### Mettre à jour un ticket

```http
PUT /api/tickets/{ticket_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "in_progress",
  "assigned_to_id": 1
}
```

**Réponse (200 OK) :**
```json
{
  "id": 1,
  "title": "Problème de connexion",
  "description": "Je n'arrive pas à me connecter à l'application",
  "status": "in_progress",
  "priority": "high",
  "creator_id": 2,
  "assigned_to_id": 1,
  "created_at": "2024-01-01T10:00:00",
  "updated_at": "2024-01-01T10:30:00",
  "resolved_at": null,
  "creator": {...},
  "assigned_to": {...},
  "comments": [...]
}
```

#### Supprimer un ticket

```http
DELETE /api/tickets/{ticket_id}
Authorization: Bearer <access_token>
```

**Réponse (204 No Content)**

### Commentaires

#### Ajouter un commentaire

```http
POST /api/tickets/{ticket_id}/comments
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "content": "Je vais investiguer ce problème"
}
```

**Réponse (201 Created) :**
```json
{
  "id": 1,
  "content": "Je vais investiguer ce problème",
  "ticket_id": 1,
  "author_id": 1,
  "created_at": "2024-01-01T10:05:00",
  "updated_at": "2024-01-01T10:05:00",
  "author": {...}
}
```

#### Obtenir les commentaires d'un ticket

```http
GET /api/tickets/{ticket_id}/comments
Authorization: Bearer <access_token>
```

**Réponse (200 OK) :**
```json
[
  {
    "id": 1,
    "content": "Je vais investiguer ce problème",
    "ticket_id": 1,
    "author_id": 1,
    "created_at": "2024-01-01T10:05:00",
    "updated_at": "2024-01-01T10:05:00",
    "author": {...}
  }
]
```

## Codes de Statut HTTP

| Code | Signification |
| :--- | :--- |
| 200 | Succès |
| 201 | Créé |
| 204 | Pas de contenu |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Non trouvé |
| 500 | Erreur serveur |

## Énumérations

### TicketStatus
- `open` : Ouvert
- `in_progress` : En cours
- `resolved` : Résolu
- `closed` : Fermé

### TicketPriority
- `low` : Basse
- `medium` : Moyenne
- `high` : Haute
- `critical` : Critique

## Erreurs

Les erreurs sont retournées au format JSON :

```json
{
  "detail": "Invalid email or password"
}
```

## Exemples avec cURL

### Connexion

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@helpdesk.local","password":"admin123"}'
```

### Créer un ticket

```bash
curl -X POST http://localhost:8000/api/tickets/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Nouveau ticket",
    "description":"Description du ticket",
    "priority":"medium"
  }'
```

### Lister les tickets

```bash
curl -X GET "http://localhost:8000/api/tickets/?skip=0&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

## Rate Limiting

Actuellement, il n'y a pas de rate limiting. Cela sera ajouté dans une version future.

## Versioning

L'API est actuellement en version 1.0. Les versions futures seront préfixées par `/api/v2/`, etc.
