import { apiClient } from './api';
import type {
  WeightClass,
  CreateWeightClassRequest,
  UpdateWeightClassRequest,
} from '@/types';

export const weightClassesService = {
  async getAll(): Promise<WeightClass[]> {
    return apiClient.get<WeightClass[]>('/weight-classes');
  },

  async getById(id: string): Promise<WeightClass> {
    return apiClient.get<WeightClass>(`/weight-classes/${id}`);
  },

  async getByName(name: string): Promise<WeightClass> {
    return apiClient.get<WeightClass>(`/weight-classes/name/${name}`);
  },

  async create(payload: CreateWeightClassRequest): Promise<WeightClass> {
    return apiClient.post<WeightClass>('/weight-classes', payload);
  },

  async update(id: string, payload: UpdateWeightClassRequest): Promise<WeightClass> {
    return apiClient.put<WeightClass>(`/weight-classes/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/weight-classes/${id}`);
  },
};

