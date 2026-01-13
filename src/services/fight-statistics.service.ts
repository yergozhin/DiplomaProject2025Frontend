import { apiClient } from './api';
import type {
  FightStatistic,
  CreateFightStatisticRequest,
  UpdateFightStatisticRequest,
} from '@/types';

export const fightStatisticsService = {
  getByFight(fightId: string) {
    return apiClient.get<FightStatistic[]>(`/fight-statistics/fight/${fightId}`);
  },

  async getByFighter(fighterId: string): Promise<FightStatistic[]> {
    return apiClient.get<FightStatistic[]>(`/fight-statistics/fighter/${fighterId}`);
  },

  getById(id: string) {
    return apiClient.get<FightStatistic>(`/fight-statistics/${id}`);
  },

  create(payload: CreateFightStatisticRequest) {
    return apiClient.post<FightStatistic>('/fight-statistics', payload);
  },

  async update(id: string, payload: UpdateFightStatisticRequest) {
    return apiClient.put<FightStatistic>(`/fight-statistics/${id}`, payload);
  },

  remove(id: string) {
    return apiClient.delete(`/fight-statistics/${id}`);
  },
};

