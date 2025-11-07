import { apiClient } from './api';
import type { Fighter, UpdateFighterProfileRequest } from '@/types';

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
};

