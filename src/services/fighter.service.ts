import { apiClient } from './api';
import type { Fighter } from '@/types';

export const fighterService = {
  async getPossibleOpponents(): Promise<Fighter[]> {
    return apiClient.get<Fighter[]>('/fighters/possible-opponents');
  },
};

