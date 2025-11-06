<template>
  <div>
    <h1>Requested Fights</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="fights.length === 0">No fight requests</div>
    <ul v-else class="fights-list">
      <li v-for="fight in fights" :key="fight.id" class="fight-item">
        <div>
          <strong>{{ fight.senderName || fight.senderEmail }}</strong>
          <span v-if="fight.senderWeightClass"> - {{ fight.senderWeightClass }}</span>
        </div>
        <div>{{ fight.senderEmail }}</div>
        <div>Status: {{ fight.status }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fightService } from '@/services/fight.service';
import type { FightRequest } from '@/types';

const fights = ref<FightRequest[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadFights() {
  loading.value = true;
  error.value = null;
  try {
    fights.value = await fightService.getRequestedFights();
  } catch (err: any) {
    error.value = err.error || 'Failed to load fight requests';
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
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.fight-item strong {
  display: block;
  margin-bottom: 5px;
}
</style>

