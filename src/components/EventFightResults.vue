<template>
  <div class="fight-results-section">
    <div class="section-header">
      <h3>Fight Results</h3>
      <p v-if="!props.readOnly" class="section-description">Add results for fights that have already taken place</p>
    </div>
    <div v-if="loading" class="status-message">Loading fights...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="pastFights.length === 0" class="status-message">No past fights found</div>
    <div v-else class="fights-list">
      <div v-for="fight in pastFights" :key="fight.fightId" class="fight-result-item">
        <div class="fight-header">
          <div class="fight-info">
            <div class="fighters">
              <span class="fighter-name">{{ fight.fighterAName }}</span>
              <span class="vs">VS</span>
              <span class="fighter-name">{{ fight.fighterBName }}</span>
            </div>
            <div class="fight-time">{{ formatDateTime(fight.slotStartTime) }}</div>
          </div>
          <div v-if="fight.existingResult" class="result-badge">
            Result Added
          </div>
        </div>

        <form v-if="!props.readOnly && editingFightId === fight.fightId" class="result-form" @submit.prevent="submitResult(fight)">
          <div class="form-group">
            <label>Winner *</label>
            <select 
              v-model="resultForm.winnerId" 
              :disabled="submitting" 
              class="winner-select"
            >
              <option value="">Select winner</option>
              <option :value="fight.fighterAProfileId || ''">
                {{ getFighterDisplayName(fight.fighterAName, fight.fighterAEmail, 'A') }}
              </option>
              <option :value="fight.fighterBProfileId || ''">
                {{ getFighterDisplayName(fight.fighterBName, fight.fighterBEmail, 'B') }}
              </option>
              <option value="__DRAW__">Draw / No Contest</option>
            </select>
            <small v-if="resultForm.winnerId && resultForm.winnerId !== '__DRAW__'" class="selected-winner">
              Selected: {{ resultForm.winnerId }}
            </small>
            <small v-if="resultForm.winnerId === '__DRAW__'" class="selected-winner">
              Selected: Draw / No Contest
            </small>
          </div>
          <div class="form-group">
            <label>Result Type *</label>
            <select v-model="resultForm.resultType" required :disabled="submitting">
              <option :value="null">Select result type</option>
              <option value="knockout">Knockout</option>
              <option value="technical_knockout">Technical Knockout</option>
              <option value="submission">Submission</option>
              <option value="decision">Decision</option>
              <option value="draw">Draw</option>
              <option value="no_contest">No Contest</option>
              <option value="disqualification">Disqualification</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Round Ended</label>
              <input
                v-model.number="resultForm.roundEnded"
                type="number"
                min="1"
                :disabled="submitting"
              />
            </div>
            <div class="form-group">
              <label>Time Ended (e.g., 3:45)</label>
              <input
                v-model="resultForm.timeEnded"
                type="text"
                placeholder="3:45"
                :disabled="submitting"
              />
            </div>
          </div>
          <div v-if="resultError" class="error-message">{{ resultError }}</div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="cancelEdit" :disabled="submitting">
              Cancel
            </button>
            <button type="submit" class="submit-btn" :disabled="submitting">
              {{ submitting ? 'Saving...' : fight.existingResult ? 'Update Result' : 'Add Result' }}
            </button>
          </div>
        </form>

        <div v-else class="result-display">
          <div v-if="fight.existingResult" class="existing-result">
            <div class="result-info">
              <strong>Winner:</strong> {{ getWinnerDisplayName(fight, fight.existingResult) }}
            </div>
            <div class="result-info">
              <strong>Result Type:</strong> {{ formatResultType(fight.existingResult.resultType) }}
            </div>
            <div v-if="fight.existingResult.roundEnded" class="result-info">
              <strong>Round:</strong> {{ fight.existingResult.roundEnded }}
            </div>
            <div v-if="fight.existingResult.timeEnded" class="result-info">
              <strong>Time:</strong> {{ fight.existingResult.timeEnded }}
            </div>
          </div>
          <button
            v-if="!props.readOnly"
            type="button"
            class="edit-result-btn"
            @click="startEdit(fight)"
            :disabled="submitting"
          >
            {{ fight.existingResult ? 'Edit Result' : 'Add Result' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { eventService } from '@/services/event.service';
import { fightResultsService } from '@/services/fight-results.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { EventFight, FightResult, CreateFightResultRequest, UpdateFightResultRequest } from '@/types';

const props = defineProps<{
  eventId: string;
  readOnly?: boolean;
}>();

const emit = defineEmits(['results-updated']);

const fights = ref<EventFight[]>([]);
const results = ref<Map<string, FightResult>>(new Map());
const loading = ref(false);
const error = ref<string | null>(null);
const editingFightId = ref<string | null>(null);
const submitting = ref(false);
const resultError = ref<string | null>(null);

const resultForm = ref<{
  winnerId: string | null | '__DRAW__';
  resultType: 'knockout' | 'technical_knockout' | 'submission' | 'decision' | 'draw' | 'no_contest' | 'disqualification' | null;
  roundEnded: number | null;
  timeEnded: string | null;
}>({
  winnerId: '',
  resultType: null,
  roundEnded: null,
  timeEnded: null,
});

const pastFights = computed(() => {
  const now = new Date();
  return fights.value
    .filter((fight: EventFight) => new Date(fight.slotStartTime) < now)
    .map((fight: EventFight) => ({
      ...fight,
      existingResult: results.value.get(fight.fightId) || null,
    }));
});

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}

function formatResultType(resultType: string | null) {
  if (!resultType) return 'N/A';
  return resultType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getFighterDisplayName(name: string | null | undefined, email: string | null | undefined, fallback: string): string {
  const parts: string[] = [];
  if (name && name.trim()) {
    parts.push(name.trim());
  }
  if (email && email.trim()) {
    parts.push(`(${email.trim()})`);
  }
  if (parts.length > 0) {
    return parts.join(' ');
  }
  return `Fighter ${fallback}`;
}

function getWinnerDisplayName(fight: EventFight, result: FightResult): string {
  if (!result.winnerId) {
    return 'Draw / No Contest';
  }

  if (result.winnerId === fight.fighterAProfileId) {
    return getFighterDisplayName(fight.fighterAName, fight.fighterAEmail, 'A');
  }
  if (result.winnerId === fight.fighterBProfileId) {
    return getFighterDisplayName(fight.fighterBName, fight.fighterBEmail, 'B');
  }

  return result.winnerName || 'Unknown Winner';
}

async function loadFights() {
  if (!props.eventId) return;
  loading.value = true;
  error.value = null;
  try {
    const loadedFights = props.readOnly 
      ? await eventService.getPublicFightsForEvent(props.eventId)
      : await eventService.getFightsForEvent(props.eventId);
    fights.value = loadedFights;

    if (loadedFights.length > 0) {
      console.log('Sample fight data:', loadedFights[0]);
    }

    for (const fight of fights.value) {
      try {
        const result = await fightResultsService.getByFight(fight.fightId);
        results.value.set(fight.fightId, result);
      } catch {
      }
    }
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load fights');
    console.error('Error loading fights:', err);
  } finally {
    loading.value = false;
  }
}

function startEdit(fight: EventFight & { existingResult: FightResult | null }) {
  editingFightId.value = fight.fightId;
  console.log('Starting edit for fight:', fight);
  console.log('Fighter A Profile ID:', fight.fighterAProfileId);
  console.log('Fighter B Profile ID:', fight.fighterBProfileId);
  if (fight.existingResult) {
    const winnerIdForSelect = fight.existingResult.winnerId === null ? '__DRAW__' : (fight.existingResult.winnerId || '');
    resultForm.value = {
      winnerId: winnerIdForSelect,
      resultType: fight.existingResult.resultType,
      roundEnded: fight.existingResult.roundEnded,
      timeEnded: fight.existingResult.timeEnded,
    };
  } else {
    resultForm.value = {
      winnerId: '',
      resultType: null,
      roundEnded: null,
      timeEnded: null,
    };
  }
  console.log('Form initialized with:', resultForm.value);
  resultError.value = null;
}

function cancelEdit() {
  editingFightId.value = null;
  resultForm.value = {
    winnerId: '' as string,
    resultType: null,
    roundEnded: null,
    timeEnded: null,
  };
  resultError.value = null;
}

async function submitResult(fight: EventFight & { existingResult: FightResult | null }) {
  if (!resultForm.value.resultType) {
    resultError.value = 'Result type is required';
    return;
  }

  if (!resultForm.value.winnerId || (resultForm.value.winnerId !== '__DRAW__' && resultForm.value.winnerId.trim() === '')) {
    resultError.value = 'Please select a winner or Draw / No Contest';
    return;
  }
  
  submitting.value = true;
  resultError.value = null;

  console.log('Submitting result with:', {
    winnerId: resultForm.value.winnerId,
    resultType: resultForm.value.resultType,
    fightId: fight.fightId,
  });

  let winnerId: string | null = null;
  if (resultForm.value.winnerId && typeof resultForm.value.winnerId === 'string' && resultForm.value.winnerId.trim() !== '' && resultForm.value.winnerId !== '__DRAW__') {
    winnerId = resultForm.value.winnerId;
  }
  
  try {
    if (fight.existingResult) {
      const payload: UpdateFightResultRequest = {
        winnerId: winnerId,
        resultType: resultForm.value.resultType,
        roundEnded: resultForm.value.roundEnded || null,
        timeEnded: resultForm.value.timeEnded?.trim() || null,
      };
      console.log('Update payload:', payload);
      const updated = await fightResultsService.update(fight.existingResult.id, payload);
      results.value.set(fight.fightId, updated);
    } else {
      const payload: CreateFightResultRequest = {
        fightId: fight.fightId,
        winnerId: winnerId,
        resultType: resultForm.value.resultType,
        roundEnded: resultForm.value.roundEnded || null,
        timeEnded: resultForm.value.timeEnded?.trim() || null,
      };
      console.log('Create payload:', payload);
      const created = await fightResultsService.create(payload);
      results.value.set(fight.fightId, created);
    }
    cancelEdit();
    emit('results-updated');
  } catch (err: any) {
    console.error('Error submitting result:', err);
    resultError.value = getErrorMessage(err.error, 'save result');
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadFights();
});
</script>

<style scoped>
.fight-results-section {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0 0 5px 0;
  font-size: 20px;
  color: #333;
}

.section-description {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.status-message {
  padding: 15px;
  text-align: center;
  color: #666;
}

.error-message {
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 15px;
}

.fights-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.fight-result-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.fight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.fight-info {
  flex: 1;
}

.fighters {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.fighter-name {
  font-weight: bold;
  color: #333;
}

.vs {
  color: #666;
  font-size: 14px;
}

.fight-time {
  font-size: 12px;
  color: #666;
}

.result-badge {
  padding: 4px 12px;
  background-color: #28a745;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.result-form {
  margin-top: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
  background-color: white;
  color: #333;
}

.form-group select option {
  padding: 8px;
  background-color: white;
  color: #333;
  display: block;
}

.winner-select {
  z-index: 10;
  position: relative;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.submit-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #5a6268;
}

.result-display {
  margin-top: 15px;
}

.existing-result {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.result-info {
  margin-bottom: 5px;
  font-size: 14px;
}

.result-info strong {
  color: #333;
  margin-right: 5px;
}

.edit-result-btn {
  padding: 8px 16px;
  background-color: #ffc107;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.edit-result-btn:hover:not(:disabled) {
  background-color: #e0a800;
}

.edit-result-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>