export type UserRole = 'fighter' | 'plo';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface Fighter {
  id: string;
  email: string;
  name: string | null;
  weightClass: string | null;
}

export interface FightRequest {
  id: string;
  status: string;
  fighterAId: string;
  fighterBId: string;
  senderId: string;
  senderEmail: string;
  senderName: string | null;
  senderWeightClass: string | null;
}

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

export interface ApiError {
  error: string;
}
