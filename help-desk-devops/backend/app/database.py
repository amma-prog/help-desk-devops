"""
Configuration de la base de données PostgreSQL avec SQLAlchemy.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configuration de la base de données
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://helpdesk_user:helpdesk_password@localhost:5432/helpdesk_db"
)

# Créer le moteur SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("SQL_ECHO", "false").lower() == "true",
    pool_pre_ping=True,  # Vérifier la connexion avant de l'utiliser
)

# Créer la session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base pour les modèles
Base = declarative_base()


def get_db():
    """
    Dépendance pour obtenir une session de base de données.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
