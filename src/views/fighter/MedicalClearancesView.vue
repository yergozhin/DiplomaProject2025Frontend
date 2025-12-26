<template>
  <div class="clearances-container">
    <h1 class="clearances-title">Medical Clearances</h1>
    <button v-if="!showForm" @click="showForm = true" class="add-btn">Add Clearance</button>
    <div v-if="loading" class="status-message">Loading clearances...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="clearances.length === 0 && !showForm" class="status-message">No medical clearances recorded</div>
    <form v-if="showForm" @submit.prevent="handleSubmit" class="clearance-form">
      <div class="form-group">
        <label for="clearanceDate">Clearance Date *</label>
        <input id="clearanceDate" v-model="form.clearanceDate" type="date" required :disabled="submitting" />
      </div>
      <div class="form-group">
        <label for="expirationDate">Expiration Date</label>
        <input id="expirationDate" v-model="form.expirationDate" type="date" :disabled="submitting" />
      </div>
      <div class="form-group">
        <label for="clearedBy">Cleared By</label>
        <input id="clearedBy" v-model="form.clearedBy" type="text" :disabled="submitting" />
      </div>
      <div class="form-group">
        <label for="clearanceType">Clearance Type</label>
        <select id="clearanceType" v-model="form.clearanceType" :disabled="submitting">
          <option :value="null">Not Set</option>
          <option value="pre-fight">Pre-Fight</option>
          <option value="post-fight">Post-Fight</option>
          <option value="annual">Annual</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>
      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea id="notes" v-model="form.notes" :disabled="submitting"></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="submitting" class="submit-btn">Submit</button>
        <button type="button" @click="cancelForm" :disabled="submitting" class="cancel-btn">Cancel</button>
      </div>
    </form>
    <ul v-if="clearances.length > 0" class="clearances-list">
      <li v-for="clearance in clearances" :key="clearance.id" class="clearance-item">
        <div class="clearance-header">
          <strong>{{ formatType(clearance.clearanceType) }}</strong>
          <span class="clearance-date">{{ formatDate(clearance.clearanceDate) }}</span>
        </div>
        <div class="clearance-details">
          <div v-if="clearance.expirationDate" class="clearance-expiry">
            <span class="label">Expires:</span>
            <span class="value">{{ formatDate(clearance.expirationDate) }}</span>
          </div>
          <div v-if="clearance.clearedBy" class="clearance-doctor">
            <span class="label">Cleared By:</span>
            <span class="value">{{ clearance.clearedBy }}</span>
          </div>
          <div v-if="clearance.notes" class="clearance-notes">
            <span class="label">Notes:</span>
            <span class="value">{{ clearance.notes }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { medicalClearancesService } from '@/services/medical-clearances.service';
import type { MedicalClearance, CreateClearanceRequest } from '@/types';

const authStore = useAuthStore();
const clearances = ref<MedicalClearance[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const showForm = ref(false);
const submitting = ref(false);

const form = ref<CreateClearanceRequest>({
  fighterId: '',
  clearanceDate: '',
  expirationDate: null,
  clearedBy: null,
  clearanceType: null,
  notes: null,
});

function formatDate(date: string | null) {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString();
}

function formatType(type: string | null) {
  if (!type) return 'Medical Clearance';
  return type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function cancelForm() {
  showForm.value = false;
  form.value = {
    fighterId: '',
    clearanceDate: '',
    expirationDate: null,
    clearedBy: null,
    clearanceType: null,
    notes: null,
  };
}

async function handleSubmit() {
  if (!authStore.user?.id) return;
  submitting.value = true;
  error.value = null;
  try {
    form.value.fighterId = authStore.user.id;
    await medicalClearancesService.create(form.value);
    showForm.value = false;
    form.value = {
      fighterId: '',
      clearanceDate: '',
      expirationDate: null,
      clearedBy: null,
      clearanceType: null,
      notes: null,
    };
    await loadClearances();
  } catch (err: any) {
    error.value = err.error || 'Failed to create medical clearance';
  } finally {
    submitting.value = false;
  }
}

async function loadClearances() {
  if (!authStore.user?.id) return;
  loading.value = true;
  error.value = null;
  try {
    clearances.value = await medicalClearancesService.getByFighter(authStore.user.id);
  } catch (err: any) {
    error.value = err.error || 'Failed to load medical clearances';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadClearances();
});
</script>

<style scoped>
.clearances-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.clearances-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.add-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-btn:hover {
  background-color: #0056b3;
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

.clearance-form {
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #218838;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.clearances-list {
  list-style: none;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.clearance-item {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.clearance-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.clearance-date {
  color: #666;
  font-size: 14px;
}

.clearance-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.clearance-expiry,
.clearance-doctor,
.clearance-notes {
  display: flex;
  gap: 10px;
}

.label {
  font-weight: bold;
  color: #333;
}

.value {
  color: #666;
}
</style>

