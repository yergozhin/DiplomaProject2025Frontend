import { apiClient } from './api';
import type {
  EventSponsor,
  CreateEventSponsorRequest,
  UpdateEventSponsorRequest,
} from '@/types';

export const eventSponsorsService = {
  getByEvent(eventId: string) {
    return apiClient.get<EventSponsor[]>(`/event-sponsors/event/${eventId}`);
  },

  getById(id: string) {
    return apiClient.get<EventSponsor>(`/event-sponsors/${id}`);
  },

  create(payload: CreateEventSponsorRequest) {
    return apiClient.post<EventSponsor>('/event-sponsors', payload);
  },

  async update(id: string, payload: UpdateEventSponsorRequest) {
    return apiClient.put<EventSponsor>(`/event-sponsors/${id}`, payload);
  },

  remove(id: string) {
    return apiClient.delete<void>(`/event-sponsors/${id}`);
  },

  delete(id: string) {
    return apiClient.delete<void>(`/event-sponsors/${id}`);
  },
};

