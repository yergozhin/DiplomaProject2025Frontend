import { apiClient } from './api';
import type { FightRequest, AcceptedFight, ScheduledFight } from '@/types';

export const fightService = {
  async getRequestedFights(): Promise<FightRequest[]> {
    return apiClient.get<FightRequest[]>('/fights/requests');
  },

  async getAcceptedFights(): Promise<AcceptedFight[]> {
    return apiClient.get<AcceptedFight[]>('/fights/accepted');
  },

  async getAcceptedFightsForFighter(): Promise<AcceptedFight[]> {
    return apiClient.get<AcceptedFight[]>('/fights/accepted/my');
  },

  async getScheduledFights(): Promise<ScheduledFight[]> {
    return apiClient.get<ScheduledFight[]>('/fights/scheduled');
  },

  async getAvailableFightsForPlo(): Promise<AcceptedFight[]> {
    return apiClient.get<AcceptedFight[]>('/fights/available-for-plo');
  },

  async sendFightRequest(fighterId: string): Promise<FightRequest> {
    return apiClient.post<FightRequest>('/fights/request', { fighterId });
  },

  async acceptFight(fightId: string): Promise<AcceptedFight> {
    return apiClient.put<AcceptedFight>(`/fights/${fightId}/accept`);
  },
};
