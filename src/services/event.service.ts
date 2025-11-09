import { apiClient } from './api';
import type { CreateEventRequest, Event, EventSlot, UpdateEventRequest } from '@/types';

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

  async updateEvent(eventId: string, payload: UpdateEventRequest): Promise<Event> {
    return apiClient.put<Event>(`/events/${eventId}`, payload);
  },

  async publishEvent(eventId: string): Promise<Event> {
    return apiClient.patch<Event>(`/events/${eventId}/publish`);
  },
};

