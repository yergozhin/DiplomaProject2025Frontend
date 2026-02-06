import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/auth.service';
import type { User, RegisterRequest, UserRole } from '@/types';
import { STORAGE_KEYS, ROUTES } from '@/utils/constants';

interface RoleSession {
  user: User;
  token: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const availableRoles = ref<Map<UserRole, RoleSession>>(new Map());
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role || null);
  const hasMultipleRoles = computed(() => availableRoles.value.size > 1);

  function logout() {
    user.value = null;
    token.value = null;
    availableRoles.value.clear();
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AVAILABLE_ROLES);
  }


  function initAuth() {
    if (isAuthenticated.value) return;

    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const storedRoles = localStorage.getItem(STORAGE_KEYS.AVAILABLE_ROLES);

    if (storedToken && storedUser) {
      token.value = storedToken;
      try {
        user.value = JSON.parse(storedUser);
        if (storedRoles) {
          const rolesArray = JSON.parse(storedRoles) as [UserRole, RoleSession][];
          availableRoles.value = new Map(rolesArray);
        } else {
          if (user.value) {
            availableRoles.value.set(user.value.role, { user: user.value, token: storedToken });
          }
        }
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

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;

    try {
      const roles: UserRole[] = ['fighter', 'plo', 'spectator'];
      const loginPromises = roles.map(async (role) => {
        try {
          return await authService.login({ email, password, role });
        } catch (err: any) {
          if (err.error === 'email_not_verified') {
            return { error: 'email_not_verified', role };
          }
          return null;
        }
      });

      const results = await Promise.all(loginPromises);
      const successfulLogins = results.filter((r): r is { user: User; token: string } => 
        r !== null && !('error' in r)
      );

      if (successfulLogins.length === 0) {
        const hasUnverified = results.some(r => r !== null && 'error' in r && r.error === 'email_not_verified');
        if (hasUnverified) {
          error.value = 'email_not_verified';
        } else {
          error.value = 'unauthorized';
        }
        throw new Error('Login failed');
      }

      availableRoles.value.clear();
      successfulLogins.forEach(({ user, token }) => {
        availableRoles.value.set(user.role, { user, token });
      });

      const firstRole = successfulLogins[0];
      if (!firstRole) {
        error.value = 'unauthorized';
        throw new Error('Login failed');
      }
      setAuth(firstRole.user, firstRole.token);
      return { user: firstRole.user, token: firstRole.token };
    } catch (err: any) {
      if (!error.value) {
        error.value = err.error || 'Login failed';
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function switchRole(role: UserRole) {
    const roleSession = availableRoles.value.get(role);
    if (roleSession) {
      setAuth(roleSession.user, roleSession.token);
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
    if (availableRoles.value.size > 0) {
      const rolesArray = Array.from(availableRoles.value.entries());
      localStorage.setItem(STORAGE_KEYS.AVAILABLE_ROLES, JSON.stringify(rolesArray));
    }
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
    availableRoles,
    hasMultipleRoles,
    register,
    login,
    logout,
    initAuth,
    getDashboardRoute,
    resendVerificationEmail,
    switchRole,
  };
});
