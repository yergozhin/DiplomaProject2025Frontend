<template>
  <div class="offers-container">
    <div class="header">
      <button @click="handleBack" class="back-btn">← Back to Fights</button>
      <h1 class="offers-title">Offers for this fight</h1>
    </div>
    <div v-if="loading" class="status-message">Loading...</div>
    <div v-else-if="error" class="status-message">{{ error }}</div>
    <div v-else-if="offers.length === 0" class="status-message">No available offers for this fight</div>
    <ul v-else class="offers-list">
      <li v-for="offer in offers" :key="offer.id" class="offer-item">
        <div class="offer-header">
          <strong>{{ offer.eventName }}</strong>
          <span>Status: {{ offer.status }}</span>
        </div>
        <div class="offer-details">
          <div>Event: {{ offer.eventName }}</div>
          <div>Slot Time: {{ formatDate(offer.slotStartTime) }}</div>
          <div class="plo-row">
            <span>PLO: {{ offer.ploEmail }}</span>
            <button
              type="button"
              class="plo-details-btn"
              @click="handleViewPloDetails(offer)"
            >
              {{ expandedPloOfferId === offer.id ? 'Hide PLO profile' : 'View PLO profile' }}
            </button>
          </div>
          <div
            class="plo-extra"
            v-if="ploDetails[offer.ploId] && expandedPloOfferId === offer.id"
          >
            <div>League name: {{ formatField(ploDetails[offer.ploId]?.leagueName) }}</div>
            <div>Owner: {{ formatOwnerName(ploDetails[offer.ploId]) }}</div>
            <div>Email: {{ formatField(ploDetails[offer.ploId]?.email) }}</div>
            <div>Phone: {{ formatField(ploDetails[offer.ploId]?.phoneNumber) }}</div>
            <div>
              Location:
              {{
                formatLocation(
                  ploDetails[offer.ploId]?.city,
                  ploDetails[offer.ploId]?.country,
                )
              }}
            </div>
            <div>Website: {{ formatField(ploDetails[offer.ploId]?.website) }}</div>
            <div v-if="ploDetails[offer.ploId]?.description">
              Description: {{ formatField(ploDetails[offer.ploId]?.description) }}
            </div>
          </div>
          <div>Amount: {{ offer.amount }} {{ offer.currency }}</div>
          <div>Fighter A Status: {{ offer.fighterAStatus }}</div>
          <div>Fighter B Status: {{ offer.fighterBStatus }}</div>

          <div class="fighters-extra">
            <div class="fighter-extra">
              <strong>Fighter A details</strong>
              <div>Name: {{ formatFighterName(getFighterDetails(offer.fighterAId)) }}</div>
              <div>Email: {{ formatField(getFighterDetails(offer.fighterAId)?.email) }}</div>
              <div>Nickname: {{ formatField(getFighterDetails(offer.fighterAId)?.nickname) }}</div>
            </div>
            <div class="fighter-extra">
              <strong>Fighter B details</strong>
              <div>Name: {{ formatFighterName(getFighterDetails(offer.fighterBId)) }}</div>
              <div>Email: {{ formatField(getFighterDetails(offer.fighterBId)?.email) }}</div>
              <div>Nickname: {{ formatField(getFighterDetails(offer.fighterBId)?.nickname) }}</div>
            </div>
          </div>
        </div>
        <div v-if="offer.status === 'pending'" class="offer-actions">
          <button @click="handleAcceptOffer(offer.id)" class="accept-btn" :disabled="updating">
            Accept
          </button>
          <button @click="handleRejectOffer(offer.id)" class="reject-btn" :disabled="updating">
            Reject
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { offerService } from '@/services/offer.service';
import { fighterService } from '@/services/fighter.service';
import { ploService } from '@/services/plo.service';
import { getErrorMessage } from '@/utils/errorMessages';
import { ROUTES } from '@/utils/constants';
import type { Offer, Fighter, PloProfile } from '@/types';

const route = useRoute();
const router = useRouter();
const fightId = route.params.fightId as string;

