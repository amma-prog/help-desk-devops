"""
Application FastAPI principale pour Help Desk.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

from app.database import Base, engine
from app.routes import auth, tickets

# Créer les tables
Base.metadata.create_all(bind=engine)

# Initialiser l'application FastAPI
app = FastAPI(
    title="Help Desk API",
    description="API de gestion de tickets Help Desk",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configuration CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(auth.router)
app.include_router(tickets.router)


@app.get("/")
def read_root():
    """Endpoint racine."""
    return {
        "message": "Help Desk API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    """Vérification de la santé de l'application."""
    return {"status": "ok"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Gestionnaire global d'exceptions."""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
