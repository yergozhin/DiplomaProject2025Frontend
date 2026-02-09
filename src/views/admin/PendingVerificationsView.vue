<template>
  <div class="pending-container">
    <h2>Fighters With Pending Verifications</h2>

    <div v-if="loading" class="status">Loading pending verifications...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="fighters.length === 0" class="status">
      No fighters have pending verifications right now.
    </div>
    <table v-else class="fighters-table">
      <thead>
        <tr>
          <th>Fighter</th>
          <th>Email</th>
          <th>Current Weight Class</th>
          <th>Country</th>
          <th>City</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fighter in fighters" :key="fighter.id">
          <td>
            <div class="fighter-name">
              <span>{{ formatName(fighter) }}</span>
              <span v-if="fighter.nickname" class="fighter-nickname">({{ fighter.nickname }})</span>
            </div>
          </td>
          <td>{{ fighter.email }}</td>
          <td>{{ fighter.currentWeightClass || fighter.weightClass || 'Not set' }}</td>
          <td>{{ fighter.country || 'Not set' }}</td>
          <td>{{ fighter.city || 'Not set' }}</td>
          <td>
            <button type="button" class="details-button" @click="goToDetails(fighter.id)">
              View details
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Fighter } from '@/types';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/utils/errorMessages';

const fighters = ref<Fighter[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();

function formatName(fighter: Fighter): string {
  if (fighter.firstName || fighter.lastName) {
    return [fighter.firstName, fighter.lastName].filter(Boolean).join(' ');
  }
  return fighter.name || 'Unknown fighter';
}

function goToDetails(fighterId: string) {
  router.push({
    name: 'AdminFighterVerificationDetails',
    params: { fighterId },
  });
}

async function loadFighters() {
  loading.value = true;
  error.value = null;
  try {
    fighters.value = await adminService.getPendingVerificationFighters();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load pending verifications');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadFighters();
});
</script>

<style scoped>
.pending-container {
  padding: 16px;
}

h2 {
  margin: 0 0 12px;
  font-size: 20px;
}

.status,
.error-message {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9fafb;
  color: #333;
}

.fighters-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.fighters-table th,
.fighters-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 14px;
}

.fighters-table thead {
  background-color: #f3f4f6;
}

.fighter-name {
  display: flex;
  gap: 4px;
  align-items: center;
}

.fighter-nickname {
  color: #555;
  font-size: 13px;
}

.details-button {
  padding: 6px 10px;
  border: 1px solid #1f2937;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  font-size: 13px;
}
</style>

