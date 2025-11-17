/**
 * Types TypeScript pour l'application Help Desk.
 */

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  creator_id: number;
  assigned_to_id?: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  creator: User;
  assigned_to?: User;
  comments: Comment[];
}

export interface TicketListItem {
  id: number;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  creator_id: number;
  assigned_to_id?: number;
  created_at: string;
  updated_at: string;
  creator: User;
  assigned_to?: User;
}

export interface Comment {
  id: number;
  content: string;
  ticket_id: number;
  author_id: number;
  created_at: string;
  updated_at: string;
  author: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface TicketCreateRequest {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface TicketUpdateRequest {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigned_to_id?: number;
}

export interface CommentCreateRequest {
  content: string;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}
