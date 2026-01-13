import { apiClient } from './api';
import type {
  FighterInjury,
  CreateInjuryRequest,
  UpdateInjuryRequest,
} from '@/types';

export const fighterInjuriesService = {
  getByFighter(fighterId: string) {
    return apiClient.get<FighterInjury[]>(`/fighter-injuries/fighter/${fighterId}`);
  },

  getById(id: string) {
    return apiClient.get<FighterInjury>(`/fighter-injuries/${id}`);
  },

  create(payload: CreateInjuryRequest) {
    return apiClient.post<FighterInjury>('/fighter-injuries', payload);
  },

  async update(id: string, payload: UpdateInjuryRequest) {
    return apiClient.put<FighterInjury>(`/fighter-injuries/${id}`, payload);
  },

  remove(id: string) {
    return apiClient.delete(`/fighter-injuries/${id}`);
  },
};