const offers = ref<Offer[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const updating = ref(false);
const fighterDetails = ref<Record<string, Fighter | null>>({});
const ploDetails = ref<Record<string, PloProfile | null>>({});
const expandedPloOfferId = ref<string | null>(null);

function handleBack() {
  router.push(ROUTES.FIGHTER_FIGHTS);
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
}

function formatField(value: string | null | undefined): string {
  if (!value) return 'Not set';
  const trimmed = value.trim();
  return trimmed || 'Not set';
}

function formatFighterName(fighter: Fighter | null | undefined): string {
  if (!fighter) return 'Not set';
  const first = fighter.firstName?.trim() || '';
  const last = fighter.lastName?.trim() || '';
  const combined = `${first} ${last}`.trim();
  if (combined) return combined;
  if (fighter.nickname && fighter.nickname.trim()) return fighter.nickname.trim();
  return 'Not set';
}

function formatOwnerName(plo: PloProfile | null | undefined): string {
  if (!plo) return 'Not set';
  const first = plo.ownerFirstName?.trim() || '';
  const last = plo.ownerLastName?.trim() || '';
  const combined = `${first} ${last}`.trim();
  if (combined) return combined;
  return 'Not set';
}

function formatLocation(city: string | null | undefined, country: string | null | undefined): string {
  const c = city?.trim() || '';
  const co = country?.trim() || '';
  if (!c && !co) return 'Not set';
  if (c && co) return `${c}, ${co}`;
  return c || co;
}

async function loadOffers() {
  loading.value = true;
  error.value = null;
  try {
    offers.value = await offerService.getAvailableOffersForFight(fightId);
    await preloadFighters();
    await preloadPlos();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load offers');
  } finally {
    loading.value = false;
  }
}

async function preloadFighters() {
  const ids = Array.from(
    new Set(
      offers.value
        .flatMap(o => [o.fighterAId, o.fighterBId])
        .filter((id): id is string => !!id),
    ),
  );

  await Promise.all(
    ids.map(async (id) => {
      if (fighterDetails.value[id] !== undefined) return;
      try {
        fighterDetails.value[id] = await fighterService.getPublicById(id);
      } catch {
        fighterDetails.value[id] = null;
      }
    }),
  );
}

async function preloadPlos() {
  const ids = Array.from(
    new Set(offers.value.map(o => o.ploId).filter((id): id is string => !!id)),
  );

  await Promise.all(
    ids.map(async (id) => {
      if (ploDetails.value[id] !== undefined) return;
      try {
        ploDetails.value[id] = await ploService.getPublicById(id);
      } catch {
        ploDetails.value[id] = null;
      }
    }),
  );
}

async function handleAcceptOffer(offerId: string) {
  updating.value = true;
  error.value = null;
  try {
    await offerService.updateOfferStatus({ offerId, status: 'accepted' });
    await loadOffers();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'accept the offer');
  } finally {
    updating.value = false;
  }
}

async function handleRejectOffer(offerId: string) {
  updating.value = true;
  error.value = null;
  try {
    await offerService.updateOfferStatus({ offerId, status: 'rejected' });
    await loadOffers();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'reject the offer');
  } finally {
    updating.value = false;
  }
}

function handleViewPloDetails(offer: Offer) {
  if (!offer.ploId) return;
  expandedPloOfferId.value = expandedPloOfferId.value === offer.id ? null : offer.id;
}

function getFighterDetails(id: string | undefined): Fighter | null | undefined {
  if (!id) return null;
  return fighterDetails.value[id];
}

onMounted(() => {
  loadOffers();
});
</script>

<style scoped>
.offers-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.offers-title {
  color: white;
  font-size: 28px;
  margin: 0;
}

.status-message {
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
}

.back-btn {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn:hover {
  background-color: #5a6268;
}

.offers-list {
  list-style: none;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.offer-item {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  max-width: 100%;
  box-sizing: border-box;
}

.offer-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.offer-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.plo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.plo-details-btn {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  cursor: pointer;
}

.plo-details-btn:hover {
  background-color: #f3f4f6;
}

.plo-extra {
  margin-top: 6px;
  font-size: 13px;
}

.fighters-extra {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px 20px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
}

.fighter-extra {
  font-size: 13px;
}

.fighter-extra strong {
  display: block;
  margin-bottom: 4px;
}

.offer-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
}

.accept-btn,
.reject-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.accept-btn {
  background-color: #28a745;
  color: white;
}

.accept-btn:hover:not(:disabled) {
  background-color: #218838;
}

.reject-btn {
  background-color: #dc3545;
  color: white;
}

.reject-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.accept-btn:disabled,
.reject-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

