import { apiClient } from './api';
import type {
  EventCategory,
  EventCategoryAssignment,
  CreateEventCategoryRequest,
  UpdateEventCategoryRequest,
} from '@/types';

export const eventCategoriesService = {
  getAll: () => apiClient.get<EventCategory[]>('/event-categories'),

  getById(id: string) {
    return apiClient.get<EventCategory>(`/event-categories/${id}`);
  },

  create: (payload: CreateEventCategoryRequest) => {
    return apiClient.post<EventCategory>('/event-categories', payload);
  },

  async update(id: string, payload: UpdateEventCategoryRequest) {
    return apiClient.put<EventCategory>(`/event-categories/${id}`, payload);
  },

  remove(id: string) {
    return apiClient.delete<void>(`/event-categories/${id}`);
  },

  delete(id: string) {
    return apiClient.delete<void>(`/event-categories/${id}`);
  },

  getByEvent: (eventId: string) => apiClient.get<EventCategoryAssignment[]>(`/event-categories/event/${eventId}`),

  assignToEvent(eventId: string, categoryId: string) {
    return apiClient.post<EventCategoryAssignment>(`/event-categories/event/${eventId}/assign`, { categoryId });
  },

  removeFromEvent: async (eventId: string, categoryId: string) => {
    return apiClient.delete<void>(`/event-categories/event/${eventId}/category/${categoryId}`);
  },
};

