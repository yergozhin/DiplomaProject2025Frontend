<template>
  <div class="dashboard-container" :style="{ backgroundImage: `url(${fightersImage})` }">
    <button @click="toggleSidebar" class="sidebar-toggle" :class="{ 'sidebar-toggle-shifted': isSidebarOpen }">
      {{ isSidebarOpen ? '✕' : '☰' }}
    </button>
    <div class="sidebar" :class="{ 'sidebar-open': isSidebarOpen, 'sidebar-closed': !isSidebarOpen }">
      <div class="sidebar-header">
        <img :src="logoImage" alt="Logo" class="sidebar-logo" />
        <router-link to="/" class="nav-link-landing">
          <span class="arrow">←</span>
          <span>Landing</span>
        </router-link>
      </div>
      <div class="sidebar-content">
        <ul>
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
      </div>
      <div class="sidebar-footer">
        <div v-if="hasMultipleRoles" class="role-switcher">
          <label class="role-switcher-label">Switch Role:</label>
          <select v-model="currentRole" @change="handleRoleSwitch" class="role-select">
            <option v-for="role in availableRolesList" :key="role.value" :value="role.value">
              {{ role.label }}
            </option>
          </select>
        </div>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
    </div>

    <div class="main-content" :class="{ 'main-content-shifted': isSidebarOpen }">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/utils/constants';
import type { UserRole } from '@/types';
import fightersImage from '@/assets/fighters.png';
import logoImage from '@/assets/logo.jpg';

const router = useRouter();
const authStore = useAuthStore();
const isSidebarOpen = ref(true);

const hasMultipleRoles = computed(() => authStore.hasMultipleRoles);
const currentRole = computed(() => authStore.userRole);

const availableRolesList = computed(() => {
  const roles: { value: UserRole; label: string }[] = [];
  authStore.availableRoles.forEach((_, role) => {
    if (role === 'fighter') roles.push({ value: 'fighter', label: 'Fighter' });
    if (role === 'plo') roles.push({ value: 'plo', label: 'Promotion League Owner' });
    if (role === 'spectator') roles.push({ value: 'spectator', label: 'Spectator' });
  });
  return roles;
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

function handleRoleSwitch(event: Event) {
  const target = event.target as HTMLSelectElement;
  const newRole = target.value as UserRole;
  if (newRole !== currentRole.value) {
    authStore.switchRole(newRole);
    router.push(authStore.getDashboardRoute());
  }
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
  border-right: 1px solid rgba(59, 130, 246, 0.2);
  text-align: left;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 999;
  transition: transform 0.3s ease;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.3);
  border-top-right-radius: 20px;
  border-bottom-right-radius: 30px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(15, 23, 42, 0.5);
  flex-shrink: 0;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px 15px;
  min-height: 0;
}

.sidebar-footer {
  padding: 12px 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(15, 23, 42, 0.5);
  flex-shrink: 0;
}

.sidebar-closed {
  transform: translateX(-100%);
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-header .sidebar-logo {
  width: 100%;
  max-width: 90px;
  height: auto;
  margin: 0 auto 10px auto;
  display: block;
  object-fit: contain;
}

.sidebar-header .nav-link-landing {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 10px;
  text-decoration: none;
  color: #ffffff;
  background-color: rgba(234, 88, 12, 0.9);
  border-radius: 6px;
  font-weight: 600;
  border: 2px solid rgba(234, 88, 12, 1);
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.sidebar-header .nav-link-landing .arrow {
  font-size: 1rem;
  line-height: 1;
}

.sidebar-header .nav-link-landing:hover {
  background-color: rgba(234, 88, 12, 1);
  border-color: rgba(251, 146, 60, 1);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(234, 88, 12, 0.4);
}

.sidebar-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-content ul li {
  margin-bottom: 10px;
}

.sidebar-content ul li a {
  display: block;
  padding: 8px 12px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.sidebar-content ul li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.sidebar-content ul li a.active {
  background-color: #3b82f6;
  color: white;
}

.sidebar-content ul li a.active:hover {
  background-color: #2563eb;
}

.role-switcher {
  margin-bottom: 8px;
  padding: 0;
}

.role-switcher-label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  margin-bottom: 4px;
  font-weight: 500;
}

.role-select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.95);
  color: #333;
  font-size: 0.85rem;
  cursor: pointer;
}

.role-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.logout-btn {
  width: 100%;
  padding: 8px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
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
