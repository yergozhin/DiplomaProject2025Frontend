import { apiClient } from './api';
import type {
  Fighter,
  FighterVerification,
  PendingVerificationDetails,
  VerificationReviewResponse,
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


