<template>
  <div>
    <h1>Welcome, {{ user?.email }}!</h1>
    <p>Manage your fighting career from here. Search for opponents, send fight requests, and respond to offers from promotion leagues.</p>
    <p>Track your fights, update your profile, and submit verification for your fight records.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>

<style scoped>
div {
  color: white;
  padding-left: 30px;
  padding-top: 20px;
}

h1 {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

p {
  color: white;
  font-size: 16px;
  line-height: 1.6;
  max-width: 800px;
  margin-bottom: 15px;
}
</style>
