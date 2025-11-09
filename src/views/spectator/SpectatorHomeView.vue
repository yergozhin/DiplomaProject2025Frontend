<template>
  <section>
    <h1>Welcome, Spectator</h1>
    <p>You are logged in as a spectator. Future updates will unlock more features here.</p>
    <button type="button" @click="handleLogout">Logout</button>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/utils/constants';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push(ROUTES.LOGIN);
}
</script>

