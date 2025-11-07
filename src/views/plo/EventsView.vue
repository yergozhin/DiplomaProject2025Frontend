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
          <strong>{{ event.name }}</strong>
          <span>Created: {{ formatDate(event.createdAt) }}</span>
        </div>
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
import type { Event } from '@/types';

const events = ref<Event[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const showForm = ref(false);
const formName = ref('');
const formSlots = ref('');
const submitting = ref(false);
const submitError = ref<string | null>(null);

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
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

