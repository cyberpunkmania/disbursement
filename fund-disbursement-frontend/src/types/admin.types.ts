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
}

export interface CreatePositionRequest {
  name: string;
  description?: string;
  active?: boolean;
}

export interface UpdatePositionRequest {
  name?: string;
  description?: string;
  active?: boolean;
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