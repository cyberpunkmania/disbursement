import apiClient from '../client';
import type { LoginRequest, OtpVerificationRequest, AuthResponse } from '@/types/auth.types';
import { API_ENDPOINTS } from '../endpoints';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<{ success: boolean; message?: string }> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // Store username for OTP verification step
    sessionStorage.setItem('verifyUsername', credentials.username);
    
    // Return success status - actual tokens come after OTP verification
    return { success: response.success || true };
  }

  static async verifyOtp(otpData: OtpVerificationRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      otpData
    );
    
    // The API returns the auth response directly, not wrapped in ApiResponse structure
    const authData = response.data || response as any;
    
    // Store tokens in localStorage after successful OTP verification
    if (authData?.accessToken) {
      localStorage.setItem('accessToken', authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
    
    // Clear temporary session data
    sessionStorage.removeItem('verifyUsername');
    
    return authData;
  }

  static async logout(): Promise<void> {
    // Clear stored tokens and user data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('verifyUsername');
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  static getVerifyUsername(): string | null {
    return sessionStorage.getItem('verifyUsername');
  }
}