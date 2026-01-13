import { apiClient } from './api';
import type {
  FightContract,
  CreateFightContractRequest,
  UpdateFightContractRequest,
} from '@/types';

export const fightContractsService = {
  getByFight(fightId: string) {
    return apiClient.get<FightContract[]>(`/fight-contracts/fight/${fightId}`);
  },

  async getByFighter(fighterId: string): Promise<FightContract[]> {
    return apiClient.get<FightContract[]>(`/fight-contracts/fighter/${fighterId}`);
  },

  getById(id: string) {
    return apiClient.get<FightContract>(`/fight-contracts/${id}`);
  },

  create(payload: CreateFightContractRequest) {
    return apiClient.post<FightContract>('/fight-contracts', payload);
  },

  async update(id: string, payload: UpdateFightContractRequest) {
    return apiClient.put<FightContract>(`/fight-contracts/${id}`, payload);
  },

  remove(id: string) {
    return apiClient.delete(`/fight-contracts/${id}`);
  },
};

