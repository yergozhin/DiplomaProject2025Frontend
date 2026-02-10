<template>
  <div class="send-offer-container">
    <h1 class="send-offer-title">Send Offer</h1>
    <div v-if="loadingFight" class="status-message">Loading fight details...</div>
    <div v-else-if="fightError" class="status-message">{{ fightError }}</div>
    <div v-else-if="fight" class="send-offer-form">
      <div class="fight-info">
        <h2>Fight Details</h2>
        <div class="fighters-section">
          <div class="fighter-card">
            <h3>Fighter A</h3>
            <div class="fighter-details">
              <div class="fighter-header">
                <div class="fighter-avatar">
                  <img
                    v-if="fighterProfiles[fight.fighterAUserId]?.profilePicture"
                    :src="fighterProfiles[fight.fighterAUserId]?.profilePicture as string"
                    alt="Fighter A profile picture"
                  />
                  <div v-else class="fighter-avatar-placeholder">
                    {{ getInitialName(fighterProfiles[fight.fighterAUserId]?.firstName, fighterProfiles[fight.fighterAUserId]?.lastName) }}
                  </div>
                </div>
                <div class="fighter-header-info">
                  <div class="fighter-main-name">
                    {{ formatName(fighterProfiles[fight.fighterAUserId]?.firstName, fighterProfiles[fight.fighterAUserId]?.lastName, fight.fighterAName) }}
                  </div>
                  <div class="fighter-main-email">
                    {{ formatEmail(fighterProfiles[fight.fighterAUserId]?.email, fight.fighterAEmail) }}
                  </div>
                  <div class="fighter-main-meta">
                    <span class="meta-item">
                      {{ formatWeightClass(fighterProfiles[fight.fighterAUserId]?.currentWeightClass, fight.fighterAWeightClass) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="info-row">
                <span class="label">Nickname:</span>
                <span class="value">{{ formatField(fighterProfiles[fight.fighterAUserId]?.nickname) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">{{ formatField(fighterProfiles[fight.fighterAUserId]?.phoneNumber) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Gender:</span>
                <span class="value">{{ formatField(fighterProfiles[fight.fighterAUserId]?.gender) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Date of birth:</span>
                <span class="value">{{ formatDateField(fighterProfiles[fight.fighterAUserId]?.dateOfBirth) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Location:</span>
                <span class="value">{{ formatLocation(fighterProfiles[fight.fighterAUserId]?.city, fighterProfiles[fight.fighterAUserId]?.country) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Height:</span>
                <span class="value">{{ formatNumberField(fighterProfiles[fight.fighterAUserId]?.height) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Reach:</span>
                <span class="value">{{ formatNumberField(fighterProfiles[fight.fighterAUserId]?.reach) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Record:</span>
                <span class="value">{{ formatRecord(fighterProfiles[fight.fighterAUserId]?.wins, fighterProfiles[fight.fighterAUserId]?.losses, fighterProfiles[fight.fighterAUserId]?.draws) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Total fights:</span>
                <span class="value">{{ formatNumberField(fighterProfiles[fight.fighterAUserId]?.totalFights) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Status:</span>
                <span class="value">{{ formatField(fighterProfiles[fight.fighterAUserId]?.status) }}</span>
              </div>
              <div v-if="fighterProfiles[fight.fighterAUserId]?.bio" class="info-row">
                <span class="label">Bio:</span>
                <span class="value">{{ fighterProfiles[fight.fighterAUserId]?.bio }}</span>
              </div>
              <div v-if="fighterProfiles[fight.fighterAUserId]?.awards" class="info-row">
                <span class="label">Awards:</span>
                <span class="value">{{ fighterProfiles[fight.fighterAUserId]?.awards }}</span>
              </div>
            </div>
          </div>
          <div class="fighter-card">
            <h3>Fighter B</h3>
            <div class="fighter-details">
              <div class="fighter-header">
                <div class="fighter-avatar">
                  <img
                    v-if="fighterProfiles[fight.fighterBUserId]?.profilePicture"
                    :src="fighterProfiles[fight.fighterBUserId]?.profilePicture as string"
                    alt="Fighter B profile picture"
                  />
                  <div v-else class="fighter-avatar-placeholder">
                    {{ getInitialName(fighterProfiles[fight.fighterBUserId]?.firstName, fighterProfiles[fight.fighterBUserId]?.lastName) }}
                  </div>
                </div>
                <div class="fighter-header-info">
                  <div class="fighter-main-name">
                    {{ formatName(fighterProfiles[fight.fighterBUserId]?.firstName, fighterProfiles[fight.fighterBUserId]?.lastName, fight.fighterBName) }}
                  </div>
                  <div class="fighter-main-email">
                    {{ formatEmail(fighterProfiles[fight.fighterBUserId]?.email, fight.fighterBEmail) }}
                  </div>
                  <div class="fighter-main-meta">
                    <span class="meta-item">
                      {{ formatWeightClass(fighterProfiles[fight.fighterBUserId]?.currentWeightClass, fight.fighterBWeightClass) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="info-row">
                <span class="label">Nickname:</span>
                <span class="value">{{ formatField(fighterProfiles[fight.fighterBUserId]?.nickname) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">{{ formatField(fighterProfiles[fight.fighterBUserId]?.phoneNumber) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Gender:</span>
                <span class="value">{{ formatField(fighterProfiles[fight.fighterBUserId]?.gender) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Date of birth:</span>
                <span class="value">{{ formatDateField(fighterProfiles[fight.fighterBUserId]?.dateOfBirth) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Location:</span>
                <span class="value">{{ formatLocation(fighterProfiles[fight.fighterBUserId]?.city, fighterProfiles[fight.fighterBUserId]?.country) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Height:</span>
                <span class="value">{{ formatNumberField(fighterProfiles[fight.fighterBUserId]?.height) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Reach:</span>
                <span class="value">{{ formatNumberField(fighterProfiles[fight.fighterBUserId]?.reach) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Record:</span>
                <span class="value">{{ formatRecord(fighterProfiles[fight.fighterBUserId]?.wins, fighterProfiles[fight.fighterBUserId]?.losses, fighterProfiles[fight.fighterBUserId]?.draws) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Total fights:</span>
                <span class="value">{{ formatNumberField(fighterProfiles[fight.fighterBUserId]?.totalFights) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Status:</span>
                <span class="value">{{ formatField(fighterProfiles[fight.fighterBUserId]?.status) }}</span>
              </div>
              <div v-if="fighterProfiles[fight.fighterBUserId]?.bio" class="info-row">
                <span class="label">Bio:</span>
                <span class="value">{{ fighterProfiles[fight.fighterBUserId]?.bio }}</span>
              </div>
              <div v-if="fighterProfiles[fight.fighterBUserId]?.awards" class="info-row">
                <span class="label">Awards:</span>
                <span class="value">{{ fighterProfiles[fight.fighterBUserId]?.awards }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="offer-form">
        <div class="form-section">
          <h2>Event & Slot</h2>
          <div class="form-group">
            <label for="eventId">Event *</label>
            <select
              id="eventId"
              v-model="form.eventId"
              required
              @change="handleEventChange"
              :disabled="loadingEvents || submitting"
            >
              <option value="">Select an event</option>
              <option v-for="event in events" :key="event.id" :value="event.id">
                {{ event.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="eventSlotId">Time Slot *</label>
            <select
              id="eventSlotId"
              v-model="form.eventSlotId"
              required
              :disabled="!form.eventId || loadingSlots || submitting"
            >
              <option value="">Select a time slot</option>
              <option v-for="slot in availableSlots" :key="slot.id" :value="slot.id">
                {{ formatDate(slot.startTime) }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-section">
          <h2>Fighter A Offer</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="fighterAAmount">Amount *</label>
              <input
                id="fighterAAmount"
                v-model.number="form.fighterAAmount"
                type="number"
                step="0.01"
                min="0"
                required
                :disabled="submitting"
              />
            </div>
            <div class="form-group">
              <label for="fighterACurrency">Currency *</label>
              <input
                id="fighterACurrency"
                v-model="form.fighterACurrency"
                type="text"
                required
                placeholder="USD"
                :disabled="submitting"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Fighter B Offer</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="fighterBAmount">Amount *</label>
              <input
                id="fighterBAmount"
                v-model.number="form.fighterBAmount"
                type="number"
                step="0.01"
                min="0"
                required
                :disabled="submitting"
              />
            </div>
            <div class="form-group">
              <label for="fighterBCurrency">Currency *</label>
              <input
                id="fighterBCurrency"
                v-model="form.fighterBCurrency"
                type="text"
                required
                placeholder="USD"
                :disabled="submitting"
              />
            </div>
          </div>
        </div>

        <div v-if="submitError" class="error-message">{{ submitError }}</div>

        <div class="form-actions">
          <button type="button" @click="handleCancel" :disabled="submitting" class="cancel-btn">
            Cancel
          </button>
          <button type="submit" :disabled="submitting" class="submit-btn">
            {{ submitting ? 'Sending...' : 'Send Offer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fightService } from '@/services/fight.service';
import { eventService } from '@/services/event.service';
import { offerService } from '@/services/offer.service';
import { fighterService } from '@/services/fighter.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { AcceptedFight, Event, EventSlot, Fighter } from '@/types';

const route = useRoute();
const router = useRouter();

const fightId = route.query.fightId as string;
const fight = ref<AcceptedFight | null>(null);
const events = ref<Event[]>([]);
const loadingFight = ref(false);
const loadingEvents = ref(false);
const loadingSlots = ref(false);
const fightError = ref<string | null>(null);
const submitting = ref(false);
const submitError = ref<string | null>(null);
const fighterProfiles = ref<Record<string, Fighter | null>>({});

const form = ref({
  eventId: '',
  eventSlotId: '',
  fighterAAmount: 0,
  fighterACurrency: '',
  fighterBAmount: 0,
  fighterBCurrency: '',
});

const availableSlots = ref<EventSlot[]>([]);

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

async function loadFight() {
  if (!fightId) {
    fightError.value = 'No fight ID provided';
    return;
  }

  loadingFight.value = true;
  fightError.value = null;
  try {
    const allFights = await fightService.getAcceptedFights();
    const foundFight = allFights.find(f => f.id === fightId);
    if (!foundFight) {
      fightError.value = 'Fight not found';
      return;
    }
    fight.value = foundFight;
    await loadFighterProfiles();
  } catch (err: any) {
    fightError.value = getErrorMessage(err.error, 'load fight details');
  } finally {
    loadingFight.value = false;
  }
}

async function loadFighterProfiles() {
  if (!fight.value) return;
  
  const ids = [fight.value.fighterAUserId, fight.value.fighterBUserId].filter(Boolean);
  
  await Promise.all(
    ids.map(async (id) => {
      if (!id || fighterProfiles.value[id]) return;
      try {
        fighterProfiles.value[id] = await fighterService.getPublicById(id);
      } catch {
        fighterProfiles.value[id] = null;
      }
    }),
  );
}

function formatName(first: string | null | undefined, last: string | null | undefined, fallbackName: string | null | undefined): string {
  const f = first?.trim() || '';
  const l = last?.trim() || '';
  if (f || l) return `${f} ${l}`.trim();
  if (fallbackName && fallbackName.trim()) return fallbackName.trim();
  return 'Not set';
}

function formatWeightClass(current: string | null | undefined, fallback: string | null | undefined): string {
  if (current && current.trim()) return current.trim();
  if (fallback && fallback.trim()) return fallback.trim();
  return 'Not set';
}

function formatEmail(email: string | null | undefined, fallback: string | null | undefined): string {
  if (email && email.trim()) return email.trim();
  if (fallback && fallback.trim()) return fallback.trim();
  return 'Not set';
}

function getInitialName(first: string | null | undefined, last: string | null | undefined): string {
  const f = first?.trim();
  const l = last?.trim();
  const source = f || l || 'N';
  return source.charAt(0).toUpperCase();
}

function formatField(value: string | null | undefined): string {
  if (value && value.trim()) return value.trim();
  return 'Not set';
}

function formatNumberField(value: number | null | undefined): string {
  if (value !== null && value !== undefined) return String(value);
  return 'Not set';
}

function formatDateField(value: string | null | undefined): string {
  if (!value) return 'Not set';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return 'Not set';
  }
}

function formatLocation(city: string | null | undefined, country: string | null | undefined): string {
  const c = city?.trim();
  const co = country?.trim();
  if (c && co) return `${c}, ${co}`;
  if (c) return c;
  if (co) return co;
  return 'Not set';
}

function formatRecord(wins: number | null | undefined, losses: number | null | undefined, draws: number | null | undefined): string {
  const w = wins ?? 0;
  const l = losses ?? 0;
  const d = draws ?? 0;
  return `${w}-${l}-${d}`;
}

async function loadEvents() {
  loadingEvents.value = true;
  try {
    events.value = await eventService.getOwnedEvents();
  } catch (err: any) {
    submitError.value = getErrorMessage(err.error, 'load events');
  } finally {
    loadingEvents.value = false;
  }
}

async function handleEventChange() {
  form.value.eventSlotId = '';
  availableSlots.value = [];
  
  if (!form.value.eventId) return;
  
  loadingSlots.value = true;
  try {
    availableSlots.value = await eventService.getAvailableSlots(form.value.eventId);
  } catch (err: any) {
    submitError.value = getErrorMessage(err.error, 'load available slots');
  } finally {
    loadingSlots.value = false;
  }
}

async function handleSubmit() {
  if (!fightId) {
    submitError.value = 'No fight ID provided';
    return;
  }

  submitting.value = true;
  submitError.value = null;

  try {
    await offerService.sendOffers({
      fightId,
      eventId: form.value.eventId,
      eventSlotId: form.value.eventSlotId,
      fighterAAmount: form.value.fighterAAmount,
      fighterACurrency: form.value.fighterACurrency,
      fighterBAmount: form.value.fighterBAmount,
      fighterBCurrency: form.value.fighterBCurrency,
    });
    router.push('/plo/offers');
  } catch (err: any) {
    submitError.value = getErrorMessage(err.error, 'send the offer');
  } finally {
    submitting.value = false;
  }
}

function handleCancel() {
  router.push('/plo/available-fights');
}

onMounted(() => {
  loadFight();
  loadEvents();
});
</script>

<style scoped>
.send-offer-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.send-offer-title {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.status-message {
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
}

.send-offer-form {
  max-width: 100%;
  box-sizing: border-box;
}

.fight-info,
.form-section {
  padding: 20px;
  margin-bottom: 30px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.fight-info h2,
.form-section h2 {
  margin-top: 0;
  margin-bottom: 15px;
}

.fighters-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.fighter-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 16px;
}

.fighter-card h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 18px;
  color: #1f2937;
}

.fighter-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fighter-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.fighter-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.12), rgba(59, 130, 246, 0.12));
  border: 1px solid #d1d5db;
}

.fighter-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fighter-avatar-placeholder {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.fighter-header-info {
  flex: 1;
  min-width: 0;
}

.fighter-main-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.fighter-main-email {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.fighter-main-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 13px;
  color: #666;
  padding: 2px 8px;
  background-color: #f3f4f6;
  border-radius: 4px;
}

.info-row {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.info-row .label {
  font-weight: 600;
  color: #374151;
  min-width: 100px;
  flex-shrink: 0;
}

.info-row .value {
  color: #6b7280;
  flex: 1;
  word-break: break-word;
}

.offer-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 100%;
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
  box-sizing: border-box;
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
  max-width: 100%;
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.form-row {
  display: flex;
  gap: 15px;
  width: 100%;
  box-sizing: border-box;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
  min-width: 0;
}

.error-message {
  padding: 10px;
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
  background-color: #007bff;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.cancel-btn:disabled,
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

