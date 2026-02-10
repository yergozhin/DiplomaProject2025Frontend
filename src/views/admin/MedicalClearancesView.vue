<template>
  <div class="medical-clearances-container">
    <h2>Medical Clearances Management</h2>

    <div v-if="loading" class="status">Loading medical clearances...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="clearances.length === 0" class="status">No medical clearances found.</div>
    <table v-else class="clearances-table">
      <thead>
        <tr>
          <th>Fighter</th>
          <th>Email</th>
          <th>Clearance Date</th>
          <th>Expiration Date</th>
          <th>Type</th>
          <th>Cleared By</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="clearance in clearances" :key="clearance.id">
          <td>{{ clearance.fighterName || 'N/A' }}</td>
          <td>{{ clearance.fighterEmail }}</td>
          <td>{{ formatDate(clearance.clearanceDate) }}</td>
          <td>{{ formatDate(clearance.expirationDate) }}</td>
          <td>{{ formatType(clearance.clearanceType) }}</td>
          <td>{{ clearance.clearedBy || 'N/A' }}</td>
          <td>
            <span class="status-pill" :class="clearance.status">
              {{ formatStatus(clearance.status) }}
            </span>
          </td>
          <td>
            <button
              v-if="clearance.status === 'pending'"
              type="button"
              class="action-button approve"
              :disabled="isProcessing(clearance.id)"
              @click="updateStatus(clearance.id, 'approved')"
            >
              {{ isProcessing(clearance.id) ? 'Processing...' : 'Approve' }}
            </button>
            <button
              v-if="clearance.status === 'pending'"
              type="button"
              class="action-button reject"
              :disabled="isProcessing(clearance.id)"
              @click="updateStatus(clearance.id, 'rejected')"
            >
              {{ isProcessing(clearance.id) ? 'Processing...' : 'Reject' }}
            </button>
            <span v-else class="status-text">{{ formatStatus(clearance.status) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminService, type MedicalClearanceAdmin } from '@/services/admin.service';
import { medicalClearancesService } from '@/services/medical-clearances.service';
import { getErrorMessage } from '@/utils/errorMessages';

const clearances = ref<MedicalClearanceAdmin[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const processingIds = ref<Set<string>>(new Set());

function formatDate(dateString: string | null) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
}

function formatType(type: string | null) {
  if (!type) return 'N/A';
  return type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function isProcessing(clearanceId: string): boolean {
  return processingIds.value.has(clearanceId);
}

async function loadClearances() {
  loading.value = true;
  error.value = null;
  try {
    clearances.value = await adminService.getMedicalClearances();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load medical clearances');
  } finally {
    loading.value = false;
  }
}

async function updateStatus(clearanceId: string, status: 'approved' | 'rejected') {
  processingIds.value.add(clearanceId);
  try {
    await medicalClearancesService.update(clearanceId, { status });
    await loadClearances();
  } catch (err: any) {
    alert(getErrorMessage(err.error, 'update the clearance status'));
  } finally {
    processingIds.value.delete(clearanceId);
  }
}

onMounted(() => {
  loadClearances();
});
</script>

<style scoped>
.medical-clearances-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.status {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error-message {
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 20px;
}

.clearances-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.clearances-table thead {
  background-color: #f8f9fa;
}

.clearances-table th {
  padding: 12px;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid #dee2e6;
  color: #333;
}

.clearances-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
}

.clearances-table tbody tr:hover {
  background-color: #f8f9fa;
}

.status-pill {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-pill.pending {
  background-color: #ffc107;
  color: #000;
}

.status-pill.approved {
  background-color: #28a745;
  color: white;
}

.status-pill.rejected {
  background-color: #dc3545;
  color: white;
}

.action-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
  transition: background-color 0.2s;
}

.action-button.approve {
  background-color: #28a745;
  color: white;
}

.action-button.approve:hover:not(:disabled) {
  background-color: #218838;
}

.action-button.reject {
  background-color: #dc3545;
  color: white;
}

.action-button.reject:hover:not(:disabled) {
  background-color: #c82333;
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-text {
  color: #666;
  font-style: italic;
}
</style>

