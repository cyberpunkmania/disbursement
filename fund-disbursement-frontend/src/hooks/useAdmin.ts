import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../api/services/admin.service';
import type {
  CreatePositionRequest,
  UpdatePositionRequest,
  CreateWorkerRequest,
  UpdateWorkerRequest,
  CreatePayPeriodRequest,
  UpdatePayPeriodRequest,
  PayrollSearchParams,
  PayrollCsvParams,
  CreateSingleDisbursementRequest,
  MPesaInitiateRequest,
} from '../types/admin.types';

// Query Keys
export const ADMIN_QUERY_KEYS = {
  POSITIONS: ['admin', 'positions'] as const,
  POSITION: (uuid: string) => ['admin', 'positions', uuid] as const,
  WORKERS: ['admin', 'workers'] as const,
  WORKER: (uuid: string) => ['admin', 'workers', uuid] as const,
  PAY_PERIODS: ['admin', 'payPeriods'] as const,
  PAY_PERIOD: (uuid: string) => ['admin', 'payPeriods', uuid] as const,
};

// ============== POSITION HOOKS ==============

export const usePositions = (activeOnly?: boolean) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.POSITIONS,
    queryFn: () => adminService.getPositions(),
    select: (data) => {
      const positions = data.data || [];
      if (typeof activeOnly === 'boolean') {
        return positions.filter((p) => p.active === activeOnly);
      }
      return positions;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};

export const usePosition = (uuid: string) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.POSITION(uuid),
    queryFn: () => adminService.getPositionByUuid(uuid),
    select: (data) => data.data,
    enabled: !!uuid,
  });
};

export const useCreatePosition = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePositionRequest) => adminService.createPosition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.POSITIONS });
    },
  });
};

export const useUpdatePosition = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdatePositionRequest }) =>
      adminService.updatePosition(uuid, data),
    onSuccess: (_, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.POSITIONS });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.POSITION(uuid) });
    },
  });
};

export const useDeletePosition = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (uuid: string) => adminService.deletePosition(uuid),
    onSuccess: (_, uuid) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.POSITIONS });
      queryClient.removeQueries({ queryKey: ADMIN_QUERY_KEYS.POSITION(uuid) });
    },
  });
};

// ============== WORKER HOOKS ==============

export const useWorkersPaginated = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.WORKERS, page, size],
    queryFn: () => adminService.getWorkersPaginated(page, size).then(res => res.data),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};

export const useWorkers = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.WORKERS, page, size],
    queryFn: () => adminService.getWorkers().then(res => res.data),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};

export const useWorkerKpi = () => {
  return useQuery({
    queryKey: ['workerKpi'],
    queryFn: () => adminService.getWorkerKpi(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};

export const useWorker = (uuid: string) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.WORKER(uuid),
    queryFn: () => adminService.getWorkerByUuid(uuid),
    select: (data) => data.data,
    enabled: !!uuid,
  });
};

export const useCreateWorker = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateWorkerRequest) => adminService.createWorker(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.WORKERS });
    },
  });
};

export const useUpdateWorker = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateWorkerRequest }) =>
      adminService.updateWorker(uuid, data),
    onSuccess: (_, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.WORKERS });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.WORKER(uuid) });
    },
  });
};

export const useDeleteWorker = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (uuid: string) => adminService.deleteWorker(uuid),
    onSuccess: (_, uuid) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.WORKERS });
      queryClient.removeQueries({ queryKey: ADMIN_QUERY_KEYS.WORKER(uuid) });
    },
  });
};

export const useToggleWorkerPayable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ uuid, payable }: { uuid: string; payable: boolean }) => adminService.toggleWorkerPayableStatus(uuid, payable),
    onSuccess: (_, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.WORKERS });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.WORKER(uuid) });
    },
  });
};

// ============== PAY PERIOD HOOKS ==============

export const usePayPeriods = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.PAY_PERIODS,
    queryFn: () => adminService.getPayPeriods(),
    select: (data) => data.data,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};

export const usePayPeriod = (uuid: string) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.PAY_PERIOD(uuid),
    queryFn: () => adminService.getPayPeriodByUuid(uuid),
    select: (data) => data.data,
    enabled: !!uuid,
  });
};

export const useCreatePayPeriod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePayPeriodRequest) => adminService.createPayPeriod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.PAY_PERIODS });
    },
  });
};

export const useUpdatePayPeriod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdatePayPeriodRequest }) =>
      adminService.updatePayPeriod(uuid, data),
    onSuccess: (_, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.PAY_PERIODS });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.PAY_PERIOD(uuid) });
    },
  });
};

