<template>
  <div class="profile-container">
    <h1 class="profile-title">My Profile</h1>

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
        <span class="label">First Name:</span>
        <span class="value">{{ profile.firstName || 'Not set' }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Last Name:</span>
        <span class="value">{{ profile.lastName || 'Not set' }}</span>
      </div>
      <div class="profile-row" v-if="profile.nickname">
        <span class="label">Nickname:</span>
        <span class="value">{{ profile.nickname }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Current Weight Class:</span>
        <span class="value">{{ profile.currentWeightClass || profile.weightClass || 'Not set' }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Phone Number:</span>
        <span class="value">{{ profile.phoneNumber || 'Not set' }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Date of Birth:</span>
        <span class="value">{{ formatDate(profile.dateOfBirth) }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Gender:</span>
        <span class="value">{{ profile.gender || 'Not set' }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Height:</span>
        <span class="value">{{ formatNumber(profile.height, 'cm') }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Reach:</span>
        <span class="value">{{ formatNumber(profile.reach, 'cm') }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Country:</span>
        <span class="value">{{ profile.country || 'Not set' }}</span>
      </div>
      <div class="profile-row">
        <span class="label">City:</span>
        <span class="value">{{ profile.city || 'Not set' }}</span>
      </div>
      <div class="profile-row">
        <span class="label">Status:</span>
        <span class="value">{{ profile.status || 'Not set' }}</span>
      </div>
      <div class="profile-row" v-if="profile.profilePicture">
        <span class="label">Profile Picture:</span>
        <span class="value">
          <a :href="profile.profilePicture" target="_blank" rel="noopener">Open picture</a>
        </span>
      </div>
      <div class="profile-row">
        <span class="label">Bio:</span>
        <span class="value">{{ profile.bio || 'Not set' }}</span>
      </div>
      <div class="profile-row" v-if="profile.profileCreatedAt">
        <span class="label">Profile Created:</span>
        <span class="value">{{ formatDateTime(profile.profileCreatedAt) }}</span>
      </div>
      <div class="profile-row" v-if="profile.profileUpdatedAt">
        <span class="label">Last Updated:</span>
        <span class="value">{{ formatDateTime(profile.profileUpdatedAt) }}</span>
      </div>

      <div class="profile-row" v-if="hasRecordData">
        <span class="label">Record:</span>
        <span class="value">{{ formatRecord(profile.wins, profile.losses, profile.draws) }}</span>
      </div>
      <div class="profile-row" v-if="profile.totalFights !== null">
        <span class="label">Total Fights:</span>
        <span class="value">{{ profile.totalFights }}</span>
      </div>
      <div class="profile-row" v-if="profile.awards">
        <span class="label">Awards:</span>
        <span class="value">{{ profile.awards }}</span>
      </div>
      <div class="profile-row" v-if="profile.recordConfirmed">
        <span class="label">Record Confirmed:</span>
        <span class="value">Yes</span>
      </div>

      <button type="button" class="edit-btn" @click="startEdit" v-if="!editing">
        Edit Profile
      </button>

      <form v-if="editing" class="edit-form" @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name *</label>
            <input id="firstName" v-model="form.firstName" type="text" :disabled="submitting" required />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name *</label>
            <input id="lastName" v-model="form.lastName" type="text" :disabled="submitting" required />
          </div>
        </div>

        <div class="form-group">
          <label for="nickname">Nickname</label>
          <input id="nickname" v-model="form.nickname" type="text" :disabled="submitting" />
        </div>

        <div class="form-group">
          <label for="currentWeightClass">Current Weight Class *</label>
          <input
            id="currentWeightClass"
            v-model="form.currentWeightClass"
            type="text"
            :disabled="submitting"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input id="phoneNumber" v-model="form.phoneNumber" type="text" :disabled="submitting" />
          </div>
          <div class="form-group">
            <label for="gender">Gender</label>
            <input id="gender" v-model="form.gender" type="text" :disabled="submitting" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="dateOfBirth">Date of Birth</label>
            <input id="dateOfBirth" v-model="form.dateOfBirth" type="date" :disabled="submitting" />
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <input id="status" v-model="form.status" type="text" :disabled="submitting" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="height">Height (cm)</label>
            <input id="height" v-model.number="form.height" type="number" min="0" :disabled="submitting" />
          </div>
          <div class="form-group">
            <label for="reach">Reach (cm)</label>
            <input id="reach" v-model.number="form.reach" type="number" min="0" :disabled="submitting" />
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
          <label for="profilePicture">Profile Picture URL</label>
          <input id="profilePicture" v-model="form.profilePicture" type="url" :disabled="submitting" />
        </div>

        <div class="form-group">
          <label for="bio">Bio</label>
          <textarea id="bio" v-model="form.bio" :disabled="submitting"></textarea>
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

      <div class="verification-section">
        <button type="button" class="section-toggle" @click="toggleVerificationSection">
          <span>Verification Submissions</span>
          <span>{{ isVerificationSectionOpen ? '−' : '+' }}</span>
        </button>
        <div v-show="isVerificationSectionOpen" class="section-content">
        <div v-if="verificationsLoading" class="status">Loading verification submissions...</div>
        <div v-else-if="verificationsError" class="error-message">{{ verificationsError }}</div>
        <div v-else-if="verifications.length === 0" class="status">No verification submissions yet.</div>
        <ul v-else class="verification-list">
          <li v-for="verification in verifications" :key="verification.id" class="verification-item">
            <div class="verification-header">
              <span class="verification-type">{{ formatVerificationType(verification.type) }}</span>
              <span class="status-tag" :class="`status-${verification.status}`">
                {{ formatVerificationStatus(verification.status) }}
              </span>
            </div>
            <div class="verification-value">
              <strong>Value:</strong>
              <span v-if="verification.type === 'image' || verification.type === 'link'">
                <a :href="verification.value" target="_blank" rel="noopener">{{ verification.value }}</a>
              </span>
              <span v-else>{{ verification.value }}</span>
            </div>
            <div class="verification-record" v-if="verification.wins || verification.losses || verification.draws">
              <strong>Proposed Record:</strong>
              {{ formatRecord(verification.wins, verification.losses, verification.draws) }}
            </div>
            <div class="verification-awards" v-if="verification.awards">
              <strong>Awards:</strong> {{ verification.awards }}
            </div>
            <div class="verification-dates">
              <span>Submitted: {{ formatDateTime(verification.createdAt) }}</span>
              <span v-if="verification.reviewedAt">Reviewed: {{ formatDateTime(verification.reviewedAt) }}</span>
            </div>
            <div class="verification-admin" v-if="verification.adminNote">
              <strong>Admin note:</strong> {{ verification.adminNote }}
            </div>
          </li>
        </ul>

        <div class="verification-form-wrapper">
          <h3>Submit New Verification</h3>
          <form class="verification-form" @submit.prevent="handleVerificationSubmit">
            <div class="form-row">
              <div class="form-group">
                <label for="verificationType">Type *</label>
                <select
                  id="verificationType"
                  v-model="verificationForm.type"
                  :disabled="verificationSubmitting"
                >
                  <option value="link">Link</option>
                  <option value="contact">Contact</option>
                  <option value="image">Image</option>
                </select>
              </div>
              <div class="form-group">
                <label for="verificationValue">Value *</label>
                <input
                  id="verificationValue"
                  v-model="verificationForm.value"
                  type="text"
                  :disabled="verificationSubmitting"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="verificationWins">Wins</label>
                <input
                  id="verificationWins"
                  v-model.number="verificationForm.wins"
                  type="number"
                  min="0"
                  :disabled="verificationSubmitting"
                />
              </div>
              <div class="form-group">
                <label for="verificationLosses">Losses</label>
                <input
                  id="verificationLosses"
                  v-model.number="verificationForm.losses"
                  type="number"
                  min="0"
                  :disabled="verificationSubmitting"
                />
              </div>
              <div class="form-group">
                <label for="verificationDraws">Draws</label>
                <input
                  id="verificationDraws"
                  v-model.number="verificationForm.draws"
                  type="number"
                  min="0"
                  :disabled="verificationSubmitting"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="verificationAwards">Awards</label>
              <textarea
                id="verificationAwards"
                v-model="verificationForm.awards"
                :disabled="verificationSubmitting"
              ></textarea>
            </div>

            <div v-if="verificationSubmitError" class="error-message">{{ verificationSubmitError }}</div>
            <div v-if="verificationSubmitSuccess" class="success-message">{{ verificationSubmitSuccess }}</div>

            <div class="form-actions">
              <button type="submit" class="save-btn" :disabled="verificationSubmitting">
                {{ verificationSubmitting ? 'Submitting...' : 'Submit Verification' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fighterService } from '@/services/fighter.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type {
  Fighter,
  FighterVerification,
  VerificationType,
  CreateVerificationRequest,
} from '@/types';

const profile = ref<Fighter | null>(null);
const loading = ref(false);
const submitting = ref(false);
const editing = ref(false);
const error = ref<string | null>(null);
const submitError = ref<string | null>(null);
const hasRecordData = computed(() => {
  if (!profile.value) return false;
  return (
    profile.value.wins !== null ||
    profile.value.losses !== null ||
    profile.value.draws !== null
  );
});

const form = ref({
  firstName: '',
  lastName: '',
  nickname: '',
  phoneNumber: '',
  dateOfBirth: '',
  gender: '',
  currentWeightClass: '',
  height: null as number | null,
  reach: null as number | null,
  country: '',
  city: '',
  status: '',
  profilePicture: '',
  bio: '',
});

const verifications = ref<FighterVerification[]>([]);
const verificationsLoading = ref(false);
const verificationsError = ref<string | null>(null);
const verificationSubmitting = ref(false);
const verificationSubmitError = ref<string | null>(null);
const verificationSubmitSuccess = ref<string | null>(null);
const isVerificationSectionOpen = ref(true);
const verificationForm = ref({
  type: 'link' as VerificationType,
  value: '',
  wins: 0,
  losses: 0,
  draws: 0,
  awards: '',
});

async function loadProfile() {
  loading.value = true;
  error.value = null;
  try {
    profile.value = await fighterService.getProfile();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load profile');
  } finally {
    loading.value = false;
  }
}

function startEdit() {
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

  if (!profile.value) return;
  editing.value = true;
  submitError.value = null;
  form.value = {
    firstName: profile.value.firstName || '',
    lastName: profile.value.lastName || '',
    nickname: profile.value.nickname || '',
    phoneNumber: profile.value.phoneNumber || '',
    dateOfBirth: toDateInput(profile.value.dateOfBirth),
    gender: profile.value.gender || '',
    currentWeightClass: profile.value.currentWeightClass || profile.value.weightClass || '',
    height: profile.value.height ?? null,
    reach: profile.value.reach ?? null,
    country: profile.value.country || '',
    city: profile.value.city || '',
    status: profile.value.status || '',
    profilePicture: profile.value.profilePicture || '',
    bio: profile.value.bio || '',
  };
}

function formatDate(value: string | null): string {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString();
}

function formatDateTime(value: string | null): string {
  if (!value) return 'Not set';
  return new Date(value).toLocaleString();
}

function formatNumber(value: number | null, suffix: string): string {
  if (value === null || value === undefined) return 'Not set';
  return `${value} ${suffix}`;
}

function formatRecord(wins: number | null, losses: number | null, draws: number | null): string {
  const w = wins ?? 0;
  const l = losses ?? 0;
  const d = draws ?? 0;
  return `${w}-${l}-${d}`;
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
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      nickname: form.value.nickname.trim() || null,
      phoneNumber: form.value.phoneNumber.trim() || null,
      dateOfBirth: form.value.dateOfBirth || null,
      gender: form.value.gender.trim() || null,
      currentWeightClass: form.value.currentWeightClass.trim(),
      height: form.value.height === null ? null : Number(form.value.height),
      reach: form.value.reach === null ? null : Number(form.value.reach),
      country: form.value.country.trim() || null,
      city: form.value.city.trim() || null,
      status: form.value.status.trim() || null,
      profilePicture: form.value.profilePicture.trim() || null,
      bio: form.value.bio.trim() || null,
    });
    profile.value = updated;
    editing.value = false;
  } catch (err: any) {
    submitError.value = getErrorMessage(err.error, 'update your profile');
  } finally {
    submitting.value = false;
  }
}

function resetVerificationForm() {
  verificationForm.value = {
    type: 'link',
    value: '',
    wins: 0,
    losses: 0,
    draws: 0,
    awards: '',
  };
}

async function loadVerifications() {
  verificationsLoading.value = true;
  verificationsError.value = null;
  try {
    verifications.value = await fighterService.getVerifications();
  } catch (err: any) {
    verificationsError.value = getErrorMessage(err.error, 'load verification submissions');
  } finally {
    verificationsLoading.value = false;
  }
}

function sanitizeStat(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  return Math.round(value);
}

async function handleVerificationSubmit() {
  verificationSubmitting.value = true;
  verificationSubmitError.value = null;
  verificationSubmitSuccess.value = null;

  const trimmedValue = verificationForm.value.value.trim();
  if (!trimmedValue) {
    verificationSubmitError.value = 'Value is required';
    verificationSubmitting.value = false;
    return;
  }

  const wins = sanitizeStat(Number(verificationForm.value.wins));
  const losses = sanitizeStat(Number(verificationForm.value.losses));
  const draws = sanitizeStat(Number(verificationForm.value.draws));
  const awards = verificationForm.value.awards.trim();

  const payload: CreateVerificationRequest = {
    type: verificationForm.value.type,
    value: trimmedValue,
    wins,
    losses,
    draws,
  };

  if (awards) {
    payload.awards = awards;
  }

  try {
    await fighterService.createVerification(payload);
    verificationSubmitSuccess.value = 'Verification submitted for review';
    resetVerificationForm();
    await loadVerifications();
  } catch (err: any) {
    verificationSubmitError.value = getErrorMessage(err.error, 'submit the verification');
  } finally {
    verificationSubmitting.value = false;
  }
}

function formatVerificationType(type: VerificationType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatVerificationStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function toggleVerificationSection() {
  isVerificationSectionOpen.value = !isVerificationSectionOpen.value;
}

onMounted(() => {
  loadProfile();
  loadVerifications();
});
</script>

<style scoped>
.profile-container {
  max-width: 600px;
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
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
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
  margin-bottom: 5px;
  font-weight: bold;
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

.verification-section {
  margin-top: 40px;
  margin-bottom: 30px;
}

.section-toggle {
  width: 100%;
  padding: 15px 20px;
  background-color: rgba(30, 58, 138, 0.9);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.section-toggle:hover {
  background-color: rgba(30, 58, 138, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.section-toggle span:last-child {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
}

.section-content {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.verification-section h2 {
  margin-bottom: 20px;
}

.verification-list {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.verification-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  background-color: #fff;
}

.verification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.verification-type {
  font-weight: bold;
  font-size: 16px;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  text-transform: capitalize;
  color: #fff;
}

.status-pending {
  background-color: #ffc107;
  color: #212529;
}

.status-accepted {
  background-color: #28a745;
}

.status-rejected {
  background-color: #dc3545;
}

.verification-value,
.verification-record,
.verification-awards,
.verification-dates,
.verification-admin {
  margin-bottom: 8px;
}

.verification-value a {
  color: #007bff;
  word-break: break-all;
}

.verification-dates {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #555;
  flex-wrap: wrap;
}

.verification-form-wrapper {
  width: 100%;
  box-sizing: border-box;
}

.verification-form-wrapper h3 {
  margin-bottom: 15px;
}

.verification-form {
  width: 100%;
  box-sizing: border-box;
}

.verification-form .form-group textarea,
.verification-form .form-group select,
.verification-form .form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  max-width: 100%;
}

.verification-form .form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  width: 100%;
  box-sizing: border-box;
}

.verification-form .form-row .form-group {
  flex: 1;
  margin-bottom: 0;
  min-width: 0;
}

.success-message {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 4px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
</style>

