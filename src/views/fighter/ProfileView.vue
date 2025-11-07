<template>
  <div class="profile-container">
    <h1>My Profile</h1>

    <div v-if="loading" class="status">Loading profile...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!profile" class="status">Profile not found.</div>
    <div v-else class="profile-card">
      <div class="profile-row">
        <span class="label">ID:</span>
        <span class="value">{{ profile.id }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Email:</span>
        <span class="value">{{ profile.email }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Name:</span>
        <span class="value">{{ profile.name || 'Not set' }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Weight Class:</span>
        <span class="value">{{ profile.weightClass || 'Not set' }}</span>
      </div>

      <button type="button" class="edit-btn" @click="startEdit" v-if="!editing">
        Edit Profile
      </button>

      <form v-if="editing" class="edit-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name *</label>
          <input id="name" v-model="form.name" type="text" :disabled="submitting" required />
        </div>
        <div class="form-group">
          <label for="weightClass">Weight Class *</label>
          <input id="weightClass" v-model="form.weightClass" type="text" :disabled="submitting" required />
        </div>

        <div v-if="submitError" class="error-message">{{ submitError }}</div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="cancelEdit" :disabled="submitting">
            Cancel
          </button>
          <button type="submit" class="save-btn" :disabled="submitting">
            {{ submitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fighterService } from '@/services/fighter.service';
import type { Fighter } from '@/types';

const profile = ref<Fighter | null>(null);
const loading = ref(false);
const submitting = ref(false);
const editing = ref(false);
const error = ref<string | null>(null);
const submitError = ref<string | null>(null);

const form = ref({
  name: '',
  weightClass: '',
});

async function loadProfile() {
  loading.value = true;
  error.value = null;
  try {
    profile.value = await fighterService.getProfile();
  } catch (err: any) {
    error.value = err.error || 'Failed to load profile';
  } finally {
    loading.value = false;
  }
}

function startEdit() {
  if (!profile.value) return;
  editing.value = true;
  submitError.value = null;
  form.value = {
    name: profile.value.name || '',
    weightClass: profile.value.weightClass || '',
  };
}

function cancelEdit() {
  editing.value = false;
  submitError.value = null;
}

async function handleSubmit() {
  if (!profile.value) return;
  submitting.value = true;
  submitError.value = null;
  try {
    const updated = await fighterService.updateProfile({
      name: form.value.name.trim(),
      weightClass: form.value.weightClass.trim(),
    });
    profile.value = updated;
    editing.value = false;
  } catch (err: any) {
    submitError.value = err.error || 'Failed to update profile';
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
}

.profile-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.profile-row {
  display: flex;
  margin-bottom: 12px;
}

.label {
  width: 140px;
  font-weight: bold;
}

.value {
  flex: 1;
}

.status {
  padding: 10px 0;
  color: #555;
}

.error-message {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 4px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.edit-btn {
  margin-top: 20px;
  padding: 10px 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.edit-form {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn,
.save-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.cancel-btn {
  background-color: #6c757d;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #5a6268;
}

.save-btn {
  background-color: #28a745;
}

.save-btn:hover:not(:disabled) {
  background-color: #218838;
}

.cancel-btn:disabled,
.save-btn:disabled,
.edit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

