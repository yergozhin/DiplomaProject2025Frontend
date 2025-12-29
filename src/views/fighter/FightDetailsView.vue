<template>
  <div class="fight-details-container">
    <h1 class="fight-details-title">Fight Details</h1>
    <div v-if="loading" class="status-message">Loading fight details...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="fightDetails" class="fight-content">
      <div class="fight-info">
        <div class="info-row">
          <span class="label">Fight ID:</span>
          <span class="value">{{ fightDetails.id }}</span>
        </div>
        <div class="info-row">
          <span class="label">Status:</span>
          <span class="value">{{ fightDetails.status }}</span>
        </div>
        <div class="info-row">
          <router-link
            :to="historyRoute"
            class="view-history-btn"
          >
            View Fight History
          </router-link>
        </div>
      </div>

      <div class="fighters-section">
        <h2>Fighters</h2>
        <div class="fighters-info">
          <div class="fighter-card">
            <h3>Fighter A</h3>
            <div class="fighter-details">
              <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">{{ fightDetails.fighterAName || fightDetails.fighterAEmail }}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">{{ fightDetails.fighterAEmail }}</span>
              </div>
              <div v-if="fightDetails.fighterAWeightClass" class="info-row">
                <span class="label">Weight Class:</span>
                <span class="value">{{ fightDetails.fighterAWeightClass }}</span>
              </div>
            </div>
            <button
              v-if="canCreateContract"
              @click="showCreateContractForm('fighterA')"
              class="create-contract-btn"
            >
              Create Contract for Fighter A
            </button>
          </div>
          <div class="fighter-card">
            <h3>Fighter B</h3>
            <div class="fighter-details">
              <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">{{ fightDetails.fighterBName || fightDetails.fighterBEmail }}</span>
            </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">{{ fightDetails.fighterBEmail }}</span>
            </div>
              <div v-if="fightDetails.fighterBWeightClass" class="info-row">
                <span class="label">Weight Class:</span>
                <span class="value">{{ fightDetails.fighterBWeightClass }}</span>
            </div>
            </div>
            <button
              v-if="canCreateContract"
              @click="showCreateContractForm('fighterB')"
              class="create-contract-btn"
            >
              Create Contract for Fighter B
            </button>
          </div>
        </div>
      </div>

      <FightContractsList
        :fight-id="fightId"
        :fight-details="fightDetails"
        :show-create-form-for="showCreateFormFor"
        @contract-created="handleContractCreated"
      />
    </div>
    <div v-else class="no-data">
      Fight not found
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fightService } from '@/services/fight.service';
import { useAuthStore } from '@/stores/auth.store';
import FightContractsList from '@/components/FightContractsList.vue';
import type { AcceptedFight } from '@/types';

const route = useRoute();
const authStore = useAuthStore();
const fightId = route.params.fightId as string;
const fightDetails = ref<AcceptedFight | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const showCreateFormFor = ref<'fighterA' | 'fighterB' | null>(null);

const historyRoute = computed(() => {
  const role = authStore.userRole;
  if (role === 'plo') {
    return `/plo/fights/${fightId}/history`;
  }
  return `/fighter/fights/${fightId}/history`;
});

const canCreateContract = computed(() => {
  const role = authStore.userRole;
  return role === 'plo' || role === 'admin';
});

async function loadFightDetails() {
  loading.value = true;
  error.value = null;
  try {
    fightDetails.value = await fightService.getFightById(fightId);
  } catch (err: any) {
    if (err.status === 404) {
      error.value = 'Fight not found';
    } else {
      error.value = err.error || 'Failed to load fight details';
    }
  } finally {
    loading.value = false;
  }
}

function showCreateContractForm(fighter: 'fighterA' | 'fighterB') {
  showCreateFormFor.value = fighter;
}

function handleContractCreated() {
  showCreateFormFor.value = null;
}

onMounted(() => {
  loadFightDetails();
});
</script>

<style scoped>
.fight-details-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.fight-details-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.status-message {
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
}

.error-message {
  color: #ff6b6b;
  font-size: 16px;
  margin-bottom: 15px;
}

.fight-content {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.fight-info {
  margin-bottom: 30px;
  background-color: white;
  padding: 15px;
  border-radius: 4px;
}

.info-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
  color: #333;
  min-width: 120px;
}

.value {
  color: #666;
}

.view-history-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.2s;
  margin-top: 10px;
}

.view-history-btn:hover {
  background-color: #218838;
}

.fighters-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.fighters-section h2 {
  color: #333;
  margin-bottom: 20px;
}

.fighters-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.fighter-card {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.fighter-card h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 18px;
}

.fighter-details {
  margin-bottom: 15px;
}

.create-contract-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  margin-top: 10px;
}

.create-contract-btn:hover {
  background-color: #0056b3;
}

.no-data {
  color: #666;
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>
