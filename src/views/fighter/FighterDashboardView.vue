<template>
  <div class="dashboard">
    <h1>Fighter Dashboard</h1>
    <p>Welcome, {{ user?.email }}!</p>
    <button @click="handleLogout" class="logout-button">Logout</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>
