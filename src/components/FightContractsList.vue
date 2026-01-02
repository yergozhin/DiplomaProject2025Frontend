<template>
  <div class="contracts-section">
    <div class="section-header">
      <h2>Fight Contracts</h2>
    </div>
    <div v-if="loading" class="status-message">Loading contracts...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="contracts.length === 0" class="no-data">No contracts available</div>
    <ul v-else class="contracts-list">
      <li v-for="contract in contracts" :key="contract.id" class="contract-item">
        <div class="contract-header">
          <h3>{{ contract.fighterName || 'Unknown Fighter' }}</h3>
          <span
            class="status-badge"
            :class="contract.contractSigned ? 'signed' : 'unsigned'"
          >
            {{ contract.contractSigned ? 'Signed' : 'Unsigned' }}
          </span>
        </div>
        <div class="contract-info">
          <div class="info-row">
            <span class="label">Amount:</span>
            <span class="value">{{ contract.contractAmount }} {{ contract.currency }}</span>
          </div>
          <div v-if="contract.contractTerms" class="info-row">
            <span class="label">Terms:</span>
            <span class="value">{{ contract.contractTerms }}</span>
          </div>
          <div v-if="contract.contractSignedAt" class="info-row">
            <span class="label">Signed At:</span>
            <span class="value">{{ formatDateTime(contract.contractSignedAt) }}</span>
          </div>
          <div class="info-row">
            <span class="label">Created:</span>
            <span class="value">{{ formatDateTime(contract.createdAt) }}</span>
          </div>
        </div>
        <div v-if="canSignContract(contract)" class="contract-actions">
          <button
            @click="handleSignContract(contract.id)"
            :disabled="signingContractId === contract.id"
            class="sign-btn"
          >
            {{ signingContractId === contract.id ? 'Signing...' : 'Sign Contract' }}
          </button>
        </div>
      </li>
    </ul>
    <div v-if="showCreateForm && props.showCreateFormFor" class="create-contract-form">
      <h3>Create Contract for {{ props.showCreateFormFor === 'fighterA' ? 'Fighter A' : 'Fighter B' }}</h3>
      <form @submit.prevent="handleCreateContract">
        <div class="form-group">
          <label for="fighterId">Fighter *</label>
          <input
            id="fighterId"
            v-model="contractForm.fighterId"
            type="text"
            disabled
            class="disabled-input"
            required
          />
          <small class="form-hint">
            Fighter is pre-selected based on the button you clicked
          </small>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="contractAmount">Amount *</label>
            <input
              id="contractAmount"
              v-model.number="contractForm.contractAmount"
              type="number"
              min="0"
              step="0.01"
              :disabled="creatingContract"
              required
            />
          </div>
          <div class="form-group">
            <label for="currency">Currency</label>
            <select
              id="currency"
              v-model="contractForm.currency"
              :disabled="creatingContract"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="contractTerms">Contract Terms</label>
          <textarea
            id="contractTerms"
            v-model="contractForm.contractTerms"
            :disabled="creatingContract"
            rows="4"
          ></textarea>
        </div>
        <div v-if="createContractError" class="error-message">{{ createContractError }}</div>
        <div class="form-actions">
          <button type="button" @click="cancelCreateForm" class="cancel-btn">Cancel</button>
          <button type="submit" :disabled="creatingContract" class="save-btn">
            {{ creatingContract ? 'Creating...' : 'Create Contract' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { fightContractsService } from '@/services/fight-contracts.service';
import { useAuthStore } from '@/stores/auth.store';
import type { FightContract, CreateFightContractRequest, AcceptedFight } from '@/types';

interface Props {
  fightId: string;
  fightDetails?: AcceptedFight | null;
  showCreateFormFor?: 'fighterA' | 'fighterB' | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  contractCreated: [];
}>();

const authStore = useAuthStore();
const contracts = ref<FightContract[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const showCreateForm = ref(false);
const creatingContract = ref(false);
const createContractError = ref<string | null>(null);
const signingContractId = ref<string | null>(null);

const contractForm = ref({
  fighterId: '',
  contractAmount: 0,
  currency: 'USD',
  contractTerms: '',
});

function formatDateTime(value: string | null) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleString();
}

function canSignContract(contract: FightContract): boolean {
  if (!authStore.user) return false;
  if (contract.contractSigned) return false;
  return authStore.user.id === contract.fighterId && authStore.userRole === 'fighter';
}

async function loadContracts() {
  loading.value = true;
  error.value = null;
  try {
    contracts.value = await fightContractsService.getByFight(props.fightId);
  } catch (err: any) {
    if (err.status !== 404) {
      error.value = err.error || 'Failed to load contracts';
    }
  } finally {
    loading.value = false;
  }
}

async function handleCreateContract() {
  creatingContract.value = true;
  createContractError.value = null;
  try {
    if (!contractForm.value.fighterId) {
      createContractError.value = 'Fighter ID is required';
      return;
    }
    const payload: CreateFightContractRequest = {
      fightId: props.fightId,
      fighterId: contractForm.value.fighterId.trim(),
      contractAmount: contractForm.value.contractAmount,
      currency: contractForm.value.currency,
      contractTerms: contractForm.value.contractTerms.trim() || null,
    };
    await fightContractsService.create(payload);
    contractForm.value = {
      fighterId: '',
      contractAmount: 0,
      currency: 'USD',
      contractTerms: '',
    };
    showCreateForm.value = false;
    await loadContracts();
    emit('contractCreated');
  } catch (err: any) {
    createContractError.value = err.error || 'Failed to create contract';
  } finally {
    creatingContract.value = false;
  }
}

function cancelCreateForm() {
  showCreateForm.value = false;
  contractForm.value = {
    fighterId: '',
    contractAmount: 0,
    currency: 'USD',
    contractTerms: '',
  };
  createContractError.value = null;
  emit('contractCreated');
}

// Watch for showCreateFormFor prop to open form with pre-filled fighter
watch(() => props.showCreateFormFor, (newValue) => {
  if (newValue && props.fightDetails) {
    showCreateForm.value = true;
    if (newValue === 'fighterA') {
      contractForm.value.fighterId = props.fightDetails.fighterAUserId;
    } else if (newValue === 'fighterB') {
      contractForm.value.fighterId = props.fightDetails.fighterBUserId;
    }
  }
});

async function handleSignContract(contractId: string) {
  signingContractId.value = contractId;
  try {
    await fightContractsService.update(contractId, {
      contractSigned: true,
    });
    await loadContracts();
  } catch (err: any) {
    alert(err.error || 'Failed to sign contract');
  } finally {
    signingContractId.value = null;
  }
}

onMounted(() => {
  loadContracts();
});
</script>

<style scoped>
.contracts-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h2 {
  color: #333;
  margin: 0;
}

.disabled-input {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.status-message {
  color: #666;
  font-size: 16px;
  margin-bottom: 15px;
}

.error-message {
  color: #ff6b6b;
  font-size: 16px;
  margin-bottom: 15px;
}

.no-data {
  color: #666;
  text-align: center;
  padding: 20px;
}

.contracts-list {
  list-style: none;
  padding: 0;
}

.contract-item {
  margin-bottom: 20px;
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.contract-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.contract-header h3 {
  color: #333;
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.signed {
  background-color: #28a745;
  color: white;
}

.status-badge.unsigned {
  background-color: #ffc107;
  color: #212529;
}

.contract-info {
  margin-bottom: 15px;
}

.info-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
  color: #333;
}

.value {
  color: #666;
}

.contract-actions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.sign-btn {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.sign-btn:hover:not(:disabled) {
  background-color: #218838;
}

.sign-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.create-contract-form {
  margin-top: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.create-contract-form h3 {
  color: #333;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-hint {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.save-btn {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn:hover:not(:disabled) {
  background-color: #218838;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

