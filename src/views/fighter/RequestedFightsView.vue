<template>
  <div class="fights-container">
    <h1 class="fights-title">Requested Fights</h1>
    <div v-if="loading" class="status-message">Loading...</div>
    <div v-else-if="error" class="status-message">{{ error }}</div>
    <div v-else-if="fights.length === 0" class="status-message">No fight requests</div>
    <ul v-else class="fights-list">
      <li v-for="fight in fights" :key="fight.id" class="fight-item">
        <div class="fight-avatar">
          <img
            v-if="senderProfiles[fight.senderId]?.profilePicture"
            :src="senderProfiles[fight.senderId]?.profilePicture as string"
            alt="Profile picture"
          />
          <div v-else class="fight-avatar-placeholder">
            {{ getSenderInitial(senderProfiles[fight.senderId], fight) }}
          </div>
        </div>
        <div class="fight-info">
          <div class="fight-main">
            <div class="fight-name-line">
              <strong>{{ senderProfiles[fight.senderId]?.firstName || fight.senderName || fight.senderEmail }}</strong>
              <span v-if="senderProfiles[fight.senderId]?.lastName" class="fight-weight">
                {{ ' ' + senderProfiles[fight.senderId]?.lastName }}
              </span>
              <span
                v-if="senderProfiles[fight.senderId]?.currentWeightClass || fight.senderWeightClass"
                class="fight-weight"
              >
                · {{ senderProfiles[fight.senderId]?.currentWeightClass || fight.senderWeightClass }}
              </span>
            </div>
            <div class="fight-email">{{ fight.senderEmail }}</div>
          </div>

          <button
            type="button"
            class="view-profile-btn"
            @click="handleToggleFightDetails(fight)"
          >
            {{ expandedFightId === fight.id ? 'Hide details' : 'View details' }}
          </button>

          <div
            v-if="expandedFightId === fight.id"
            class="fight-details"
          >
            <div class="details-row">
              <span class="details-label">Name</span>
              <span class="details-value">
                {{ formatDetail(senderProfiles[fight.senderId]?.firstName) }}
                {{ formatDetail(senderProfiles[fight.senderId]?.lastName) }}
              </span>
            </div>
            <div class="details-row">
              <span class="details-label">Email</span>
              <span class="details-value">{{ fight.senderEmail }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Weight class</span>
              <span class="details-value">
                {{ formatDetail(senderProfiles[fight.senderId]?.currentWeightClass || fight.senderWeightClass) }}
              </span>
            </div>
            <div class="details-row">
              <span class="details-label">Status</span>
              <span class="details-value">{{ formatDetail(senderProfiles[fight.senderId]?.status) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Phone</span>
              <span class="details-value">{{ formatDetail(senderProfiles[fight.senderId]?.phoneNumber) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Date of birth</span>
              <span class="details-value">{{ formatDateDetail(senderProfiles[fight.senderId]?.dateOfBirth) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Gender</span>
              <span class="details-value">{{ formatDetail(senderProfiles[fight.senderId]?.gender) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Location</span>
              <span class="details-value">
                {{
                  senderProfiles[fight.senderId]?.city || senderProfiles[fight.senderId]?.country
                    ? (senderProfiles[fight.senderId]?.city || '') +
                      (senderProfiles[fight.senderId]?.city &&
                      senderProfiles[fight.senderId]?.country
                        ? ', '
                        : '') +
                      (senderProfiles[fight.senderId]?.country || '')
                    : 'Not set'
                }}
              </span>
            </div>
            <div class="details-row">
              <span class="details-label">Total fights</span>
              <span class="details-value">{{ formatNumberDetail(senderProfiles[fight.senderId]?.totalFights, '') }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Record</span>
              <span class="details-value">
                {{
                  senderProfiles[fight.senderId]?.wins == null &&
                  senderProfiles[fight.senderId]?.losses == null &&
                  senderProfiles[fight.senderId]?.draws == null
                    ? 'Not set'
                    : formatRecord(
                        senderProfiles[fight.senderId]?.wins,
                        senderProfiles[fight.senderId]?.losses,
                        senderProfiles[fight.senderId]?.draws,
                      )
                }}
              </span>
            </div>
            <div class="details-row">
              <span class="details-label">Awards</span>
              <span class="details-value">{{ formatDetail(senderProfiles[fight.senderId]?.awards) }}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Bio</span>
              <span class="details-value">
                {{ formatDetail(senderProfiles[fight.senderId]?.bio) }}
              </span>
            </div>
          </div>
        </div>

        <button 
          @click="handleAcceptFight(fight.id)" 
          :disabled="acceptingFightId === fight.id || acceptedFightIds.has(fight.id)"
          class="accept-btn"
        >
          <span v-if="acceptingFightId === fight.id">Accepting...</span>
          <span v-else-if="acceptedFightIds.has(fight.id)">Accepted</span>
          <span v-else>Accept Fight</span>
        </button>
      </li>
    </ul>
    <div v-if="acceptError" class="error-message">{{ acceptError }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fightService } from '@/services/fight.service';
import { fighterService } from '@/services/fighter.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { FightRequest, Fighter } from '@/types';

const fights = ref<FightRequest[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const acceptingFightId = ref<string | null>(null);
const acceptedFightIds = ref<Set<string>>(new Set());
const acceptError = ref<string | null>(null);
const expandedFightId = ref<string | null>(null);
const senderProfiles = ref<Record<string, Fighter | null>>({});
const senderLoading = ref<Set<string>>(new Set());

async function loadFights() {
  loading.value = true;
  error.value = null;
  try {
    fights.value = await fightService.getRequestedFights();
    await loadSenderProfiles();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load fight requests');
  } finally {
    loading.value = false;
  }
}

async function loadSenderProfiles() {
  const ids = Array.from(new Set(fights.value.map(f => f.senderId)));
  await Promise.all(
    ids.map(async (id) => {
      if (senderProfiles.value[id] || senderLoading.value.has(id)) return;
      senderLoading.value.add(id);
      try {
        senderProfiles.value[id] = await fighterService.getPublicById(id);
      } catch {
        senderProfiles.value[id] = null;
      } finally {
        senderLoading.value.delete(id);
      }
    }),
  );
}

async function handleAcceptFight(fightId: string) {
  acceptingFightId.value = fightId;
  acceptError.value = null;
  
  try {
    await fightService.acceptFight(fightId);
    acceptedFightIds.value.add(fightId);
    fights.value = fights.value.filter(fight => fight.id !== fightId);
  } catch (err: any) {
    acceptError.value = getErrorMessage(err.error, 'accept the fight request');
  } finally {
    acceptingFightId.value = null;
  }
}

async function handleToggleFightDetails(fight: FightRequest) {
  const id = fight.senderId;
  if (expandedFightId.value === fight.id) {
    expandedFightId.value = null;
    return;
  }
  if (!senderProfiles.value[id] && !senderLoading.value.has(id)) {
    senderLoading.value.add(id);
    try {
      senderProfiles.value[id] = await fighterService.getPublicById(id);
    } catch {
      senderProfiles.value[id] = null;
    } finally {
      senderLoading.value.delete(id);
    }
  }
  expandedFightId.value = fight.id;
}

function formatDetail(value: string | null | undefined): string {
  if (!value) return 'Not set';
  const trimmed = value.trim();
  return trimmed || 'Not set';
}

function formatNumberDetail(value: number | null | undefined, suffix: string): string {
  if (value === null || value === undefined) return 'Not set';
  const s = suffix || '';
  return s ? `${value} ${s}` : String(value);
}

function formatDateDetail(value: string | null | undefined): string {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not set';
  return date.toLocaleDateString();
}

function formatRecord(
  wins: number | null | undefined,
  losses: number | null | undefined,
  draws: number | null | undefined
): string {
  const w = wins ?? 0;
  const l = losses ?? 0;
  const d = draws ?? 0;
  return `${w}-${l}-${d}`;
}

function getSenderInitial(profile: Fighter | null | undefined, fight: FightRequest): string {
  const source =
    profile?.firstName ||
    profile?.lastName ||
    fight.senderName ||
    fight.senderEmail ||
    '?';
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 100%;
  box-sizing: border-box;
  gap: 15px;
}

.fight-avatar {
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

.fight-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fight-avatar-placeholder {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.fight-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.fight-main {
  margin-bottom: 6px;
}

.fight-name-line {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.fight-info strong {
  display: block;
  margin-bottom: 2px;
  word-break: break-word;
}

.fight-weight {
  font-size: 13px;
  color: #555;
}

.fight-email {
  font-size: 13px;
  color: #666;
}

.view-profile-btn {
  margin-top: 4px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.view-profile-btn:hover {
  background-color: #f3f4f6;
  border-color: #cbd5e1;
}

.fight-details {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px 16px;
}

.details-row {
  display: flex;
  flex-direction: column;
  font-size: 12px;
}

.details-label {
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 2px;
}

.details-value {
  color: #111827;
  word-break: break-word;
}

.accept-btn {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.accept-btn:hover:not(:disabled) {
  background-color: #218838;
}

.accept-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>

