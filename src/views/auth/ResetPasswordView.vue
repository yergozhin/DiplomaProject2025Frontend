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
      <h1>Reset Password</h1>
      <form @submit.prevent="handleResetPassword" class="auth-form">
        <div class="form-group">
          <label for="password">New Password</label>
          <input
            id="password"
            v-model="resetForm.password"
            type="password"
            required
            placeholder="Enter new password"
            minlength="6"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="resetForm.confirmPassword"
            type="password"
            required
            placeholder="Confirm new password"
            minlength="6"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          <p>Password reset successfully! Redirecting to login...</p>
        </div>

        <button type="submit" :disabled="loading || success" class="submit-button">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>
          <router-link to="/login">Back to Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from '@/services/auth.service';

const route = useRoute();
const router = useRouter();

const resetForm = ref({
  password: '',
  confirmPassword: '',
});

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

onMounted(() => {
  const token = route.query.token as string;
  if (!token) {
    error.value = 'Invalid reset link';
  }
});

async function handleResetPassword() {
  const token = route.query.token as string;
  if (!token) {
    error.value = 'Invalid reset link';
    return;
  }

  if (resetForm.value.password !== resetForm.value.confirmPassword) {
    error.value = 'Passwords do not match';
    return;
  }

  if (resetForm.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    await authService.resetPassword({
      token,
      password: resetForm.value.password,
    });
    success.value = true;
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err: any) {
    error.value = err.error || 'Failed to reset password';
  } finally {
    loading.value = false;
  }
}
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
}

.auth-card h1 {
  text-align: center;
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #333;
  background-color: white;
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-button {
  padding: 0.75rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background-color: #555;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
}

.success-message {
  padding: 0.75rem;
  background-color: rgba(40, 167, 69, 0.9);
  color: white;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
}

.success-message p {
  margin: 0;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-footer p {
  margin: 0.4rem 0;
  color: white;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  font-size: 0.9rem;
}

.auth-footer a {
  color: white;
  text-decoration: underline;
  font-weight: 500;
}

.auth-footer a:hover {
  opacity: 0.8;
}
</style>

