import { apiClient } from './api';
import type { Offer } from '@/types';

export interface SendOfferRequest {
  fightId: string;
  eventId: string;
  eventSlotId: string;
  fighterAAmount: number;
  fighterACurrency: string;
  fighterBAmount: number;
  fighterBCurrency: string;
}

export const offerService = {
  async getAvailableOffersForFight(fightId: string): Promise<Offer[]> {
    return apiClient.get<Offer[]>(`/offers/available-offers/fight/${fightId}`);
  },

  async sendOffers(data: SendOfferRequest): Promise<Offer[]> {
    return apiClient.post<Offer[]>('/offers', data);
  },
};

