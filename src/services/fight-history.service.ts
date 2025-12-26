import { apiClient } from './api';
import type {
  FightHistory,
  CreateFightHistoryRequest,
} from '@/types';

export const fightHistoryService = {
  async getByFight(fightId: string): Promise<FightHistory[]> {
    return apiClient.get<FightHistory[]>(`/fight-history/fight/${fightId}`);
  },

  async getById(id: string): Promise<FightHistory> {
    return apiClient.get<FightHistory>(`/fight-history/${id}`);
  },

  async create(payload: CreateFightHistoryRequest): Promise<FightHistory> {
    return apiClient.post<FightHistory>('/fight-history', payload);
  },
};

