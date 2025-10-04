import axiosInstance from './axios';

// API error type
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Helper function to handle API errors
export const handleApiError = (error: unknown): ApiError => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as { response?: { data?: unknown; status?: number } };
    const responseData = axiosError.response?.data;
    
    if (typeof responseData === 'object' && responseData !== null) {
      return {
        message: (responseData as { message?: string }).message || 'An error occurred',
        errors: (responseData as { errors?: Record<string, string[]> }).errors,
        statusCode: axiosError.response?.status,
      };
    }
  }
  
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
  };
};

// API utilities
export const api = {
  // Generic GET request
  get: async <T>(url: string, params?: Record<string, unknown>) => {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  },

  // Generic POST request
  post: async <T>(url: string, data?: unknown, config?: { headers?: Record<string, string> }) => {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  },

  // Generic PUT request
  put: async <T>(url: string, data?: unknown) => {
    const response = await axiosInstance.put<T>(url, data);
    return response.data;
  },

  // Generic DELETE request
  delete: async <T>(url: string) => {
    const response = await axiosInstance.delete<T>(url);
    return response.data;
  },

  // Generic PATCH request
  patch: async <T>(url: string, data?: unknown) => {
    const response = await axiosInstance.patch<T>(url, data);
    return response.data;
  },

  // Upload file with FormData
  upload: async <T>(url: string, formData: FormData) => {
    const response = await axiosInstance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
