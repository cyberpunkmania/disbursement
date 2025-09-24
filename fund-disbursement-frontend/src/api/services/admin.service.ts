import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  Position,
  CreatePositionRequest,
  UpdatePositionRequest,
  Worker,
  CreateWorkerRequest,
  UpdateWorkerRequest,
  PayPeriod,
  CreatePayPeriodRequest,
  CreateSingleDisbursementRequest,
  DisbursementResponse,
  MPesaInitiateRequest,
  StatusResponse,
  BatchResponse,
} from '../../types/admin.types';
import type { ApiResponse } from '../../types/api.types';
import { z } from 'zod';

// Input validation schemas
const uuidSchema = z.string().uuid();
const positiveNumberSchema = z.number().positive();
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);
const emailSchema = z.string().email();

class AdminService {
  // Utility method for input sanitization
  private sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  // Utility method for UUID validation
  private validateUuid(uuid: string): void {
    const result = uuidSchema.safeParse(uuid);
    if (!result.success) {
      throw new Error('Invalid UUID format');
    }
  }

  // ============== POSITION MANAGEMENT ==============
  
  async getPositions(activeOnly?: boolean): Promise<ApiResponse<Position[]>> {
    try {
      // Backend provides all positions at /admin/positions; filter on client
      const response = await apiClient.get<Position[]>(
        API_ENDPOINTS.ADMIN.POSITIONS
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch positions:', error);
      throw error;
    }
  }

  async getPositionByUuid(uuid: string): Promise<ApiResponse<Position>> {
    this.validateUuid(uuid);
    
    try {
      const response = await apiClient.get<Position>(
        API_ENDPOINTS.ADMIN.POSITION_BY_UUID(uuid)
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch position ${uuid}:`, error);
      throw error;
    }
  }

  async createPosition(data: CreatePositionRequest): Promise<ApiResponse<Position>> {
    // Input validation and sanitization
    const sanitizedData = {
      ...data,
      name: this.sanitizeString(data.name),
      description: data.description ? this.sanitizeString(data.description) : undefined,
      multiplier: data.multiplier !== undefined ? data.multiplier : undefined,
    };

    // Validate multiplier (allow 0 or 1)
    if (sanitizedData.multiplier !== undefined) {
      const multResult = positiveNumberSchema.safeParse(sanitizedData.multiplier);
      if (!multResult.success || (sanitizedData.multiplier !== 0 && sanitizedData.multiplier !== 1)) {
        throw new Error('Multiplier must be 0 or 1');
      }
    }

    try {
      const response = await apiClient.post<Position>(
        API_ENDPOINTS.ADMIN.POSITIONS,
        sanitizedData
      );
      return response;
    } catch (error) {
      console.error('Failed to create position:', error);
      throw error;
    }
  }

  async updatePosition(uuid: string, data: UpdatePositionRequest): Promise<ApiResponse<Position>> {
    this.validateUuid(uuid);
    // Input validation and sanitization
    const sanitizedData = {
      ...data,
      name: data.name ? this.sanitizeString(data.name) : undefined,
      description: data.description ? this.sanitizeString(data.description) : undefined,
      multiplier: data.multiplier !== undefined ? data.multiplier : undefined,
    };

    // Validate multiplier if provided
    if (sanitizedData.multiplier !== undefined) {
      const multResult = positiveNumberSchema.safeParse(sanitizedData.multiplier);
      if (!multResult.success || (sanitizedData.multiplier !== 0 && sanitizedData.multiplier !== 1)) {
        throw new Error('Multiplier must be 0 or 1');
      }
    }

    try {
      const response = await apiClient.patch<Position>(
        API_ENDPOINTS.ADMIN.POSITION_BY_UUID(uuid),
        sanitizedData
      );
      return response;
    } catch (error) {
      console.error(`Failed to update position ${uuid}:`, error);
      throw error;
    }
  }

  async deletePosition(uuid: string): Promise<ApiResponse<void>> {
    this.validateUuid(uuid);
    try {
      const response = await apiClient.delete<void>(
        API_ENDPOINTS.ADMIN.POSITION_BY_UUID(uuid)
      );
      return response;
    } catch (error) {
      console.error(`Failed to delete position ${uuid}:`, error);
      throw error;
    }
  }

  // ============== WORKER MANAGEMENT ==============
  
  async getWorkers(): Promise<ApiResponse<Worker[]>> {
    try {
      const response = await apiClient.get<Worker[]>(
        API_ENDPOINTS.ADMIN.WORKERS
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch workers:', error);
      throw error;
    }
  }

  async getWorkerByUuid(uuid: string): Promise<ApiResponse<Worker>> {
    this.validateUuid(uuid);
    try {
      const response = await apiClient.get<Worker>(
        API_ENDPOINTS.ADMIN.WORKER_BY_UUID(uuid)
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch worker ${uuid}:`, error);
      throw error;
    }
  }

  async createWorker(data: CreateWorkerRequest): Promise<ApiResponse<Worker>> {
    // Input validation and sanitization
    const sanitizedData = {
      ...data,
      fullName: this.sanitizeString(data.fullName),
      email: this.sanitizeString(data.email),
      phone: this.sanitizeString(data.phone),
    };

    // Validate email
    const emailResult = emailSchema.safeParse(sanitizedData.email);
    if (!emailResult.success) {
      throw new Error('Invalid email format');
    }

    // Validate phone number
    const phoneResult = phoneSchema.safeParse(sanitizedData.phone);
    if (!phoneResult.success) {
      throw new Error('Invalid phone number format');
    }

    // Validate rate
    const rateResult = positiveNumberSchema.safeParse(sanitizedData.rate);
    if (!rateResult.success) {
      throw new Error('Rate must be a positive number');
    }

    try {
      const response = await apiClient.post<Worker>(
        API_ENDPOINTS.ADMIN.WORKERS,
        sanitizedData
      );
      return response;
    } catch (error) {
      console.error('Failed to create worker:', error);
      throw error;
    }
  }

  async updateWorker(uuid: string, data: UpdateWorkerRequest): Promise<ApiResponse<Worker>> {
    this.validateUuid(uuid);
    // Input validation and sanitization
    const sanitizedData = {
      ...data,
      fullName: data.fullName ? this.sanitizeString(data.fullName) : undefined,
      email: data.email ? this.sanitizeString(data.email) : undefined,
      phone: data.phone ? this.sanitizeString(data.phone) : undefined,
    };

    // Validate email if provided
    if (sanitizedData.email) {
      const emailResult = emailSchema.safeParse(sanitizedData.email);
      if (!emailResult.success) {
        throw new Error('Invalid email format');
      }
    }

    // Validate phone number if provided
    if (sanitizedData.phone) {
      const phoneResult = phoneSchema.safeParse(sanitizedData.phone);
      if (!phoneResult.success) {
        throw new Error('Invalid phone number format');
      }
    }

    // Validate rate if provided
    if (sanitizedData.rate !== undefined) {
      const rateResult = positiveNumberSchema.safeParse(sanitizedData.rate);
      if (!rateResult.success) {
        throw new Error('Rate must be a positive number');
      }
    }

    try {
      const response = await apiClient.patch<Worker>(
        API_ENDPOINTS.ADMIN.WORKER_BY_UUID(uuid),
        sanitizedData
      );
      return response;
    } catch (error) {
      console.error(`Failed to update worker ${uuid}:`, error);
      throw error;
    }
  }

  async deleteWorker(uuid: string): Promise<ApiResponse<void>> {
    this.validateUuid(uuid);
    
    try {
      const response = await apiClient.delete<void>(
        API_ENDPOINTS.ADMIN.WORKER_BY_UUID(uuid)
      );
      return response;
    } catch (error) {
      console.error(`Failed to delete worker ${uuid}:`, error);
      throw error;
    }
  }

  async toggleWorkerPayableStatus(uuid: string, payable: boolean): Promise<ApiResponse<Worker>> {
    this.validateUuid(uuid);
    
    try {
      const url = `${API_ENDPOINTS.ADMIN.WORKER_TOGGLE_PAYABLE(uuid)}?payable=${encodeURIComponent(String(payable))}`;
      const response = await apiClient.patch<Worker>(url);
      return response;
    } catch (error) {
      console.error(`Failed to toggle payable status for worker ${uuid}:`, error);
      throw error;
    }
  }

  // ============== PAYROLL MANAGEMENT ==============
  
  async getPayPeriods(): Promise<ApiResponse<PayPeriod[]>> {
    try {
      const response = await apiClient.get<PayPeriod[]>(
        API_ENDPOINTS.PAYROLL.PERIODS
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch pay periods:', error);
      throw error;
    }
  }

  async getPayPeriodByUuid(uuid: string): Promise<ApiResponse<PayPeriod>> {
    this.validateUuid(uuid);
    try {
      const response = await apiClient.get<PayPeriod>(
        API_ENDPOINTS.PAYROLL.PERIOD_BY_UUID(uuid)
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch pay period ${uuid}:`, error);
      throw error;
    }
  }

  async createPayPeriod(data: CreatePayPeriodRequest): Promise<ApiResponse<PayPeriod>> {
    // Input validation and sanitization
    const sanitizedData = {
      ...data,
      label: data.label ? this.sanitizeString(data.label) : undefined,
    };

    // Validate dates
    const startDate = new Date(sanitizedData.startDate);
    const endDate = new Date(sanitizedData.endDate);
    
    if (startDate >= endDate) {
      throw new Error('Start date must be before end date');
    }

    try {
      const response = await apiClient.post<PayPeriod>(
        API_ENDPOINTS.PAYROLL.PERIODS,
        sanitizedData
      );
      return response;
    } catch (error) {
      console.error('Failed to create pay period:', error);
      throw error;
    }
  }

  // ============== DISBURSEMENT MANAGEMENT ==============
  
  async createSingleDisbursement(data: CreateSingleDisbursementRequest): Promise<ApiResponse<DisbursementResponse>> {
    this.validateUuid(data.workerUuid);
    
    // Validate amount
    const amountResult = positiveNumberSchema.safeParse(data.amount);
    if (!amountResult.success) {
      throw new Error('Amount must be a positive number');
    }

    try {
      const response = await apiClient.post<DisbursementResponse>(
        API_ENDPOINTS.DISBURSEMENTS.SINGLE,
        data
      );
      return response;
    } catch (error) {
      console.error('Failed to create single disbursement:', error);
      throw error;
    }
  }

  async createBatchDisbursement(workerUuids: string[]): Promise<ApiResponse<BatchResponse>> {
    // Validate all UUIDs
    workerUuids.forEach(uuid => this.validateUuid(uuid));

    try {
      const response = await apiClient.post<BatchResponse>(
        API_ENDPOINTS.DISBURSEMENTS.BATCH,
        { workerUuids }
      );
      return response;
    } catch (error) {
      console.error('Failed to create batch disbursement:', error);
      throw error;
    }
  }

  async disburseBatch(batchUuid: string): Promise<ApiResponse<StatusResponse>> {
    this.validateUuid(batchUuid);

    try {
      const response = await apiClient.post<StatusResponse>(
        API_ENDPOINTS.DISBURSEMENTS.BATCH_DISBURSE(batchUuid)
      );
      return response;
    } catch (error) {
      console.error(`Failed to disburse batch ${batchUuid}:`, error);
      throw error;
    }
  }

  // ============== M-PESA MANAGEMENT ==============
  
  async initiateMPesaPayment(data: MPesaInitiateRequest): Promise<ApiResponse<StatusResponse>> {
    // Input validation and sanitization
    const sanitizedData = {
      ...data,
      app: this.sanitizeString(data.app),
      phoneNumber: this.sanitizeString(data.phoneNumber),
      remarks: data.remarks ? this.sanitizeString(data.remarks) : undefined,
    };

    // Validate phone number
    const phoneResult = phoneSchema.safeParse(sanitizedData.phoneNumber);
    if (!phoneResult.success) {
      throw new Error('Invalid phone number format');
    }

    // Validate amount
    const amountResult = positiveNumberSchema.safeParse(sanitizedData.amount);
    if (!amountResult.success) {
      throw new Error('Amount must be a positive number');
    }

    try {
      const response = await apiClient.post<StatusResponse>(
        API_ENDPOINTS.MPESA.INITIATE,
        sanitizedData
      );
      return response;
    } catch (error) {
      console.error('Failed to initiate M-Pesa payment:', error);
      throw error;
    }
  }

  // ============== ADDITIONAL PAY PERIOD OPERATIONS ==============
  
  async updatePayPeriod(uuid: string, data: Partial<CreatePayPeriodRequest>): Promise<ApiResponse<PayPeriod>> {
    this.validateUuid(uuid);
    
    // Input validation and sanitization
    const sanitizedData = {
      ...data,
      label: data.label ? this.sanitizeString(data.label) : undefined,
    };

    // Validate dates if provided
    if (sanitizedData.startDate && sanitizedData.endDate) {
      const startDate = new Date(sanitizedData.startDate);
      const endDate = new Date(sanitizedData.endDate);
      
      if (startDate >= endDate) {
        throw new Error('Start date must be before end date');
      }
    }

    try {
      const response = await apiClient.put<PayPeriod>(
        API_ENDPOINTS.PAYROLL.PERIOD_BY_UUID(uuid),
        sanitizedData
      );
      return response;
    } catch (error) {
      console.error(`Failed to update pay period ${uuid}:`, error);
      throw error;
    }
  }

  async deletePayPeriod(uuid: string): Promise<ApiResponse<void>> {
    this.validateUuid(uuid);
    
    try {
      const response = await apiClient.delete<void>(
        API_ENDPOINTS.PAYROLL.PERIOD_BY_UUID(uuid)
      );
      return response;
    } catch (error) {
      console.error(`Failed to delete pay period ${uuid}:`, error);
      throw error;
    }
  }

  async approvePayPeriod(uuid: string): Promise<ApiResponse<PayPeriod>> {
    this.validateUuid(uuid);
    
    try {
      const response = await apiClient.post<PayPeriod>(
        API_ENDPOINTS.PAYROLL.PERIOD_APPROVE(uuid)
      );
      return response;
    } catch (error) {
      console.error(`Failed to approve pay period ${uuid}:`, error);
      throw error;
    }
  }

  async lockPayPeriod(uuid: string): Promise<ApiResponse<PayPeriod>> {
    this.validateUuid(uuid);
    
    try {
      const response = await apiClient.patch<PayPeriod>(
        API_ENDPOINTS.PAYROLL.PERIOD_LOCK(uuid)
      );
      return response;
    } catch (error) {
      console.error(`Failed to lock pay period ${uuid}:`, error);
      throw error;
    }
  }

  async generatePayItems(periodUuid: string): Promise<ApiResponse<StatusResponse>> {
    this.validateUuid(periodUuid);
    try {
      const response = await apiClient.post<StatusResponse>(
        API_ENDPOINTS.PAYROLL.GENERATE_PAY_ITEMS(periodUuid)
      );
      return response;
    } catch (error) {
      console.error(`Failed to generate pay items for period ${periodUuid}:`, error);
      throw error;
    }
  }

  async createBatchFromPeriod(periodUuid: string): Promise<ApiResponse<BatchResponse>> {
    this.validateUuid(periodUuid);
    try {
      const response = await apiClient.post<BatchResponse>(
        API_ENDPOINTS.DISBURSEMENTS.FROM_PERIOD(periodUuid)
      );
      return response;
    } catch (error) {
      console.error(`Failed to create batch from period ${periodUuid}:`, error);
      throw error;
    }
  }

  async sendBatch(batchUuid: string): Promise<ApiResponse<StatusResponse>> {
    this.validateUuid(batchUuid);
    try {
      const response = await apiClient.post<StatusResponse>(
        API_ENDPOINTS.DISBURSEMENTS.SEND_BATCH(batchUuid)
      );
      return response;
    } catch (error) {
      console.error(`Failed to send batch ${batchUuid}:`, error);
      throw error;
    }
  }
}

export const adminService = new AdminService();