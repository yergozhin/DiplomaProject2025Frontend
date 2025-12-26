<template>
  <div class="rankings-container">
    <h1 class="rankings-title">My Rankings</h1>
    <div v-if="loading" class="status-message">Loading rankings...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="rankings.length === 0" class="status-message">No rankings found</div>
    <ul v-else class="rankings-list">
      <li v-for="ranking in rankings" :key="ranking.id" class="ranking-item">
        <div class="ranking-header">
          <strong>{{ ranking.weightClassName || 'Unknown Weight Class' }}</strong>
          <span class="ranking-date">{{ formatDate(ranking.rankingDate) }}</span>
        </div>
        <div class="ranking-details">
          <div class="ranking-position">
            <span class="label">Position:</span>
            <span class="value">{{ ranking.rankingPosition || 'N/A' }}</span>
          </div>
          <div class="ranking-points">
            <span class="label">Points:</span>
            <span class="value">{{ ranking.rankingPoints }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { fighterRankingsService } from '@/services/fighter-rankings.service';
import type { FighterRanking } from '@/types';

const authStore = useAuthStore();
const rankings = ref<FighterRanking[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

async function loadRankings() {
  if (!authStore.user?.id) return;
  loading.value = true;
  error.value = null;
  try {
    rankings.value = await fighterRankingsService.getByFighter(authStore.user.id);
  } catch (err: any) {
    error.value = err.error || 'Failed to load rankings';
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

.rankings-list {
  list-style: none;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.ranking-item {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  max-width: 100%;
  box-sizing: border-box;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.ranking-date {
  color: #666;
  font-size: 14px;
}

.ranking-details {
  display: flex;
  gap: 30px;
}

.ranking-position,
.ranking-points {
  display: flex;
  gap: 10px;
}

.label {
  font-weight: bold;
  color: #333;
}

.value {
  color: #666;
}
</style>

