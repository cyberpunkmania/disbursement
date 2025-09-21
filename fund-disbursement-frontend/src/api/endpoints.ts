// API endpoint constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/fund-disbursement/authenticate',
    VERIFY_OTP: '/auth/fund-disbursement/verify-otp',
    REFRESH: '/auth/refresh-token',
  },
  ADMIN: {
    WORKERS: '/admin/workers',
    POSITIONS: '/admin/positions',
    PAYROLL: '/admin/payroll',
    DISBURSEMENTS: '/admin/disbursements',
  },
  USER: {
    DISBURSEMENTS: '/disbursements',
    SINGLE_DISBURSEMENT: '/disbursements/single',
    TRANSACTIONS: '/user/transactions',
  },
} as const;