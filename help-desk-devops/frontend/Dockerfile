# Stage 1: Builder
FROM node:18-alpine as builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package.json package-lock.json* yarn.lock* ./

# Installer les dépendances
RUN npm install --legacy-peer-deps || yarn install

# Copier le code source
COPY . .

# Builder l'application
RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers buildés depuis le builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
