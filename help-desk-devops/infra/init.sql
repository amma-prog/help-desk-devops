-- Script d'initialisation de la base de données Help Desk

-- Créer les extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Créer l'utilisateur administrateur par défaut
INSERT INTO users (email, username, full_name, hashed_password, is_active, is_admin, created_at, updated_at)
VALUES (
    'admin@helpdesk.local',
    'admin',
    'Administrator',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUmGEJvi', -- password: admin123
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Créer un utilisateur utilisateur par défaut
INSERT INTO users (email, username, full_name, hashed_password, is_active, is_admin, created_at, updated_at)
VALUES (
    'user@helpdesk.local',
    'user',
    'Regular User',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUmGEJvi', -- password: admin123
    true,
    false,
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;
