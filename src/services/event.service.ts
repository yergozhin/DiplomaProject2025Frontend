import { apiClient } from './api';
import type { CreateEventRequest, Event, EventSlot, UpdateEventRequest } from '@/types';

export const eventService = {
  getOwnedEvents() {
    return apiClient.get<Event[]>('/events/owned-events');
  },

  getAvailableSlots(eventId: string) {
    return apiClient.get<EventSlot[]>(`/events/${eventId}/available-slots`);
  },

  createEvent(payload: CreateEventRequest) {
    return apiClient.post<Event>('/events', payload);
  },

  updateEvent(eventId: string, payload: UpdateEventRequest) {
    return apiClient.put<Event>(`/events/${eventId}`, payload);
  },

  publishEvent(eventId: string) {
    return apiClient.patch<Event>(`/events/${eventId}/publish`);
  },

  getPublishedEvents() {
    return apiClient.get<Event[]>('/events/published');
  },

  getFightsForEvent(eventId: string) {
    return apiClient.get<import('@/types').EventFight[]>(`/events/${eventId}/fights`);
  },
};

