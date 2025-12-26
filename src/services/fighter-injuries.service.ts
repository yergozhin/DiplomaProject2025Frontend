import { apiClient } from './api';
import type {
  FighterInjury,
  CreateInjuryRequest,
  UpdateInjuryRequest,
} from '@/types';

export const fighterInjuriesService = {
  async getByFighter(fighterId: string): Promise<FighterInjury[]> {
    return apiClient.get<FighterInjury[]>(`/fighter-injuries/fighter/${fighterId}`);
  },

  async getById(id: string): Promise<FighterInjury> {
    return apiClient.get<FighterInjury>(`/fighter-injuries/${id}`);
  },

  async create(payload: CreateInjuryRequest): Promise<FighterInjury> {
    return apiClient.post<FighterInjury>('/fighter-injuries', payload);
  },

  async update(id: string, payload: UpdateInjuryRequest): Promise<FighterInjury> {
    return apiClient.put<FighterInjury>(`/fighter-injuries/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/fighter-injuries/${id}`);
  },
};

