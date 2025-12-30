import { apiClient } from './api';
import type { EventStatusHistory } from '@/types';

export const eventStatusHistoryService = {
  async getByEvent(eventId: string): Promise<EventStatusHistory[]> {
    return apiClient.get<EventStatusHistory[]>(`/event-status-history/event/${eventId}`);
  },
};

