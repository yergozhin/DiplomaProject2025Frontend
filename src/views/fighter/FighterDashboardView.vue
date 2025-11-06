<template>
  <div class="dashboard">
    <h1>Fighter Dashboard</h1>
    <p>Welcome, {{ user?.email }}!</p>
    <button @click="handleLogout">Logout</button>

    <div class="opponents-section">
      <h2>Possible Opponents</h2>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="opponents.length === 0">No opponents available</div>
      <ul v-else>
        <li v-for="opponent in opponents" :key="opponent.id">
          <div>
            <strong>{{ opponent.name || opponent.email }}</strong>
            <span v-if="opponent.weightClass"> - {{ opponent.weightClass }}</span>
          </div>
          <div>{{ opponent.email }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { fighterService } from '@/services/fighter.service';
import type { Fighter } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
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

function handleLogout() {
  authStore.logout();
  router.push('/login');
}

onMounted(() => {
  loadOpponents();
});
</script>
