import { apiClient } from './api';
import type {
  Fighter,
  FighterVerification,
  UpdateFighterProfileRequest,
  CreateVerificationRequest,
} from '@/types';

export interface OpponentFilters {
  weightClass?: string | null;
  searchName?: string | null;
}

export const fighterService = {
  async getPossibleOpponents(filters?: OpponentFilters): Promise<Fighter[]> {
    const params = new URLSearchParams();
    if (filters?.weightClass) params.append('weightClass', filters.weightClass);
    if (filters?.searchName) params.append('searchName', filters.searchName);
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `/fighters/possible-opponents?${queryString}`
      : '/fighters/possible-opponents';
    
    return apiClient.get<Fighter[]>(endpoint);
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

