<template>
  <div class="opponents-container">
    <h1 class="opponents-title">Possible Opponents</h1>
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
import { fighterService } from '@/services/fighter.service';
import { fightService } from '@/services/fight.service';
import type { Fighter } from '@/types';

const opponents = ref<Fighter[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const sendingRequestId = ref<string | null>(null);
const requestSentIds = ref<Set<string>>(new Set());
const requestError = ref<string | null>(null);

async function loadOpponents() {
  loading.value = true;
  error.value = null;
  try {
    opponents.value = await fighterService.getPossibleOpponents();
  } catch (err: any) {
    error.value = err.error || 'Failed to load opponents';
  } finally {
    loading.value = false;
  }
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
</style>

