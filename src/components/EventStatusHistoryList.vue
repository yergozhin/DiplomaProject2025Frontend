<template>
  <div class="history-section">
    <h3 class="history-title">Status History</h3>
    <div v-if="loading" class="status-message">Loading history...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="history.length === 0" class="no-data">No history available</div>
    <div v-else class="history-timeline">
      <div v-for="entry in history" :key="entry.id" class="history-item">
        <div class="history-dot"></div>
        <div class="history-content">
          <div class="history-header">
            <span class="history-status" :class="entry.status.toLowerCase()">{{ formatStatus(entry.status) }}</span>
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
import { ref, onMounted, watch } from 'vue';
import { eventStatusHistoryService } from '@/services/event-status-history.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { EventStatusHistory } from '@/types';

interface Props {
  eventId: string;
}

const props = defineProps<Props>();

const history = ref<EventStatusHistory[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

async function loadHistory() {
  loading.value = true;
  error.value = null;
  try {
    history.value = await eventStatusHistoryService.getByEvent(props.eventId);
  } catch (err: any) {
    if (err.status !== 404) {
      error.value = getErrorMessage(err.error, 'load history');
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadHistory();
});

watch(() => props.eventId, () => {
  loadHistory();
});
</script>

<style scoped>
.history-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.history-title {
  color: #333;
  font-size: 16px;
  margin-bottom: 15px;
  font-weight: 600;
}

.status-message {
  padding: 10px;
  color: #666;
  font-size: 14px;
}

.error-message {
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  font-size: 14px;
}

.no-data {
  padding: 10px;
  color: #666;
  font-size: 14px;
  text-align: center;
}

.history-timeline {
  position: relative;
  padding-left: 20px;
}

.history-item {
  position: relative;
  padding-bottom: 15px;
}

.history-dot {
  position: absolute;
  left: -25px;
  top: 5px;
  width: 10px;
  height: 10px;
  background-color: #007bff;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #007bff;
}

.history-content {
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 4px;
  border-left: 3px solid #007bff;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.history-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.history-status.draft { background-color: #6c757d; }
.history-status.published { background-color: #28a745; }
.history-status.cancelled { background-color: #dc3545; }
.history-status.rejected { background-color: #ffc107; color: #000; }
.history-status.completed { background-color: #007bff; }

.history-date {
  font-size: 12px;
  color: #666;
}

.history-meta {
  font-size: 13px;
  color: #555;
  margin-bottom: 4px;
}

.history-reason {
  font-size: 13px;
  color: #666;
  font-style: italic;
}
</style>

