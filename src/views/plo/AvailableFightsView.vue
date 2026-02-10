<template>
  <div class="fights-container">
    <h1 class="fights-title">Available Fights</h1>
    <div v-if="loading" class="status-message">Loading...</div>
    <div v-else-if="error" class="status-message">{{ error }}</div>
    <div v-else-if="fights.length === 0" class="status-message">No available fights</div>
    <ul v-else class="fights-list">
      <li v-for="fight in fights" :key="fight.id" class="fight-item">
        <div class="fighters">
          <div class="fighter">
            <div class="fighter-avatar">
              <img
                v-if="fighterProfiles[fight.fighterAUserId]?.profilePicture"
                :src="fighterProfiles[fight.fighterAUserId]?.profilePicture as string"
                alt="Fighter A profile picture"
              />
              <div v-else class="fighter-avatar-placeholder">
                {{ getInitialName(fighterProfiles[fight.fighterAUserId]?.firstName, fighterProfiles[fight.fighterAUserId]?.lastName) }}
              </div>
            </div>
            <div class="fighter-info">
              <div class="fighter-name-line">
                <strong>{{ formatName(fighterProfiles[fight.fighterAUserId]?.firstName, fighterProfiles[fight.fighterAUserId]?.lastName, fight.fighterAName) }}</strong>
                <span class="fighter-weight">
                  {{ formatWeightClass(fighterProfiles[fight.fighterAUserId]?.currentWeightClass, fight.fighterAWeightClass) }}
                </span>
              </div>
              <div class="fighter-email">
                {{ formatEmail(fighterProfiles[fight.fighterAUserId]?.email, fight.fighterAEmail) }}
              </div>
            </div>
          </div>
          <div class="vs">VS</div>
          <div class="fighter">
            <div class="fighter-avatar">
              <img
                v-if="fighterProfiles[fight.fighterBUserId]?.profilePicture"
                :src="fighterProfiles[fight.fighterBUserId]?.profilePicture as string"
                alt="Fighter B profile picture"
              />
              <div v-else class="fighter-avatar-placeholder">
                {{ getInitialName(fighterProfiles[fight.fighterBUserId]?.firstName, fighterProfiles[fight.fighterBUserId]?.lastName) }}
              </div>
            </div>
            <div class="fighter-info">
              <div class="fighter-name-line">
                <strong>{{ formatName(fighterProfiles[fight.fighterBUserId]?.firstName, fighterProfiles[fight.fighterBUserId]?.lastName, fight.fighterBName) }}</strong>
                <span class="fighter-weight">
                  {{ formatWeightClass(fighterProfiles[fight.fighterBUserId]?.currentWeightClass, fight.fighterBWeightClass) }}
                </span>
              </div>
              <div class="fighter-email">
                {{ formatEmail(fighterProfiles[fight.fighterBUserId]?.email, fight.fighterBEmail) }}
              </div>
            </div>
          </div>
        </div>
        <div class="fight-actions">
          <button @click="handleSendOffers(fight.id)" class="send-offers-btn">Send Offers</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fightService } from '@/services/fight.service';
import { fighterService } from '@/services/fighter.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { AcceptedFight, Fighter } from '@/types';

const router = useRouter();
const fights = ref<AcceptedFight[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const fighterProfiles = ref<Record<string, Fighter | null>>({});

async function loadFights() {
  loading.value = true;
  error.value = null;
  try {
    fights.value = await fightService.getAvailableFightsForPlo();
    await loadFighterProfiles();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load available fights');
  } finally {
    loading.value = false;
  }
}

async function loadFighterProfiles() {
  const ids = Array.from(
    new Set(fights.value.flatMap(f => [f.fighterAUserId, f.fighterBUserId])),
  );

  await Promise.all(
    ids.map(async (id) => {
      if (!id || fighterProfiles.value[id]) return;
      try {
        fighterProfiles.value[id] = await fighterService.getPublicById(id);
      } catch {
        fighterProfiles.value[id] = null;
      }
    }),
  );
}

function handleSendOffers(fightId: string) {
  router.push(`/plo/send-offer?fightId=${fightId}`);
}

function formatName(first: string | null | undefined, last: string | null | undefined, fallbackName: string | null | undefined): string {
  const f = first?.trim() || '';
  const l = last?.trim() || '';
  if (f || l) return `${f} ${l}`.trim();
  if (fallbackName && fallbackName.trim()) return fallbackName.trim();
  return 'Not set';
}

function formatWeightClass(current: string | null | undefined, fallback: string | null | undefined): string {
  if (current && current.trim()) return current.trim();
  if (fallback && fallback.trim()) return fallback.trim();
  return 'Not set';
}

function formatEmail(email: string | null | undefined, fallback: string | null | undefined): string {
  if (email && email.trim()) return email.trim();
  if (fallback && fallback.trim()) return fallback.trim();
  return 'Not set';
}

function getInitialName(first: string | null | undefined, last: string | null | undefined): string {
  const f = first?.trim();
  const l = last?.trim();
  const source = f || l || 'N';
  return source.charAt(0).toUpperCase();
}

onMounted(() => {
  loadFights();
});
</script>

<style scoped>
.fights-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.fights-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.status-message {
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
}

.fights-list {
  list-style: none;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.fight-item {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  max-width: 100%;
  box-sizing: border-box;
}

.fighters {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.fighter {
  flex: 1;
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
  margin-bottom: 6px;
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

.fighter-info {
  min-width: 0;
}

.fighter-name-line {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.vs {
  font-weight: bold;
  font-size: 18px;
  color: #666;
}

.fight-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.send-offers-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-offers-btn:hover {
  background-color: #0056b3;
}
</style>

