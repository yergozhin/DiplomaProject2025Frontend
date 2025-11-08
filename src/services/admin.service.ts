import { apiClient } from './api';
import type { Fighter } from '@/types';

export const adminService = {
  async getPendingVerificationFighters(): Promise<Fighter[]> {
    return apiClient.get<Fighter[]>('/fighters/pending-verifications/fighters');
  },
};


