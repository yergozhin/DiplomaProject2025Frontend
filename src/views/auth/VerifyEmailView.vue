<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Verifying Email</h1>
      <div v-if="loading" class="verifying-message">
        <p>Please wait, verifying your email...</p>
      </div>
      <div v-else-if="success" class="success-message">
        <p>Email verified successfully!</p>
        <router-link to="/login" class="login-link">Go to Login</router-link>
      </div>
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <router-link to="/login" class="login-link">Go to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { authService } from '@/services/auth.service';

const route = useRoute();

const loading = ref(true);
const success = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  const token = route.query.token as string;
  
  if (!token) {
    error.value = 'Invalid verification link';
    loading.value = false;
    return;
  }

  try {
    await authService.verifyEmail(token);
    success.value = true;
  } catch (err: any) {
    error.value = err.error || 'Verification failed. The link may be invalid or expired.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.auth-card h1 {
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 24px;
}

.verifying-message,
.success-message,
.error-message {
  padding: 20px;
}

.success-message {
  color: #155724;
}

.error-message {
  color: #721c24;
}

.login-link {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.login-link:hover {
  background-color: #0056b3;
}
</style>

