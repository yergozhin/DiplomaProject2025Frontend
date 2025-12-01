<template>
  <div class="events-container">
    <h1 class="events-title">Published Events</h1>
    <div v-if="loading" class="status-message">Loading...</div>
    <div v-else-if="error" class="status-message">{{ error }}</div>
    <div v-else-if="events.length === 0" class="status-message">No published events yet.</div>
    <ul v-else class="events-list">
      <li v-for="event in events" :key="event.id" class="event-item">
        <div class="event-header">
          <strong>{{ event.eventName ?? event.name }}</strong>
          <span>Status: {{ event.status ?? 'unknown' }}</span>
        </div>
        <div v-if="event.eventDescription" class="event-description">
          {{ event.eventDescription }}
        </div>
        <div class="event-meta">
          <span>City: {{ event.city ?? 'N/A' }}</span>
          <span>Country: {{ event.country ?? 'N/A' }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Event } from '@/types';
import { eventService } from '@/services/event.service';

const events = ref<Event[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadEvents() {
  loading.value = true;
  error.value = null;
  try {
    events.value = await eventService.getPublishedEvents();
  } catch (err: any) {
    error.value = err?.error || 'Failed to load events';
  } finally {
    loading.value = false;
  }
}

onMounted(loadEvents);
</script>

<style scoped>
.events-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.events-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.status-message {
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
}

.events-list {
  list-style: none;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.event-item {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  max-width: 100%;
  box-sizing: border-box;
}

.event-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.event-description {
  margin-bottom: 15px;
  color: #333;
}

.event-meta {
  display: flex;
  gap: 20px;
  color: #555;
  font-size: 14px;
  flex-wrap: wrap;
}
</style>

