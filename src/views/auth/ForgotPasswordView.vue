<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Forgot Password</h1>
      <form @submit.prevent="handleRequestReset" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="forgotForm.email"
            type="email"
            required
            placeholder="Enter your email"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="role">Role</label>
          <select
            id="role"
            v-model="forgotForm.role"
            required
            :disabled="loading"
          >
            <option value="">Select a role</option>
            <option value="fighter">Fighter</option>
            <option value="plo">Promotion League Owner</option>
            <option value="spectator">Spectator</option>
          </select>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          Password reset email sent! Please check your inbox.
        </div>

        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>
          Remember your password?
          <router-link to="/login">Login here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/auth.service';
import type { UserRole } from '@/types';

const router = useRouter();

const forgotForm = ref({
  email: '',
  role: '' as UserRole | '',
});

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

async function handleRequestReset() {
  if (!forgotForm.value.role) {
    return;
  }

  loading.value = true;
  error.value = null;
  success.value = false;

  try {
    await authService.requestPasswordReset({
      email: forgotForm.value.email,
      role: forgotForm.value.role as UserRole,
    });
    success.value = true;
  } catch (err: any) {
    error.value = err.error || 'Failed to send reset email';
  } finally {
    loading.value = false;
  }
}
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
}

.auth-card h1 {
  margin-top: 0;
  margin-bottom: 30px;
  text-align: center;
  font-size: 24px;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.submit-button {
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.submit-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 15px;
}

.success-message {
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
  margin-bottom: 15px;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;
}

.auth-footer p {
  margin: 10px 0;
}

.auth-footer a {
  color: #007bff;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>

