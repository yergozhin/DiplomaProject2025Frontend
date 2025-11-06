<template>
  <div>
    <h1>Requested Fights</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="fights.length === 0">No fight requests</div>
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
    error.value = err.error || 'Failed to load fight requests';
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
    if (err.error === 'fight_not_found') {
      acceptError.value = 'Fight request not found';
    } else if (err.error === 'invalid_status') {
      acceptError.value = 'Fight request is no longer valid';
    } else if (err.error === 'forbidden' || err.error === 'not_receiver') {
      acceptError.value = 'You are not authorized to accept this fight request';
    } else {
      acceptError.value = err.error || 'Failed to accept fight request';
    }
  } finally {
    acceptingFightId.value = null;
  }
}

onMounted(() => {
  loadFights();
});
</script>

<style scoped>
.fights-list {
  list-style: none;
  padding: 0;
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
}

.fight-info {
  flex: 1;
}

.fight-info strong {
  display: block;
  margin-bottom: 5px;
}

.accept-btn {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
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

