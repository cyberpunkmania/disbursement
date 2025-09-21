export interface User {
  id: string;
  userCode: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
}

export interface Position {
  uuid: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface Worker {
  uuid: string;
  fullName: string;
  phone: string;
  email: string;
  payFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  rate: number;
  status: 'ACTIVE' | 'INACTIVE';
  payable: boolean;
  team?: string;
  nationalId?: string;
  kraPin?: string;
  positionUuid: string;
  positionName: string;
}

export interface PayPeriod {
  id: number;
  uuid: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'GENERATED' | 'APPROVED' | 'COMPLETED';
  label?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Disbursement {
  batchUuid: string;
  type?: 'SINGLE' | 'BULK';
  status?: string;
  amount?: number;
  createdAt?: string;
}

export interface WorkerFormData {
  fullName: string;
  phone: string;
  email: string;
  payFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  rate: number;
  nationalId?: string;
  kraPin?: string;
  team?: string;
  positionUuid: string;
}