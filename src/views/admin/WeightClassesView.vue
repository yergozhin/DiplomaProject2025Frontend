<template>
  <div class="weight-classes-container">
    <h2>Weight Classes Management</h2>
    <button v-if="!showForm" @click="showForm = true" class="add-btn">Add Weight Class</button>
    <div v-if="loading" class="status">Loading weight classes...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <form v-if="showForm" @submit.prevent="handleSubmit" class="weight-class-form">
      <div class="form-group">
        <label for="name">Name *</label>
        <input id="name" v-model="form.name" type="text" required :disabled="submitting" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="minWeightKg">Min Weight (kg)</label>
          <input id="minWeightKg" v-model.number="form.minWeightKg" type="number" step="0.1" :disabled="submitting" />
        </div>
        <div class="form-group">
          <label for="maxWeightKg">Max Weight (kg)</label>
          <input id="maxWeightKg" v-model.number="form.maxWeightKg" type="number" step="0.1" :disabled="submitting" />
        </div>
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" v-model="form.description" :disabled="submitting"></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="submitting" class="submit-btn">Submit</button>
        <button type="button" @click="cancelForm" :disabled="submitting" class="cancel-btn">Cancel</button>
      </div>
    </form>
    <div v-if="weightClasses.length === 0 && !showForm" class="status">No weight classes found.</div>
    <table v-else class="weight-classes-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Weight Range</th>
          <th>Description</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="wc in weightClasses" :key="wc.id">
          <td>{{ wc.name }}</td>
          <td>{{ formatWeightRange(wc.minWeightKg, wc.maxWeightKg) }}</td>
          <td>{{ wc.description || 'No description' }}</td>
          <td>{{ formatDate(wc.createdAt) }}</td>
          <td>
            <div class="actions">
              <button type="button" class="action-button edit" @click="editWeightClass(wc)">Edit</button>
              <button
                type="button"
                class="action-button delete"
                :disabled="isProcessing(wc.id)"
                @click="deleteWeightClass(wc.id)"
              >
                Delete
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
import type { WeightClass, CreateWeightClassRequest, UpdateWeightClassRequest } from '@/types';
import { weightClassesService } from '@/services/weight-classes.service';

const weightClasses = ref<WeightClass[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const showForm = ref(false);
const submitting = ref(false);
const processingId = ref<string | null>(null);
const editingId = ref<string | null>(null);

const form = ref<CreateWeightClassRequest>({
  name: '',
  minWeightKg: null,
  maxWeightKg: null,
  description: null,
});

function formatWeightRange(min: number | null, max: number | null) {
  if (min === null && max === null) return 'No range';
  if (min === null) return `Up to ${max} kg`;
  if (max === null) return `${min}+ kg`;
  return `${min} - ${max} kg`;
}

function formatDate(date: string | null) {
  if (!date) return 'Unknown';
  return new Date(date).toLocaleDateString();
}

function isProcessing(id: string) {
  return processingId.value === id;
}

function cancelForm() {
  showForm.value = false;
  editingId.value = null;
  form.value = {
    name: '',
    minWeightKg: null,
    maxWeightKg: null,
    description: null,
  };
}

function editWeightClass(wc: WeightClass) {
  editingId.value = wc.id;
  form.value = {
    name: wc.name,
    minWeightKg: wc.minWeightKg,
    maxWeightKg: wc.maxWeightKg,
    description: wc.description,
  };
  showForm.value = true;
}

async function handleSubmit() {
  submitting.value = true;
  error.value = null;
  try {
    if (editingId.value) {
      await weightClassesService.update(editingId.value, form.value as UpdateWeightClassRequest);
    } else {
      await weightClassesService.create(form.value);
    }
    cancelForm();
    await loadWeightClasses();
  } catch (err: any) {
    error.value = err.error || 'Failed to save weight class';
  } finally {
    submitting.value = false;
  }
}

async function deleteWeightClass(id: string) {
  if (!confirm('Are you sure you want to delete this weight class?')) return;
  processingId.value = id;
  error.value = null;
  try {
    await weightClassesService.delete(id);
    await loadWeightClasses();
  } catch (err: any) {
    error.value = err.error || 'Failed to delete weight class';
  } finally {
    processingId.value = null;
  }
}

async function loadWeightClasses() {
  loading.value = true;
  error.value = null;
  try {
    weightClasses.value = await weightClassesService.getAll();
  } catch (err: any) {
    error.value = err.error || 'Failed to load weight classes';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadWeightClasses();
});
</script>

<style scoped>
.weight-classes-container {
  padding: 20px;
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

.status {
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
}

.error-message {
  color: #ff6b6b;
  font-size: 16px;
  margin-bottom: 15px;
}

.weight-class-form {
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group {
  margin-bottom: 15px;
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea {
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

.weight-classes-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.weight-classes-table th,
.weight-classes-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.weight-classes-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
}

.action-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.action-button.edit {
  background-color: #ffc107;
  color: #000;
}

.action-button.edit:hover {
  background-color: #e0a800;
}

.action-button.delete {
  background-color: #dc3545;
  color: white;
}

.action-button.delete:hover {
  background-color: #c82333;
}

.action-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>

