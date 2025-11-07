<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>Admin Dashboard</h1>
      <button type="button" class="logout-btn" @click="handleLogout">Logout</button>
    </header>

    <section class="admin-content">
      <p>Welcome, admin. Use backend tools to manage fighters, events, and offers.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.admin-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: left;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.admin-header h1 {
  margin: 0;
  font-size: 28px;
}

.logout-btn {
  padding: 10px 18px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c82333;
}

.admin-content {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}
</style>

