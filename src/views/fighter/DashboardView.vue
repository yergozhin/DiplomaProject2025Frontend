<template>
  <div>
    <h1>Welcome, {{ user?.email }}!</h1>
    <p>This is your fighter dashboard where you can manage your fighting career. As a fighter, you have full control over your fight opportunities and career progression.</p>
    <p>You can search for possible opponents based on your weight class and send fight requests to other fighters. When you receive fight requests from other fighters, you can review and accept or reject them. Once a fight is accepted by both parties, it becomes available for promotion leagues to make offers.</p>
    <p>You can browse and respond to promotion league offers for your accepted fights. Both fighters can accept offers, and when you both choose the same offer, the fight gets scheduled. You can also view all your scheduled fights and track your upcoming events.</p>
    <p>Additionally, you can view and update your fighter profile including your personal information, weight class, and physical attributes. You can submit verification evidence for your fight records, and once verified by an admin, your official record will be updated. Manage your complete fighter profile and build your fighting career from this dashboard.</p>
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
