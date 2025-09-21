export interface ApiResponse<T = any> {
  success: boolean;
  responseCode: number;
  responseMessage: string;
  message: string;
  data?: T;
  timestamp: string;
  requestId: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
}