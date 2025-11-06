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
      component: () => import('@/views/fighter/FighterDashboardView.vue'),
      meta: { requiresAuth: true, requiredRole: 'fighter' },
      children: [
        {
          path: '',
          redirect: 'dashboard',
        },
        {
          path: 'dashboard',
          name: 'FighterDashboard',
          component: () => import('@/views/fighter/DashboardView.vue'),
        },
        {
          path: 'profile',
          name: 'FighterProfile',
          component: () => import('@/views/fighter/ProfileView.vue'),
        },
        {
          path: 'opponents',
          name: 'FighterOpponents',
          component: () => import('@/views/fighter/PossibleOpponentsView.vue'),
        },
        {
          path: 'requests',
          name: 'FighterRequests',
          component: () => import('@/views/fighter/RequestedFightsView.vue'),
        },
        {
          path: 'fights',
          name: 'FighterFights',
          component: () => import('@/views/fighter/MyFightsView.vue'),
        },
        {
          path: 'scheduled-fights',
          name: 'FighterScheduledFights',
          component: () => import('@/views/fighter/ScheduledFightsView.vue'),
        },
        {
          path: 'fights/:fightId/offers',
          name: 'FighterFightOffers',
          component: () => import('@/views/fighter/FightOffersView.vue'),
        },
      ],
    },
    {
      path: '/plo',
      component: () => import('@/views/plo/PLODashboardView.vue'),
      meta: { requiresAuth: true, requiredRole: 'plo' },
      children: [
        {
          path: '',
          redirect: 'dashboard',
        },
        {
          path: 'dashboard',
          name: 'PLODashboard',
          component: () => import('@/views/plo/DashboardView.vue'),
        },
        {
          path: 'events',
          name: 'PLOEvents',
          component: () => import('@/views/plo/EventsView.vue'),
        },
        {
          path: 'available-fights',
          name: 'PLOAvailableFights',
          component: () => import('@/views/plo/AvailableFightsView.vue'),
        },
        {
          path: 'offers',
          name: 'PLOOffers',
          component: () => import('@/views/plo/OffersView.vue'),
        },
        {
          path: 'send-offer',
          name: 'PLOSendOffer',
          component: () => import('@/views/plo/SendOfferView.vue'),
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
