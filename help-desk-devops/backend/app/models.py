"""
Modèles de données SQLAlchemy pour l'application Help Desk.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
import enum
from app.database import Base


class TicketStatus(str, enum.Enum):
    """Énumération des statuts de ticket."""
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class TicketPriority(str, enum.Enum):
    """Énumération des priorités de ticket."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class User(Base):
    """Modèle utilisateur."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255))
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    tickets_created = relationship("Ticket", back_populates="creator", foreign_keys="Ticket.creator_id")
    tickets_assigned = relationship("Ticket", back_populates="assigned_to", foreign_keys="Ticket.assigned_to_id")
    comments = relationship("Comment", back_populates="author")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"


class Ticket(Base):
    """Modèle de ticket."""
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum(TicketStatus), default=TicketStatus.OPEN, index=True)
    priority = Column(Enum(TicketPriority), default=TicketPriority.MEDIUM, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    # Relations
    creator = relationship("User", back_populates="tickets_created", foreign_keys=[creator_id])
    assigned_to = relationship("User", back_populates="tickets_assigned", foreign_keys=[assigned_to_id])
    comments = relationship("Comment", back_populates="ticket", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Ticket(id={self.id}, title={self.title}, status={self.status})>"


class Comment(Base):
    """Modèle de commentaire sur un ticket."""
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    ticket = relationship("Ticket", back_populates="comments")
    author = relationship("User", back_populates="comments")

    def __repr__(self):
        return f"<Comment(id={self.id}, ticket_id={self.ticket_id}, author_id={self.author_id})>"
