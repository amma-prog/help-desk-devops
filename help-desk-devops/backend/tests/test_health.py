"""Tests pour la santé de l'application."""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Test le endpoint de santé."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_root():
    """Test le endpoint racine."""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
