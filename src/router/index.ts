import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/utils/constants';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: () => import('@/views/LandingPageView.vue'),
      meta: { requiresAuth: false },
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
      path: ROUTES.VERIFY_EMAIL,
      name: 'VerifyEmail',
      component: () => import('@/views/auth/VerifyEmailView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: ROUTES.FORGOT_PASSWORD,
      name: 'ForgotPassword',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: ROUTES.RESET_PASSWORD,
      name: 'ResetPassword',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: ROUTES.ADMIN_DASHBOARD,
      component: () => import('@/views/admin/AdminDashboardView.vue'),
      meta: { requiresAuth: true, requiredRole: 'admin' },
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: () => import('@/views/admin/AdminHomeView.vue'),
        },
        {
          path: 'pending-verifications',
          name: 'AdminPendingVerifications',
          component: () => import('@/views/admin/PendingVerificationsView.vue'),
        },
        {
          path: 'pending-verifications/:fighterId',
          name: 'AdminFighterVerificationDetails',
          component: () => import('@/views/admin/PendingVerificationDetailsView.vue'),
        },
        {
          path: 'promotion-leagues',
          name: 'AdminPromotionLeagues',
          component: () => import('@/views/admin/PromotionLeaguesView.vue'),
        },
        {
          path: 'weight-classes',
          name: 'AdminWeightClasses',
          component: () => import('@/views/admin/WeightClassesView.vue'),
        },
      ],
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
        {
          path: 'fights/:fightId/details',
          name: 'FighterFightDetails',
          component: () => import('@/views/fighter/FightDetailsView.vue'),
        },
        {
          path: 'rankings',
          name: 'FighterRankings',
          component: () => import('@/views/fighter/RankingsView.vue'),
        },
        {
          path: 'injuries',
          name: 'FighterInjuries',
          component: () => import('@/views/fighter/InjuriesView.vue'),
        },
        {
          path: 'medical-clearances',
          name: 'FighterMedicalClearances',
          component: () => import('@/views/fighter/MedicalClearancesView.vue'),
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
        {
          path: 'profile',
          name: 'PLOProfile',
          component: () => import('@/views/plo/ProfileView.vue'),
        },
        {
          path: 'event-categories',
          name: 'PLOEventCategories',
          component: () => import('@/views/plo/EventCategoriesView.vue'),
        },
        {
          path: 'event-sponsors',
          name: 'PLOEventSponsors',
          component: () => import('@/views/plo/EventSponsorsView.vue'),
        },
      ],
    },
    {
      path: ROUTES.SPECTATOR_HOME,
      component: () => import('@/views/spectator/SpectatorDashboardView.vue'),
      meta: { requiresAuth: true, requiredRole: 'spectator' },
      children: [
        {
          path: '',
          redirect: 'events',
        },
        {
          path: 'events',
          name: 'SpectatorEvents',
          component: () => import('@/views/spectator/SpectatorEventsView.vue'),
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
