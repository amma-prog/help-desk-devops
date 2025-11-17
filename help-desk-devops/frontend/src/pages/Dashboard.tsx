/**
 * Page du tableau de bord.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useTicketStore } from "../services/store";
import { TicketStatus } from "../types";
import "../styles/dashboard.css";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const tickets = useTicketStore((state) => state.tickets);
  const fetchTickets = useTicketStore((state) => state.fetchTickets);
  const isLoading = useTicketStore((state) => state.isLoading);
  const error = useTicketStore((state) => state.error);

  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchTickets(0, 10, statusFilter || undefined);
  }, [user, navigate, statusFilter, fetchTickets]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusColor = (status: TicketStatus): string => {
    switch (status) {
      case TicketStatus.OPEN:
        return "status-open";
      case TicketStatus.IN_PROGRESS:
        return "status-in-progress";
      case TicketStatus.RESOLVED:
        return "status-resolved";
      case TicketStatus.CLOSED:
        return "status-closed";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "low":
        return "priority-low";
      case "medium":
        return "priority-medium";
      case "high":
        return "priority-high";
      case "critical":
        return "priority-critical";
      default:
        return "";
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Help Desk</h1>
          <p>Bienvenue, {user?.full_name || user?.username}</p>
        </div>
        <div className="header-right">
          <button onClick={() => navigate("/tickets/new")} className="btn-primary">
            + Nouveau Ticket
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="filters">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="closed">Fermé</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading">Chargement des tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="no-tickets">
            <p>Aucun ticket trouvé</p>
          </div>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="ticket-card"
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <div className="ticket-header">
                  <h3>{ticket.title}</h3>
                  <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="ticket-meta">
                  <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className="created-date">
                    {new Date(ticket.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="ticket-creator">
                  <small>Par: {ticket.creator.username}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
