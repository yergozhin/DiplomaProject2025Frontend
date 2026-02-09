<template>
  <div class="auth-container">
    <header class="auth-header">
      <router-link to="/" class="nav-brand">
        <img src="@/assets/logo.jpg" alt="GladiatorGrid" class="logo-img" />
        <span class="brand-text">GladiatorGrid</span>
      </router-link>
      <router-link to="/" class="back-link">Back to landing page</router-link>
    </header>
    <div class="auth-card">
      <h1>Verifying Email</h1>
      <div v-if="loading" class="verifying-message">
        <p>Please wait, verifying your email address...</p>
      </div>
      <div v-else-if="success" class="success-message">
        <p>Your email has been verified successfully! You can now log in to access your account.</p>
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
import { getErrorMessage } from '@/utils/errorMessages';

const route = useRoute();

const loading = ref(true);
const success = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  const token = route.query.token as string;
  
  if (!token) {
    error.value = 'This verification link is missing the required token. Please check your email and use the link we sent you.';
    loading.value = false;
    return;
  }

  try {
    await authService.verifyEmail(token);
    success.value = true;
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'verify your email');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  overflow: hidden;
}

.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0.75rem 0;
  flex-shrink: 0;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-img {
  height: 35px;
  width: auto;
  object-fit: contain;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.back-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #666;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.back-link:hover {
  background-color: #555;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  margin: auto;
  background-image: url('@/assets/landing.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  text-align: center;
}

.auth-card h1 {
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.verifying-message {
  padding: 1rem;
  color: white;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.verifying-message p {
  margin: 0;
}

.success-message {
  padding: 1rem;
  background-color: rgba(40, 167, 69, 0.9);
  color: white;
  border-radius: 4px;
}

.success-message p {
  margin: 0 0 1rem 0;
}

.error-message {
  padding: 1rem;
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  border-radius: 4px;
}

.error-message p {
  margin: 0 0 1rem 0;
}

.login-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.login-link:hover {
  background-color: #555;
}
</style>

