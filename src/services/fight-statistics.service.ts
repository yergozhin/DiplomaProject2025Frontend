import { apiClient } from './api';
import type {
  FightStatistic,
  CreateFightStatisticRequest,
  UpdateFightStatisticRequest,
} from '@/types';

export const fightStatisticsService = {
  async getByFight(fightId: string): Promise<FightStatistic[]> {
    return apiClient.get<FightStatistic[]>(`/fight-statistics/fight/${fightId}`);
  },

  async getByFighter(fighterId: string): Promise<FightStatistic[]> {
    return apiClient.get<FightStatistic[]>(`/fight-statistics/fighter/${fighterId}`);
  },

  async getById(id: string): Promise<FightStatistic> {
    return apiClient.get<FightStatistic>(`/fight-statistics/${id}`);
  },

  async create(payload: CreateFightStatisticRequest): Promise<FightStatistic> {
    return apiClient.post<FightStatistic>('/fight-statistics', payload);
  },

  async update(id: string, payload: UpdateFightStatisticRequest): Promise<FightStatistic> {
    return apiClient.put<FightStatistic>(`/fight-statistics/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/fight-statistics/${id}`);
  },
};

