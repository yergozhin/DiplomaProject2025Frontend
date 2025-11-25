<template>
  <div class="auth-container">
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
          Password reset successfully! Redirecting to login...
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

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:disabled {
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

.auth-footer a {
  color: #007bff;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>

