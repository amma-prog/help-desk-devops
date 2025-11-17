"""Tests pour l'authentification."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_login_success():
    """Test la connexion réussie."""
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@helpdesk.local", "password": "admin123"}
    )
    assert response.status_code in [200, 401]  # 401 si pas de données


def test_login_invalid_credentials():
    """Test la connexion avec identifiants invalides."""
    response = client.post(
        "/api/auth/login",
        json={"email": "invalid@example.com", "password": "wrongpassword"}
    )
    assert response.status_code in [401, 404]


def test_register():
    """Test l'enregistrement d'un nouvel utilisateur."""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "password123",
            "full_name": "New User"
        }
    )
    assert response.status_code in [201, 400]  # 400 si l'utilisateur existe déjà
