<template>
  <div class="spectator-container">
    <div class="spectator-card">
      <h1>Welcome, Spectator</h1>
      <p>You are logged in as a spectator. Future updates will unlock more features here.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.spectator-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e1e2f, #23233a);
  padding: 2rem;
}

.spectator-card {
  background: rgba(17, 17, 26, 0.85);
  border-radius: 16px;
  padding: 3rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4);
  color: #f0f4ff;
}

.spectator-card h1 {
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  color: #7f9cff;
}

.spectator-card p {
  font-size: 1rem;
  line-height: 1.6;
  color: #c2c8ff;
}
</style>

