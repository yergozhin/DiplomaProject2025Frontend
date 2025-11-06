<template>
  <div>
    <h1>Possible Opponents</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="opponents.length === 0">No opponents available</div>
    <ul v-else class="opponents-list">
      <li v-for="opponent in opponents" :key="opponent.id" class="opponent-item">
        <div>
          <strong>{{ opponent.name || opponent.email }}</strong>
          <span v-if="opponent.weightClass"> - {{ opponent.weightClass }}</span>
        </div>
        <div>{{ opponent.email }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fighterService } from '@/services/fighter.service';
import type { Fighter } from '@/types';

const opponents = ref<Fighter[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadOpponents() {
  loading.value = true;
  error.value = null;
  try {
    opponents.value = await fighterService.getPossibleOpponents();
  } catch (err: any) {
    error.value = err.error || 'Failed to load opponents';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadOpponents();
});
</script>

<style scoped>
.opponents-list {
  list-style: none;
  padding: 0;
}

.opponent-item {
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.opponent-item strong {
  display: block;
  margin-bottom: 5px;
}
</style>

