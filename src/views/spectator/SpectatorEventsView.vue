<template>
  <section>
    <h1>Published Events</h1>

    <div v-if="loading">Loading events...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="events.length === 0">No published events yet.</div>
    <ul v-else class="event-list">
      <li v-for="event in events" :key="event.id">
        <h2>{{ event.eventName ?? event.name }}</h2>
        <p v-if="event.eventDescription">{{ event.eventDescription }}</p>
        <p class="meta">
          <span>City: {{ event.city ?? 'N/A' }}</span>
          <span>Country: {{ event.country ?? 'N/A' }}</span>
          <span>Status: {{ event.status ?? 'unknown' }}</span>
        </p>
      </li>
    </ul>
  </section>
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
.event-list {
  list-style: none;
  padding: 0;
}

.event-list li {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 12px;
}

.event-list h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.event-list p {
  margin: 4px 0;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: #555;
  font-size: 14px;
}

.error {
  color: #dc3545;
}
</style>

