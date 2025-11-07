import { apiClient } from './api';
import type { CreateEventRequest, Event, EventSlot } from '@/types';

export const eventService = {
  async getOwnedEvents(): Promise<Event[]> {
    return apiClient.get<Event[]>('/events/owned-events');
  },

  async getAvailableSlots(eventId: string): Promise<EventSlot[]> {
    return apiClient.get<EventSlot[]>(`/events/${eventId}/available-slots`);
  },

  async createEvent(payload: CreateEventRequest): Promise<Event> {
    return apiClient.post<Event>('/events', payload);
  },
};

