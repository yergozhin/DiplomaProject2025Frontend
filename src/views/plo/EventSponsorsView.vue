<template>
  <div class="sponsors-container">
    <h1 class="sponsors-title">Event Sponsors</h1>
    <div class="event-selector">
      <label for="eventSelect">Select Event:</label>
      <select id="eventSelect" v-model="selectedEventId" @change="loadSponsors">
        <option value="">Choose an event...</option>
        <option v-for="event in events" :key="event.id" :value="event.id">
          {{ event.name }}
        </option>
      </select>
    </div>
    <button v-if="selectedEventId && !showForm" @click="showForm = true" class="add-btn">Add Sponsor</button>
    <div v-if="loading" class="status-message">Loading sponsors...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <form v-if="showForm && selectedEventId" @submit.prevent="handleSubmit" class="sponsor-form">
      <div class="form-group">
        <label for="sponsorName">Sponsor Name *</label>
        <input id="sponsorName" v-model="form.sponsorName" type="text" required :disabled="submitting" />
      </div>
      <div class="form-group">
        <label for="sponsorLogo">Sponsor Logo URL</label>
        <input id="sponsorLogo" v-model="form.sponsorLogo" type="url" :disabled="submitting" />
      </div>
      <div class="form-group">
        <label for="sponsorshipLevel">Sponsorship Level</label>
        <select id="sponsorshipLevel" v-model="form.sponsorshipLevel" :disabled="submitting">
          <option :value="null">Not Set</option>
          <option value="platinum">Platinum</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="bronze">Bronze</option>
        </select>
      </div>
      <div class="form-group">
        <label for="sponsorshipAmount">Sponsorship Amount</label>
        <input id="sponsorshipAmount" v-model.number="form.sponsorshipAmount" type="number" :disabled="submitting" />
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="submitting" class="submit-btn">Submit</button>
        <button type="button" @click="cancelForm" :disabled="submitting" class="cancel-btn">Cancel</button>
      </div>
    </form>
    <div v-if="selectedEventId && sponsors.length === 0 && !showForm" class="status-message">No sponsors for this event</div>
    <ul v-if="selectedEventId && sponsors.length > 0" class="sponsors-list">
      <li v-for="sponsor in sponsors" :key="sponsor.id" class="sponsor-item">
        <div class="sponsor-header">
          <div>
            <strong>{{ sponsor.sponsorName }}</strong>
            <span v-if="sponsor.sponsorshipLevel" class="sponsor-level">{{ formatLevel(sponsor.sponsorshipLevel) }}</span>
          </div>
          <button
            type="button"
            class="delete-btn"
            :disabled="isProcessing(sponsor.id)"
            @click="deleteSponsor(sponsor.id)"
          >
            Delete
          </button>
        </div>
        <div v-if="sponsor.sponsorLogo" class="sponsor-logo">
          <img :src="sponsor.sponsorLogo" :alt="sponsor.sponsorName" />
        </div>
        <div v-if="sponsor.sponsorshipAmount" class="sponsor-amount">
          Amount: {{ formatCurrency(sponsor.sponsorshipAmount) }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { eventSponsorsService } from '@/services/event-sponsors.service';
import { eventService } from '@/services/event.service';
import type { EventSponsor, CreateEventSponsorRequest, Event } from '@/types';

const events = ref<Event[]>([]);
const sponsors = ref<EventSponsor[]>([]);
const selectedEventId = ref<string>('');
const loading = ref(false);
const error = ref<string | null>(null);
const showForm = ref(false);
const submitting = ref(false);
const processingId = ref<string | null>(null);

const form = ref<CreateEventSponsorRequest>({
  eventId: '',
  sponsorName: '',
  sponsorLogo: null,
  sponsorshipLevel: null,
  sponsorshipAmount: null,
});

function formatLevel(level: string) {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function isProcessing(id: string) {
  return processingId.value === id;
}

function cancelForm() {
  showForm.value = false;
  form.value = {
    eventId: '',
    sponsorName: '',
    sponsorLogo: null,
    sponsorshipLevel: null,
    sponsorshipAmount: null,
  };
}

async function handleSubmit() {
  if (!selectedEventId.value) return;
  submitting.value = true;
  error.value = null;
  try {
    form.value.eventId = selectedEventId.value;
    await eventSponsorsService.create(form.value);
    cancelForm();
    await loadSponsors();
  } catch (err: any) {
    error.value = err.error || 'Failed to create sponsor';
  } finally {
    submitting.value = false;
  }
}

async function deleteSponsor(id: string) {
  if (!confirm('Are you sure you want to delete this sponsor?')) return;
  processingId.value = id;
  error.value = null;
  try {
    await eventSponsorsService.delete(id);
    await loadSponsors();
  } catch (err: any) {
    error.value = err.error || 'Failed to delete sponsor';
  } finally {
    processingId.value = null;
  }
}

async function loadSponsors() {
  if (!selectedEventId.value) {
    sponsors.value = [];
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    sponsors.value = await eventSponsorsService.getByEvent(selectedEventId.value);
  } catch (err: any) {
    error.value = err.error || 'Failed to load sponsors';
  } finally {
    loading.value = false;
  }
}

async function loadEvents() {
  try {
    events.value = await eventService.getOwnedEvents();
  } catch (err: any) {
    error.value = err.error || 'Failed to load events';
  }
}

onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
.sponsors-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.sponsors-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.event-selector {
  margin-bottom: 20px;
  color: white;
}

.event-selector label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.event-selector select {
  width: 100%;
  max-width: 400px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
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

.sponsor-form {
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
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
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

.sponsors-list {
  list-style: none;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.sponsor-item {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.sponsor-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.sponsor-level {
  margin-left: 10px;
  padding: 4px 8px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  font-size: 12px;
}

.delete-btn {
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background-color: #c82333;
}

.delete-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.sponsor-logo {
  margin: 10px 0;
}

.sponsor-logo img {
  max-width: 200px;
  max-height: 100px;
  object-fit: contain;
}

.sponsor-amount {
  margin-top: 10px;
  font-weight: bold;
  color: #28a745;
}
</style>

