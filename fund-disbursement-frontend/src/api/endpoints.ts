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
    WORKERS_SEARCH: (page: number = 0, size: number = 20) =>
      `/admin/workers/search?page=${page}&size=${size}`,
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
    BATCHES_SEARCH: (page = 0, size = 20, sortBy = 'createdAt', direction = 'desc') =>
      `/disbursements/batches/search?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
    BATCH_BY_UUID: (uuid: string) => `/disbursements/${uuid}`,
    SEND_BATCH: (batchUuid: string) => `/disbursements/send/${batchUuid}`,
  },
  MPESA: {
    INITIATE: '/mpesa/initiate',
  },
  USER: {
    DISBURSEMENTS: '/disbursements',
    SINGLE_DISBURSEMENT: '/disbursements/single',
    TRANSACTIONS: '/user/transactions',
  },
  KPI: {
    WORKERS: '/kpi/workers',
  },
} as const;