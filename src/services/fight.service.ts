import { apiClient } from './api';
import type { FightRequest } from '@/types';

export const fightService = {
  async getRequestedFights(): Promise<FightRequest[]> {
    return apiClient.get<FightRequest[]>('/fights/requests');
  },
};

