import api, { handleApiError } from '@/lib/api';
import type { AdminStats, User, UserListResponse, PaginationParams } from '@/types/api';

// Admin Service
export const adminService = {
  /**
   * Get admin dashboard statistics
   */
  getStats: async (): Promise<AdminStats> => {
    try {
      const response = await api.get<{ stats: AdminStats }>('/admin/stats');
      return response.stats;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all users with pagination
   */
  getAllUsers: async (params?: PaginationParams): Promise<UserListResponse> => {
    try {
      const response = await api.get<UserListResponse>('/admin/users', params as Record<string, unknown>);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get<{ user: User }>(`/admin/users/${id}`);
      return response.user;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update user role
   */
  updateUserRole: async (id: string, role: 'user' | 'vet' | 'admin'): Promise<User> => {
    try {
      const response = await api.patch<{ user: User }>(`/admin/users/${id}/role`, { role });
      return response.user;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a user
   */
  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/admin/users/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Ban/unban a user
   */
  toggleUserBan: async (id: string, banned: boolean): Promise<User> => {
    try {
      const response = await api.patch<{ user: User }>(`/admin/users/${id}/ban`, { banned });
      return response.user;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get pending vet verifications
   */
  getPendingVetVerifications: async (): Promise<User[]> => {
    try {
      const response = await api.get<{ users: User[] }>('/admin/vets/pending');
      return response.users;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Verify a vet account
   */
  verifyVet: async (id: string): Promise<User> => {
    try {
      const response = await api.patch<{ user: User }>(`/admin/vets/${id}/verify`, {});
      return response.user;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default adminService;
