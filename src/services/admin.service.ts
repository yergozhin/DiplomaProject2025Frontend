import { apiClient } from './api';
import type {
  Fighter,
  FighterVerification,
  PendingVerificationDetails,
  VerificationReviewResponse,
  PromotionLeagueOwner,
} from '@/types';

export const adminService = {
  getPendingVerificationFighters: async (): Promise<Fighter[]> => {
    return apiClient.get<Fighter[]>('/fighters/pending-verifications/fighters');
  },
  getPendingVerifications(): Promise<FighterVerification[]> {
    return apiClient.get<FighterVerification[]>('/fighters/verifications/pending');
  },
  getPendingVerificationDetails(fighterId: string): Promise<PendingVerificationDetails> {
    return apiClient.get<PendingVerificationDetails>(`/fighters/pending-verifications/${fighterId}`);
  },
  async getPromotionLeagues(): Promise<PromotionLeagueOwner[]> {
    return apiClient.get<PromotionLeagueOwner[]>('/admin/plos');
  },
  updatePromotionLeagueStatus: (ploId: string, status: 'verified' | 'unverified') => {
    return apiClient.patch<{ id: string; ploStatus: 'verified' | 'unverified' }>(
      `/admin/plos/${ploId}/status`,
      { status },
    );
  },
  reviewVerification(
    verificationId: string,
    status: 'accepted' | 'rejected',
    adminNote?: string | null,
  ): Promise<VerificationReviewResponse> {
    return apiClient.patch<VerificationReviewResponse>(
      `/fighters/verifications/${verificationId}/status`,
      {
        status,
        adminNote: adminNote || null,
      },
    );
  },
  getUsers: () => apiClient.get<User[]>('/admin/users'),
  async verifyUserEmail(userId: string): Promise<{ id: string; emailVerified: boolean }> {
    return apiClient.post<{ id: string; emailVerified: boolean }>(`/admin/users/${userId}/verify-email`);
  },
  getMedicalClearances(): Promise<MedicalClearanceAdmin[]> {
    return apiClient.get<MedicalClearanceAdmin[]>('/admin/medical-clearances');
  },
};

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

export interface User {
  id: string;
  email: string;
  role: 'fighter' | 'plo' | 'spectator';
  emailVerified: boolean;
  name: string | null;
  createdAt: string | null;
}


