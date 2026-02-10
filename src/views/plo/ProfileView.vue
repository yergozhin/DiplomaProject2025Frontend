<template>
  <div class="profile-container">
    <h1 class="profile-title">Promotion League Profile</h1>

    <div v-if="loading" class="status">Loading profile...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!profile" class="status">Profile not found.</div>
    <div v-else class="profile-card">
      <div class="profile-header">
        <div class="profile-picture-container">
          <img
            v-if="profile.logo && isBase64Image(profile.logo)"
            :src="profile.logo"
            alt="Logo"
            class="profile-picture-main"
          />
          <div v-else-if="profile.logo" class="profile-picture-link">
            <a :href="profile.logo" target="_blank" rel="noopener">View Logo</a>
          </div>
          <div v-else class="profile-picture-placeholder">
            <span>No Logo</span>
          </div>
        </div>
        <div class="profile-header-info">
          <div class="profile-name-large">
            {{ profile.leagueName || 'Not set' }}
          </div>
          <div class="profile-email-large">{{ profile.email }}</div>
          <div class="profile-header-meta">
            <span class="header-meta-item">{{ profile.phoneNumber || 'Not set' }}</span>
            <span class="header-meta-sep">•</span>
            <span class="header-meta-item">{{ formatDate(profile.foundedDate) }}</span>
            <span class="header-meta-sep">•</span>
            <span class="header-meta-item">{{ formatOwner(profile.ownerFirstName, profile.ownerLastName) }}</span>
          </div>
        </div>
      </div>

      <div class="profile-section-full">
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
        <div class="profile-row" v-if="profile.description">
          <span class="label">Description:</span>
          <span class="value">{{ profile.description }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Social Links:</span>
          <span class="value">{{ profile.socialMediaLinks || 'Not set' }}</span>
        </div>
      </div>

        <PloEventStatistics />

        <button type="button" class="edit-btn" @click="startEdit" v-if="!editing">
          Edit Profile
        </button>

        <form v-if="editing" class="edit-form" @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label for="leagueName">League Name</label>
            <input id="leagueName" v-model="form.leagueName" type="text" placeholder="Enter your league name" :disabled="submitting" />
          </div>
          <div class="form-group">
            <label for="foundedDate">Founded Date</label>
            <input id="foundedDate" v-model="form.foundedDate" type="date" :disabled="submitting" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="ownerFirstName">Owner First Name</label>
            <input id="ownerFirstName" v-model="form.ownerFirstName" type="text" placeholder="Enter owner's first name" :disabled="submitting" />
          </div>
          <div class="form-group">
            <label for="ownerLastName">Owner Last Name</label>
            <input id="ownerLastName" v-model="form.ownerLastName" type="text" placeholder="Enter owner's last name" :disabled="submitting" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input id="phoneNumber" v-model="form.phoneNumber" type="text" placeholder="+48 123 456 789" :disabled="submitting" />
          </div>
          <div class="form-group">
            <label for="website">Website</label>
            <input id="website" v-model="form.website" type="url" placeholder="https://example.com" :disabled="submitting" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="country">Country</label>
            <input id="country" v-model="form.country" type="text" placeholder="Enter country" :disabled="submitting" />
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input id="city" v-model="form.city" type="text" placeholder="Enter city" :disabled="submitting" />
          </div>
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <input id="address" v-model="form.address" type="text" placeholder="Enter full address" :disabled="submitting" />
        </div>

        <div class="form-group">
          <label for="logo">Logo</label>
          <input
            id="logo"
            type="file"
            accept="image/*"
            @change="handleImageSelect"
            :disabled="submitting"
          />
          <div v-if="form.logo" class="image-preview-container">
            <img v-if="isBase64Image(form.logo)" :src="form.logo" alt="Preview" class="image-preview" />
            <div v-else class="image-url-display">{{ form.logo }}</div>
            <button type="button" class="remove-image-btn" @click="removeImage" :disabled="submitting">Remove</button>
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="form.description" placeholder="Describe your promotion league" :disabled="submitting"></textarea>
        </div>

        <div class="form-group">
          <label for="socialMediaLinks">Social Media Links</label>
          <textarea id="socialMediaLinks" v-model="form.socialMediaLinks" placeholder="Enter social media links" :disabled="submitting"></textarea>
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
import { getErrorMessage } from '@/utils/errorMessages';
import PloEventStatistics from '@/components/PloEventStatistics.vue';
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

function isBase64Image(value: string | null): boolean {
  if (!value) return false;
  return value.startsWith('data:image/');
}

async function loadProfile() {
  loading.value = true;
  error.value = null;
  try {
    profile.value = await ploService.getProfile();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load profile');
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

function handleImageSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    submitError.value = 'Image size must be less than 5MB';
    target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result;
    if (typeof result === 'string') {
      form.value.logo = result;
    }
  };
  reader.onerror = () => {
    submitError.value = 'Failed to read the image file';
    target.value = '';
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  form.value.logo = '';
  const fileInput = document.getElementById('logo') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
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
      logo: form.value.logo.trim() || null,
      foundedDate: form.value.foundedDate ? form.value.foundedDate : null,
      socialMediaLinks: sanitize(form.value.socialMediaLinks),
    };

    const updated = await ploService.updateProfile(payload);
    profile.value = updated;
    editing.value = false;
  } catch (err: any) {
    submitError.value = getErrorMessage(err.error, 'update your profile');
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
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  padding-left: 30px;
  text-align: left;
}

.profile-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.profile-card {
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  transition: box-shadow 0.2s ease;
}

.profile-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.profile-header {
  display: flex;
  gap: 24px;
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.profile-picture-container {
  flex-shrink: 0;
}

.profile-picture-main {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 3px solid rgba(255, 255, 255, 0.9);
  transition: transform 0.2s ease;
}

.profile-picture-main:hover {
  transform: scale(1.05);
}

.profile-picture-link {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.1), rgba(99, 102, 241, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(30, 58, 138, 0.3);
}

.profile-picture-link a {
  color: rgba(30, 58, 138, 0.9);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.profile-picture-link a:hover {
  color: rgba(30, 58, 138, 1);
}

.profile-picture-placeholder {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.1), rgba(99, 102, 241, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(30, 58, 138, 0.3);
  color: rgba(30, 58, 138, 0.6);
  font-weight: 500;
}

.profile-header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.profile-name-large {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.profile-email-large {
  font-size: 15px;
  color: #555;
  margin-top: 4px;
}

.profile-header-meta {
  margin-top: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.header-meta-item {
  font-weight: 500;
}

.header-meta-sep {
  opacity: 0.5;
}

.profile-section-full {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  padding-top: 8px;
}

.profile-row {
  display: flex;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: padding-left 0.15s ease;
}

.profile-row:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.profile-row:hover {
  padding-left: 4px;
}

.label {
  width: 140px;
  font-weight: 600;
  color: #555;
}

.value {
  flex: 1;
  color: #333;
}

.status {
  padding: 10px 0;
  color: white;
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
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.edit-form {
  margin-top: 24px;
  padding: 20px 20px 24px 20px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
  max-width: 100%;
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  width: 100%;
  box-sizing: border-box;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
  min-width: 0;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  max-width: 100%;
  font-size: 14px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
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

.image-preview-container {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.image-preview {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 2px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-url-display {
  padding: 8px 12px;
  background-color: #f3f4f6;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  color: #555;
  word-break: break-all;
}

.remove-image-btn {
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.15s ease;
}

.remove-image-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.remove-image-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

</style>


