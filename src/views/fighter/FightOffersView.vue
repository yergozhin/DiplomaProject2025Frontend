<template>
  <div>
    <div class="header">
      <button @click="$emit('back')" class="back-btn">← Back to Fights</button>
      <h1>Available Offers for Fight #{{ props.fightId }}</h1>
    </div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="offers.length === 0">No available offers for this fight</div>
    <ul v-else class="offers-list">
      <li v-for="offer in offers" :key="offer.id" class="offer-item">
        <div class="offer-header">
          <strong>{{ offer.eventName }}</strong>
          <span>Status: {{ offer.status }}</span>
        </div>
        <div class="offer-details">
          <div>Event: {{ offer.eventName }}</div>
          <div>Slot Time: {{ formatDate(offer.slotStartTime) }}</div>
          <div>PLO: {{ offer.ploEmail }}</div>
          <div>Amount: {{ offer.amount }} {{ offer.currency }}</div>
          <div>Fighter A Status: {{ offer.fighterAStatus }}</div>
          <div>Fighter B Status: {{ offer.fighterBStatus }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { offerService } from '@/services/offer.service';
import type { Offer } from '@/types';

const props = defineProps<{
  fightId: string;
}>();

defineEmits<{
  back: [];
}>();

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
    offers.value = await offerService.getAvailableOffersForFight(props.fightId);
  } catch (err: any) {
    error.value = err.error || 'Failed to load offers';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadOffers();
});
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.back-btn {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn:hover {
  background-color: #5a6268;
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
}

.offer-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.offer-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>

