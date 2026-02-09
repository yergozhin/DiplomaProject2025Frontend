<template>
  <div class="fights-container">
    <h1 class="fights-title">Scheduled Fights</h1>
    <div v-if="loading" class="status-message">Loading...</div>
    <div v-else-if="error" class="status-message">{{ error }}</div>
    <div v-else-if="fights.length === 0" class="status-message">No scheduled fights</div>
    <ul v-else class="fights-list">
      <li v-for="fight in fights" :key="fight.id" class="fight-item">
        <div class="fight-header">
          <strong>Fight #{{ fight.id }}</strong>
          <span>Status: {{ fight.status }}</span>
        </div>
        <div class="fighters">
          <div class="fighter">
            <strong>Fighter A:</strong>
            <div>{{ fight.fighterAName || fight.fighterAEmail }}</div>
            <div v-if="fight.fighterAWeightClass">{{ fight.fighterAWeightClass }}</div>
            <div>{{ fight.fighterAEmail }}</div>
          </div>
          <div class="vs">VS</div>
          <div class="fighter">
            <strong>Fighter B:</strong>
            <div>{{ fight.fighterBName || fight.fighterBEmail }}</div>
            <div v-if="fight.fighterBWeightClass">{{ fight.fighterBWeightClass }}</div>
            <div>{{ fight.fighterBEmail }}</div>
          </div>
        </div>
        <div class="fight-actions">
          <button @click="handleViewDetails(fight.id)" class="view-details-btn">View Details</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fightService } from '@/services/fight.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { ScheduledFight } from '@/types';

const router = useRouter();

const fights = ref<ScheduledFight[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadFights() {
  loading.value = true;
  error.value = null;
  try {
    fights.value = await fightService.getScheduledFights();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load scheduled fights');
  } finally {
    loading.value = false;
  }
}

function handleViewDetails(fightId: string) {
  router.push(`/fighter/fights/${fightId}/details`);
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
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  max-width: 100%;
  box-sizing: border-box;
}

.fight-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.fighters {
  display: flex;
  align-items: center;
  gap: 20px;
}

.fighter {
  flex: 1;
}

.vs {
  font-weight: bold;
  font-size: 18px;
  color: #666;
}

.fighter strong {
  display: block;
  margin-bottom: 5px;
}

.fight-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.view-details-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.view-details-btn:hover {
  background-color: #0056b3;
}
</style>

