<template>
  <div class="rankings-container">
    <h1 class="rankings-title">Rankings</h1>
    <div v-if="loading" class="status-message">Loading rankings...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="rankings.length === 0" class="status-message">No rankings found</div>
    <div v-else>
      <h2 class="rankings-subtitle">Pound for Pound Rankings</h2>
      <table class="rankings-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Fighter</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Draws</th>
            <th>Total Fights</th>
            <th>Win Rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ranking in sortedRankings" :key="ranking.id">
            <td>{{ ranking.rankingPosition || 'N/A' }}</td>
            <td class="fighter-cell">
              <div class="fighter-main-line">
                <span class="fighter-main-name">{{ getFighterName(ranking) }}</span>
                <span class="fighter-main-weight">
                  {{ formatField(getProfile(ranking.fighterId)?.currentWeightClass || ranking.weightClassName) }}
                </span>
              </div>
              <div
                v-if="expandedFighterId === ranking.fighterId"
                class="fighter-extra-details"
              >
                <div>Email: {{ formatEmail(getProfile(ranking.fighterId)?.email, ranking.fighterEmail) }}</div>
                <div>Nickname: {{ formatField(getProfile(ranking.fighterId)?.nickname) }}</div>
                <div>Phone: {{ formatField(getProfile(ranking.fighterId)?.phoneNumber) }}</div>
                <div>Gender: {{ formatField(getProfile(ranking.fighterId)?.gender) }}</div>
                <div>Date of birth: {{ formatDateField(getProfile(ranking.fighterId)?.dateOfBirth) }}</div>
                <div>
                  Location:
                  {{ formatLocation(getProfile(ranking.fighterId)?.city, getProfile(ranking.fighterId)?.country) }}
                </div>
              </div>
            </td>
            <td>{{ ranking.wins ?? 0 }}</td>
            <td>{{ ranking.losses ?? 0 }}</td>
            <td>{{ ranking.draws ?? 0 }}</td>
            <td>{{ ranking.totalFights ?? 0 }}</td>
            <td>{{ getWinRate(ranking) }}</td>
            <td>
              <button
                type="button"
                class="view-details-btn"
                @click="toggleDetails(ranking.fighterId)"
              >
                {{ expandedFighterId === ranking.fighterId ? 'Hide details' : 'View details' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { fighterRankingsService } from '@/services/fighter-rankings.service';
import { fighterService } from '@/services/fighter.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { FighterRanking, Fighter } from '@/types';

const rankings = ref<FighterRanking[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const fighterProfiles = ref<Record<string, Fighter | null>>({});
const expandedFighterId = ref<string | null>(null);

const sortedRankings = computed(() => {
  return [...rankings.value].sort((a, b) => {
    if (a.rankingPosition && b.rankingPosition) {
      return a.rankingPosition - b.rankingPosition;
    }
    if (a.rankingPosition) return -1;
    if (b.rankingPosition) return 1;
    return 0;
  });
});

function getFighterName(ranking: FighterRanking): string {
  return ranking.fighterName || ranking.fighterEmail || `Fighter ${ranking.fighterId.substring(0, 8)}`;
}

function getWinRate(ranking: FighterRanking): string {
  if (!ranking.totalFights || ranking.totalFights === 0) {
    return '0%';
  }
  const winRate = ((ranking.wins ?? 0) / ranking.totalFights) * 100;
  return `${winRate.toFixed(1)}%`;
}

async function loadRankings() {
  loading.value = true;
  error.value = null;
  try {
    rankings.value = await fighterRankingsService.getAll();
    await preloadFighters();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load rankings');
  } finally {
    loading.value = false;
  }
}

async function preloadFighters() {
  const ids = Array.from(
    new Set(rankings.value.map(r => r.fighterId).filter((id): id is string => !!id)),
  );

  await Promise.all(
    ids.map(async (id) => {
      if (fighterProfiles.value[id] !== undefined) return;
      try {
        fighterProfiles.value[id] = await fighterService.getPublicById(id);
      } catch {
        fighterProfiles.value[id] = null;
      }
    }),
  );
}

function toggleDetails(fighterId: string) {
  if (!fighterId) return;
  expandedFighterId.value = expandedFighterId.value === fighterId ? null : fighterId;
}

function getProfile(fighterId: string): Fighter | null | undefined {
  return fighterProfiles.value[fighterId];
}

function formatField(value: string | null | undefined): string {
  if (!value) return 'Not set';
  const trimmed = value.trim();
  return trimmed || 'Not set';
}

function formatEmail(email: string | null | undefined, fallback: string | null | undefined): string {
  if (email && email.trim()) return email.trim();
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

onMounted(() => {
  loadRankings();
});
</script>

<style scoped>
.rankings-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.rankings-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.rankings-subtitle {
  color: white;
  font-size: 22px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
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

.rankings-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.rankings-table thead {
  background-color: #f8f9fa;
}

.rankings-table th {
  padding: 12px;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid #dee2e6;
  color: #333;
}

.rankings-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #333;
}

.fighter-cell {
  max-width: 360px;
}

.fighter-main-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.fighter-main-name {
  font-weight: 600;
}

.fighter-main-weight {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.fighter-extra-details {
  margin-top: 6px;
  font-size: 12px;
  color: #4b5563;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
}

.fighter-extra-details div {
  min-width: 140px;
}

.view-details-btn {
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  cursor: pointer;
}

.view-details-btn:hover {
  background-color: #f3f4f6;
}

.rankings-table tbody tr:hover {
  background-color: #f8f9fa;
}
</style>

