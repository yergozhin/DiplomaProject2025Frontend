import { apiClient } from './api';
import type {
  FightResult,
  CreateFightResultRequest,
  UpdateFightResultRequest,
} from '@/types';

export const fightResultsService = {
  getByFight(fightId: string) {
    return apiClient.get<FightResult>(`/fight-results/fight/${fightId}`);
  },

  getById(id: string) {
    return apiClient.get<FightResult>(`/fight-results/${id}`);
  },

  create(payload: CreateFightResultRequest) {
    return apiClient.post<FightResult>('/fight-results', payload);
  },

  async update(id: string, payload: UpdateFightResultRequest) {
    return apiClient.put<FightResult>(`/fight-results/${id}`, payload);
  },

  remove(id: string) {
    return apiClient.delete(`/fight-results/${id}`);
  },
};

