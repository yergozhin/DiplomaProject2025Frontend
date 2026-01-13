import { apiClient } from './api';
import type { EventStatusHistory } from '@/types';

export const eventStatusHistoryService = {
  getByEvent(eventId: string) {
    return apiClient.get<EventStatusHistory[]>(`/event-status-history/event/${eventId}`);
  },
};

