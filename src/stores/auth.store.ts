import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/auth.service';
import type { User, RegisterRequest, LoginRequest, UserRole } from '@/types';
import { STORAGE_KEYS, ROUTES } from '@/utils/constants';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role || null);

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }


  function initAuth() {
    if (isAuthenticated.value) return;

    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      token.value = storedToken;
      try {
        user.value = JSON.parse(storedUser);
      } catch {
        logout();
      }
    }
  }

  async function register(data: RegisterRequest) {
    loading.value = true;
    error.value = null;

    try {
      const res = await authService.register(data);
      return res;
    } catch (err: any) {
      error.value = err.error || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function login(data: LoginRequest) {
    loading.value = true;
    error.value = null;

    try {
      const res = await authService.login(data);
      setAuth(res.user, res.token);
      return res;
    } catch (err: any) {
      error.value = err.error || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function resendVerificationEmail(email: string, role: UserRole) {
    loading.value = true;
    error.value = null;

    try {
      const res = await authService.resendVerificationEmail({
        email,
        role,
      });
      return res;
    } catch (err: any) {
      error.value = err.error || 'Failed to resend verification email';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function setAuth(userData: User, authToken: string) {
    user.value = userData;
    token.value = authToken;
    localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  }

  function getDashboardRoute(): string {
    const role = userRole.value;
    if (!role) return ROUTES.LOGIN;
    if (role === 'fighter') return ROUTES.FIGHTER_DASHBOARD;
    if (role === 'plo') return ROUTES.PLO_DASHBOARD;
    if (role === 'spectator') return ROUTES.SPECTATOR_EVENTS;
    if (role === 'admin') return ROUTES.ADMIN_DASHBOARD;
    return ROUTES.LOGIN;
  }

  initAuth();

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    register,
    login,
    logout,
    initAuth,
    getDashboardRoute,
    resendVerificationEmail,
  };
});
