<template>
  <div class="rankings-container">
    <h1 class="rankings-title">My Rankings</h1>
    <div v-if="loading" class="status-message">Loading rankings...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="rankings.length === 0" class="status-message">No rankings found</div>
    <div v-else>
      <h2 class="rankings-subtitle">Pound for Pound Rankings</h2>
      <table class="rankings-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Fighter</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Draws</th>
            <th>Total Fights</th>
            <th>Win Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ranking in sortedRankings" :key="ranking.id">
            <td>{{ ranking.rankingPosition || 'N/A' }}</td>
            <td>{{ getFighterName(ranking) }}</td>
            <td>{{ ranking.wins ?? 0 }}</td>
            <td>{{ ranking.losses ?? 0 }}</td>
            <td>{{ ranking.draws ?? 0 }}</td>
            <td>{{ ranking.totalFights ?? 0 }}</td>
            <td>{{ getWinRate(ranking) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { fighterRankingsService } from '@/services/fighter-rankings.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { FighterRanking } from '@/types';

const rankings = ref<FighterRanking[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const sortedRankings = computed(() => {
  return [...rankings.value].sort((a, b) => {
    if (a.rankingPosition && b.rankingPosition) {
      return a.rankingPosition - b.rankingPosition;
    }
    if (a.rankingPosition) return -1;
    if (b.rankingPosition) return 1;
    return 0;
  });
});

function getFighterName(ranking: FighterRanking): string {
  return ranking.fighterName || ranking.fighterEmail || `Fighter ${ranking.fighterId.substring(0, 8)}`;
}

function getWinRate(ranking: FighterRanking): string {
  if (!ranking.totalFights || ranking.totalFights === 0) {
    return '0%';
  }
  const winRate = ((ranking.wins ?? 0) / ranking.totalFights) * 100;
  return `${winRate.toFixed(1)}%`;
}

async function loadRankings() {
  loading.value = true;
  error.value = null;
  try {
    rankings.value = await fighterRankingsService.getAll();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load rankings');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadRankings();
});
</script>

<style scoped>
.rankings-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.rankings-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.rankings-subtitle {
  color: white;
  font-size: 22px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
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

.rankings-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.rankings-table thead {
  background-color: #f8f9fa;
}

.rankings-table th {
  padding: 12px;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid #dee2e6;
  color: #333;
}

.rankings-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #333;
}

.rankings-table tbody tr:hover {
  background-color: #f8f9fa;
}
</style>

