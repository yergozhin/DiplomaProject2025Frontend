<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <h2>Spectator</h2>
      <ul>
        <li>
          <router-link :to="ROUTES.SPECTATOR_EVENTS" active-class="active">
            Published Events
          </router-link>
        </li>
      </ul>
      <button type="button" class="logout-btn" @click="handleLogout">
        Logout
      </button>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
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

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 200px;
  padding: 20px;
  border-right: 1px solid #ddd;
  background-color: #f7f7f7;
}

.sidebar h2 {
  margin: 0 0 16px;
  font-size: 18px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}

.sidebar li {
  margin-bottom: 10px;
}

.sidebar a {
  display: block;
  padding: 8px 12px;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
}

.sidebar a:hover {
  background-color: #e5e5e5;
}

.sidebar a.active {
  background-color: #007bff;
  color: #fff;
}

.logout-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #dc3545;
  color: #fff;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c82333;
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>

