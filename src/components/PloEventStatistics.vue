<template>
  <div class="statistics-section">
    <h2 class="statistics-title">Event Statistics</h2>
    <div v-if="loading" class="status">Loading statistics...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!statistics || statistics.length === 0" class="no-statistics">
      No statistics available
    </div>
    <div v-else class="statistics-card">
      <div class="stat-item">
        <span class="stat-label">Total Events:</span>
        <span class="stat-value">{{ latestStatistics.totalEvents }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Completed Events:</span>
        <span class="stat-value">{{ latestStatistics.completedEvents }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total Fights Organized:</span>
        <span class="stat-value">{{ latestStatistics.totalFightsOrganized }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Statistics Date:</span>
        <span class="stat-value">{{ formatDate(latestStatistics.statisticsDate) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ploEventStatisticsService } from '@/services/plo-event-statistics.service';
import { useAuthStore } from '@/stores/auth.store';
import type { PloEventStatistics } from '@/types';

const authStore = useAuthStore();
const statistics = ref<PloEventStatistics[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const latestStatistics = computed(() => {
  if (statistics.value.length === 0) return null;
  return statistics.value[0];
});

function formatDate(value: string | null) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString();
}

async function loadStatistics() {
  if (!authStore.user?.id) return;
  loading.value = true;
  error.value = null;
  try {
    statistics.value = await ploEventStatisticsService.getByPloId(authStore.user.id);
  } catch (err: any) {
    error.value = err.error || 'Failed to load statistics';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadStatistics();
});
</script>

<style scoped>
.statistics-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #ddd;
}

.statistics-title {
  color: #333;
  font-size: 20px;
  margin-bottom: 15px;
}

.statistics-card {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-weight: bold;
  color: #333;
}

.stat-value {
  color: #007bff;
  font-weight: 600;
}

.status {
  padding: 10px 0;
  color: #666;
}

.error-message {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 4px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.no-statistics {
  padding: 20px;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>

