<template>
  <div>
    <h1>My Events</h1>
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
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

onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
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

