<template>
  <div class="history-section">
    <h2>Fight History</h2>
    <div v-if="loading" class="status-message">Loading fight history...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="history.length === 0" class="no-data">No history available</div>
    <div v-else class="history-timeline">
      <div v-for="entry in history" :key="entry.id" class="history-item">
        <div class="history-dot"></div>
        <div class="history-content">
          <div class="history-header">
            <span class="history-status">{{ formatStatus(entry.status) }}</span>
            <span class="history-date">{{ formatDateTime(entry.changedAt) }}</span>
          </div>
          <div v-if="entry.changedByName" class="history-meta">
            Changed by: {{ entry.changedByName }}
          </div>
          <div v-if="entry.changeReason" class="history-reason">
            Reason: {{ entry.changeReason }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fightHistoryService } from '@/services/fight-history.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { FightHistory } from '@/types';

interface Props {
  fightId: string;
}

const props = defineProps<Props>();

const history = ref<FightHistory[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

async function loadHistory() {
  loading.value = true;
  error.value = null;
  try {
    history.value = await fightHistoryService.getByFight(props.fightId);
  } catch (err: any) {
    if (err.status !== 404) {
      error.value = getErrorMessage(err.error, 'load fight history');
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadHistory();
});
</script>

<style scoped>
.history-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.history-section h2 {
  color: #333;
  margin-bottom: 20px;
}

.status-message {
  color: #666;
  font-size: 16px;
  margin-bottom: 15px;
}

.error-message {
  color: #ff6b6b;
  font-size: 16px;
  margin-bottom: 15px;
}

.no-data {
  color: #666;
  text-align: center;
  padding: 20px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.history-timeline {
  position: relative;
  padding-left: 30px;
}

.history-timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #ddd;
}

.history-item {
  position: relative;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.history-dot {
  position: absolute;
  left: -22px;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #007bff;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #007bff;
  z-index: 1;
}

.history-content {
  flex: 1;
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.history-status {
  font-weight: bold;
  color: #333;
  font-size: 16px;
}

.history-date {
  color: #666;
  font-size: 14px;
}

.history-meta {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.history-reason {
  color: #666;
  font-size: 14px;
  font-style: italic;
  margin-top: 5px;
}
</style>

