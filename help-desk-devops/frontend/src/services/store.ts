/**
 * Store Zustand pour la gestion d'état de l'application.
 */
import { create } from "zustand";
import { User, Ticket, TicketListItem } from "../types";
import { apiClient } from "./api";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

interface TicketStore {
  tickets: TicketListItem[];
  currentTicket: Ticket | null;
  isLoading: boolean;
  error: string | null;
  fetchTickets: (skip?: number, limit?: number, status?: string) => Promise<void>;
  fetchTicket: (ticketId: number) => Promise<void>;
  createTicket: (title: string, description: string, priority: string) => Promise<void>;
  updateTicket: (ticketId: number, data: any) => Promise<void>;
  deleteTicket: (ticketId: number) => Promise<void>;
  clearError: () => void;
}

// Store d'authentification
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.login({ email, password });
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      set({ isAuthenticated: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    apiClient.logout();
    set({ user: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    if (user && token) {
      set({ user: JSON.parse(user), isAuthenticated: true });
    }
  },
}));

// Store des tickets
export const useTicketStore = create<TicketStore>((set) => ({
  tickets: [],
  currentTicket: null,
  isLoading: false,
  error: null,

  fetchTickets: async (skip = 0, limit = 10, status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const tickets = await apiClient.getTickets(skip, limit, status);
      set({ tickets });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch tickets" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTicket: async (ticketId: number) => {
    set({ isLoading: true, error: null });
    try {
      const ticket = await apiClient.getTicket(ticketId);
      set({ currentTicket: ticket });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch ticket" });
    } finally {
      set({ isLoading: false });
    }
  },

  createTicket: async (title: string, description: string, priority: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.createTicket({ title, description, priority: priority as any });
      // Rafraîchir la liste des tickets
      const tickets = await apiClient.getTickets();
      set({ tickets });
    } catch (error: any) {
      set({ error: error.message || "Failed to create ticket" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTicket: async (ticketId: number, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTicket = await apiClient.updateTicket(ticketId, data);
      set({ currentTicket: updatedTicket });
      // Rafraîchir la liste
      const tickets = await apiClient.getTickets();
      set({ tickets });
    } catch (error: any) {
      set({ error: error.message || "Failed to update ticket" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTicket: async (ticketId: number) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteTicket(ticketId);
      const tickets = await apiClient.getTickets();
      set({ tickets, currentTicket: null });
    } catch (error: any) {
      set({ error: error.message || "Failed to delete ticket" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
