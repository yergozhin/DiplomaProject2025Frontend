<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Register</h1>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="registerForm.email"
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
            v-model="registerForm.password"
            type="password"
            required
            placeholder="Enter your password"
            :disabled="loading"
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="role">Role</label>
          <select
            id="role"
            v-model="registerForm.role"
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

        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>
          Already have an account?
          <router-link to="/login">Login here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import type { UserRole } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const registerForm = ref({
  email: '',
  password: '',
  role: '' as UserRole | '',
});

const loading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

async function handleRegister() {
  if (!registerForm.value.role) {
    return;
  }

  try {
    await authStore.register({
      email: registerForm.value.email,
      password: registerForm.value.password,
      role: registerForm.value.role as UserRole,
    });

    router.push(authStore.getDashboardRoute());
  } catch (err) {
    console.error('Registration failed:', err);
  }
}
</script>
