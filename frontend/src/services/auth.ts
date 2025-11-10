import api, { handleApiError } from '@/lib/api';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User 
} from '@/types/api';

// Authentication Service
export const authService = {
  /**
   * Register or login with Firebase ID token
   */
  registerOrLogin: async (data: { idToken: string; fullName?: string }): Promise<AuthResponse> => {
    try {
      console.log('Calling /auth/register endpoint with data:', { 
        idToken: data.idToken.substring(0, 20) + '...', 
        fullName: data.fullName 
      });
      
      const response = await api.post<{ success: boolean; message: string; user: User; isNewUser: boolean }>('/auth/register', data);
      
      console.log('Backend response received:', response);
      
      // Backend returns { success, message, user, isNewUser }
      // Convert to AuthResponse format expected by frontend
      const authResponse: AuthResponse = {
        user: response.user,
        token: data.idToken, // Use Firebase token
        isNewUser: response.isNewUser,
      };
      
      // Store token and user data in localStorage
      if (authResponse.token) {
        localStorage.setItem('happytails_token', authResponse.token);
      }
      if (authResponse.user) {
        localStorage.setItem('happytails_user', JSON.stringify(authResponse.user));
      }
      
      return authResponse;
    } catch (error) {
      console.error('Auth service error:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('happytails_token', response.token);
        localStorage.setItem('happytails_user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('happytails_token', response.token);
        localStorage.setItem('happytails_user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('happytails_token');
      localStorage.removeItem('happytails_user');
      
      // Optionally call backend logout endpoint if it exists
      // await api.post('/auth/logout');
    } catch (error) {
      // Still clear local storage even if API call fails
      localStorage.removeItem('happytails_token');
      localStorage.removeItem('happytails_user');
      throw handleApiError(error);
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<{ user: User }>('/auth/me');
      return response.user;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<{ user: User }>('/auth/profile', data);
      
      // Update stored user data
      localStorage.setItem('happytails_user', JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get stored token
   */
  getToken: (): string | null => {
    return localStorage.getItem('happytails_token');
  },

  /**
   * Get stored user
   */
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('happytails_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },
};

export default authService;
