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

export interface ResendVerificationEmailResponse {
  message: string;
}

export const authService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>('/auth/register', data);
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', data);
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiClient.get<{ message: string }>(`/auth/verify-email?token=${token}`);
  },

  async resendVerificationEmail(
    data: ResendVerificationEmailRequest,
  ): Promise<ResendVerificationEmailResponse> {
    return apiClient.post<ResendVerificationEmailResponse>(
      '/auth/resend-verification-email',
      data,
    );
  },
};
