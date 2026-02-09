<template>
  <div class="offers-container">
    <h1 class="offers-title">My Offers</h1>
    <div v-if="loading" class="status-message">Loading offers...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="offers.length === 0" class="status-message">No offers available at this time</div>
    <ul v-else class="offers-list">
      <li v-for="offer in offers" :key="offer.id" class="offer-item">
        <div class="offer-header">
          <strong>{{ offer.eventName || 'Event' }}</strong>
          <span class="status-badge" :class="offer.status">{{ offer.status }}</span>
        </div>
        <div class="offer-details">
          <div><strong>Fight ID:</strong> {{ offer.fightId }}</div>
          <div v-if="offer.slotStartTime"><strong>Event Time:</strong> {{ formatDate(offer.slotStartTime) }}</div>
          <div><strong>Promotion League:</strong> {{ offer.ploEmail }}</div>
          <div><strong>Your Amount:</strong> {{ offer.amount }} {{ offer.currency }}</div>
          <div v-if="offer.fighterAStatus || offer.fighterBStatus">
            <strong>Status:</strong> 
            Fighter A: {{ offer.fighterAStatus || 'N/A' }}, 
            Fighter B: {{ offer.fighterBStatus || 'N/A' }}
          </div>
        </div>
        <div v-if="offer.status === 'pending'" class="offer-actions">
          <button @click="handleAccept(offer.id)" class="accept-btn" :disabled="updating">
            Accept
          </button>
          <button @click="handleReject(offer.id)" class="reject-btn" :disabled="updating">
            Reject
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { offerService } from '@/services/offer.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { Offer } from '@/types';

const offers = ref<Offer[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const updating = ref(false);

function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
}

async function loadOffers() {
  loading.value = true;
  error.value = null;
  try {
    offers.value = await offerService.getAvailableOffers();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load offers');
  } finally {
    loading.value = false;
  }
}

async function handleAccept(offerId: string) {
  updating.value = true;
  error.value = null;
  try {
    await offerService.updateOfferStatus({ offerId, status: 'accepted' });
    await loadOffers();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'accept the offer');
  } finally {
    updating.value = false;
  }
}

async function handleReject(offerId: string) {
  updating.value = true;
  error.value = null;
  try {
    await offerService.updateOfferStatus({ offerId, status: 'rejected' });
    await loadOffers();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'reject the offer');
  } finally {
    updating.value = false;
  }
}

onMounted(() => {
  loadOffers();
});
</script>

<style scoped>
.offers-container {
  padding: 20px 30px;
  color: #213547;
}

.offers-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #213547;
}

.status-message, .error-message {
  font-size: 16px;
  margin-bottom: 15px;
  color: #213547;
}

.error-message {
  color: #ff6b6b;
}

.offers-list {
  list-style: none;
  padding: 0;
}

.offer-item {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  color: #213547;
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.offer-header strong {
  color: #213547;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.pending {
  background-color: #ffc107;
  color: #000;
}

.status-badge.accepted {
  background-color: #28a745;
  color: white;
}

.status-badge.rejected {
  background-color: #dc3545;
  color: white;
}

.offer-details {
  margin-bottom: 15px;
  color: #213547;
}

.offer-details div {
  margin-bottom: 5px;
  color: #213547;
}

.offer-details strong {
  color: #213547;
}

.offer-actions {
  display: flex;
  gap: 10px;
}

.accept-btn, .reject-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.accept-btn {
  background-color: #28a745;
  color: white;
}

.accept-btn:hover:not(:disabled) {
  background-color: #218838;
}

.reject-btn {
  background-color: #dc3545;
  color: white;
}

.reject-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.accept-btn:disabled, .reject-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

