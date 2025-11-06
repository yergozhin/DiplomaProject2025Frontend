<template>
  <div>
    <h1>Dashboard</h1>
    <p>Welcome, {{ user?.email }}!</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>

<style scoped>
</style>
