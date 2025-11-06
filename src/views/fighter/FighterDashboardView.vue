<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <h2>Menu</h2>
      <ul>
        <li><a href="#" @click.prevent="currentView = 'profile'">Profile</a></li>
        <li><a href="#" @click.prevent="currentView = 'dashboard'">Dashboard</a></li>
        <li><a href="#" @click.prevent="currentView = 'opponents'">Possible opponents</a></li>
        <li><a href="#" @click.prevent="currentView = 'requested-fights'">Opponent requests</a></li>
        <li><a href="#" @click.prevent="currentView = 'fights'">Accepted fights</a></li>
        <li><a href="#" @click.prevent="currentView = 'scheduled-fights'">Scheduled Fights</a></li>
      </ul>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </div>

    <div class="main-content">
      <DashboardView v-if="currentView === 'dashboard'" />
      <PossibleOpponentsView v-else-if="currentView === 'opponents'" />
      <RequestedFightsView v-else-if="currentView === 'requested-fights'" />
      <MyFightsView 
        v-else-if="currentView === 'fights'" 
        :onViewOffers="handleViewOffers"
      />
      <FightOffersView 
        v-else-if="currentView === 'fight-offers'"
        :fightId="selectedFightId"
        @back="currentView = 'fights'"
      />
      <ScheduledFightsView v-else-if="currentView === 'scheduled-fights'" />
      <ProfileView v-else-if="currentView === 'profile'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import DashboardView from './DashboardView.vue';
import PossibleOpponentsView from './PossibleOpponentsView.vue';
import RequestedFightsView from './RequestedFightsView.vue';
import MyFightsView from './MyFightsView.vue';
import FightOffersView from './FightOffersView.vue';
import ScheduledFightsView from './ScheduledFightsView.vue';
import ProfileView from './ProfileView.vue';

const router = useRouter();
const authStore = useAuthStore();
const currentView = ref('dashboard');
const selectedFightId = ref('');

function handleViewOffers(fightId: string) {
  selectedFightId.value = fightId;
  currentView.value = 'fight-offers';
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
