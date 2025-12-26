import { apiClient } from './api';
import type {
  FightResult,
  CreateFightResultRequest,
  UpdateFightResultRequest,
} from '@/types';

export const fightResultsService = {
  async getByFight(fightId: string): Promise<FightResult> {
    return apiClient.get<FightResult>(`/fight-results/fight/${fightId}`);
  },

  async getById(id: string): Promise<FightResult> {
    return apiClient.get<FightResult>(`/fight-results/${id}`);
  },

  async create(payload: CreateFightResultRequest): Promise<FightResult> {
    return apiClient.post<FightResult>('/fight-results', payload);
  },

  async update(id: string, payload: UpdateFightResultRequest): Promise<FightResult> {
    return apiClient.put<FightResult>(`/fight-results/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/fight-results/${id}`);
  },
};

