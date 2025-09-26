// Security and validation types
export interface ValidationError {
  [field: string]: string;
}

export interface ApiError {
  success: false;
  responseCode: number;
  responseMessage: string;
  message: string;
  data?: ValidationError | null;
  timestamp: string;
  requestId: string;
}

// Position Types
export interface Position {
  uuid: string;
  name: string;
  active: boolean;
  description?: string;
  multiplier?: number;
  createdAt?: string;
}

export interface CreatePositionRequest {
  name: string;
  description?: string;
  active?: boolean;
  multiplier?: number;
}

export interface UpdatePositionRequest {
  name?: string;
  description?: string;
  active?: boolean;
  multiplier?: number;
}

// Worker Types
export type PayFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type WorkerStatus = 'ACTIVE' | 'INACTIVE';

export interface Worker {
  uuid: string;
  fullName: string;
  phone: string;
  email: string;
  payFrequency: PayFrequency;
  rate: number;
  status: WorkerStatus;
  payable: boolean;
  team?: string;
  nationalId?: string;
  kraPin?: string;
  positionUuid: string;
  positionName?: string;
}

export interface CreateWorkerRequest {
  fullName: string;
  phone: string;
  email: string;
  payFrequency: PayFrequency;
  rate: number;
  nationalId?: string;
  kraPin?: string;
  team?: string;
  positionUuid: string;
}

export interface UpdateWorkerRequest {
  fullName?: string;
  phone?: string;
  email?: string;
  payFrequency?: PayFrequency;
  rate?: number;
  team?: string;
  positionUuid?: string;
  payable?: boolean;
  nationalId?: string;
  kraPin?: string;
}

// Pay Period Types
export type PayPeriodFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type PayPeriodStatus = 'DRAFT' | 'APPROVED' | 'LOCKED';

export interface PayPeriod {
  id: number;
  uuid: string;
  frequency: PayPeriodFrequency;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: PayPeriodStatus;
  label?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface CreatePayPeriodRequest {
  frequency: PayPeriodFrequency;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  label?: string;
}

export interface UpdatePayPeriodRequest {
  frequency?: PayPeriodFrequency;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  label?: string;
}

// Payroll search and filter types
export interface PayrollSearchParams {
  q?: string;
  g?: string;
  status?: PayPeriodStatus;
  frequency?: PayPeriodFrequency;
  startFrom?: string; // YYYY-MM-DD
  startTo?: string; // YYYY-MM-DD
  createdFrom?: string; // ISO date-time
  createdTo?: string; // ISO date-time
  page?: number;
  size?: number;
  sort?: string;
}

export interface PayrollSearchResponse {
  content: PayPeriod[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// CSV export parameters
export interface PayrollCsvParams {
  q?: string;
  status?: PayPeriodStatus;
  frequency?: PayPeriodFrequency;
  startFrom?: string; // YYYY-MM-DD
  startTo?: string; // YYYY-MM-DD
  endFrom?: string; // YYYY-MM-DD
  endTo?: string; // YYYY-MM-DD
  createdFrom?: string; // ISO date-time
  createdTo?: string; // ISO date-time
  sort?: string;
}

// Disbursement Types
export interface DisbursementBatch {
  batchUuid: string;
}

export interface CreateSingleDisbursementRequest {
  workerUuid: string;
  amount: number;
}

export interface DisbursementResponse {
  status: string;
}

// M-Pesa Types
export interface MPesaInitiateRequest {
  app: string;
  phoneNumber: string;
  amount: number;
  remarks?: string;
}

// API Response utility types
export interface StatusResponse {
  status: string;
}

export interface BatchResponse {
  batchUuid: string;
}