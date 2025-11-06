export const API_BASE_URL = 'http://localhost:3000/api';

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FIGHTER_DASHBOARD: '/fighter/dashboard',
  PLO_DASHBOARD: '/plo/dashboard',
} as const;
