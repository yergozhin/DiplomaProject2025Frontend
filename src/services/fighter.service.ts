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
  getPossibleOpponents: async (filters?: OpponentFilters): Promise<Fighter[]> => {
    if (!filters || (!filters.weightClass && !filters.searchName)) {
      return apiClient.get<Fighter[]>('/fighters/possible-opponents');
    }
    
    let url = '/fighters/possible-opponents?';
    if (filters.weightClass) {
      url += `weightClass=${filters.weightClass}`;
    }
    if (filters.searchName) {
      if (filters.weightClass) url += '&';
      url += `searchName=${filters.searchName}`;
    }
    
    return apiClient.get<Fighter[]>(url);
  },

  getProfile(): Promise<Fighter> {
    return apiClient.get<Fighter>('/fighters/profile');
  },

  updateProfile: (payload: UpdateFighterProfileRequest): Promise<Fighter> => {
    return apiClient.put<Fighter>('/fighters/profile', payload);
  },

  async getVerifications(): Promise<FighterVerification[]> {
    return apiClient.get<FighterVerification[]>('/fighters/verifications');
  },

  createVerification(payload: CreateVerificationRequest): Promise<FighterVerification> {
    return apiClient.post<FighterVerification>('/fighters/verifications', payload);
  },
};

