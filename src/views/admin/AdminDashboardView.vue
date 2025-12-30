<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h1>Admin</h1>
      <nav>
        <router-link to="/" class="nav-link-landing">Back to Landing Page</router-link>
        <router-link :to="ROUTES.ADMIN_DASHBOARD" active-class="active">Home</router-link>
        <router-link :to="ROUTES.ADMIN_PENDING_VERIFICATIONS" active-class="active">
          Pending Verifications
        </router-link>
        <router-link :to="ROUTES.ADMIN_PLOS" active-class="active">
          Promotion Leagues
        </router-link>
        <router-link :to="ROUTES.ADMIN_EMAIL_VERIFICATION" active-class="active">
          Email Verification
        </router-link>
        <router-link :to="ROUTES.ADMIN_MEDICAL_CLEARANCES" active-class="active">
          Medical Clearances
        </router-link>
        <router-link :to="ROUTES.ADMIN_EVENT_CATEGORIES" active-class="active">
          Event Categories
        </router-link>
      </nav>
      <button type="button" @click="handleLogout">Logout</button>
    </aside>
    <main class="content">
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
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 200px;
  padding: 16px;
  background-color: #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar h1 {
  margin: 0;
  font-size: 18px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar a {
  color: #1f2937;
  text-decoration: none;
  padding: 6px 8px;
  border-radius: 4px;
}

.sidebar a.active {
  background-color: #d1d5db;
}

.nav-link-landing {
  color: #007bff;
  font-weight: 500;
}

.nav-link-landing:hover {
  background-color: #e5e7eb;
}

.sidebar button {
  margin-top: auto;
  padding: 6px 8px;
  border: 1px solid #1f2937;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.content {
  flex: 1;
  padding: 16px;
  background-color: #ffffff;
}
</style>

