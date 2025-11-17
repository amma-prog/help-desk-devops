/**
 * Page de création d'un nouveau ticket.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useTicketStore } from "../services/store";
import { TicketPriority } from "../types";
import "../styles/ticket-form.css";

export const NewTicket: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const createTicket = useTicketStore((state) => state.createTicket);
  const isLoading = useTicketStore((state) => state.isLoading);
  const error = useTicketStore((state) => state.error);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [localError, setLocalError] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!title.trim() || !description.trim()) {
      setLocalError("Veuillez remplir tous les champs");
      return;
    }

    try {
      await createTicket(title, description, priority);
      navigate("/dashboard");
    } catch (err: any) {
      setLocalError(err.response?.data?.detail || "Failed to create ticket");
    }
  };

  return (
    <div className="ticket-form-container">
      <header className="form-header">
        <button onClick={() => navigate("/dashboard")} className="btn-back">
          ← Retour
        </button>
        <h1>Créer un nouveau ticket</h1>
      </header>

      <main className="form-main">
        <div className="form-card">
          {(localError || error) && (
            <div className="error-message">{localError || error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Titre du ticket *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Décrivez brièvement le problème"
                required
                disabled={isLoading}
                minLength={5}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez en détail le problème"
                required
                disabled={isLoading}
                rows={6}
                minLength={10}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priorité</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                disabled={isLoading}
              >
                <option value={TicketPriority.LOW}>Basse</option>
                <option value={TicketPriority.MEDIUM}>Moyenne</option>
                <option value={TicketPriority.HIGH}>Haute</option>
                <option value={TicketPriority.CRITICAL}>Critique</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="btn-secondary"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? "Création en cours..." : "Créer le ticket"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
