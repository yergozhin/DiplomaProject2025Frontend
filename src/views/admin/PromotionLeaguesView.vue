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
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="plo in plos" :key="plo.id">
          <td>{{ plo.email }}</td>
          <td>{{ plo.name || 'Unknown' }}</td>
          <td>
            <span class="status-pill" :class="plo.status">{{ formatStatus(plo.status) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { PromotionLeagueOwner } from '@/types';
import { adminService } from '@/services/admin.service';

const plos = ref<PromotionLeagueOwner[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

async function loadPlos() {
  loading.value = true;
  error.value = null;
  try {
    plos.value = await adminService.getPromotionLeagues();
  } catch (err: any) {
    error.value = err.error || 'Failed to load promotion leagues';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadPlos();
});
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
</style>


