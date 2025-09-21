export interface LoginRequest {
  username: string; // email
  password: string;
}

export interface OtpVerificationRequest {
  username: string; // email used in login
  otp: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface User {
  id: string;
  userCode: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
}