import { apiClient } from './api';
import type {
  FightHistory,
  CreateFightHistoryRequest,
} from '@/types';

export const fightHistoryService = {
  getByFight(fightId: string) {
    return apiClient.get<FightHistory[]>(`/fight-history/fight/${fightId}`);
  },

  async getById(id: string): Promise<FightHistory> {
    return apiClient.get<FightHistory>(`/fight-history/${id}`);
  },

  create(payload: CreateFightHistoryRequest) {
    return apiClient.post<FightHistory>('/fight-history', payload);
  },
};

