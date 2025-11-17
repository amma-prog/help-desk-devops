# Guide de Contribution

Merci de contribuer à l'application Help Desk ! Ce guide explique comment contribuer au projet.

## Code de Conduite

Tous les contributeurs doivent respecter le code de conduite du projet. Soyez respectueux et constructif.

## Processus de Contribution

### 1. Fork et Clone

```bash
# Fork le dépôt sur GitHub
# Cloner votre fork
git clone https://github.com/votre-username/help-desk-devops.git
cd help-desk-devops

# Ajouter le dépôt original comme remote
git remote add upstream https://github.com/organisation/help-desk-devops.git
```

### 2. Créer une Branche

```bash
# Mettre à jour develop
git checkout develop
git pull upstream develop

# Créer une branche de fonctionnalité
git checkout -b feature/ma-fonctionnalite
```

**Convention de nommage :**
- `feature/nom-de-la-feature` : Nouvelle fonctionnalité
- `bugfix/nom-du-bug` : Correction de bug
- `docs/nom-de-la-doc` : Documentation
- `chore/nom-de-la-tache` : Tâche de maintenance

### 3. Développer

#### Backend

```bash
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
uvicorn app.main:app --reload

# Lancer les tests
pytest tests/

# Vérifier la qualité du code
black app/
flake8 app/
bandit -r app/
```

#### Frontend

```bash
cd frontend

# Installer les dépendances
npm install --legacy-peer-deps

# Lancer le serveur de développement
npm run dev

# Lancer les tests
npm run test

# Vérifier la qualité du code
npm run lint

# Vérifier les types
npm run type-check
```

### 4. Commit et Push

```bash
# Ajouter les fichiers modifiés
git add .

# Commit avec un message descriptif
git commit -m "feat: ajouter la fonctionnalité X"

# Push vers votre fork
git push origin feature/ma-fonctionnalite
```

**Convention de commits (Conventional Commits) :**
- `feat:` : Nouvelle fonctionnalité
- `fix:` : Correction de bug
- `docs:` : Documentation
- `style:` : Formatage du code
- `refactor:` : Refactorisation
- `perf:` : Amélioration de performance
- `test:` : Tests
- `chore:` : Tâches de maintenance

### 5. Pull Request

1. Allez sur GitHub et créez une Pull Request vers `develop`
2. Décrivez clairement les modifications
3. Référencez les issues associées (ex: `Fixes #123`)
4. Attendez la revue de code

### 6. Revue de Code

- Au moins une approbation est requise
- Les tests doivent passer
- La couverture de code ne doit pas diminuer
- Le code doit respecter les standards du projet

### 7. Merge

Une fois approuvée, votre PR sera fusionnée dans `develop`.

## Standards de Qualité

### Backend (Python)

- **Linting :** Flake8
- **Formatage :** Black
- **Sécurité :** Bandit
- **Tests :** Pytest
- **Couverture :** Minimum 80%

### Frontend (TypeScript/React)

- **Linting :** ESLint
- **Formatage :** Prettier
- **Tests :** Vitest
- **Types :** TypeScript strict
- **Couverture :** Minimum 80%

## Tests

### Backend

```bash
cd backend

# Lancer tous les tests
pytest tests/

# Lancer avec couverture
pytest tests/ --cov=app

# Lancer un test spécifique
pytest tests/test_auth.py::test_login
```

### Frontend

```bash
cd frontend

# Lancer tous les tests
npm run test

# Lancer en mode watch
npm run test -- --watch

# Lancer avec couverture
npm run test -- --coverage
```

## Documentation

- Mettez à jour la documentation si vous modifiez des fonctionnalités
- Ajoutez des docstrings aux nouvelles fonctions
- Mettez à jour le README si nécessaire

## Sécurité

- Ne commitez jamais de secrets (clés API, mots de passe)
- Utilisez des variables d'environnement
- Suivez les bonnes pratiques de sécurité

## Performance

- Optimisez les requêtes de base de données
- Utilisez le caching quand approprié
- Profitez du code pour identifier les goulots d'étranglement

## Questions ?

- Ouvrez une issue pour les questions
- Consultez la documentation existante
- Demandez de l'aide dans les discussions

## Merci !

Votre contribution est appréciée ! 🎉
