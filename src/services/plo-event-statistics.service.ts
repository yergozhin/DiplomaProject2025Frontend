import { apiClient } from './api';
import type { PloEventStatistics } from '@/types';

export const ploEventStatisticsService = {
  async getByPloId(ploId: string): Promise<PloEventStatistics[]> {
    return apiClient.get<PloEventStatistics[]>(`/plo-event-statistics/plo/${ploId}`);
  },
};

