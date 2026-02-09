<template>
  <div class="send-offer-container">
    <h1 class="send-offer-title">Send Offer</h1>
    <div v-if="loadingFight" class="status-message">Loading fight details...</div>
    <div v-else-if="fightError" class="status-message">{{ fightError }}</div>
    <div v-else-if="fight" class="send-offer-form">
      <div class="fight-info">
        <h2>Fight Details</h2>
        <div class="fighters">
          <div class="fighter">
            <strong>Fighter A:</strong>
            <div>{{ fight.fighterAName || fight.fighterAEmail }}</div>
            <div v-if="fight.fighterAWeightClass">{{ fight.fighterAWeightClass }}</div>
          </div>
          <div class="vs">VS</div>
          <div class="fighter">
            <strong>Fighter B:</strong>
            <div>{{ fight.fighterBName || fight.fighterBEmail }}</div>
            <div v-if="fight.fighterBWeightClass">{{ fight.fighterBWeightClass }}</div>
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
import { getErrorMessage } from '@/utils/errorMessages';
import type { AcceptedFight, Event, EventSlot } from '@/types';

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
  } catch (err: any) {
    fightError.value = getErrorMessage(err.error, 'load fight details');
  } finally {
    loadingFight.value = false;
  }
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

.fighters {
  display: flex;
  align-items: center;
  gap: 20px;
}

.fighter {
  flex: 1;
}

.vs {
  font-weight: bold;
  font-size: 18px;
  color: #666;
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

