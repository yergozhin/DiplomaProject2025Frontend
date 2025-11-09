<template>
  <div class="profile-container">
    <h1>Promotion League Profile</h1>

    <div v-if="loading" class="status">Loading profile...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!profile" class="status">Profile not found.</div>
    <div v-else class="profile-card">
      <section class="profile-section">
        <div class="profile-row">
          <span class="label">Email:</span>
          <span class="value">{{ profile.email }}</span>
        </div>
        <div class="profile-row">
          <span class="label">League Name:</span>
          <span class="value">{{ profile.leagueName || 'Not set' }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Owner:</span>
          <span class="value">{{ formatOwner(profile.ownerFirstName, profile.ownerLastName) }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Phone:</span>
          <span class="value">{{ profile.phoneNumber || 'Not set' }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Website:</span>
          <span class="value">
            <a v-if="profile.website" :href="profile.website" target="_blank" rel="noreferrer">
              {{ profile.website }}
            </a>
            <span v-else>Not set</span>
          </span>
        </div>
        <div class="profile-row">
          <span class="label">Location:</span>
          <span class="value">{{ formatLocation(profile.city, profile.country) }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Address:</span>
          <span class="value">{{ profile.address || 'Not set' }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Founded:</span>
          <span class="value">{{ formatDate(profile.foundedDate) }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Description:</span>
          <span class="value">{{ profile.description || 'Not set' }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Logo:</span>
          <span class="value">
            <a v-if="profile.logo" :href="profile.logo" target="_blank" rel="noreferrer">View logo</a>
            <span v-else>Not set</span>
          </span>
        </div>
        <div class="profile-row">
          <span class="label">Social Links:</span>
          <span class="value">{{ profile.socialMediaLinks || 'Not set' }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Created:</span>
          <span class="value">{{ formatDateTime(profile.createdAt) }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Updated:</span>
          <span class="value">{{ formatDateTime(profile.updatedAt) }}</span>
        </div>
      </section>

      <button type="button" class="edit-btn" @click="startEdit" v-if="!editing">
        Edit Profile
      </button>

      <form v-if="editing" class="edit-form" @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label for="leagueName">League Name</label>
            <input id="leagueName" v-model="form.leagueName" type="text" :disabled="submitting" />
          </div>
          <div class="form-group">
            <label for="foundedDate">Founded Date</label>
            <input id="foundedDate" v-model="form.foundedDate" type="date" :disabled="submitting" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="ownerFirstName">Owner First Name</label>
            <input id="ownerFirstName" v-model="form.ownerFirstName" type="text" :disabled="submitting" />
          </div>
          <div class="form-group">
            <label for="ownerLastName">Owner Last Name</label>
            <input id="ownerLastName" v-model="form.ownerLastName" type="text" :disabled="submitting" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input id="phoneNumber" v-model="form.phoneNumber" type="text" :disabled="submitting" />
          </div>
          <div class="form-group">
            <label for="website">Website</label>
            <input id="website" v-model="form.website" type="url" :disabled="submitting" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="country">Country</label>
            <input id="country" v-model="form.country" type="text" :disabled="submitting" />
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input id="city" v-model="form.city" type="text" :disabled="submitting" />
          </div>
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <input id="address" v-model="form.address" type="text" :disabled="submitting" />
        </div>

        <div class="form-group">
          <label for="logo">Logo URL</label>
          <input id="logo" v-model="form.logo" type="url" :disabled="submitting" />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="form.description" :disabled="submitting"></textarea>
        </div>

        <div class="form-group">
          <label for="socialMediaLinks">Social Media Links</label>
          <textarea id="socialMediaLinks" v-model="form.socialMediaLinks" :disabled="submitting"></textarea>
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
import { onMounted, ref } from 'vue';
import { ploService } from '@/services/plo.service';
import type { PloProfile } from '@/types';

const profile = ref<PloProfile | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const editing = ref(false);
const submitting = ref(false);
const submitError = ref<string | null>(null);

const form = ref({
  leagueName: '',
  ownerFirstName: '',
  ownerLastName: '',
  phoneNumber: '',
  website: '',
  country: '',
  city: '',
  address: '',
  description: '',
  logo: '',
  foundedDate: '',
  socialMediaLinks: '',
});

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

function formatDate(value: string | null) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString();
}

function formatDateTime(value: string | null) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleString();
}

async function loadProfile() {
  loading.value = true;
  error.value = null;
  try {
    profile.value = await ploService.getProfile();
  } catch (err: any) {
    error.value = err.error || 'Failed to load profile';
  } finally {
    loading.value = false;
  }
}

function toDateInput(value: string | null): string {
  if (!value) return '';
  const sanitized = value.replace(/[./]/g, '-');
  const addOneDay = (year: number, month: number, day: number) => {
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().slice(0, 10);
  };
  const match = sanitized.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return addOneDay(Number(match[1]), Number(match[2]), Number(match[3]));
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function startEdit() {
  if (!profile.value) return;
  editing.value = true;
  submitError.value = null;
  form.value = {
    leagueName: profile.value.leagueName || '',
    ownerFirstName: profile.value.ownerFirstName || '',
    ownerLastName: profile.value.ownerLastName || '',
    phoneNumber: profile.value.phoneNumber || '',
    website: profile.value.website || '',
    country: profile.value.country || '',
    city: profile.value.city || '',
    address: profile.value.address || '',
    description: profile.value.description || '',
    logo: profile.value.logo || '',
    foundedDate: toDateInput(profile.value.foundedDate),
    socialMediaLinks: profile.value.socialMediaLinks || '',
  };
}

function cancelEdit() {
  editing.value = false;
  submitError.value = null;
}

function sanitize(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function handleSubmit() {
  submitting.value = true;
  submitError.value = null;
  try {
    const payload = {
      leagueName: sanitize(form.value.leagueName),
      ownerFirstName: sanitize(form.value.ownerFirstName),
      ownerLastName: sanitize(form.value.ownerLastName),
      phoneNumber: sanitize(form.value.phoneNumber),
      website: sanitize(form.value.website),
      country: sanitize(form.value.country),
      city: sanitize(form.value.city),
      address: sanitize(form.value.address),
      description: sanitize(form.value.description),
      logo: sanitize(form.value.logo),
      foundedDate: form.value.foundedDate ? form.value.foundedDate : null,
      socialMediaLinks: sanitize(form.value.socialMediaLinks),
    };

    const updated = await ploService.updateProfile(payload);
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
  max-width: 720px;
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

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.label {
  width: 140px;
  font-weight: bold;
}

.value {
  flex: 1;
  min-width: 160px;
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
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.form-group {
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
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


