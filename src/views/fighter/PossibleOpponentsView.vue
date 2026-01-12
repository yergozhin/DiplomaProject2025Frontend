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
          <div>
            <strong>{{ opponent.name || opponent.email }}</strong>
            <span v-if="opponent.weightClass"> - {{ opponent.weightClass }}</span>
          </div>
          <div>{{ opponent.email }}</div>
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
import type { Fighter, WeightClass } from '@/types';

const opponents = ref<Fighter[]>([]);
const weightClasses = ref<WeightClass[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const sendingRequestId = ref<string | null>(null);
const requestSentIds = ref<Set<string>>(new Set());
const requestError = ref<string | null>(null);

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
    error.value = err.error || 'Failed to load opponents';
  } finally {
    loading.value = false;
  }
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
    if (err.error === 'request_exists') {
      requestError.value = 'A fight request already exists with this opponent';
      requestSentIds.value.add(fighterId);
    } else if (err.error === 'cannot_request_self') {
      requestError.value = 'Cannot send a fight request to yourself';
    } else {
      requestError.value = err.error || 'Failed to send fight request';
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
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
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

.opponent-info strong {
  display: block;
  margin-bottom: 5px;
  word-break: break-word;
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

