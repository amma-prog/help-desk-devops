/**
 * Service API pour communiquer avec le Backend.
 */
import axios, { AxiosInstance, AxiosError } from "axios";
import {
  LoginRequest,
  TokenResponse,
  Ticket,
  TicketListItem,
  TicketCreateRequest,
  TicketUpdateRequest,
  Comment,
  CommentCreateRequest,
  User,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Charger le token depuis le localStorage
    this.token = localStorage.getItem("access_token");

    // Intercepteur pour ajouter le token aux requêtes
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Intercepteur pour gérer les erreurs
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem("access_token", token);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }

  // ============ Authentification ============

  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const response = await this.client.post<TokenResponse>("/api/auth/login", credentials);
    this.setToken(response.data.access_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
  }

  async register(userData: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
  }): Promise<User> {
    const response = await this.client.post<User>("/api/auth/register", userData);
    return response.data;
  }

  // ============ Tickets ============

  async createTicket(ticketData: TicketCreateRequest): Promise<Ticket> {
    const response = await this.client.post<Ticket>("/api/tickets/", ticketData);
    return response.data;
  }

  async getTickets(skip: number = 0, limit: number = 10, status?: string): Promise<TicketListItem[]> {
    const params: Record<string, any> = { skip, limit };
    if (status) params.status = status;
    const response = await this.client.get<TicketListItem[]>("/api/tickets/", { params });
    return response.data;
  }

  async getTicket(ticketId: number): Promise<Ticket> {
    const response = await this.client.get<Ticket>(`/api/tickets/${ticketId}`);
    return response.data;
  }

  async updateTicket(ticketId: number, ticketData: TicketUpdateRequest): Promise<Ticket> {
    const response = await this.client.put<Ticket>(`/api/tickets/${ticketId}`, ticketData);
    return response.data;
  }

  async deleteTicket(ticketId: number): Promise<void> {
    await this.client.delete(`/api/tickets/${ticketId}`);
  }

  // ============ Commentaires ============

  async addComment(ticketId: number, commentData: CommentCreateRequest): Promise<Comment> {
    const response = await this.client.post<Comment>(
      `/api/tickets/${ticketId}/comments`,
      commentData
    );
    return response.data;
  }

  async getComments(ticketId: number): Promise<Comment[]> {
    const response = await this.client.get<Comment[]>(`/api/tickets/${ticketId}/comments`);
    return response.data;
  }

  // ============ Santé ============

  async healthCheck(): Promise<{ status: string }> {
    const response = await this.client.get<{ status: string }>("/health");
    return response.data;
  }
}

export const apiClient = new ApiClient();
