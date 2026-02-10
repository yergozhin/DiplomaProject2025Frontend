<template>
  <div class="opponents-container">
    <h1 class="opponents-title">Possible Opponents</h1>
    
    <div class="filters-section">
      <div class="filter-group">
        <label for="searchName">Search by Name</label>
        <input
          id="searchName"
          v-model="filters.searchName"
          type="text"
          placeholder="Enter name or email"
          @input="handleFilterChange"
        />
      </div>
      
      <div class="filter-group">
        <label for="weightClass">Weight Class</label>
        <select
          id="weightClass"
          v-model="filters.weightClass"
          @change="handleFilterChange"
        >
          <option value="">All Weight Classes</option>
          <option v-for="wc in weightClasses" :key="wc.id" :value="wc.name">
            {{ wc.name }}
          </option>
        </select>
      </div>
      
      <button @click="clearFilters" class="clear-filters-btn">Clear Filters</button>
    </div>
    
    <div v-if="loading" class="status-message">Loading...</div>
    <div v-else-if="error" class="status-message">{{ error }}</div>
    <div v-else-if="opponents.length === 0" class="status-message">No opponents available</div>
    <ul v-else class="opponents-list">
      <li v-for="opponent in opponents" :key="opponent.id" class="opponent-item">
        <div class="opponent-info">
          <div class="opponent-main">
            <div class="opponent-name-line">
              <strong>{{ opponent.name || opponent.email }}</strong>
              <span v-if="opponent.weightClass" class="opponent-weight">· {{ opponent.weightClass }}</span>
            </div>
            <div class="opponent-email">{{ opponent.email }}</div>
          </div>
          <div class="opponent-meta">
            <span
              v-if="opponent.city || opponent.country"
              class="opponent-meta-item"
            >
              {{ opponent.city || '' }}{{ opponent.city && opponent.country ? ', ' : '' }}{{ opponent.country || '' }}
            </span>
            <span
              v-if="opponent.wins != null || opponent.losses != null || opponent.draws != null"
              class="opponent-meta-item"
            >
              Record: {{ formatRecord(opponent.wins, opponent.losses, opponent.draws) }}
            </span>
            <span
              v-if="opponent.status"
              class="opponent-meta-item"
            >
              Status: {{ opponent.status }}</span>
          </div>

          <button
            type="button"
            class="view-profile-btn"
            @click="toggleOpponentDetails(opponent.id)"
          >
            {{ expandedOpponentId === opponent.id ? 'Hide details' : 'View details' }}
          </button>

          <div
            v-if="expandedOpponentId === opponent.id"
            class="opponent-details"
          >
            <div class="details-row">
              <span class="details-label">First name</span>
              <span class="details-value">{{ formatDetail(opponent.firstName) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Last name</span>
              <span class="details-value">{{ formatDetail(opponent.lastName) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Nickname</span>
              <span class="details-value">{{ formatDetail(opponent.nickname) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Phone</span>
              <span class="details-value">{{ formatDetail(opponent.phoneNumber) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Date of birth</span>
              <span class="details-value">{{ formatDateDetail(opponent.dateOfBirth) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Gender</span>
              <span class="details-value">{{ formatDetail(opponent.gender) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Current weight class</span>
              <span class="details-value">{{ formatDetail(opponent.currentWeightClass || opponent.weightClass) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Height</span>
              <span class="details-value">{{ formatNumberDetail(opponent.height, 'cm') }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Reach</span>
              <span class="details-value">{{ formatNumberDetail(opponent.reach, 'cm') }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Location</span>
              <span class="details-value">
                {{ opponent.city || opponent.country ? (opponent.city || '') + (opponent.city && opponent.country ? ', ' : '') + (opponent.country || '') : 'Not set' }}
              </span>
            </div>
            <div class="details-row">
              <span class="details-label">Total fights</span>
              <span class="details-value">{{ formatNumberDetail(opponent.totalFights, '') }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Record</span>
              <span class="details-value">
                {{ opponent.wins == null && opponent.losses == null && opponent.draws == null
                  ? 'Not set'
                  : formatRecord(opponent.wins, opponent.losses, opponent.draws) }}
              </span>
            </div>
            <div class="details-row">
              <span class="details-label">Awards</span>
              <span class="details-value">{{ formatDetail(opponent.awards) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Status</span>
              <span class="details-value">{{ formatDetail(opponent.status) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Bio</span>
              <span class="details-value details-value-multiline">{{ formatDetail(opponent.bio) }}</span>
            </div>
          </div>
        </div>

        <button 
          @click="handleSendRequest(opponent.id)" 
          :disabled="sendingRequestId === opponent.id || requestSentIds.has(opponent.id)"
          class="send-request-btn"
        >
          <span v-if="sendingRequestId === opponent.id">Sending...</span>
          <span v-else-if="requestSentIds.has(opponent.id)">Request Sent</span>
          <span v-else>Send Fight Request</span>
        </button>
      </li>
    </ul>
    <div v-if="requestError" class="error-message">{{ requestError }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fighterService, type OpponentFilters } from '@/services/fighter.service';
import { weightClassesService } from '@/services/weight-classes.service';
import { fightService } from '@/services/fight.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { Fighter, WeightClass } from '@/types';

const opponents = ref<Fighter[]>([]);
const weightClasses = ref<WeightClass[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const sendingRequestId = ref<string | null>(null);
const requestSentIds = ref<Set<string>>(new Set());
const requestError = ref<string | null>(null);
const expandedOpponentId = ref<string | null>(null);

const filters = ref<OpponentFilters>({
  searchName: null,
  weightClass: null,
});

let filterTimeout: ReturnType<typeof setTimeout> | null = null;

async function loadWeightClasses() {
  try {
    weightClasses.value = await weightClassesService.getAll();
  } catch (err) {
    console.error('Failed to load weight classes:', err);
  }
}

async function loadOpponents() {
  loading.value = true;
  error.value = null;
  try {
    opponents.value = await fighterService.getPossibleOpponents(filters.value);
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load opponents');
  } finally {
    loading.value = false;
  }
}

function toggleOpponentDetails(id: string) {
  expandedOpponentId.value = expandedOpponentId.value === id ? null : id;
}

function formatRecord(
  wins: number | null | undefined,
  losses: number | null | undefined,
  draws: number | null | undefined
): string {
  const w = wins ?? 0;
  const l = losses ?? 0;
  const d = draws ?? 0;
  return `${w}-${l}-${d}`;
}

function formatDetail(value: string | null | undefined): string {
  if (!value) return 'Not set';
  const trimmed = value.trim();
  return trimmed || 'Not set';
}

function formatNumberDetail(value: number | null | undefined, suffix: string): string {
  if (value === null || value === undefined) return 'Not set';
  const s = suffix || '';
  return s ? `${value} ${s}` : String(value);
}

function formatDateDetail(value: string | null | undefined): string {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not set';
  return date.toLocaleDateString();
}

function handleFilterChange() {
  if (filterTimeout) {
    clearTimeout(filterTimeout);
  }
  filterTimeout = setTimeout(() => {
    loadOpponents();
  }, 300);
}

function clearFilters() {
  filters.value = {
    searchName: null,
    weightClass: null,
  };
  loadOpponents();
}

async function handleSendRequest(fighterId: string) {
  sendingRequestId.value = fighterId;
  requestError.value = null;
  
  try {
    await fightService.sendFightRequest(fighterId);
    requestSentIds.value.add(fighterId);
  } catch (err: any) {
    requestError.value = getErrorMessage(err.error, 'send the fight request');
    if (err.error === 'request_exists') {
      requestSentIds.value.add(fighterId);
    }
  } finally {
    sendingRequestId.value = null;
  }
}

onMounted(() => {
  loadWeightClasses();
  loadOpponents();
});
</script>

<style scoped>
.opponents-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.opponents-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.status-message {
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
}

.opponents-list {
  list-style: none;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.opponent-item {
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

.opponent-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.opponent-main {
  margin-bottom: 6px;
}

.opponent-name-line {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.opponent-info strong {
  display: block;
  margin-bottom: 2px;
  word-break: break-word;
}

.opponent-weight {
  font-size: 13px;
  color: #555;
}

.opponent-email {
  font-size: 13px;
  color: #666;
}

.opponent-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: #555;
}

.opponent-meta-item::before {
  content: "•";
  margin-right: 4px;
}

.view-profile-btn {
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.view-profile-btn:hover {
  background-color: #f3f4f6;
  border-color: #cbd5e1;
}

.opponent-details {
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

.details-value-multiline {
  white-space: pre-wrap;
}

.send-request-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.send-request-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.send-request-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.filters-section {
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.filter-group label {
  color: white;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 500;
}

.filter-group input,
.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  color: #333;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.clear-filters-btn {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  height: fit-content;
}

.clear-filters-btn:hover {
  background-color: #5a6268;
}
</style>

