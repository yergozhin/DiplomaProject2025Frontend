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

export interface AcceptedFight {
  id: string;
  status: string;
  fighterAId: string;
  fighterBId: string;
  fighterAUserId: string;
  fighterAEmail: string;
  fighterAName: string | null;
  fighterAWeightClass: string | null;
  fighterBUserId: string;
  fighterBEmail: string;
  fighterBName: string | null;
  fighterBWeightClass: string | null;
}

export interface ScheduledFight {
  id: string;
  status: string;
  fighterAId: string;
  fighterBId: string;
  fighterAUserId: string;
  fighterAEmail: string;
  fighterAName: string | null;
  fighterAWeightClass: string | null;
  fighterBUserId: string;
  fighterBEmail: string;
  fighterBName: string | null;
  fighterBWeightClass: string | null;
}

export interface Offer {
  id: string;
  fightId: string;
  eventId: string;
  eventSlotId: string;
  fighterId: string;
  ploId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  eventName?: string;
  slotStartTime?: string;
  ploEmail?: string;
  fighterAId?: string;
  fighterBId?: string;
  fighterAStatus?: string;
  fighterBStatus?: string;
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

export interface EventSlot {
  id: string;
  eventId: string;
  startTime: string;
  fightId: string | null;
}

export interface Event {
  id: string;
  name: string;
  ploId: string;
  createdAt: string;
  slots: EventSlot[];
}

export interface CreateEventRequest {
  name: string;
  slots: string[];
}

export interface ApiError {
  error: string;
}
