export const API_BASE_URL = 'http://localhost:3000/api';

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FIGHTER_DASHBOARD: '/fighter/dashboard',
  FIGHTER_PROFILE: '/fighter/profile',
  FIGHTER_OPPONENTS: '/fighter/opponents',
  FIGHTER_REQUESTS: '/fighter/requests',
  FIGHTER_FIGHTS: '/fighter/fights',
  FIGHTER_SCHEDULED_FIGHTS: '/fighter/scheduled-fights',
  FIGHTER_FIGHT_OFFERS: '/fighter/fights/:fightId/offers',
  PLO_DASHBOARD: '/plo/dashboard',
  PLO_EVENTS: '/plo/events',
  PLO_AVAILABLE_FIGHTS: '/plo/available-fights',
  PLO_OFFERS: '/plo/offers',
} as const;
