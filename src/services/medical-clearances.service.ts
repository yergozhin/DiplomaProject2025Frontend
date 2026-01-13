import { apiClient } from './api';
import type {
  MedicalClearance,
  CreateClearanceRequest,
  UpdateClearanceRequest,
} from '@/types';

export const medicalClearancesService = {
  getByFighter(fighterId: string) {
    return apiClient.get<MedicalClearance[]>(`/medical-clearances/fighter/${fighterId}`);
  },

  async getById(id: string): Promise<MedicalClearance> {
    return apiClient.get<MedicalClearance>(`/medical-clearances/${id}`);
  },

  create(payload: CreateClearanceRequest) {
    return apiClient.post<MedicalClearance>('/medical-clearances', payload);
  },

  async update(id: string, payload: UpdateClearanceRequest) {
    return apiClient.put<MedicalClearance>(`/medical-clearances/${id}`, payload);
  },

  remove(id: string) {
    return apiClient.delete(`/medical-clearances/${id}`);
  },
};

