<template>
  <div>
    <h1>My Events</h1>
    <div class="actions">
      <button type="button" class="add-btn" @click="openForm" v-if="!showForm">
        Add Event
      </button>
    </div>
    <form v-if="showForm" class="add-event-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="eventName">Event Name *</label>
        <input id="eventName" v-model="formName" type="text" :disabled="submitting" required />
      </div>
      <div class="form-group">
        <label for="eventSlots">Time Slots *</label>
        <textarea
          id="eventSlots"
          v-model="formSlots"
          :disabled="submitting"
          placeholder="One ISO date per line"
          required
        ></textarea>
        <small class="helper-text">Example: 2025-06-01T18:00:00Z</small>
      </div>
      <div v-if="submitError" class="error-message">{{ submitError }}</div>
      <div class="form-actions">
        <button type="button" class="cancel-btn" @click="closeForm" :disabled="submitting">
          Cancel
        </button>
        <button type="submit" class="submit-btn" :disabled="submitting">
          {{ submitting ? 'Saving...' : 'Create Event' }}
        </button>
      </div>
    </form>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="events.length === 0">No events created</div>
    <ul v-else class="events-list">
      <li v-for="event in events" :key="event.id" class="event-item">
        <div class="event-header">
          <div>
            <strong>{{ event.name }}</strong>
            <span v-if="event.eventName && event.eventName !== event.name" class="event-subtitle">
              ({{ event.eventName }})
            </span>
          </div>
          <div class="event-meta">
            <span class="status-pill" :class="event.status || 'draft'">{{ (event.status || 'draft').toUpperCase() }}</span>
            <span>Created: {{ formatDate(event.createdAt) }}</span>
            <span v-if="event.updatedAt">Updated: {{ formatDate(event.updatedAt) }}</span>
          </div>
        </div>

        <div class="event-details">
          <div class="detail-group">
            <span class="detail-label">Description:</span>
            <span class="detail-value">{{ event.eventDescription || 'Not set' }}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Venue:</span>
            <span class="detail-value">{{ formatVenue(event) }}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Capacity:</span>
            <span class="detail-value">{{ formatCapacity(event.venueCapacity) }}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Poster:</span>
            <span class="detail-value">
              <a v-if="event.posterImage" :href="event.posterImage" target="_blank" rel="noreferrer">View poster</a>
              <span v-else>Not set</span>
            </span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Ticket Link:</span>
            <span class="detail-value">
              <a v-if="event.ticketLink" :href="event.ticketLink" target="_blank" rel="noreferrer">Buy tickets</a>
              <span v-else>Not set</span>
            </span>
          </div>
        </div>

        <div class="event-actions">
          <button type="button" class="edit-btn" @click="startEdit(event)" :disabled="processingId === event.id">
            Edit Details
          </button>
          <button
            type="button"
            class="publish-btn"
            @click="publish(event.id)"
            :disabled="processingId === event.id || event.status === 'published'"
          >
            {{ processingId === event.id && publishMode ? 'Publishing...' : 'Publish Event' }}
          </button>
        </div>

        <form v-if="editingId === event.id" class="edit-event-form" @submit.prevent="submitUpdate(event.id)">
          <div class="form-row">
            <div class="form-group">
              <label for="eventNameEdit">Display Name</label>
              <input id="eventNameEdit" v-model="form.eventName" type="text" :disabled="processingId === event.id" />
            </div>
            <div class="form-group">
              <label for="venueName">Venue Name</label>
              <input id="venueName" v-model="form.venueName" type="text" :disabled="processingId === event.id" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="venueAddress">Venue Address</label>
              <input id="venueAddress" v-model="form.venueAddress" type="text" :disabled="processingId === event.id" />
            </div>
            <div class="form-group">
              <label for="city">City</label>
              <input id="city" v-model="form.city" type="text" :disabled="processingId === event.id" />
            </div>
            <div class="form-group">
              <label for="country">Country</label>
              <input id="country" v-model="form.country" type="text" :disabled="processingId === event.id" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="venueCapacity">Capacity</label>
              <input
                id="venueCapacity"
                v-model.number="form.venueCapacity"
                type="number"
                min="0"
                :disabled="processingId === event.id"
              />
            </div>
            <div class="form-group">
              <label for="ticketLink">Ticket Link</label>
              <input id="ticketLink" v-model="form.ticketLink" type="url" :disabled="processingId === event.id" />
            </div>
          </div>

          <div class="form-group">
            <label for="posterImage">Poster Image URL</label>
            <input id="posterImage" v-model="form.posterImage" type="url" :disabled="processingId === event.id" />
          </div>

          <div class="form-group">
            <label for="eventDescription">Description</label>
            <textarea
              id="eventDescription"
              v-model="form.eventDescription"
              :disabled="processingId === event.id"
            ></textarea>
          </div>

          <div v-if="submitError" class="error-message">{{ submitError }}</div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="cancelEdit" :disabled="processingId === event.id">
              Cancel
            </button>
            <button type="submit" class="submit-btn" :disabled="processingId === event.id">
              {{ processingId === event.id && !publishMode ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>

        <div class="event-slots">
          <div class="slots-header">
            <strong>Time Slots ({{ event.slots.length }})</strong>
          </div>
          <ul v-if="event.slots.length > 0" class="slots-list">
            <li v-for="slot in event.slots" :key="slot.id" class="slot-item">
              <span>{{ formatDate(slot.startTime) }}</span>
              <span v-if="slot.fightId" class="slot-assigned">Assigned</span>
              <span v-else class="slot-available">Available</span>
            </li>
          </ul>
          <div v-else class="no-slots">No time slots</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { eventService } from '@/services/event.service';
import type { Event, UpdateEventRequest } from '@/types';

const events = ref<Event[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const showForm = ref(false);
const formName = ref('');
const formSlots = ref('');
const submitting = ref(false);
const submitError = ref<string | null>(null);
const editingId = ref<string | null>(null);
const processingId = ref<string | null>(null);
const publishMode = ref(false);
const form = ref({
  eventName: '',
  eventDescription: '',
  venueName: '',
  venueAddress: '',
  city: '',
  country: '',
  venueCapacity: null as number | null,
  posterImage: '',
  ticketLink: '',
});

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

function formatVenue(event: Event) {
  const parts = [event.venueName, event.venueAddress, event.city, event.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Not set';
}

function formatCapacity(value: number | null) {
  if (value === null || value === undefined) return 'Not set';
  if (value <= 0) return 'Not set';
  return value.toLocaleString();
}

function resetForm() {
  formName.value = '';
  formSlots.value = '';
  submitError.value = null;
}

function openForm() {
  showForm.value = true;
  resetForm();
}

function closeForm() {
  showForm.value = false;
  resetForm();
}

function sanitize(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function startEdit(event: Event) {
  editingId.value = event.id;
  processingId.value = null;
  publishMode.value = false;
  submitError.value = null;
  form.value = {
    eventName: event.eventName || event.name,
    eventDescription: event.eventDescription || '',
    venueName: event.venueName || '',
    venueAddress: event.venueAddress || '',
    city: event.city || '',
    country: event.country || '',
    venueCapacity: event.venueCapacity ?? null,
    posterImage: event.posterImage || '',
    ticketLink: event.ticketLink || '',
  };
}

function cancelEdit() {
  editingId.value = null;
  processingId.value = null;
  publishMode.value = false;
  submitError.value = null;
}

async function submitUpdate(eventId: string) {
  processingId.value = eventId;
  publishMode.value = false;
  submitError.value = null;
  const payload: UpdateEventRequest = {
    eventName: sanitize(form.value.eventName),
    eventDescription: sanitize(form.value.eventDescription),
    venueName: sanitize(form.value.venueName),
    venueAddress: sanitize(form.value.venueAddress),
    city: sanitize(form.value.city),
    country: sanitize(form.value.country),
    venueCapacity: form.value.venueCapacity ?? null,
    posterImage: sanitize(form.value.posterImage),
    ticketLink: sanitize(form.value.ticketLink),
  };
  try {
    await eventService.updateEvent(eventId, payload);
    await loadEvents();
    cancelEdit();
  } catch (err: any) {
    submitError.value = err.error || 'Failed to update event';
  } finally {
    processingId.value = null;
  }
}

async function publish(eventId: string) {
  processingId.value = eventId;
  publishMode.value = true;
  submitError.value = null;
  try {
    await eventService.publishEvent(eventId);
    await loadEvents();
    cancelEdit();
  } catch (err: any) {
    submitError.value = err.error || 'Failed to publish event';
  } finally {
    processingId.value = null;
    publishMode.value = false;
  }
}

async function loadEvents() {
  loading.value = true;
  error.value = null;
  try {
    events.value = await eventService.getOwnedEvents();
  } catch (err: any) {
    error.value = err.error || 'Failed to load events';
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  const name = formName.value.trim();
  const slots = formSlots.value
    .split('\n')
    .map(slot => slot.trim())
    .filter(slot => slot.length > 0);

  if (!name) {
    submitError.value = 'Event name is required';
    return;
  }

  if (slots.length === 0) {
    submitError.value = 'Add at least one time slot';
    return;
  }

  submitting.value = true;
  submitError.value = null;

  try {
    await eventService.createEvent({ name, slots });
    await loadEvents();
    closeForm();
  } catch (err: any) {
    submitError.value = err.error || 'Failed to create event';
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
.actions {
  margin-bottom: 20px;
}

.add-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #0056b3;
}

.add-event-form {
  margin-bottom: 30px;
  padding: 20px;
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
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.helper-text {
  display: block;
  margin-top: 5px;
  color: #6c757d;
}

.error-message {
  padding: 10px;
  margin-bottom: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.cancel-btn,
.submit-btn {
  padding: 10px 20px;
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

.events-list {
  list-style: none;
  padding: 0;
}

.event-item {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.event-header strong {
  font-size: 18px;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.event-subtitle {
  margin-left: 8px;
  font-size: 14px;
  color: #4b5563;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
  background-color: #e2e8f0;
  color: #1e293b;
}

.event-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-weight: bold;
  color: #1f2937;
}

.detail-value {
  color: #374151;
  word-break: break-word;
}

.event-actions {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.edit-btn,
.publish-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

.edit-btn {
  background-color: #2563eb;
}

.edit-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.publish-btn {
  background-color: #22c55e;
}

.publish-btn:hover:not(:disabled) {
  background-color: #16a34a;
}

.publish-btn:disabled,
.edit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.event-slots {
  margin-top: 15px;
}

.slots-header {
  margin-bottom: 10px;
}

.slots-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.slot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.slot-assigned {
  color: #28a745;
  font-weight: bold;
}

.slot-available {
  color: #6c757d;
}

.no-slots {
  padding: 10px;
  color: #6c757d;
  font-style: italic;
}
</style>

