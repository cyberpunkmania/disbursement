export interface LoginRequest {
  username: string; // email
  password: string;
}

export interface LoginResponse {
  success: boolean;
  responseCode: number;
  responseMessage: string;
  message: string;
  data: {
    message: string | null;
    access_token: string;
    refresh_token: string;
  };
  timestamp: string;
  requestId: string;
}

export interface User {
  id: number;
  role: 'ADMIN' | 'USER';
  sub: string; // email from JWT
  iat: number;
  exp: number;
}

// Legacy types for compatibility
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}