import { apiClient } from './api';
import type { PloProfile, UpdatePloProfileRequest } from '@/types';

export const ploService = {
  getProfile(): Promise<PloProfile> {
    return apiClient.get<PloProfile>('/plos/profile');
  },

  updateProfile(payload: UpdatePloProfileRequest): Promise<PloProfile> {
    return apiClient.put<PloProfile>('/plos/profile', payload);
  },

  getPublicById(id: string): Promise<PloProfile> {
    return apiClient.get<PloProfile>(`/plos/public/${id}`);
  },
};


