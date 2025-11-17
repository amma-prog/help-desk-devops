/**
 * Page de détails d'un ticket.
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore, useTicketStore } from "../services/store";
import { TicketStatus } from "../types";
import { apiClient } from "../services/api";
import "../styles/ticket-detail.css";

export const TicketDetail: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams<{ ticketId: string }>();
  const user = useAuthStore((state) => state.user);
  const currentTicket = useTicketStore((state) => state.currentTicket);
  const fetchTicket = useTicketStore((state) => state.fetchTicket);
  const updateTicket = useTicketStore((state) => state.updateTicket);
  const isLoading = useTicketStore((state) => state.isLoading);

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [newStatus, setNewStatus] = useState<TicketStatus | "">(
    currentTicket?.status || ""
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (ticketId) {
      fetchTicket(parseInt(ticketId));
    }
  }, [user, ticketId, navigate, fetchTicket]);

  useEffect(() => {
    if (currentTicket) {
      setComments(currentTicket.comments);
      setNewStatus(currentTicket.status);
    }
  }, [currentTicket]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !ticketId) return;

    try {
      const comment = await apiClient.addComment(parseInt(ticketId), {
        content: newComment,
      });
      setComments([...comments, comment]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleStatusChange = async () => {
    if (!ticketId || !newStatus) return;

    try {
      await updateTicket(parseInt(ticketId), { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (isLoading || !currentTicket) {
    return <div className="loading">Chargement du ticket...</div>;
  }

  return (
    <div className="ticket-detail-container">
      <header className="detail-header">
        <button onClick={() => navigate("/dashboard")} className="btn-back">
          ← Retour
        </button>
        <h1>{currentTicket.title}</h1>
      </header>

      <main className="detail-main">
        <div className="ticket-info">
          <div className="info-section">
            <h3>Informations du ticket</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">ID:</span>
                <span className="value">#{currentTicket.id}</span>
              </div>
              <div className="info-item">
                <span className="label">Statut:</span>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
                  onBlur={handleStatusChange}
                  className="status-select"
                >
                  <option value={TicketStatus.OPEN}>Ouvert</option>
                  <option value={TicketStatus.IN_PROGRESS}>En cours</option>
                  <option value={TicketStatus.RESOLVED}>Résolu</option>
                  <option value={TicketStatus.CLOSED}>Fermé</option>
                </select>
              </div>
              <div className="info-item">
                <span className="label">Priorité:</span>
                <span className="value">{currentTicket.priority}</span>
              </div>
              <div className="info-item">
                <span className="label">Créé par:</span>
                <span className="value">{currentTicket.creator.username}</span>
              </div>
              <div className="info-item">
                <span className="label">Date de création:</span>
                <span className="value">
                  {new Date(currentTicket.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              {currentTicket.assigned_to && (
                <div className="info-item">
                  <span className="label">Assigné à:</span>
                  <span className="value">{currentTicket.assigned_to.username}</span>
                </div>
              )}
            </div>
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <p>{currentTicket.description}</p>
          </div>
        </div>

        <div className="comments-section">
          <h3>Commentaires ({comments.length})</h3>

          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              rows={3}
            />
            <button type="submit" className="btn-primary" disabled={!newComment.trim()}>
              Ajouter un commentaire
            </button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">Aucun commentaire pour le moment</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <strong>{comment.author.username}</strong>
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
