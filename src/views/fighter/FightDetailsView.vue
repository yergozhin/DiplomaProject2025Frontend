<template>
  <div class="fight-details-container">
    <h1 class="fight-details-title">Fight Details</h1>
    <div v-if="loading" class="status-message">Loading fight details...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="fightDetails" class="fight-content">
      <div class="fight-info">
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
              <div class="fighter-header">
                <div class="fighter-avatar">
                  <img
                    v-if="fighterAProfile?.profilePicture"
                    :src="fighterAProfile.profilePicture"
                    alt="Fighter A profile picture"
                  />
                  <div v-else class="fighter-avatar-placeholder">
                    {{ getInitial(fighterAProfile?.firstName, fighterAProfile?.lastName) }}
                  </div>
                </div>
                <div class="fighter-header-info">
                  <div class="fighter-main-name">
                    {{ formatName(fighterAProfile?.firstName, fighterAProfile?.lastName, fightDetails.fighterAName) }}
                  </div>
                  <div class="fighter-main-email">
                    {{ formatEmail(fighterAProfile?.email, fightDetails.fighterAEmail) }}
                  </div>
                  <div class="fighter-main-meta">
                    <span class="meta-item">
                      {{ formatWeightClass(fighterAProfile?.currentWeightClass, fightDetails.fighterAWeightClass) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="info-row">
                <span class="label">Nickname:</span>
                <span class="value">{{ formatField(fighterAProfile?.nickname) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">
                  {{ formatEmail(fighterAProfile?.email, fightDetails.fighterAEmail) }}
                </span>
              </div>
              <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">{{ formatField(fighterAProfile?.phoneNumber) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Gender:</span>
                <span class="value">{{ formatField(fighterAProfile?.gender) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Date of birth:</span>
                <span class="value">{{ formatDateField(fighterAProfile?.dateOfBirth) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Location:</span>
                <span class="value">
                  {{ formatLocation(fighterAProfile?.city, fighterAProfile?.country) }}
                </span>
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
              <div class="fighter-header">
                <div class="fighter-avatar">
                  <img
                    v-if="fighterBProfile?.profilePicture"
                    :src="fighterBProfile.profilePicture"
                    alt="Fighter B profile picture"
                  />
                  <div v-else class="fighter-avatar-placeholder">
                    {{ getInitial(fighterBProfile?.firstName, fighterBProfile?.lastName) }}
                  </div>
                </div>
                <div class="fighter-header-info">
                  <div class="fighter-main-name">
                    {{ formatName(fighterBProfile?.firstName, fighterBProfile?.lastName, fightDetails.fighterBName) }}
                  </div>
                  <div class="fighter-main-email">
                    {{ formatEmail(fighterBProfile?.email, fightDetails.fighterBEmail) }}
                  </div>
                  <div class="fighter-main-meta">
                    <span class="meta-item">
                      {{ formatWeightClass(fighterBProfile?.currentWeightClass, fightDetails.fighterBWeightClass) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="info-row">
                <span class="label">Nickname:</span>
                <span class="value">{{ formatField(fighterBProfile?.nickname) }}</span>
            </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">
                  {{ formatEmail(fighterBProfile?.email, fightDetails.fighterBEmail) }}
                </span>
            </div>
              <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">{{ formatField(fighterBProfile?.phoneNumber) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Gender:</span>
                <span class="value">{{ formatField(fighterBProfile?.gender) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Date of birth:</span>
                <span class="value">{{ formatDateField(fighterBProfile?.dateOfBirth) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Location:</span>
                <span class="value">
                  {{ formatLocation(fighterBProfile?.city, fighterBProfile?.country) }}
                </span>
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
import { fighterService } from '@/services/fighter.service';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMessage } from '@/utils/errorMessages';
import FightContractsList from '@/components/FightContractsList.vue';
import type { AcceptedFight, Fighter } from '@/types';

const route = useRoute();
const authStore = useAuthStore();
const fightId = route.params.fightId as string;
const fightDetails = ref<AcceptedFight | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const showCreateFormFor = ref<'fighterA' | 'fighterB' | null>(null);
const fighterAProfile = ref<Fighter | null>(null);
const fighterBProfile = ref<Fighter | null>(null);

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
    if (fightDetails.value) {
      await loadFighterProfiles(fightDetails.value);
    }
  } catch (err: any) {
    if (err.status === 404) {
      error.value = 'Fight not found';
    } else {
      error.value = getErrorMessage(err.error, 'load fight details');
    }
  } finally {
    loading.value = false;
  }
}

async function loadFighterProfiles(details: AcceptedFight) {
  const tasks: Promise<void>[] = [];
  if (details.fighterAUserId) {
    tasks.push(
      fighterService
        .getPublicById(details.fighterAUserId)
        .then(p => {
          fighterAProfile.value = p;
        })
        .catch(() => {
          fighterAProfile.value = null;
        }),
    );
  }
  if (details.fighterBUserId) {
    tasks.push(
      fighterService
        .getPublicById(details.fighterBUserId)
        .then(p => {
          fighterBProfile.value = p;
        })
        .catch(() => {
          fighterBProfile.value = null;
        }),
    );
  }
  if (tasks.length) {
    await Promise.all(tasks);
  }
}

function showCreateContractForm(fighter: 'fighterA' | 'fighterB') {
  showCreateFormFor.value = fighter;
}

function handleContractCreated() {
  showCreateFormFor.value = null;
}

function formatName(first: string | null | undefined, last: string | null | undefined, fallback: string | null | undefined): string {
  const f = first?.trim() || '';
  const l = last?.trim() || '';
  if (f || l) return `${f} ${l}`.trim();
  if (fallback && fallback.trim()) return fallback.trim();
  return 'Not set';
}

function formatEmail(email: string | null | undefined, fallback: string | null | undefined): string {
  if (email && email.trim()) return email.trim();
  if (fallback && fallback.trim()) return fallback.trim();
  return 'Not set';
}

function formatField(value: string | null | undefined): string {
  if (!value) return 'Not set';
  const trimmed = value.trim();
  return trimmed || 'Not set';
}

function formatWeightClass(current: string | null | undefined, fallback: string | null | undefined): string {
  if (current && current.trim()) return current.trim();
  if (fallback && fallback.trim()) return fallback.trim();
  return 'Not set';
}

function formatDateField(value: string | null | undefined): string {
  if (!value) return 'Not set';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Not set';
  return d.toLocaleDateString();
}

function formatLocation(city: string | null | undefined, country: string | null | undefined): string {
  const c = city?.trim() || '';
  const co = country?.trim() || '';
  if (!c && !co) return 'Not set';
  if (c && co) return `${c}, ${co}`;
  return c || co;
}

function getInitial(first: string | null | undefined, last: string | null | undefined): string {
  const f = first?.trim();
  const l = last?.trim();
  const src = f || l || 'N';
  return src.charAt(0).toUpperCase();
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

.fighter-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.fighter-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.12), rgba(59, 130, 246, 0.12));
  border: 1px solid #d1d5db;
}

.fighter-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fighter-avatar-placeholder {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.fighter-header-info {
  min-width: 0;
}

.fighter-main-name {
  font-weight: 600;
  color: #111827;
}

.fighter-main-email {
  font-size: 13px;
  color: #4b5563;
}

.fighter-main-meta {
  margin-top: 2px;
  font-size: 12px;
  color: #6b7280;
}

.meta-item {
  margin-right: 8px;
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
