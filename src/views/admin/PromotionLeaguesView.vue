<template>
  <div class="plos-container">
    <h2>Promotion League Owners</h2>

    <div v-if="loading" class="status">Loading promotion leagues...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="plos.length === 0" class="status">No promotion league owners found.</div>
    <table v-else class="plos-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>League</th>
          <th>Owner</th>
          <th>Phone</th>
          <th>Website</th>
          <th>Location</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="plo in plos" :key="plo.id">
          <td>{{ plo.email }}</td>
          <td>{{ plo.leagueName || 'Unknown league' }}</td>
          <td>{{ formatOwner(plo.ownerFirstName, plo.ownerLastName) }}</td>
          <td>{{ plo.phoneNumber || 'Not set' }}</td>
          <td>
            <a v-if="plo.website" :href="plo.website" target="_blank" rel="noreferrer">
              {{ plo.website }}
            </a>
            <span v-else>Not set</span>
          </td>
          <td>{{ formatLocation(plo.city, plo.country) }}</td>
          <td>
            <span class="status-pill" :class="plo.status">{{ formatStatus(plo.status) }}</span>
          </td>
          <td>
            <div class="actions">
              <button
                v-if="plo.status === 'unverified'"
                type="button"
                class="action-button verify"
                :disabled="isProcessing(plo.id)"
                @click="changeStatus(plo.id, 'verified')"
              >
                Verify
              </button>
              <button
                v-else
                type="button"
                class="action-button unverify"
                :disabled="isProcessing(plo.id)"
                @click="changeStatus(plo.id, 'unverified')"
              >
                Unverify
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { PromotionLeagueOwner, PloStatus } from '@/types';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/utils/errorMessages';

const plos = ref<PromotionLeagueOwner[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const processingId = ref<string | null>(null);

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatOwner(first: string | null, last: string | null) {
  const parts = [first, last].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : 'Not set';
}

function formatLocation(city: string | null, country: string | null) {
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return 'Not set';
}

async function loadPlos() {
  loading.value = true;
  error.value = null;
  try {
    plos.value = await adminService.getPromotionLeagues();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load promotion leagues');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadPlos();
});

function isProcessing(id: string) {
  return processingId.value === id;
}

async function changeStatus(ploId: string, status: PloStatus) {
  if (processingId.value) return;
  processingId.value = ploId;
  error.value = null;
  try {
    const result = await adminService.updatePromotionLeagueStatus(ploId, status);
    const index = plos.value.findIndex((item) => item.id === ploId);
    if (index >= 0) {
      const current = plos.value[index];
      if (!current) return;
      plos.value[index] = {
        ...current,
        status: result.ploStatus as PloStatus,
      };
    }
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'update promotion league status');
  } finally {
    processingId.value = null;
  }
}
</script>

<style scoped>
.plos-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h2 {
  margin: 0;
  font-size: 20px;
}

.status,
.error-message {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f9fafb;
  color: #333;
}

.error-message {
  border-color: #fca5a5;
  background-color: #fee2e2;
  color: #7f1d1d;
}

.plos-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.plos-table th,
.plos-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 14px;
}
.plos-table td a {
  color: #2563eb;
  text-decoration: underline;
}


.plos-table thead {
  background-color: #f3f4f6;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
}

.status-pill.verified {
  background-color: #dcfce7;
  color: #15803d;
}

.status-pill.unverified {
  background-color: #fee2e2;
  color: #b91c1c;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-size: 13px;
  cursor: pointer;
  background-color: #ffffff;
}

.action-button.verify {
  border-color: #15803d;
  color: #15803d;
}

.action-button.unverify {
  border-color: #b91c1c;
  color: #b91c1c;
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>


