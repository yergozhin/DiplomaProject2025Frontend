<template>
  <div class="dashboard-container" :style="{ backgroundImage: `url(${fightersImage})` }">
    <button @click="toggleSidebar" class="sidebar-toggle" :class="{ 'sidebar-toggle-shifted': isSidebarOpen }">
      {{ isSidebarOpen ? '✕' : '☰' }}
    </button>
    <div class="sidebar" :class="{ 'sidebar-open': isSidebarOpen, 'sidebar-closed': !isSidebarOpen }">
      <img :src="logoImage" alt="Logo" class="sidebar-logo" />
      <ul>
        <li>
          <router-link to="/" class="nav-link-landing">Back to Landing Page</router-link>
        </li>
        <li>
          <router-link :to="ROUTES.FIGHTER_PROFILE" active-class="active">
            Profile
          </router-link>
        </li>
        <li>
          <router-link :to="ROUTES.FIGHTER_DASHBOARD" active-class="active">
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link :to="ROUTES.FIGHTER_OPPONENTS" active-class="active">
            Possible opponents
          </router-link>
        </li>
        <li>
          <router-link :to="ROUTES.FIGHTER_REQUESTS" active-class="active">
            Opponent requests
          </router-link>
        </li>
        <li>
          <router-link :to="ROUTES.FIGHTER_FIGHTS" active-class="active">
            Accepted fights
          </router-link>
        </li>
        <li>
          <router-link :to="ROUTES.FIGHTER_SCHEDULED_FIGHTS" active-class="active">
            Scheduled Fights
          </router-link>
        </li>
        <li>
          <router-link :to="ROUTES.FIGHTER_INJURIES" active-class="active">
            Injuries
          </router-link>
        </li>
        <li>
          <router-link :to="ROUTES.FIGHTER_MEDICAL_CLEARANCES" active-class="active">
            Medical Clearances
          </router-link>
        </li>
        <li>
          <router-link :to="ROUTES.FIGHTER_RANKINGS" active-class="active">
            Rankings
          </router-link>
        </li>
      </ul>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </div>

    <div class="main-content" :class="{ 'main-content-shifted': isSidebarOpen }">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/utils/constants';
import fightersImage from '@/assets/fighters.png';
import logoImage from '@/assets/logo.jpg';

const router = useRouter();
const authStore = useAuthStore();
const isSidebarOpen = ref(true);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
}

.sidebar-toggle {
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1000;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle:hover {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.sidebar-toggle-shifted {
  left: 215px;
}

.sidebar {
  width: 200px;
  background: linear-gradient(180deg, rgba(30, 58, 138, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-right: 1px solid rgba(59, 130, 246, 0.2);
  text-align: left;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 999;
  transition: transform 0.3s ease;
  overflow-y: auto;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.3);
  border-top-right-radius: 20px;
  border-bottom-right-radius: 30px;
}

.sidebar-closed {
  transform: translateX(-100%);
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-logo {
  width: 100%;
  max-width: 160px;
  height: auto;
  margin: 0 auto 20px auto;
  display: block;
  border-radius: 8px;
  object-fit: contain;
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
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.sidebar ul li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.sidebar ul li a.active {
  background-color: #3b82f6;
  color: white;
}

.sidebar ul li a.active:hover {
  background-color: #2563eb;
}

.nav-link-landing {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: #ffffff;
  background-color: rgba(234, 88, 12, 0.9);
  border-radius: 6px;
  font-weight: 600;
  border: 2px solid rgba(234, 88, 12, 1);
  transition: all 0.2s ease;
  text-align: center;
}

.nav-link-landing:hover {
  background-color: rgba(234, 88, 12, 1);
  border-color: rgba(251, 146, 60, 1);
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4);
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
  padding-left: 20px;
  text-align: left;
  position: relative;
  z-index: 1;
  transition: margin-left 0.3s ease;
  margin-left: 0;
  width: 100%;
}

.main-content-shifted {
  margin-left: 200px;
}
</style>
