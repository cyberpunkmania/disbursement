import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api.types';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://fund-disbursement-production.up.railway.app/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout for production
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request details for debugging
        console.log('API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`,
          headers: {
            'Content-Type': config.headers['Content-Type'],
            'Accept': config.headers['Accept'],
            'Authorization': config.headers.Authorization ? 'Bearer [TOKEN_PRESENT]' : 'No Authorization',
          },
          params: config.params,
          data: config.data,
        });
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
        console.error('API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });

        if (error.response?.status === 401 || error.response?.status === 403) {
          // Handle token refresh or redirect to login
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
          sessionStorage.removeItem('user');
          window.location.href = '/login';
        }
        
        // Format error message with more details for debugging
        const status = error.response?.status;
        const statusText = error.response?.statusText;
        const message = error.response?.data?.message || error.message || 'An error occurred';
        
        throw new Error(`${status ? `${status} ${statusText}: ` : ''}${message}`);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data;
  }
}

export default new ApiClient();