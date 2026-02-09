<template>
  <div class="offers-container">
    <h1 class="offers-title">My Sent Offers</h1>
    <div v-if="loading" class="status-message">Loading...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="offers.length === 0" class="status-message">No offers sent yet</div>
    <ul v-else class="offers-list">
      <li v-for="offer in offers" :key="offer.id" class="offer-item">
        <div class="offer-header">
          <strong>Fight #{{ offer.fightId }}</strong>
          <span class="status-badge" :class="offer.status">{{ offer.status }}</span>
        </div>
        <div class="offer-details">
          <div><strong>Event:</strong> {{ offer.eventName || 'N/A' }}</div>
          <div v-if="offer.slotStartTime"><strong>Slot Time:</strong> {{ formatDate(offer.slotStartTime) }}</div>
          <div><strong>Fighter ID:</strong> {{ offer.fighterId }}</div>
          <div><strong>Amount:</strong> {{ offer.amount }} {{ offer.currency }}</div>
          <div><strong>Created:</strong> {{ formatDate(offer.createdAt) }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiClient } from '@/services/api';
import { getErrorMessage } from '@/utils/errorMessages';
import type { Offer } from '@/types';

const offers = ref<Offer[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
}

async function loadOffers() {
  loading.value = true;
  error.value = null;
  try {
    offers.value = await apiClient.get<Offer[]>('/offers');
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load offers');
  } finally {
    loading.value = false;
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
  color: #213547;
}

.offer-details div {
  margin-bottom: 5px;
  color: #213547;
}

.offer-details strong {
  color: #213547;
}
</style>

