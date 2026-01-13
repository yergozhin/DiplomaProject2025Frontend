import { apiClient } from './api';
import type {
  WeightClass,
  CreateWeightClassRequest,
  UpdateWeightClassRequest,
} from '@/types';

export const weightClassesService = {
  getAll(): Promise<WeightClass[]> {
    return apiClient.get<WeightClass[]>('/weight-classes');
  },

  getById: async (id: string): Promise<WeightClass> => {
    return apiClient.get<WeightClass>(`/weight-classes/${id}`);
  },

  async getByName(name: string): Promise<WeightClass> {
    return apiClient.get<WeightClass>(`/weight-classes/name/${name}`);
  },

  create(payload: CreateWeightClassRequest): Promise<WeightClass> {
    return apiClient.post<WeightClass>('/weight-classes', payload);
  },

  update: async (id: string, payload: UpdateWeightClassRequest): Promise<WeightClass> => {
    return apiClient.put<WeightClass>(`/weight-classes/${id}`, payload);
  },

  remove(id: string): Promise<void> {
    return apiClient.delete(`/weight-classes/${id}`);
  },
};

