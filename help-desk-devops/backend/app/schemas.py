"""
Schémas Pydantic pour la validation des données.
"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum


class TicketStatus(str, Enum):
    """Énumération des statuts de ticket."""
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class TicketPriority(str, Enum):
    """Énumération des priorités de ticket."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# ============ Schémas Utilisateur ============

class UserBase(BaseModel):
    """Schéma de base pour un utilisateur."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """Schéma pour la création d'un utilisateur."""
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """Schéma pour la mise à jour d'un utilisateur."""
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    """Schéma de réponse pour un utilisateur."""
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============ Schémas d'Authentification ============

class LoginRequest(BaseModel):
    """Schéma pour la demande de connexion."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schéma pour la réponse de token."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ============ Schémas Commentaire ============

class CommentBase(BaseModel):
    """Schéma de base pour un commentaire."""
    content: str = Field(..., min_length=1, max_length=5000)


class CommentCreate(CommentBase):
    """Schéma pour la création d'un commentaire."""
    pass


class CommentResponse(CommentBase):
    """Schéma de réponse pour un commentaire."""
    id: int
    ticket_id: int
    author_id: int
    created_at: datetime
    updated_at: datetime
    author: UserResponse

    class Config:
        from_attributes = True


# ============ Schémas Ticket ============

class TicketBase(BaseModel):
    """Schéma de base pour un ticket."""
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=10, max_length=5000)
    priority: TicketPriority = TicketPriority.MEDIUM


class TicketCreate(TicketBase):
    """Schéma pour la création d'un ticket."""
    pass


class TicketUpdate(BaseModel):
    """Schéma pour la mise à jour d'un ticket."""
    title: Optional[str] = Field(None, min_length=5, max_length=255)
    description: Optional[str] = Field(None, min_length=10, max_length=5000)
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    assigned_to_id: Optional[int] = None


class TicketResponse(TicketBase):
    """Schéma de réponse pour un ticket."""
    id: int
    status: TicketStatus
    creator_id: int
    assigned_to_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime]
    creator: UserResponse
    assigned_to: Optional[UserResponse]
    comments: List[CommentResponse] = []

    class Config:
        from_attributes = True


class TicketListResponse(BaseModel):
    """Schéma pour la liste des tickets."""
    id: int
    title: str
    status: TicketStatus
    priority: TicketPriority
    creator_id: int
    assigned_to_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    creator: UserResponse
    assigned_to: Optional[UserResponse]

    class Config:
        from_attributes = True


# ============ Schémas de Réponse Générale ============

class ErrorResponse(BaseModel):
    """Schéma pour une réponse d'erreur."""
    detail: str
    status_code: int


class SuccessResponse(BaseModel):
    """Schéma pour une réponse de succès."""
    message: str
    data: Optional[dict] = None
