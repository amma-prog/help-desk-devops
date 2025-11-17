"""Routes pour la gestion des tickets."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models import User, Ticket, TicketStatus
from app.schemas import (
    TicketCreate, TicketUpdate, TicketResponse, TicketListResponse, CommentCreate, CommentResponse
)
from app.auth import get_current_user

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


@router.post("/", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Créer un nouveau ticket."""
    new_ticket = Ticket(
        title=ticket_data.title,
        description=ticket_data.description,
        priority=ticket_data.priority,
        creator_id=current_user.id,
        status=TicketStatus.OPEN
    )
    
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    
    return new_ticket


@router.get("/", response_model=List[TicketListResponse])
def list_tickets(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lister tous les tickets."""
    query = db.query(Ticket)
    
    if status:
        try:
            status_enum = TicketStatus(status)
            query = query.filter(Ticket.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status}"
            )
    
    tickets = query.offset(skip).limit(limit).all()
    return tickets


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtenir les détails d'un ticket."""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    return ticket


@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: int,
    ticket_data: TicketUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mettre à jour un ticket."""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # Vérifier les permissions (créateur ou admin)
    if ticket.creator_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this ticket"
        )
    
    # Mettre à jour les champs
    if ticket_data.title is not None:
        ticket.title = ticket_data.title
    if ticket_data.description is not None:
        ticket.description = ticket_data.description
    if ticket_data.status is not None:
        ticket.status = ticket_data.status
        if ticket_data.status == TicketStatus.RESOLVED:
            ticket.resolved_at = datetime.utcnow()
    if ticket_data.priority is not None:
        ticket.priority = ticket_data.priority
    if ticket_data.assigned_to_id is not None:
        ticket.assigned_to_id = ticket_data.assigned_to_id
    
    ticket.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(ticket)
    
    return ticket


@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprimer un ticket."""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # Vérifier les permissions (créateur ou admin)
    if ticket.creator_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this ticket"
        )
    
    db.delete(ticket)
    db.commit()


@router.post("/{ticket_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def add_comment(
    ticket_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Ajouter un commentaire à un ticket."""
    from app.models import Comment
    
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    new_comment = Comment(
        content=comment_data.content,
        ticket_id=ticket_id,
        author_id=current_user.id
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    return new_comment


@router.get("/{ticket_id}/comments", response_model=List[CommentResponse])
def get_comments(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtenir les commentaires d'un ticket."""
    from app.models import Comment
    
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    comments = db.query(Comment).filter(Comment.ticket_id == ticket_id).all()
    return comments
