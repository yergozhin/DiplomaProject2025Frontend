<template>
  <div class="fights-container">
    <h1 class="fights-title">Requested Fights</h1>
    <div v-if="loading" class="status-message">Loading...</div>
    <div v-else-if="error" class="status-message">{{ error }}</div>
    <div v-else-if="fights.length === 0" class="status-message">No fight requests</div>
    <ul v-else class="fights-list">
      <li v-for="fight in fights" :key="fight.id" class="fight-item">
        <div class="fight-info">
          <div>
            <strong>{{ fight.senderName || fight.senderEmail }}</strong>
            <span v-if="fight.senderWeightClass"> - {{ fight.senderWeightClass }}</span>
          </div>
          <div>{{ fight.senderEmail }}</div>
          <div>Status: {{ fight.status }}</div>
        </div>
        <button 
          @click="handleAcceptFight(fight.id)" 
          :disabled="acceptingFightId === fight.id || acceptedFightIds.has(fight.id)"
          class="accept-btn"
        >
          <span v-if="acceptingFightId === fight.id">Accepting...</span>
          <span v-else-if="acceptedFightIds.has(fight.id)">Accepted</span>
          <span v-else>Accept Fight</span>
        </button>
      </li>
    </ul>
    <div v-if="acceptError" class="error-message">{{ acceptError }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fightService } from '@/services/fight.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { FightRequest } from '@/types';

const fights = ref<FightRequest[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const acceptingFightId = ref<string | null>(null);
const acceptedFightIds = ref<Set<string>>(new Set());
const acceptError = ref<string | null>(null);

async function loadFights() {
  loading.value = true;
  error.value = null;
  try {
    fights.value = await fightService.getRequestedFights();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load fight requests');
  } finally {
    loading.value = false;
  }
}

async function handleAcceptFight(fightId: string) {
  acceptingFightId.value = fightId;
  acceptError.value = null;
  
  try {
    await fightService.acceptFight(fightId);
    acceptedFightIds.value.add(fightId);
    fights.value = fights.value.filter(fight => fight.id !== fightId);
  } catch (err: any) {
    acceptError.value = getErrorMessage(err.error, 'accept the fight request');
  } finally {
    acceptingFightId.value = null;
  }
}

onMounted(() => {
  loadFights();
});
</script>

<style scoped>
.fights-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.fights-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.status-message {
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
}

.fights-list {
  list-style: none;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.fight-item {
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

.fight-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.fight-info strong {
  display: block;
  margin-bottom: 5px;
  word-break: break-word;
}

.accept-btn {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.accept-btn:hover:not(:disabled) {
  background-color: #218838;
}

.accept-btn:disabled {
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
</style>

