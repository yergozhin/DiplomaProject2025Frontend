import { apiClient } from './api';
import type { Offer } from '@/types';

export const offerService = {
  async getAvailableOffersForFight(fightId: string): Promise<Offer[]> {
    return apiClient.get<Offer[]>(`/offers/available-offers/fight/${fightId}`);
  },
};

