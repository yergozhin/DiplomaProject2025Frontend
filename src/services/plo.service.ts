import { apiClient } from './api';
import type { PloProfile, UpdatePloProfileRequest } from '@/types';

export const ploService = {
  async getProfile(): Promise<PloProfile> {
    return apiClient.get<PloProfile>('/plos/profile');
  },

  async updateProfile(payload: UpdatePloProfileRequest): Promise<PloProfile> {
    return apiClient.put<PloProfile>('/plos/profile', payload);
  },
};


