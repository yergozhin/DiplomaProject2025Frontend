import { apiClient } from './api';
import type { FightRequest, AcceptedFight, ScheduledFight } from '@/types';

export const fightService = {
  getRequestedFights: () => apiClient.get<FightRequest[]>('/fights/requests'),

  getAcceptedFights() {
    return apiClient.get<AcceptedFight[]>('/fights/accepted');
  },

  getAcceptedFightsForFighter() {
    return apiClient.get<AcceptedFight[]>('/fights/accepted/my');
  },

  getScheduledFights: () => apiClient.get<ScheduledFight[]>('/fights/scheduled'),

  getAvailableFightsForPlo() {
    return apiClient.get<AcceptedFight[]>('/fights/available-for-plo');
  },

  sendFightRequest(fighterId: string) {
    return apiClient.post<FightRequest>('/fights/request', { fighterId });
  },

  acceptFight(fightId: string) {
    return apiClient.put<AcceptedFight>(`/fights/${fightId}/accept`);
  },

  getFightById(fightId: string) {
    return apiClient.get<AcceptedFight>(`/fights/${fightId}`);
  },
};
