import { apiClient } from './api';
import type { PloEventStatistics } from '@/types';

export const ploEventStatisticsService = {
  getByPloId(ploId: string) {
    return apiClient.get<PloEventStatistics[]>(`/plo-event-statistics/plo/${ploId}`);
  },
};

