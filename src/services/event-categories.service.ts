import { apiClient } from './api';
import type {
  EventCategory,
  EventCategoryAssignment,
  CreateEventCategoryRequest,
  UpdateEventCategoryRequest,
} from '@/types';

export const eventCategoriesService = {
  async getAll(): Promise<EventCategory[]> {
    return apiClient.get<EventCategory[]>('/event-categories');
  },

  async getById(id: string): Promise<EventCategory> {
    return apiClient.get<EventCategory>(`/event-categories/${id}`);
  },

  async create(payload: CreateEventCategoryRequest): Promise<EventCategory> {
    return apiClient.post<EventCategory>('/event-categories', payload);
  },

  async update(id: string, payload: UpdateEventCategoryRequest): Promise<EventCategory> {
    return apiClient.put<EventCategory>(`/event-categories/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/event-categories/${id}`);
  },

  async getByEvent(eventId: string): Promise<EventCategoryAssignment[]> {
    return apiClient.get<EventCategoryAssignment[]>(`/event-categories/event/${eventId}`);
  },

  async assignToEvent(eventId: string, categoryId: string): Promise<EventCategoryAssignment> {
    return apiClient.post<EventCategoryAssignment>(`/event-categories/event/${eventId}/assign`, { categoryId });
  },

  async removeFromEvent(eventId: string, categoryId: string): Promise<void> {
    return apiClient.delete(`/event-categories/event/${eventId}/category/${categoryId}`);
  },
};

