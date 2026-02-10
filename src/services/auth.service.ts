import { apiClient } from './api';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
} from '@/types';

export interface ResendVerificationEmailRequest {
  email: string;
  role: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/auth/register', data);
  },

  login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', data);
  },

  verifyEmail(token: string): Promise<{ message: string }> {
    return apiClient.get<{ message: string }>(`/auth/verify-email?token=${token}`);
  },

  resendVerificationEmail: (data: ResendVerificationEmailRequest): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/resend-verification-email', data);
  },

  requestPasswordReset(data: RequestPasswordResetRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/request-password-reset', data);
  },

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/reset-password', data);
  },
};
