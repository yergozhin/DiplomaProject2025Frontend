<template>
  <div>
    <h1>Available Fights</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="fights.length === 0">No available fights</div>
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
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fightService } from '@/services/fight.service';
import type { AcceptedFight } from '@/types';

const fights = ref<AcceptedFight[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadFights() {
  loading.value = true;
  error.value = null;
  try {
    fights.value = await fightService.getAcceptedFights();
  } catch (err: any) {
    error.value = err.error || 'Failed to load fights';
  } finally {
    loading.value = false;
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
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
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
</style>

