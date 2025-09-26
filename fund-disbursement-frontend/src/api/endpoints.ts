// API endpoint constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/fund-disbursement/authenticate',
    REFRESH: '/auth/refresh-token',
  },
  ADMIN: {
    // Position endpoints - Updated to match API specification
    POSITIONS: '/admin/positions',
    POSITION_BY_UUID: (uuid: string) => `/admin/positions/${uuid}`,
    
    // Worker endpoints
    WORKERS: '/admin/workers',
    WORKER_BY_UUID: (uuid: string) => `/admin/workers/${uuid}`,
    WORKER_TOGGLE_PAYABLE: (uuid: string) => `/admin/workers/${uuid}/payable`,
    
    // Legacy endpoints (keeping for backward compatibility)
    PAYROLL: '/admin/payroll',
    DISBURSEMENTS: '/admin/disbursements',
  },
  PAYROLL: {
    PERIODS: '/payroll/periods',
    PERIOD_BY_UUID: (uuid: string) => `/payroll/periods/${uuid}`,
    PERIOD_UPDATE: (uuid: string) => `/payroll/update/${uuid}`,
    PERIOD_CSV: '/payroll/periods:csv',
    PERIOD_SEARCH: '/payroll/search',
    PERIOD_GET: (uuid: string) => `/payroll/${uuid}`,
    GENERATE_PAY_ITEMS: (periodUuid: string) => `/payroll/periods/${periodUuid}/items:auto`,
    PERIOD_APPROVE: (uuid: string) => `/payroll/periods/${uuid}/approve`,
    PERIOD_LOCK: (uuid: string) => `/payroll/periods/${uuid}/lock`,
  },
  DISBURSEMENTS: {
    FROM_PERIOD: (periodUuid: string) => `/disbursements/from-period/${periodUuid}`,
    SINGLE: '/disbursements/single',
    BATCH: '/disbursements/batch',
    SEND_BATCH: (batchUuid: string) => `/disbursements/send/${batchUuid}`,
    BATCH_DISBURSE: (batchUuid: string) => `/disbursements/disburse/${batchUuid}`,
  },
  MPESA: {
    INITIATE: '/mpesa/initiate',
  },
  USER: {
    DISBURSEMENTS: '/disbursements',
    SINGLE_DISBURSEMENT: '/disbursements/single',
    TRANSACTIONS: '/user/transactions',
  },
} as const;