export const useDeletePayPeriod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (uuid: string) => adminService.deletePayPeriod(uuid),
    onSuccess: (_, uuid) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.PAY_PERIODS });
      queryClient.removeQueries({ queryKey: ADMIN_QUERY_KEYS.PAY_PERIOD(uuid) });
    },
  });
};

export const useApprovePayPeriod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (uuid: string) => adminService.approvePayPeriod(uuid),
    onSuccess: (_, uuid) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.PAY_PERIODS });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.PAY_PERIOD(uuid) });
    },
  });
};

export const useLockPayPeriod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (uuid: string) => adminService.lockPayPeriod(uuid),
    onSuccess: (_, uuid) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.PAY_PERIODS });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.PAY_PERIOD(uuid) });
    },
  });
};

export const useGeneratePayItems = () => {
  return useMutation({
    mutationFn: (periodUuid: string) => adminService.generatePayItems(periodUuid),
  });
};

export const useCreateBatchFromPeriod = () => {
  return useMutation({
    mutationFn: (periodUuid: string) => adminService.createBatchFromPeriod(periodUuid),
  });
};

export const useSendBatch = () => {
  return useMutation({
    mutationFn: (batchUuid: string) => adminService.sendBatch(batchUuid),
  });
};

// ============== NEW PAYROLL HOOKS ==============

export const usePayPeriodById = (uuid: string) => {
  return useQuery({
    queryKey: ['admin', 'payPeriods', 'byId', uuid],
    queryFn: () => adminService.getPayPeriodById(uuid),
    select: (data) => data.data,
    enabled: !!uuid,
  });
};

export const useSearchPayPeriods = (params: PayrollSearchParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'payPeriods', 'search', params],
    queryFn: () => adminService.searchPayPeriods(params),
    select: (data) => data.data,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export const useExportPayPeriodsCsv = () => {
  return useMutation({
    mutationFn: (params: PayrollCsvParams = {}) => adminService.exportPayPeriodsCsv(params),
  });
};

// ============== DISBURSEMENT HOOKS ==============

export const useCreateSingleDisbursement = () => {
  return useMutation({
    mutationFn: (data: CreateSingleDisbursementRequest) =>
      adminService.createSingleDisbursement(data),
  });
};

export const useCreateBatchDisbursement = () => {
  return useMutation({
    mutationFn: (workerUuids: string[]) =>
      adminService.createBatchDisbursement(workerUuids),
  });
};

export const useDisburseBatch = () => {
  return useMutation({
    mutationFn: (batchUuid: string) => adminService.disburseBatch(batchUuid),
  });
};

// ============== M-PESA HOOKS ==============

export const useInitiateMPesaPayment = () => {
  return useMutation({
    mutationFn: (data: MPesaInitiateRequest) => adminService.initiateMPesaPayment(data),
  });
};

// ============== COMPOSED HOOKS ==============

// Hook for getting workers with their position information
export const useWorkersWithPositions = () => {
  const { data: workers, ...workersQuery } = useWorkers();
  const { data: positions } = usePositions();

  const workersWithPositions = workers?.map(worker => ({
    ...worker,
    positionName: positions?.find(p => p.uuid === worker.positionUuid)?.name || 'Unknown',
  }));

  return {
    data: workersWithPositions,
    ...workersQuery,
  };
};

// Hook for dashboard statistics
export const useDashboardStats = () => {
  const { data: workers } = useWorkers();
  const { data: positions } = usePositions();
  const { data: payPeriods } = usePayPeriods();

  const stats = {
    totalWorkers: workers?.length || 0,
    activeWorkers: workers?.filter(w => w.status === 'ACTIVE').length || 0,
    totalPositions: positions?.length || 0,
    activePositions: positions?.filter(p => p.active).length || 0,
    totalPayPeriods: payPeriods?.length || 0,
    draftPayPeriods: payPeriods?.filter(p => p.status === 'DRAFT').length || 0,
    approvedPayPeriods: payPeriods?.filter(p => p.status === 'APPROVED').length || 0,
    lockedPayPeriods: payPeriods?.filter(p => p.status === 'LOCKED').length || 0,
  };

  return stats;
};

export const useDisbursementBatches = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['disbursementBatches', page, size],
    queryFn: () => adminService.getDisbursementBatches(page, size),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};

export const useDisbursementBatch = (uuid: string) => {
  return useQuery({
    queryKey: ['disbursementBatch', uuid],
    queryFn: () => adminService.getDisbursementBatchByUuid(uuid),
    enabled: !!uuid,
  });
};