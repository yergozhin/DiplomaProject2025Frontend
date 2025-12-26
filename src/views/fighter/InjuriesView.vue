<template>
  <div class="injuries-container">
    <h1 class="injuries-title">My Injuries</h1>
    <button v-if="!showForm" @click="showForm = true" class="add-btn">Add Injury</button>
    <div v-if="loading" class="status-message">Loading injuries...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="injuries.length === 0 && !showForm" class="status-message">No injuries recorded</div>
    <form v-if="showForm" @submit.prevent="handleSubmit" class="injury-form">
      <div class="form-group">
        <label for="injuryType">Injury Type *</label>
        <input id="injuryType" v-model="form.injuryType" type="text" required :disabled="submitting" />
      </div>
      <div class="form-group">
        <label for="injuryDescription">Description</label>
        <textarea id="injuryDescription" v-model="form.injuryDescription" :disabled="submitting"></textarea>
      </div>
      <div class="form-group">
        <label for="injuryDate">Injury Date</label>
        <input id="injuryDate" v-model="form.injuryDate" type="date" :disabled="submitting" />
      </div>
      <div class="form-group">
        <label for="recoveryStatus">Recovery Status</label>
        <select id="recoveryStatus" v-model="form.recoveryStatus" :disabled="submitting">
          <option :value="null">Not Set</option>
          <option value="recovering">Recovering</option>
          <option value="cleared">Cleared</option>
          <option value="ongoing">Ongoing</option>
        </select>
      </div>
      <div class="form-group">
        <label for="medicalNotes">Medical Notes</label>
        <textarea id="medicalNotes" v-model="form.medicalNotes" :disabled="submitting"></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="submitting" class="submit-btn">Submit</button>
        <button type="button" @click="cancelForm" :disabled="submitting" class="cancel-btn">Cancel</button>
      </div>
    </form>
    <ul v-if="injuries.length > 0" class="injuries-list">
      <li v-for="injury in injuries" :key="injury.id" class="injury-item">
        <div class="injury-header">
          <strong>{{ injury.injuryType }}</strong>
          <span class="injury-date">{{ formatDate(injury.injuryDate) }}</span>
        </div>
        <div v-if="injury.injuryDescription" class="injury-description">{{ injury.injuryDescription }}</div>
        <div class="injury-status">
          <span class="label">Status:</span>
          <span class="value">{{ formatStatus(injury.recoveryStatus) }}</span>
        </div>
        <div v-if="injury.medicalNotes" class="injury-notes">
          <span class="label">Notes:</span>
          <span class="value">{{ injury.medicalNotes }}</span>
        </div>
        <div class="injury-updated">Updated: {{ formatDateTime(injury.updatedAt) }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { fighterInjuriesService } from '@/services/fighter-injuries.service';
import type { FighterInjury, CreateInjuryRequest } from '@/types';

const authStore = useAuthStore();
const injuries = ref<FighterInjury[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const showForm = ref(false);
const submitting = ref(false);

const form = ref<CreateInjuryRequest>({
  fighterId: '',
  injuryType: '',
  injuryDescription: null,
  injuryDate: null,
  recoveryStatus: null,
  medicalNotes: null,
});

function formatDate(date: string | null) {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString();
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString();
}

function formatStatus(status: string | null) {
  if (!status) return 'Not set';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function cancelForm() {
  showForm.value = false;
  form.value = {
    fighterId: '',
    injuryType: '',
    injuryDescription: null,
    injuryDate: null,
    recoveryStatus: null,
    medicalNotes: null,
  };
}

async function handleSubmit() {
  if (!authStore.user?.id) return;
  submitting.value = true;
  error.value = null;
  try {
    form.value.fighterId = authStore.user.id;
    await fighterInjuriesService.create(form.value);
    showForm.value = false;
    form.value = {
      fighterId: '',
      injuryType: '',
      injuryDescription: null,
      injuryDate: null,
      recoveryStatus: null,
      medicalNotes: null,
    };
    await loadInjuries();
  } catch (err: any) {
    error.value = err.error || 'Failed to create injury record';
  } finally {
    submitting.value = false;
  }
}

async function loadInjuries() {
  if (!authStore.user?.id) return;
  loading.value = true;
  error.value = null;
  try {
    injuries.value = await fighterInjuriesService.getByFighter(authStore.user.id);
  } catch (err: any) {
    error.value = err.error || 'Failed to load injuries';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadInjuries();
});
</script>

<style scoped>
.injuries-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.injuries-title {
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

.injury-form {
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

.injuries-list {
  list-style: none;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.injury-item {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.injury-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.injury-date {
  color: #666;
  font-size: 14px;
}

.injury-description {
  margin-bottom: 10px;
  color: #333;
}

.injury-status,
.injury-notes {
  margin-bottom: 8px;
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

.injury-updated {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}
</style>

