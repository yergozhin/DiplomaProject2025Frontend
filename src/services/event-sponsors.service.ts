import { apiClient } from './api';
import type {
  EventSponsor,
  CreateEventSponsorRequest,
  UpdateEventSponsorRequest,
} from '@/types';

export const eventSponsorsService = {
  async getByEvent(eventId: string): Promise<EventSponsor[]> {
    return apiClient.get<EventSponsor[]>(`/event-sponsors/event/${eventId}`);
  },

  async getById(id: string): Promise<EventSponsor> {
    return apiClient.get<EventSponsor>(`/event-sponsors/${id}`);
  },

  async create(payload: CreateEventSponsorRequest): Promise<EventSponsor> {
    return apiClient.post<EventSponsor>('/event-sponsors', payload);
  },

  async update(id: string, payload: UpdateEventSponsorRequest): Promise<EventSponsor> {
    return apiClient.put<EventSponsor>(`/event-sponsors/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/event-sponsors/${id}`);
  },
};

