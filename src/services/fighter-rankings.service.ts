import { apiClient } from './api';
import type {
  FighterRanking,
  CreateRankingRequest,
  UpdateRankingRequest,
} from '@/types';

export const fighterRankingsService = {
  async getAll(): Promise<FighterRanking[]> {
    return apiClient.get<FighterRanking[]>('/fighter-rankings/all');
  },

  async getByFighter(fighterId: string): Promise<FighterRanking[]> {
    return apiClient.get<FighterRanking[]>(`/fighter-rankings/fighter/${fighterId}`);
  },

  async getByWeightClass(weightClassId: string): Promise<FighterRanking[]> {
    return apiClient.get<FighterRanking[]>(`/fighter-rankings/weight-class/${weightClassId}`);
  },

  async getById(id: string): Promise<FighterRanking> {
    return apiClient.get<FighterRanking>(`/fighter-rankings/${id}`);
  },

  async create(payload: CreateRankingRequest): Promise<FighterRanking> {
    return apiClient.post<FighterRanking>('/fighter-rankings', payload);
  },

  async update(id: string, payload: UpdateRankingRequest): Promise<FighterRanking> {
    return apiClient.put<FighterRanking>(`/fighter-rankings/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/fighter-rankings/${id}`);
  },
};

