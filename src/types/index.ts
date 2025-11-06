// User and Role types
export type UserRole = 'fighter' | 'plo';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

// Auth request/response types
export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  id: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// API Error response
export interface ApiError {
  error: string;
}

