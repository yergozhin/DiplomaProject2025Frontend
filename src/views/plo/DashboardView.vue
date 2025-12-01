<template>
  <div>
    <h1>Welcome, {{ user?.email }}!</h1>
    <p>This is your Promotion League Owner dashboard where you can manage your promotion league events and fight organization. As a Promotion League Owner, you can create and organize fighting events efficiently.</p>
    <p>You can create events with time slots for fights to be scheduled. Before creating events or sending offers, you must be verified by an administrator. Once verified, you can view a list of available fights that have been accepted by fighters.</p>
    <p>You can send offers to fighters for their accepted fights, specifying event slots and payment amounts. Fighters can then respond to your offers, and when both fighters accept the same offer, the fight gets scheduled for your event.</p>
    <p>You can view and manage all your created events, update event details, publish events, and delete events before their scheduled time. You can also view and update your promotion league profile including league name, owner information, contact details, and branding.</p>
    <p>Additionally, you can delete specific event fights before the event date and time. Manage your complete promotion league operations and organize professional fighting events from this dashboard.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>

<style scoped>
div {
  color: white;
  padding-left: 30px;
  padding-top: 20px;
}

h1 {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

p {
  color: white;
  font-size: 16px;
  line-height: 1.6;
  max-width: 800px;
  margin-bottom: 15px;
}
</style>

