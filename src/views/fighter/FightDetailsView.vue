<template>
  <div class="fight-details-container">
    <h1 class="fight-details-title">Fight Details</h1>
    <div v-if="loading" class="status-message">Loading fight details...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else class="fight-content">
      <div class="fight-info">
        <div class="info-row">
          <span class="label">Fight ID:</span>
          <span class="value">{{ fightId }}</span>
        </div>
      </div>
      <div v-if="result" class="result-section">
        <h2>Fight Result</h2>
        <div class="result-info">
          <div class="info-row">
            <span class="label">Winner:</span>
            <span class="value">{{ result.winnerName || 'No winner' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Result Type:</span>
            <span class="value">{{ formatResultType(result.resultType) }}</span>
          </div>
          <div v-if="result.roundEnded" class="info-row">
            <span class="label">Round Ended:</span>
            <span class="value">{{ result.roundEnded }}</span>
          </div>
          <div v-if="result.timeEnded" class="info-row">
            <span class="label">Time Ended:</span>
            <span class="value">{{ result.timeEnded }}</span>
          </div>
        </div>
      </div>
      <div v-if="statistics.length > 0" class="statistics-section">
        <h2>Fight Statistics</h2>
        <div v-for="stat in statistics" :key="stat.id" class="stat-item">
          <h3>{{ stat.fighterName || 'Unknown Fighter' }}</h3>
          <div class="stat-grid">
            <div class="stat-box">
              <span class="stat-label">Strikes Landed</span>
              <span class="stat-value">{{ stat.strikesLanded }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Strikes Attempted</span>
              <span class="stat-value">{{ stat.strikesAttempted }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Takedowns Landed</span>
              <span class="stat-value">{{ stat.takedownsLanded }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Takedowns Attempted</span>
              <span class="stat-value">{{ stat.takedownsAttempted }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Submission Attempts</span>
              <span class="stat-value">{{ stat.submissionAttempts }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Control Time</span>
              <span class="stat-value">{{ formatTime(stat.controlTimeSeconds) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!result && statistics.length === 0" class="no-data">
        No fight details available yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fightResultsService } from '@/services/fight-results.service';
import { fightStatisticsService } from '@/services/fight-statistics.service';
import type { FightResult, FightStatistic } from '@/types';

const route = useRoute();
const fightId = route.params.fightId as string;
const result = ref<FightResult | null>(null);
const statistics = ref<FightStatistic[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

function formatResultType(type: string | null) {
  if (!type) return 'Not set';
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function loadFightDetails() {
  loading.value = true;
  error.value = null;
  try {
    try {
      result.value = await fightResultsService.getByFight(fightId);
    } catch (err: any) {
      if (err.status !== 404) throw err;
    }
    try {
      statistics.value = await fightStatisticsService.getByFight(fightId);
    } catch (err: any) {
      if (err.status !== 404) throw err;
    }
  } catch (err: any) {
    error.value = err.error || 'Failed to load fight details';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadFightDetails();
});
</script>

<style scoped>
.fight-details-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.fight-details-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
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

.fight-content {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.fight-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
  color: #333;
}

.value {
  color: #666;
}

.result-section,
.statistics-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.result-section h2,
.statistics-section h2 {
  color: #333;
  margin-bottom: 15px;
}

.result-info {
  background-color: white;
  padding: 15px;
  border-radius: 4px;
}

.stat-item {
  margin-bottom: 30px;
  background-color: white;
  padding: 15px;
  border-radius: 4px;
}

.stat-item h3 {
  color: #333;
  margin-bottom: 15px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.no-data {
  color: #666;
  text-align: center;
  padding: 40px;
}
</style>

