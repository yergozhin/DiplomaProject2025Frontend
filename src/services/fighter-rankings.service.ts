import { apiClient } from './api';
import type {
  FighterRanking,
  CreateRankingRequest,
  UpdateRankingRequest,
} from '@/types';

export const fighterRankingsService = {
  getAll() {
    return apiClient.get<FighterRanking[]>('/fighter-rankings/all');
  },

  getByFighter(fighterId: string) {
    return apiClient.get<FighterRanking[]>(`/fighter-rankings/fighter/${fighterId}`);
  },

  async getByWeightClass(weightClassId: string): Promise<FighterRanking[]> {
    return apiClient.get<FighterRanking[]>(`/fighter-rankings/weight-class/${weightClassId}`);
  },

  getById(id: string) {
    return apiClient.get<FighterRanking>(`/fighter-rankings/${id}`);
  },

  create(payload: CreateRankingRequest) {
    return apiClient.post<FighterRanking>('/fighter-rankings', payload);
  },

  async update(id: string, payload: UpdateRankingRequest) {
    return apiClient.put<FighterRanking>(`/fighter-rankings/${id}`, payload);
  },

  remove(id: string) {
    return apiClient.delete(`/fighter-rankings/${id}`);
  },
};

