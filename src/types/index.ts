export type UserRole = 'fighter' | 'plo' | 'admin';

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
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  currentWeightClass: string | null;
  height: number | null;
  reach: number | null;
  country: string | null;
  city: string | null;
  status: string | null;
  profilePicture: string | null;
  bio: string | null;
  profileCreatedAt: string | null;
  profileUpdatedAt: string | null;
  verificationLinks: string | null;
  verificationContacts: string | null;
  totalFights: number | null;
  wins: number | null;
  losses: number | null;
  draws: number | null;
  awards: string | null;
  recordConfirmed: boolean;
  recordConfirmedAt: string | null;
  recordConfirmedBy: string | null;
  recordAdminNotes: string | null;
}

export interface UpdateFighterProfileRequest {
  firstName: string;
  lastName: string;
  nickname?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  currentWeightClass: string;
  height?: number | null;
  reach?: number | null;
  country?: string | null;
  city?: string | null;
  status?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  verificationLinks?: string | null;
  verificationContacts?: string | null;
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
