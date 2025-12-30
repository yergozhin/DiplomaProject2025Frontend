export type UserRole = 'fighter' | 'plo' | 'spectator' | 'admin';

export type PloStatus = 'unverified' | 'verified';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  ploStatus?: PloStatus | null;
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

export interface PendingVerificationDetails {
  fighter: Fighter;
  verifications: FighterVerification[];
}

export interface VerificationReviewResponse {
  verification: FighterVerification | null;
  fighter: Fighter | null;
}

export interface PromotionLeagueOwner {
  id: string;
  email: string;
  status: PloStatus;
  name: string | null;
  leagueName: string | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  phoneNumber: string | null;
  website: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  description: string | null;
  logo: string | null;
  foundedDate: string | null;
  socialMediaLinks: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PloProfile {
  id: string;
  email: string;
  leagueName: string | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  phoneNumber: string | null;
  website: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  description: string | null;
  logo: string | null;
  foundedDate: string | null;
  socialMediaLinks: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdatePloProfileRequest {
  leagueName: string | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  phoneNumber: string | null;
  website: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  description: string | null;
  logo: string | null;
  foundedDate: string | null;
  socialMediaLinks: string | null;
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
}

export type VerificationType = 'link' | 'contact' | 'image';
export type VerificationStatus = 'pending' | 'accepted' | 'rejected';

export interface FighterVerification {
  id: string;
  fighterId: string;
  type: VerificationType;
  value: string;
  wins: number;
  losses: number;
  draws: number;
  awards: string | null;
  status: VerificationStatus;
  adminId: string | null;
  adminNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface CreateVerificationRequest {
  type: VerificationType;
  value: string;
  wins?: number;
  losses?: number;
  draws?: number;
  awards?: string | null;
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
  ploStatus?: PloStatus | null;
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
  eventName: string | null;
  eventDescription: string | null;
  venueName: string | null;
  venueAddress: string | null;
  city: string | null;
  country: string | null;
  venueCapacity: number | null;
  posterImage: string | null;
  ticketLink: string | null;
  status: string | null;
  updatedAt: string | null;
  slots: EventSlot[];
}

export interface CreateEventRequest {
  name: string;
  slots: string[];
}

export interface UpdateEventRequest {
  eventName?: string | null;
  eventDescription?: string | null;
  venueName?: string | null;
  venueAddress?: string | null;
  city?: string | null;
  country?: string | null;
  venueCapacity?: number | null;
  posterImage?: string | null;
  ticketLink?: string | null;
}

export interface ApiError {
  error: string;
}

export interface WeightClass {
  id: string;
  name: string;
  minWeightKg: number | null;
  maxWeightKg: number | null;
  description: string | null;
  createdAt: string | null;
}

export interface CreateWeightClassRequest {
  name: string;
  minWeightKg?: number | null;
  maxWeightKg?: number | null;
  description?: string | null;
}

export interface UpdateWeightClassRequest {
  name?: string;
  minWeightKg?: number | null;
  maxWeightKg?: number | null;
  description?: string | null;
}

export interface FighterRanking {
  id: string;
  fighterId: string;
  weightClassId: string;
  weightClassName: string | null;
  rankingPosition: number | null;
  rankingPoints: number;
  rankingDate: string;
}

export interface CreateRankingRequest {
  fighterId: string;
  weightClassId: string;
  rankingPosition?: number | null;
  rankingPoints?: number;
  rankingDate: string;
}

export interface UpdateRankingRequest {
  rankingPosition?: number | null;
  rankingPoints?: number;
  rankingDate?: string;
}

export interface FighterInjury {
  id: string;
  fighterId: string;
  injuryType: string;
  injuryDescription: string | null;
  injuryDate: string | null;
  recoveryStatus: 'recovering' | 'cleared' | 'ongoing' | null;
  medicalNotes: string | null;
  updatedAt: string;
}

export interface CreateInjuryRequest {
  fighterId: string;
  injuryType: string;
  injuryDescription?: string | null;
  injuryDate?: string | null;
  recoveryStatus?: 'recovering' | 'cleared' | 'ongoing' | null;
  medicalNotes?: string | null;
}

export interface UpdateInjuryRequest {
  injuryType?: string;
  injuryDescription?: string | null;
  injuryDate?: string | null;
  recoveryStatus?: 'recovering' | 'cleared' | 'ongoing' | null;
  medicalNotes?: string | null;
}

export interface MedicalClearanceAdmin {
  id: string;
  fighterId: string;
  fighterEmail: string;
  fighterName: string | null;
  clearanceDate: string;
  expirationDate: string | null;
  clearedBy: string | null;
  clearanceType: string | null;
  notes: string | null;
  status: 'pending' | 'approved' | 'rejected';
}

export interface MedicalClearance {
  id: string;
  fighterId: string;
  clearanceDate: string;
  expirationDate: string | null;
  clearedBy: string | null;
  clearanceType: 'pre-fight' | 'post-fight' | 'annual' | 'emergency' | null;
  notes: string | null;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CreateClearanceRequest {
  fighterId: string;
  clearanceDate: string;
  expirationDate?: string | null;
  clearedBy?: string | null;
  clearanceType?: 'pre-fight' | 'post-fight' | 'annual' | 'emergency' | null;
  notes?: string | null;
}

export interface UpdateClearanceRequest {
  clearanceDate?: string;
  expirationDate?: string | null;
  clearedBy?: string | null;
  clearanceType?: 'pre-fight' | 'post-fight' | 'annual' | 'emergency' | null;
  notes?: string | null;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface FightResult {
  id: string;
  fightId: string;
  winnerId: string | null;
  winnerName: string | null;
  resultType: 'knockout' | 'technical_knockout' | 'submission' | 'decision' | 'draw' | 'no_contest' | 'disqualification' | null;
  roundEnded: number | null;
  timeEnded: string | null;
  judgeScores: Record<string, unknown> | null;
}

export interface CreateFightResultRequest {
  fightId: string;
  winnerId?: string | null;
  resultType?: 'knockout' | 'technical_knockout' | 'submission' | 'decision' | 'draw' | 'no_contest' | 'disqualification' | null;
  roundEnded?: number | null;
  timeEnded?: string | null;
  judgeScores?: Record<string, unknown> | null;
}

export interface UpdateFightResultRequest {
  winnerId?: string | null;
  resultType?: 'knockout' | 'technical_knockout' | 'submission' | 'decision' | 'draw' | 'no_contest' | 'disqualification' | null;
  roundEnded?: number | null;
  timeEnded?: string | null;
  judgeScores?: Record<string, unknown> | null;
}

export interface FightStatistic {
  id: string;
  fightId: string;
  fighterId: string;
  fighterName: string | null;
  strikesLanded: number;
  strikesAttempted: number;
  takedownsLanded: number;
  takedownsAttempted: number;
  submissionAttempts: number;
  controlTimeSeconds: number;
}

export interface CreateFightStatisticRequest {
  fightId: string;
  fighterId: string;
  strikesLanded?: number;
  strikesAttempted?: number;
  takedownsLanded?: number;
  takedownsAttempted?: number;
  submissionAttempts?: number;
  controlTimeSeconds?: number;
}

export interface UpdateFightStatisticRequest {
  strikesLanded?: number;
  strikesAttempted?: number;
  takedownsLanded?: number;
  takedownsAttempted?: number;
  submissionAttempts?: number;
  controlTimeSeconds?: number;
}

export interface FightHistory {
  id: string;
  fightId: string;
  status: string;
  changedBy: string | null;
  changedByName: string | null;
  changeReason: string | null;
  changedAt: string;
}

export interface CreateFightHistoryRequest {
  fightId: string;
  status: string;
  changeReason?: string | null;
}

export interface FightContract {
  id: string;
  fightId: string;
  fighterId: string;
  fighterName: string | null;
  contractAmount: number;
  currency: string;
  contractSigned: boolean;
  contractSignedAt: string | null;
  contractTerms: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFightContractRequest {
  fightId: string;
  fighterId: string;
  contractAmount: number;
  currency?: string;
  contractTerms?: string | null;
}

export interface UpdateFightContractRequest {
  contractAmount?: number;
  currency?: string;
  contractSigned?: boolean;
  contractTerms?: string | null;
}

export interface EventCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface CreateEventCategoryRequest {
  name: string;
  description?: string | null;
}

export interface UpdateEventCategoryRequest {
  name?: string;
  description?: string | null;
}

export interface EventCategoryAssignment {
  id: string;
  eventId: string;
  categoryId: string;
  categoryName: string | null;
}

export interface EventSponsor {
  id: string;
  eventId: string;
  sponsorName: string;
  sponsorLogo: string | null;
  sponsorshipLevel: 'platinum' | 'gold' | 'silver' | 'bronze' | null;
  sponsorshipAmount: number | null;
}

export interface CreateEventSponsorRequest {
  eventId: string;
  sponsorName: string;
  sponsorLogo?: string | null;
  sponsorshipLevel?: 'platinum' | 'gold' | 'silver' | 'bronze' | null;
  sponsorshipAmount?: number | null;
}

export interface UpdateEventSponsorRequest {
  sponsorName?: string;
  sponsorLogo?: string | null;
  sponsorshipLevel?: 'platinum' | 'gold' | 'silver' | 'bronze' | null;
  sponsorshipAmount?: number | null;
}

export interface EventLocation {
  id: string;
  eventId: string;
  venueName: string | null;
  venueAddress: string | null;
  city: string | null;
  country: string | null;
  venueCapacity: number | null;
  updatedAt: string;
}

export interface CreateEventLocationRequest {
  eventId: string;
  venueName?: string | null;
  venueAddress?: string | null;
  city?: string | null;
  country?: string | null;
  venueCapacity?: number | null;
}

export interface UpdateEventLocationRequest {
  venueName?: string | null;
  venueAddress?: string | null;
  city?: string | null;
  country?: string | null;
  venueCapacity?: number | null;
}

export interface EventMetadata {
  id: string;
  eventId: string;
  posterImage: string | null;
  ticketLink: string | null;
  updatedAt: string;
}

export interface CreateEventMetadataRequest {
  eventId: string;
  posterImage?: string | null;
  ticketLink?: string | null;
}

export interface UpdateEventMetadataRequest {
  posterImage?: string | null;
  ticketLink?: string | null;
}

export interface EventStatusHistory {
  id: string;
  eventId: string;
  status: 'draft' | 'published' | 'cancelled' | 'rejected' | 'completed';
  changedBy: string | null;
  changedByName: string | null;
  changeReason: string | null;
  changedAt: string;
}

export interface CreateEventStatusHistoryRequest {
  eventId: string;
  status: 'draft' | 'published' | 'cancelled' | 'rejected' | 'completed';
  changeReason?: string | null;
}

export interface PloEventStatistics {
  id: string;
  ploId: string;
  totalEvents: number;
  completedEvents: number;
  totalFightsOrganized: number;
  statisticsDate: string;
}

export interface CreatePloEventStatisticsRequest {
  ploId: string;
  totalEvents?: number;
  completedEvents?: number;
  totalFightsOrganized?: number;
  statisticsDate: string;
}

export interface UpdatePloEventStatisticsRequest {
  totalEvents?: number;
  completedEvents?: number;
  totalFightsOrganized?: number;
  statisticsDate?: string;
}

export interface OfferResponse {
  id: string;
  offerId: string;
  fighterId: string;
  fighterName: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'accepted' | 'rejected';
  respondedAt: string | null;
}

export interface CreateOfferResponseRequest {
  offerId: string;
  fighterId: string;
  amount: number;
  currency?: string;
  status?: 'pending' | 'accepted' | 'rejected';
}

export interface UpdateOfferResponseRequest {
  amount?: number;
  currency?: string;
  status?: 'pending' | 'accepted' | 'rejected';
}
