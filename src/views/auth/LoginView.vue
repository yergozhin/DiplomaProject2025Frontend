<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="loginForm.email"
            type="email"
            required
            placeholder="Enter your email"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            required
            placeholder="Enter your password"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="role">Role</label>
          <select
            id="role"
            v-model="loginForm.role"
            required
            :disabled="loading"
          >
            <option value="">Select a role</option>
            <option value="fighter">Fighter</option>
            <option value="plo">Promotion League Owner</option>
            <option value="spectator">Spectator</option>
          </select>
        </div>

        <div v-if="error && !showResendVerification" class="error-message">
          {{ error }}
        </div>

        <div v-if="showResendVerification" class="verification-message">
          <p>Your email has not been verified yet. Please check your inbox for the verification link.</p>
          <button
            type="button"
            @click="handleResendVerification"
            :disabled="resending || loading"
            class="resend-button"
          >
            {{ resending ? 'Sending...' : 'Resend Verification Email' }}
          </button>
          <p v-if="resendSuccess" class="success-message">
            Verification email sent! Please check your inbox.
          </p>
        </div>

        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>
          Don't have an account?
          <router-link to="/register">Register here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import type { UserRole } from '@/types';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loginForm = ref({
  email: '',
  password: '',
  role: '' as UserRole | '',
});

const resending = ref(false);
const resendSuccess = ref(false);

const loading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

const showResendVerification = computed(() => {
  return error.value === 'email_not_verified';
});

async function handleLogin() {
  if (!loginForm.value.role) {
    return;
  }

  resendSuccess.value = false;

  try {
    await authStore.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
      role: loginForm.value.role as UserRole,
    });

    const redirectPath = (route.query.redirect as string) || authStore.getDashboardRoute();
    router.push(redirectPath);
  } catch (err: any) {
    console.error('Login failed:', err);
  }
}

async function handleResendVerification() {
  if (!loginForm.value.email || !loginForm.value.role) {
    return;
  }

  resending.value = true;
  resendSuccess.value = false;

  try {
    await authStore.resendVerificationEmail(
      loginForm.value.email,
      loginForm.value.role as UserRole,
    );
    resendSuccess.value = true;
    setTimeout(() => {
      resendSuccess.value = false;
    }, 5000);
  } catch (err) {
    // Error handled by auth store
  } finally {
    resending.value = false;
  }
}
</script>

<style scoped>
.verification-message {
  padding: 15px;
  margin: 15px 0;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  color: #856404;
}

.verification-message p {
  margin: 0 0 10px 0;
}

.resend-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

.resend-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.resend-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  margin-top: 10px;
  color: #155724;
  font-weight: 500;
}
</style>
