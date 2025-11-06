import { apiClient } from './api';
import type { Event } from '@/types';

export const eventService = {
  async getOwnedEvents(): Promise<Event[]> {
    return apiClient.get<Event[]>('/events/owned-events');
  },
};

