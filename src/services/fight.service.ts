import { apiClient } from './api';
import type { FightRequest, AcceptedFight, ScheduledFight } from '@/types';

export const fightService = {
  async getRequestedFights(): Promise<FightRequest[]> {
    return apiClient.get<FightRequest[]>('/fights/requests');
  },

  async getAcceptedFights(): Promise<AcceptedFight[]> {
    return apiClient.get<AcceptedFight[]>('/fights/accepted');
  },

  async getScheduledFights(): Promise<ScheduledFight[]> {
    return apiClient.get<ScheduledFight[]>('/fights/scheduled');
  },
};
