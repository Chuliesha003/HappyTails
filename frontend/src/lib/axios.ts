import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { auth } from './firebase';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Prevent aggressive redirects on 401 during initial app load where auth may still be rehydrating.
const APP_START_TS = Date.now();
const AUTH_REDIRECT_COOLDOWN_MS = 3000; // 3 seconds

// Helper to check if error is retryable
// Note: 429 responses (rate limit) are NOT retried so the client can show a friendly message immediately
const isRetryableError = (error: AxiosError): boolean => {
  if (!error.response) {
    // Network errors are retryable
    return true;
  }

  const status = error.response.status;
  // Retry on 5xx server errors only. Do NOT retry 429 (rate limit) so UI can react immediately.
  return status >= 500 && status < 600;
};

// Helper to calculate retry delay with exponential backoff
const getRetryDelay = (retryCount: number): number => {
  return RETRY_DELAY * Math.pow(2, retryCount);
};

// Helper to wait for delay
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Request interceptor to add Firebase auth token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Skip adding token for public auth endpoints
      const isPublicAuthEndpoint = config.url?.includes('/auth/register');
      
      if (isPublicAuthEndpoint) {
        // These endpoints receive the token in the request body, not header
        return config;
      }
      
      // Get current Firebase user
      const currentUser = auth.currentUser;

      if (currentUser && config.headers) {
        // Get fresh Firebase ID token
        const idToken = await currentUser.getIdToken(true); // Force refresh
        console.log('🔑 Using fresh Firebase token from currentUser');
        config.headers.Authorization = `Bearer ${idToken}`;
        // Also update localStorage with fresh token
        localStorage.setItem('happytails_token', idToken);
      } else {
        // Fallback: if Firebase currentUser is not available (e.g. during rehydrate),
        // try to use the stored token from localStorage so users who have a saved
        // session in localStorage are not treated as unauthenticated immediately.
        const fallbackToken = localStorage.getItem('happytails_token');
        if (fallbackToken && config.headers) {
          console.log('🔑 Using fallback token from localStorage');
          config.headers.Authorization = `Bearer ${fallbackToken}`;
        } else {
          console.warn('⚠️ No auth token available - neither currentUser nor localStorage token');
        }
      }
    } catch (error) {
      console.warn('Unable to attach Firebase token:', error);
      // Continue with the request even if token fetch fails
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling with retry logic
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };
    
    // Initialize retry count
    if (!config._retryCount) {
      config._retryCount = 0;
    }
    
    // Check if we should retry
    if (config._retryCount < MAX_RETRIES && isRetryableError(error)) {
      config._retryCount += 1;
      
      // Calculate delay with exponential backoff
      const delay = getRetryDelay(config._retryCount);
      
      console.log(`Retrying request (${config._retryCount}/${MAX_RETRIES}) after ${delay}ms...`);
      
      // Wait before retrying
      await sleep(delay);
      
      // Retry the request
      return axiosInstance(config);
    }
    
    // Handle non-retryable errors or max retries reached
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401: {
          // Unauthorized - if we truly have no session, clear token and redirect to login.
          // But avoid redirecting when the app is still rehydrating auth (e.g. Firebase onAuthStateChanged)
          const storedToken = localStorage.getItem('happytails_token');
          const currentUserLocal = auth.currentUser;

          // If there's a stored token or Firebase still has a currentUser, don't force-redirect; let AuthProvider handle state.
          if (!storedToken && !currentUserLocal) {
            localStorage.removeItem('happytails_token');
            localStorage.removeItem('happytails_user');
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          } else {
            // If we do have a stored token or firebase user, just log and allow AuthProvider/onAuthStateChanged to resolve.
            console.warn('Received 401 but auth state appears to be present; deferring redirect to AuthProvider.');
          }
          break;
        }
          
        case 403:
          // Forbidden - insufficient permissions
          console.error('Access denied:', data);
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', data);
          break;
          
        case 429:
          // Too many requests - rate limited
          console.error('Rate limit exceeded - max retries reached:', data);
          break;
          
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          console.error('Server error - max retries reached:', data);
          break;
          
        default:
          console.error('API error:', data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - no response from server (max retries reached)');
    } else {
      // Error setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
