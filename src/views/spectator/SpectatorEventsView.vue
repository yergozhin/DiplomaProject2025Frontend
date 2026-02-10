<template>
  <div class="events-container">
    <h1 class="events-title">Published Events</h1>
    <div v-if="loading" class="status-message">Loading...</div>
    <div v-else-if="error" class="status-message">{{ error }}</div>
    <div v-else-if="events.length === 0" class="status-message">No published events yet.</div>
    <ul v-else class="events-list">
      <li v-for="event in events" :key="event.id" class="event-item">
        <div class="event-header">
          <div class="event-title-block">
            <strong class="event-title-text">{{ event.eventName || event.name }}</strong>
          </div>
          <div class="event-meta">
            <span class="status-pill">{{ (event.status || 'published').toUpperCase() }}</span>
          </div>
        </div>

        <div class="event-main">
          <div class="event-poster">
            <img
              v-if="event.posterImage && isBase64Image(event.posterImage)"
              :src="event.posterImage"
              alt="Event Poster"
              class="poster-preview"
            />
            <a
              v-else-if="event.posterImage"
              :href="event.posterImage"
              target="_blank"
              rel="noreferrer"
              class="poster-link"
            >
              View poster
            </a>
            <div v-else class="poster-empty">No poster</div>
          </div>

          <div class="event-details">
            <div class="detail-group">
              <span class="detail-label">Description</span>
              <span class="detail-value">{{ event.eventDescription || 'Not set' }}</span>
            </div>
            <div class="detail-group">
              <span class="detail-label">Venue</span>
              <span class="detail-value">{{ formatVenue(event) }}</span>
            </div>
            <div class="detail-group">
              <span class="detail-label">Capacity</span>
              <span class="detail-value">{{ formatCapacity(event.venueCapacity) }}</span>
            </div>
            <div class="detail-group">
              <span class="detail-label">Tickets</span>
              <span class="detail-value">
                <a
                  v-if="event.ticketLink"
                  :href="event.ticketLink"
                  target="_blank"
                  rel="noreferrer"
                >
                  Buy tickets
                </a>
                <span v-else>Not set</span>
              </span>
            </div>
          </div>
        </div>

        <div class="event-extra">
          <button
            type="button"
            class="toggle-btn"
            @click="toggleDetails(event.id)"
          >
            {{ expandedEventId === event.id ? 'Hide event details' : 'View event details' }}
          </button>
        </div>

        <div v-if="expandedEventId === event.id" class="event-details-expanded">
          <div class="details-section">
            <h3>Time Slots</h3>
            <div v-if="loadingSlots[event.id]" class="status-message-small">Loading slots...</div>
            <div v-else-if="eventSlots[event.id] && eventSlots[event.id]!.length > 0" class="slots-list">
              <div v-for="slot in eventSlots[event.id]!" :key="slot.id" class="slot-item">
                <span>{{ formatDate(slot.startTime) }}</span>
                <span v-if="slot.fightId" class="slot-assigned">Assigned</span>
                <span v-else class="slot-available">Available</span>
              </div>
            </div>
            <div v-else class="no-data">No time slots</div>
          </div>

          <div class="details-section">
            <h3>Event Categories</h3>
            <div v-if="loadingCategories[event.id]" class="status-message-small">Loading categories...</div>
            <div v-else-if="eventCategories[event.id] && eventCategories[event.id]!.length > 0" class="categories-list-readonly">
              <div v-for="category in eventCategories[event.id]!" :key="category.id" class="category-item-readonly">
                <span class="category-name">{{ category.categoryName || 'Unknown' }}</span>
              </div>
            </div>
            <div v-else class="no-data">No categories assigned</div>
          </div>

          <div class="details-section">
            <h3>Event Sponsors</h3>
            <div v-if="loadingSponsors[event.id]" class="status-message-small">Loading sponsors...</div>
            <div v-else-if="eventSponsors[event.id] && eventSponsors[event.id]!.length > 0" class="sponsors-list-readonly">
              <div v-for="sponsor in eventSponsors[event.id]!" :key="sponsor.id" class="sponsor-item-readonly">
                <div class="sponsor-name">{{ sponsor.sponsorName }}</div>
                <div class="sponsor-meta">
                  <span v-if="sponsor.sponsorshipLevel" class="sponsor-level">
                    {{ sponsor.sponsorshipLevel.toUpperCase() }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="no-data">No sponsors assigned</div>
          </div>

          <div class="details-section">
            <h3>Fights</h3>
            <div v-if="loadingFights[event.id]" class="status-message-small">Loading fights...</div>
            <div v-else-if="eventFights[event.id] && eventFights[event.id]!.length > 0" class="fights-list">
              <div v-for="fight in eventFights[event.id]!" :key="fight.fightId" class="fight-item">
                <div class="fight-header-row">
                  <div class="fighters-names">
                    <span class="fighter-name">{{ fight.fighterAName || 'Fighter A' }}</span>
                    <span class="vs">VS</span>
                    <span class="fighter-name">{{ fight.fighterBName || 'Fighter B' }}</span>
                  </div>
                  <div class="fight-time">{{ formatDate(fight.slotStartTime) }}</div>
                </div>
                <div class="fight-details-row">
                  <div class="fighter-detail">
                    <span class="fighter-label">Fighter A:</span>
                    <span class="fighter-info">{{ fight.fighterAName || 'Not set' }}</span>
                    <span class="fighter-email">{{ fight.fighterAEmail || '' }}</span>
                  </div>
                  <div class="fighter-detail">
                    <span class="fighter-label">Fighter B:</span>
                    <span class="fighter-info">{{ fight.fighterBName || 'Not set' }}</span>
                    <span class="fighter-email">{{ fight.fighterBEmail || '' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="no-data">No fights scheduled</div>
          </div>

          <div class="details-section">
            <h3>Fight Results</h3>
            <EventFightResults
              :event-id="event.id"
              :read-only="true"
              @results-updated="() => {}"
            />
          </div>

          <div class="details-section">
            <h3>Promotion League</h3>
            <div v-if="loadingPlo[event.ploId]" class="status-message-small">Loading PLO details...</div>
            <div v-else-if="ploDetails[event.ploId]" class="plo-details">
              <div class="plo-detail-row">
                <span class="plo-label">League Name:</span>
                <span class="plo-value">{{ formatField(ploDetails[event.ploId]?.leagueName) }}</span>
              </div>
              <div class="plo-detail-row">
                <span class="plo-label">Owner:</span>
                <span class="plo-value">{{ formatOwner(ploDetails[event.ploId]?.ownerFirstName, ploDetails[event.ploId]?.ownerLastName) }}</span>
              </div>
              <div class="plo-detail-row">
                <span class="plo-label">Location:</span>
                <span class="plo-value">{{ formatLocation(ploDetails[event.ploId]?.city, ploDetails[event.ploId]?.country) }}</span>
              </div>
              <div class="plo-detail-row">
                <span class="plo-label">Website:</span>
                <span class="plo-value">
                  <a v-if="ploDetails[event.ploId]?.website" :href="ploDetails[event.ploId]!.website || undefined" target="_blank" rel="noreferrer">
                    {{ ploDetails[event.ploId]!.website }}
                  </a>
                  <span v-else>Not set</span>
                </span>
              </div>
              <div v-if="ploDetails[event.ploId]?.description" class="plo-detail-row">
                <span class="plo-label">Description:</span>
                <span class="plo-value">{{ ploDetails[event.ploId]?.description }}</span>
              </div>
            </div>
            <div v-else class="no-data">PLO details not available</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Event, EventSlot, PloProfile, EventFight, EventCategoryAssignment, EventSponsor } from '@/types';
import { eventService } from '@/services/event.service';
import { ploService } from '@/services/plo.service';
import { eventCategoriesService } from '@/services/event-categories.service';
import { eventSponsorsService } from '@/services/event-sponsors.service';
import { getErrorMessage } from '@/utils/errorMessages';
import EventFightResults from '@/components/EventFightResults.vue';

const events = ref<Event[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const expandedEventId = ref<string | null>(null);
const eventSlots = ref<Record<string, EventSlot[]>>({});
const loadingSlots = ref<Record<string, boolean>>({});
const eventFights = ref<Record<string, EventFight[]>>({});
const loadingFights = ref<Record<string, boolean>>({});
const eventCategories = ref<Record<string, EventCategoryAssignment[]>>({});
const loadingCategories = ref<Record<string, boolean>>({});
const eventSponsors = ref<Record<string, EventSponsor[]>>({});
const loadingSponsors = ref<Record<string, boolean>>({});
const ploDetails = ref<Record<string, PloProfile | null>>({});
const loadingPlo = ref<Record<string, boolean>>({});

function isBase64Image(value: string | null): boolean {
  if (!value) return false;
  return value.startsWith('data:image/');
}

function formatVenue(event: Event): string {
  const parts = [];
  if (event.venueName) parts.push(event.venueName);
  if (event.venueAddress) parts.push(event.venueAddress);
  if (event.city) parts.push(event.city);
  if (event.country) parts.push(event.country);
  return parts.length > 0 ? parts.join(', ') : 'Not set';
}

function formatCapacity(capacity: number | null): string {
  if (capacity === null || capacity === undefined) return 'Not set';
  return capacity.toLocaleString();
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Not set';
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return 'Not set';
  }
}

function formatField(value: string | null | undefined): string {
  if (!value) return 'Not set';
  const trimmed = value.trim();
  return trimmed || 'Not set';
}

function formatOwner(first: string | null | undefined, last: string | null | undefined): string {
  const parts = [first, last].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : 'Not set';
}

function formatLocation(city: string | null | undefined, country: string | null | undefined): string {
  const c = city?.trim() || '';
  const co = country?.trim() || '';
  if (!c && !co) return 'Not set';
  if (c && co) return `${c}, ${co}`;
  return c || co;
}

async function toggleDetails(eventId: string) {
  if (expandedEventId.value === eventId) {
    expandedEventId.value = null;
  } else {
    expandedEventId.value = eventId;
    await loadEventDetails(eventId);
  }
}

async function loadEventDetails(eventId: string) {
  const event = events.value.find(e => e.id === eventId);
  if (!event) return;

  if (!eventSlots.value[eventId]) {
    await loadSlots(eventId);
  }

  if (!eventFights.value[eventId]) {
    await loadFights(eventId);
  }

  if (!eventCategories.value[eventId]) {
    await loadCategories(eventId);
  }

  if (!eventSponsors.value[eventId]) {
    await loadSponsors(eventId);
  }

  if (!ploDetails.value[event.ploId]) {
    await loadPloDetails(event.ploId);
  }
}

async function loadSlots(eventId: string) {
  loadingSlots.value[eventId] = true;
  try {
    eventSlots.value[eventId] = await eventService.getAllSlots(eventId);
  } catch {
    eventSlots.value[eventId] = [];
  } finally {
    loadingSlots.value[eventId] = false;
  }
}

async function loadFights(eventId: string) {
  loadingFights.value[eventId] = true;
  try {
    eventFights.value[eventId] = await eventService.getPublicFightsForEvent(eventId);
  } catch {
    eventFights.value[eventId] = [];
  } finally {
    loadingFights.value[eventId] = false;
  }
}

async function loadCategories(eventId: string) {
  loadingCategories.value[eventId] = true;
  try {
    eventCategories.value[eventId] = await eventCategoriesService.getByEvent(eventId);
  } catch {
    eventCategories.value[eventId] = [];
  } finally {
    loadingCategories.value[eventId] = false;
  }
}

async function loadSponsors(eventId: string) {
  loadingSponsors.value[eventId] = true;
  try {
    eventSponsors.value[eventId] = await eventSponsorsService.getByEvent(eventId);
  } catch {
    eventSponsors.value[eventId] = [];
  } finally {
    loadingSponsors.value[eventId] = false;
  }
}

async function loadPloDetails(ploId: string) {
  if (!ploId) return;
  loadingPlo.value[ploId] = true;
  try {
    ploDetails.value[ploId] = await ploService.getPublicById(ploId);
  } catch {
    ploDetails.value[ploId] = null;
  } finally {
    loadingPlo.value[ploId] = false;
  }
}

async function loadEvents() {
  loading.value = true;
  error.value = null;
  try {
    events.value = await eventService.getPublishedEvents();
  } catch (err: any) {
    error.value = getErrorMessage(err?.error, 'load events');
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

.status-message-small {
  color: #666;
  font-size: 14px;
  margin: 10px 0;
}

.events-list {
  list-style: none;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.event-item {
  padding: 18px 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.event-title-block {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.event-title-text {
  font-size: 18px;
}

.event-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
  background-color: #28a745;
  color: white;
}

.event-main {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-top: 4px;
}

.event-poster {
  width: 160px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.poster-preview {
  width: 100%;
  max-width: 160px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.poster-link {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 13px;
}

.poster-link:hover {
  background-color: #0056b3;
}

.poster-empty {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 13px;
  border: 1px dashed #ddd;
  border-radius: 4px;
}

.event-details {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px 16px;
  margin-bottom: 6px;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-weight: 600;
  color: #1f2937;
  font-size: 13px;
}

.detail-value {
  color: #374151;
  word-break: break-word;
  font-size: 13px;
}

.detail-value a {
  color: #007bff;
  text-decoration: none;
}

.detail-value a:hover {
  text-decoration: underline;
}

.event-extra {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
}

.toggle-btn {
  padding: 8px 14px;
  font-size: 13px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  background-color: #1d4ed8;
  color: #ffffff;
}

.toggle-btn:hover {
  background-color: #1e40af;
}

.event-details-expanded {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.details-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.details-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.details-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.slots-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
}

.slot-assigned {
  color: #28a745;
  font-weight: bold;
}

.slot-available {
  color: #6c757d;
}

.no-data {
  padding: 10px;
  color: #6c757d;
  font-style: italic;
  font-size: 13px;
}

.plo-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.plo-detail-row {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.plo-label {
  font-weight: 600;
  color: #555;
  min-width: 120px;
}

.plo-value {
  color: #333;
  flex: 1;
}

.plo-value a {
  color: #007bff;
  text-decoration: none;
}

.plo-value a:hover {
  text-decoration: underline;
}

.fights-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fight-item {
  padding: 12px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.fight-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.fighters-names {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #1f2937;
}

.fighter-name {
  font-size: 14px;
}

.vs {
  color: #6b7280;
  font-size: 12px;
  font-weight: normal;
}

.fight-time {
  font-size: 12px;
  color: #6b7280;
}

.fight-details-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.fighter-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fighter-label {
  font-weight: 600;
  color: #555;
  font-size: 12px;
}

.fighter-info {
  color: #333;
  font-size: 13px;
}

.fighter-email {
  color: #6b7280;
  font-size: 12px;
}

.categories-list-readonly {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-item-readonly {
  padding: 6px 12px;
  background-color: #e5e7eb;
  border-radius: 16px;
  font-size: 13px;
  color: #374151;
}

.category-name {
  font-weight: 500;
}

.sponsors-list-readonly {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sponsor-item-readonly {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.sponsor-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  margin-bottom: 4px;
}

.sponsor-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.sponsor-level {
  display: inline-block;
  padding: 2px 8px;
  background-color: #f3f4f6;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
}
</style>

