<template>
  <div class="sponsors-section">
    <div class="sponsors-header">
      <h3>Event Sponsors</h3>
      <button
        type="button"
        class="add-sponsor-btn"
        @click="addNewSponsor"
        :disabled="disabled"
      >
        Add Sponsor
      </button>
    </div>
    <div v-if="sponsors.length > 0" class="sponsors-list">
      <div
        v-for="sponsor in sponsors"
        :key="sponsor.id"
        class="sponsor-item"
      >
        <div v-if="editingSponsorId !== sponsor.id" class="sponsor-display">
          <div class="sponsor-info">
            <strong>{{ sponsor.sponsorName }}</strong>
            <span v-if="sponsor.sponsorshipLevel" class="sponsor-level">
              {{ sponsor.sponsorshipLevel.toUpperCase() }}
            </span>
            <span v-if="sponsor.sponsorshipAmount" class="sponsor-amount">
              ${{ sponsor.sponsorshipAmount.toLocaleString() }}
            </span>
          </div>
          <div class="sponsor-actions">
            <button
              type="button"
              class="edit-sponsor-btn"
              @click="startEditSponsor(sponsor)"
              :disabled="processingSponsorId === sponsor.id"
            >
              Edit
            </button>
            <button
              type="button"
              class="delete-sponsor-btn"
              @click="deleteSponsor(sponsor.id)"
              :disabled="processingSponsorId === sponsor.id"
            >
              Delete
            </button>
          </div>
        </div>
        <form
          v-else
          class="sponsor-edit-form"
          @submit.prevent="submitSponsorUpdate(sponsor.id)"
        >
          <div class="form-row">
            <div class="form-group">
              <label>Sponsor Name *</label>
              <input
                v-model="sponsorForm.sponsorName"
                type="text"
                required
                :disabled="processingSponsorId === sponsor.id"
              />
            </div>
            <div class="form-group">
              <label>Sponsorship Level</label>
              <select
                v-model="sponsorForm.sponsorshipLevel"
                :disabled="processingSponsorId === sponsor.id"
              >
                <option :value="null">None</option>
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Sponsor Logo URL</label>
              <input
                v-model="sponsorForm.sponsorLogo"
                type="url"
                :disabled="processingSponsorId === sponsor.id"
              />
            </div>
            <div class="form-group">
              <label>Sponsorship Amount</label>
              <input
                v-model.number="sponsorForm.sponsorshipAmount"
                type="number"
                min="0"
                step="0.01"
                :disabled="processingSponsorId === sponsor.id"
              />
            </div>
          </div>
          <div class="form-actions">
            <button
              type="button"
              class="cancel-btn"
              @click="cancelEditSponsor"
              :disabled="processingSponsorId === sponsor.id"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="submit-btn"
              :disabled="processingSponsorId === sponsor.id"
            >
              {{ processingSponsorId === sponsor.id ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-else-if="editingSponsorId !== 'new'" class="no-sponsors">No sponsors added yet</div>
    <form
      v-if="editingSponsorId === 'new'"
      class="sponsor-edit-form"
      @submit.prevent="submitSponsorUpdate('new')"
    >
      <div class="form-row">
        <div class="form-group">
          <label>Sponsor Name *</label>
          <input
            v-model="sponsorForm.sponsorName"
            type="text"
            required
            :disabled="processingSponsorId === 'new'"
          />
        </div>
        <div class="form-group">
          <label>Sponsorship Level</label>
          <select
            v-model="sponsorForm.sponsorshipLevel"
            :disabled="processingSponsorId === 'new'"
          >
            <option :value="null">None</option>
            <option value="platinum">Platinum</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Sponsor Logo URL</label>
          <input
            v-model="sponsorForm.sponsorLogo"
            type="url"
            :disabled="processingSponsorId === 'new'"
          />
        </div>
        <div class="form-group">
          <label>Sponsorship Amount</label>
          <input
            v-model.number="sponsorForm.sponsorshipAmount"
            type="number"
            min="0"
            step="0.01"
            :disabled="processingSponsorId === 'new'"
          />
        </div>
      </div>
      <div class="form-actions">
        <button
          type="button"
          class="cancel-btn"
          @click="cancelEditSponsor"
          :disabled="processingSponsorId === 'new'"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="submit-btn"
          :disabled="processingSponsorId === 'new'"
        >
          {{ processingSponsorId === 'new' ? 'Creating...' : 'Create Sponsor' }}
        </button>
      </div>
    </form>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { eventSponsorsService } from '@/services/event-sponsors.service';
import type { EventSponsor, CreateEventSponsorRequest, UpdateEventSponsorRequest } from '@/types';

const props = defineProps<{
  eventId: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'sponsors-updated'): void;
}>();

const sponsors = ref<EventSponsor[]>([]);
const editingSponsorId = ref<string | null>(null);
const processingSponsorId = ref<string | null>(null);
const error = ref<string | null>(null);
const sponsorForm = ref<CreateEventSponsorRequest>({
  eventId: '',
  sponsorName: '',
  sponsorLogo: null,
  sponsorshipLevel: null,
  sponsorshipAmount: null,
});

async function loadSponsors() {
  try {
    sponsors.value = await eventSponsorsService.getByEvent(props.eventId);
    error.value = null;
  } catch (err: any) {
    error.value = err.error || 'Failed to load sponsors';
    sponsors.value = [];
  }
}

function addNewSponsor() {
  editingSponsorId.value = 'new';
  sponsorForm.value = {
    eventId: props.eventId,
    sponsorName: '',
    sponsorLogo: null,
    sponsorshipLevel: null,
    sponsorshipAmount: null,
  };
}

function startEditSponsor(sponsor: EventSponsor) {
  editingSponsorId.value = sponsor.id;
  sponsorForm.value = {
    eventId: sponsor.eventId,
    sponsorName: sponsor.sponsorName,
    sponsorLogo: sponsor.sponsorLogo,
    sponsorshipLevel: sponsor.sponsorshipLevel,
    sponsorshipAmount: sponsor.sponsorshipAmount,
  };
}

function cancelEditSponsor() {
  editingSponsorId.value = null;
  processingSponsorId.value = null;
  error.value = null;
  sponsorForm.value = {
    eventId: '',
    sponsorName: '',
    sponsorLogo: null,
    sponsorshipLevel: null,
    sponsorshipAmount: null,
  };
}

async function submitSponsorUpdate(sponsorId: string) {
  if (sponsorId === 'new') {
    await createSponsor();
  } else {
    await updateSponsor(sponsorId);
  }
}

async function createSponsor() {
  processingSponsorId.value = 'new';
  error.value = null;
  try {
    const payload: CreateEventSponsorRequest = {
      eventId: sponsorForm.value.eventId,
      sponsorName: sponsorForm.value.sponsorName,
      sponsorLogo: sponsorForm.value.sponsorLogo || null,
      sponsorshipLevel: sponsorForm.value.sponsorshipLevel || null,
      sponsorshipAmount: sponsorForm.value.sponsorshipAmount || null,
    };
    await eventSponsorsService.create(payload);
    await loadSponsors();
    cancelEditSponsor();
    emit('sponsors-updated');
  } catch (err: any) {
    error.value = err.error || 'Failed to create sponsor';
  } finally {
    processingSponsorId.value = null;
  }
}

async function updateSponsor(sponsorId: string) {
  processingSponsorId.value = sponsorId;
  error.value = null;
  try {
    const payload: UpdateEventSponsorRequest = {
      sponsorName: sponsorForm.value.sponsorName,
      sponsorLogo: sponsorForm.value.sponsorLogo || null,
      sponsorshipLevel: sponsorForm.value.sponsorshipLevel || null,
      sponsorshipAmount: sponsorForm.value.sponsorshipAmount || null,
    };
    await eventSponsorsService.update(sponsorId, payload);
    await loadSponsors();
    cancelEditSponsor();
    emit('sponsors-updated');
  } catch (err: any) {
    error.value = err.error || 'Failed to update sponsor';
  } finally {
    processingSponsorId.value = null;
  }
}

async function deleteSponsor(sponsorId: string) {
  if (!confirm('Are you sure you want to delete this sponsor?')) return;
  processingSponsorId.value = sponsorId;
  error.value = null;
  try {
    await eventSponsorsService.delete(sponsorId);
    error.value = null;
    await loadSponsors();
    emit('sponsors-updated');
  } catch (err: any) {
    error.value = err.error || 'Failed to delete sponsor';
  } finally {
    processingSponsorId.value = null;
  }
}

watch(() => props.eventId, () => {
  if (props.eventId) {
    loadSponsors();
  }
}, { immediate: true });

onMounted(() => {
  if (props.eventId) {
    loadSponsors();
  }
});
</script>

<style scoped>
.sponsors-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

.sponsors-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.sponsors-header h3 {
  margin: 0;
  font-size: 18px;
}

.add-sponsor-btn {
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-sponsor-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.add-sponsor-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sponsors-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sponsor-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.sponsor-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sponsor-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.sponsor-level {
  padding: 2px 8px;
  background-color: #ffc107;
  color: #000;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.sponsor-amount {
  color: #28a745;
  font-weight: bold;
}

.sponsor-actions {
  display: flex;
  gap: 8px;
}

.edit-sponsor-btn,
.delete-sponsor-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: white;
}

.edit-sponsor-btn {
  background-color: #2563eb;
}

.edit-sponsor-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.delete-sponsor-btn {
  background-color: #dc3545;
}

.delete-sponsor-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.edit-sponsor-btn:disabled,
.delete-sponsor-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sponsor-edit-form {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:disabled,
.form-group select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.cancel-btn,
.submit-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: white;
}

.cancel-btn {
  background-color: #6c757d;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #5a6268;
}

.submit-btn {
  background-color: #28a745;
}

.submit-btn:hover:not(:disabled) {
  background-color: #218838;
}

.cancel-btn:disabled,
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.no-sponsors {
  padding: 10px;
  color: #6c757d;
  font-style: italic;
  text-align: center;
}

.error-message {
  padding: 10px;
  margin-top: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>

