import { apiClient } from './api';
import type {
  Fighter,
  FighterVerification,
  PendingVerificationDetails,
  VerificationReviewResponse,
  PromotionLeagueOwner,
} from '@/types';

export const adminService = {
  async getPendingVerificationFighters(): Promise<Fighter[]> {
    return apiClient.get<Fighter[]>('/fighters/pending-verifications/fighters');
  },
  async getPendingVerifications(): Promise<FighterVerification[]> {
    return apiClient.get<FighterVerification[]>('/fighters/verifications/pending');
  },
  async getPendingVerificationDetails(fighterId: string): Promise<PendingVerificationDetails> {
    return apiClient.get<PendingVerificationDetails>(`/fighters/pending-verifications/${fighterId}`);
  },
  async getPromotionLeagues(): Promise<PromotionLeagueOwner[]> {
    return apiClient.get<PromotionLeagueOwner[]>('/admin/plos');
  },
  async updatePromotionLeagueStatus(ploId: string, status: 'verified' | 'unverified') {
    return apiClient.patch<{ id: string; ploStatus: 'verified' | 'unverified' }>(
      `/admin/plos/${ploId}/status`,
      { status },
    );
  },
  async reviewVerification(
    verificationId: string,
    status: 'accepted' | 'rejected',
    adminNote?: string | null,
  ): Promise<VerificationReviewResponse> {
    return apiClient.patch<VerificationReviewResponse>(
      `/fighters/verifications/${verificationId}/status`,
      {
        status,
        adminNote: adminNote ?? null,
      },
    );
  },
};


