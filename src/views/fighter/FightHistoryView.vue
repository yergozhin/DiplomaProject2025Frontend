<template>
  <div class="fight-history-container">
    <div class="header">
      <h1 class="page-title">Fight History</h1>
      <router-link :to="backRoute" class="back-btn">
        ← Back to Fight Details
      </router-link>
    </div>
    <div v-if="loading" class="status-message">Loading fight history...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="history.length === 0" class="no-data">
      <p>No history available for this fight.</p>
    </div>
    <div v-else class="history-content">
      <div class="history-timeline">
        <div v-for="entry in history" :key="entry.id" class="history-item">
          <div class="history-dot"></div>
          <div class="history-content-card">
            <div class="history-header">
              <span class="history-status">{{ formatStatus(entry.status) }}</span>
              <span class="history-date">{{ formatDateTime(entry.changedAt) }}</span>
            </div>
            <div v-if="entry.changedByName" class="history-meta">
              <span class="meta-label">Changed by:</span>
              <span class="meta-value">{{ entry.changedByName }}</span>
            </div>
            <div v-if="entry.changeReason" class="history-reason">
              <span class="reason-label">Reason:</span>
              <span class="reason-value">{{ entry.changeReason }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { fightHistoryService } from '@/services/fight-history.service';
import type { FightHistory } from '@/types';

const route = useRoute();
const authStore = useAuthStore();
const fightId = route.params.fightId as string;

const backRoute = computed(() => {
  const role = authStore.userRole;
  if (role === 'plo') {
    return `/plo/fights/${fightId}/details`;
  }
  return `/fighter/fights/${fightId}/details`;
});

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
    history.value = await fightHistoryService.getByFight(fightId);
  } catch (err: any) {
    if (err.status === 404) {
      error.value = 'Fight not found';
    } else {
      error.value = err.error || 'Failed to load fight history';
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
.fight-history-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  color: white;
  font-size: 28px;
  margin: 0;
}

.back-btn {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #5a6268;
}

.status-message {
  color: white;
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
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.history-content {
  background-color: #f9f9f9;
  padding: 20px;
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

.history-content-card {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.history-status {
  font-weight: bold;
  color: #333;
  font-size: 18px;
}

.history-date {
  color: #666;
  font-size: 14px;
}

.history-meta {
  display: flex;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.meta-label {
  font-weight: 500;
}

.meta-value {
  color: #333;
}

.history-reason {
  display: flex;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

.reason-label {
  font-weight: 500;
  font-style: italic;
}

.reason-value {
  color: #333;
  font-style: italic;
}
</style>

