import { apiClient } from './api';
import type {
  MedicalClearance,
  CreateClearanceRequest,
  UpdateClearanceRequest,
} from '@/types';

export const medicalClearancesService = {
  async getByFighter(fighterId: string): Promise<MedicalClearance[]> {
    return apiClient.get<MedicalClearance[]>(`/medical-clearances/fighter/${fighterId}`);
  },

  async getById(id: string): Promise<MedicalClearance> {
    return apiClient.get<MedicalClearance>(`/medical-clearances/${id}`);
  },

  async create(payload: CreateClearanceRequest): Promise<MedicalClearance> {
    return apiClient.post<MedicalClearance>('/medical-clearances', payload);
  },

  async update(id: string, payload: UpdateClearanceRequest): Promise<MedicalClearance> {
    return apiClient.put<MedicalClearance>(`/medical-clearances/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/medical-clearances/${id}`);
  },
};

