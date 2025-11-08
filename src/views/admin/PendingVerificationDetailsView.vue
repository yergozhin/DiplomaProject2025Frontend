<template>
  <div class="details-container">
    <button type="button" class="back-button" @click="goBack">
      ← Back to pending verifications
    </button>

    <div v-if="loading" class="status">Loading fighter details...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!fighter" class="status">
      Fighter information is not available.
    </div>
    <div v-else>
      <section class="fighter-section">
        <h2>{{ fighterName }}</h2>
        <div class="fighter-meta">
          <div><strong>Email:</strong> {{ fighter.email }}</div>
          <div><strong>Weight class:</strong> {{ fighter.currentWeightClass || fighter.weightClass || 'Not set' }}</div>
          <div><strong>Location:</strong> {{ formatLocation(fighter) }}</div>
          <div><strong>Status:</strong> {{ fighter.status || 'Not set' }}</div>
        </div>
        <div class="fighter-record">
          <h3>Record</h3>
          <div class="record-row">
            <div><strong>Total fights:</strong> {{ fighter.totalFights ?? 'Not set' }}</div>
            <div><strong>Wins:</strong> {{ fighter.wins ?? 'Not set' }}</div>
            <div><strong>Losses:</strong> {{ fighter.losses ?? 'Not set' }}</div>
            <div><strong>Draws:</strong> {{ fighter.draws ?? 'Not set' }}</div>
          </div>
          <div v-if="fighter.awards" class="awards">
            <strong>Awards:</strong>
            <pre>{{ fighter.awards }}</pre>
          </div>
          <div v-if="fighter.recordAdminNotes" class="awards">
            <strong>Admin notes:</strong>
            <pre>{{ fighter.recordAdminNotes }}</pre>
          </div>
        </div>
      </section>

      <section class="verifications-section">
        <h3>Verification submissions</h3>
        <div v-if="verifications.length === 0" class="status">
          No verifications for this fighter.
        </div>
        <table v-else class="verifications-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Value</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Draws</th>
              <th>Awards</th>
              <th>Status</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="verification in verifications" :key="verification.id">
              <td class="capitalize">{{ verification.type }}</td>
              <td class="value-cell">{{ verification.value }}</td>
              <td>{{ verification.wins }}</td>
              <td>{{ verification.losses }}</td>
              <td>{{ verification.draws }}</td>
              <td>{{ verification.awards || '—' }}</td>
              <td class="capitalize">{{ formatStatus(verification.status) }}</td>
              <td>{{ formatDate(verification.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Fighter, FighterVerification } from '@/types';
import { adminService } from '@/services/admin.service';

const route = useRoute();
const router = useRouter();

const fighter = ref<Fighter | null>(null);
const verifications = ref<FighterVerification[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const fighterId = computed(() => {
  const value = route.params.fighterId;
  if (typeof value === 'string') return value;
  return Array.isArray(value) ? value[0] : null;
});

const fighterName = computed(() => {
  if (!fighter.value) return 'Fighter details';
  const { firstName, lastName, name, nickname } = fighter.value;
  const parts = [firstName, lastName].filter(Boolean);
  let display = parts.join(' ');
  if (!display && name) {
    display = name;
  }
  if (!display) {
    display = 'Unknown fighter';
  }
  if (nickname) {
    return `${display} (${nickname})`;
  }
  return display;
});

function goBack() {
  router.push({ name: 'AdminPendingVerifications' });
}

function formatLocation(payload: Fighter) {
  if (payload.country && payload.city) return `${payload.city}, ${payload.country}`;
  if (payload.country) return payload.country;
  if (payload.city) return payload.city;
  return 'Not set';
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function formatStatus(value: string) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

async function loadData() {
  if (!fighterId.value) {
    error.value = 'Invalid fighter id.';
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const details = await adminService.getPendingVerificationDetails(fighterId.value);
    fighter.value = details.fighter;
    verifications.value = details.verifications;
    if (!fighter.value) {
      error.value = 'Fighter not found.';
    }
  } catch (err: any) {
    error.value = err.error || 'Failed to load fighter details.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.details-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-button {
  align-self: flex-start;
  padding: 6px 10px;
  border: 1px solid #1f2937;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  font-size: 13px;
}

.status,
.error-message {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9fafb;
  color: #333;
}

.error-message {
  border-color: #fca5a5;
  background-color: #fee2e2;
  color: #7f1d1d;
}

.fighter-section {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 16px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fighter-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  font-size: 14px;
}

.fighter-record {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fighter-record h3 {
  margin: 0;
  font-size: 16px;
}

.record-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
  font-size: 14px;
}

.awards {
  font-size: 14px;
}

.awards pre {
  margin: 4px 0 0;
  padding: 8px;
  background-color: #f9fafb;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}

.verifications-section {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 16px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.verifications-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  font-size: 14px;
}

.verifications-table th,
.verifications-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.verifications-table thead {
  background-color: #f3f4f6;
}

.capitalize {
  text-transform: capitalize;
}

.value-cell {
  max-width: 280px;
  word-break: break-word;
}
</style>


