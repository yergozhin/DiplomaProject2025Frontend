<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <router-link to="/" class="nav-link-landing">Back to Landing Page</router-link>
        </li>
        <li>
          <router-link :to="ROUTES.PLO_DASHBOARD" active-class="active">
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link :to="ROUTES.PLO_EVENTS" active-class="active">
            Events
          </router-link>
        </li>
        <li>
          <router-link :to="ROUTES.PLO_AVAILABLE_FIGHTS" active-class="active">
            Available Fights
          </router-link>
        </li>
        <li>
          <router-link :to="ROUTES.PLO_OFFERS" active-class="active">
            Offers
          </router-link>
        </li>
        <li>
          <router-link :to="ROUTES.PLO_PROFILE" active-class="active">
            Profile
          </router-link>
        </li>
      </ul>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </div>

    <div class="main-content">
      <router-view />
    </div>
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
  router.push('/login');
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  align-items: flex-start;
}

.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
  border-right: 1px solid #ddd;
  text-align: left;
}

.sidebar h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.sidebar ul li {
  margin-bottom: 10px;
}

.sidebar ul li a {
  display: block;
  padding: 8px 12px;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
}

.sidebar ul li a:hover {
  background-color: #e0e0e0;
}

.sidebar ul li a.active {
  background-color: #007bff;
  color: white;
}

.sidebar ul li a.active:hover {
  background-color: #0056b3;
}

.nav-link-landing {
  display: block;
  padding: 8px 12px;
  text-decoration: none;
  color: #007bff;
  border-radius: 4px;
  font-weight: 500;
}

.nav-link-landing:hover {
  background-color: #e0e0e0;
}

.logout-btn {
  width: 100%;
  padding: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c82333;
}

.main-content {
  flex: 1;
  padding: 20px;
  text-align: left;
}
</style>
