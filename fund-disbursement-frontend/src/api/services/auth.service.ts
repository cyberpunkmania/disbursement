import apiClient from '../client';
import type { LoginRequest, LoginResponse, AuthResponse, User } from '@/types/auth.types';
import { API_ENDPOINTS } from '../endpoints';

export class AuthService {
  // Helper function to decode JWT and extract user info
  private static decodeJWT(token: string): User | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('AuthService.login called with:', credentials);
    
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      console.log('API response:', response);
      
      // The response is already the data from the API client
      const loginData = response as any as LoginResponse;
      
      console.log('Login data:', loginData);
      
      if (!loginData.success) {
        throw new Error(loginData.message || 'Login failed');
      }

      const accessToken = loginData.data.access_token;
      const refreshToken = loginData.data.refresh_token;
      
      console.log('Tokens received:', { accessToken, refreshToken });
      
      // Decode JWT to extract user information
      const userFromToken = this.decodeJWT(accessToken);
      
      console.log('Decoded user from token:', userFromToken);
      
      if (!userFromToken) {
        throw new Error('Invalid token received');
      }

      const user: User = {
        id: userFromToken.id,
        role: userFromToken.role,
        sub: userFromToken.sub,
        iat: userFromToken.iat,
        exp: userFromToken.exp,
      };

      console.log('User object created:', user);

      // Store tokens and user data in sessionStorage
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      sessionStorage.setItem('user', JSON.stringify(user));
      const authResponse = {
        accessToken,
        refreshToken,
        user,
      };
      console.log('Returning auth response:', authResponse);   
      return authResponse;
    } catch (error) {
      console.error('Login error in AuthService:', error);
      throw error;
    }
  }
  static async logout(): Promise<void> {
    // Clear stored tokens and user data from sessionStorage
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  }
  static getCurrentUser(): User | null {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  static getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    // Check if token is expired
    const user = this.getCurrentUser();
    if (!user) return false;
    const currentTime = Math.floor(Date.now() / 1000);
    return user.exp > currentTime;
  }
}





























