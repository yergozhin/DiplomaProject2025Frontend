<template>
  <div class="offers-container">
    <h1 class="offers-title">My Sent Offers</h1>
    <div v-if="loading" class="status-message">Loading...</div>
    <div v-else-if="error" class="status-message">{{ error }}</div>
    <div v-else-if="offers.length === 0" class="status-message">No offers sent yet</div>
    <ul v-else class="offers-list">
      <li v-for="offer in offers" :key="offer.id" class="offer-item">
        <div class="offer-avatar">
          <div class="offer-avatar-placeholder">
            {{ offer.eventName?.charAt(0).toUpperCase() || 'O' }}
          </div>
        </div>
        <div class="offer-info">
          <div class="offer-main">
            <div class="offer-name-line">
              <strong>{{ offer.eventName || 'Event' }}</strong>
              <span class="offer-status-badge" :class="offer.status">{{ offer.status }}</span>
            </div>
            <div class="offer-meta">
              <span v-if="offer.slotStartTime" class="offer-meta-item">
                {{ formatDate(offer.slotStartTime) }}
              </span>
              <span class="offer-meta-item">
                {{ offer.amount }} {{ offer.currency }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="view-details-btn"
            @click="toggleOfferDetails(offer.id)"
          >
            {{ expandedOfferId === offer.id ? 'Hide details' : 'View details' }}
          </button>

          <div
            v-if="expandedOfferId === offer.id"
            class="offer-details"
          >
            <div class="details-row">
              <span class="details-label">Event</span>
              <span class="details-value">{{ formatDetail(offer.eventName) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Slot Time</span>
              <span class="details-value">{{ formatDateDetail(offer.slotStartTime) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Amount</span>
              <span class="details-value">{{ offer.amount }} {{ offer.currency }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Status</span>
              <span class="details-value">{{ offer.status }}</span>
            </div>
          </div>
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
const expandedOfferId = ref<string | null>(null);

function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
}

function formatDetail(value: string | null | undefined): string {
  if (!value) return 'Not set';
  const trimmed = value.trim();
  return trimmed || 'Not set';
}

function formatDateDetail(value: string | null | undefined): string {
  if (!value) return 'Not set';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return 'Not set';
  }
}

function toggleOfferDetails(id: string) {
  expandedOfferId.value = expandedOfferId.value === id ? null : id;
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
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.offers-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.status-message {
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
}

.offers-list {
  list-style: none;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.offer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 100%;
  box-sizing: border-box;
  gap: 15px;
}

.offer-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.12), rgba(59, 130, 246, 0.12));
  border: 1px solid #d1d5db;
}

.offer-avatar-placeholder {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.offer-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.offer-main {
  margin-bottom: 6px;
}

.offer-name-line {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 4px;
}

.offer-info strong {
  display: block;
  margin-bottom: 2px;
  word-break: break-word;
}

.offer-status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  text-transform: capitalize;
}

.offer-status-badge.pending {
  background-color: #ffc107;
  color: #000;
}

.offer-status-badge.accepted {
  background-color: #28a745;
  color: white;
}

.offer-status-badge.rejected {
  background-color: #dc3545;
  color: white;
}

.offer-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: #555;
}

.offer-meta-item::before {
  content: "•";
  margin-right: 4px;
}

.view-details-btn {
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.view-details-btn:hover {
  background-color: #f3f4f6;
  border-color: #cbd5e1;
}

.offer-details {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px 16px;
}

.details-row {
  display: flex;
  flex-direction: column;
  font-size: 12px;
}

.details-label {
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 2px;
}

.details-value {
  color: #111827;
  word-break: break-word;
}
</style>

