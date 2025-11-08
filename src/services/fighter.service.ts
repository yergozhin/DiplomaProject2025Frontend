import { apiClient } from './api';
import type {
  Fighter,
  FighterVerification,
  UpdateFighterProfileRequest,
  CreateVerificationRequest,
} from '@/types';

export const fighterService = {
  async getPossibleOpponents(): Promise<Fighter[]> {
    return apiClient.get<Fighter[]>('/fighters/possible-opponents');
  },

  async getProfile(): Promise<Fighter> {
    return apiClient.get<Fighter>('/fighters/profile');
  },

  async updateProfile(payload: UpdateFighterProfileRequest): Promise<Fighter> {
    return apiClient.put<Fighter>('/fighters/profile', payload);
  },

  async getVerifications(): Promise<FighterVerification[]> {
    return apiClient.get<FighterVerification[]>('/fighters/verifications');
  },

  async createVerification(payload: CreateVerificationRequest): Promise<FighterVerification> {
    return apiClient.post<FighterVerification>('/fighters/verifications', payload);
  },
};

