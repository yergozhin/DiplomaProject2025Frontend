import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/utils/constants';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: () => {
        const authStore = useAuthStore();
        if (authStore.isAuthenticated) {
          return authStore.getDashboardRoute();
        }
        return ROUTES.LOGIN;
      },
    },
    {
      path: ROUTES.LOGIN,
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: ROUTES.REGISTER,
      name: 'Register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/fighter',
      meta: { requiresAuth: true, requiredRole: 'fighter' },
      children: [
        {
          path: 'dashboard',
          name: 'FighterDashboard',
          component: () => import('@/views/fighter/FighterDashboardView.vue'),
        },
      ],
    },
    {
      path: '/plo',
      meta: { requiresAuth: true, requiredRole: 'plo' },
      children: [
        {
          path: 'dashboard',
          name: 'PLODashboard',
          component: () => import('@/views/plo/PLODashboardView.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiredRole = to.meta.requiredRole as string | undefined;

  if (requiresAuth) {
    if (!authStore.isAuthenticated) {
      next({ path: ROUTES.LOGIN, query: { redirect: to.fullPath } });
      return;
    }

    if (requiredRole && authStore.userRole !== requiredRole) {
      next({ path: authStore.getDashboardRoute() });
      return;
    }
  } else {
    if (authStore.isAuthenticated && (to.path === ROUTES.LOGIN || to.path === ROUTES.REGISTER)) {
      next({ path: authStore.getDashboardRoute() });
      return;
    }
  }

  next();
});

export default router;
