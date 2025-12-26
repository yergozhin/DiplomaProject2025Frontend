import { apiClient } from './api';
import type {
  FightContract,
  CreateFightContractRequest,
  UpdateFightContractRequest,
} from '@/types';

export const fightContractsService = {
  async getByFight(fightId: string): Promise<FightContract[]> {
    return apiClient.get<FightContract[]>(`/fight-contracts/fight/${fightId}`);
  },

  async getByFighter(fighterId: string): Promise<FightContract[]> {
    return apiClient.get<FightContract[]>(`/fight-contracts/fighter/${fighterId}`);
  },

  async getById(id: string): Promise<FightContract> {
    return apiClient.get<FightContract>(`/fight-contracts/${id}`);
  },

  async create(payload: CreateFightContractRequest): Promise<FightContract> {
    return apiClient.post<FightContract>('/fight-contracts', payload);
  },

  async update(id: string, payload: UpdateFightContractRequest): Promise<FightContract> {
    return apiClient.put<FightContract>(`/fight-contracts/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/fight-contracts/${id}`);
  },
};

