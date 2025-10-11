import api, { handleApiError } from '@/lib/api';
import type { AdminStats, User, UserListResponse, Appointment, Vet, Article, Pet, PaginationParams, Medication } from '@/types/api';

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

  /**
   * Get all appointments (admin view)
   */
  getAllAppointments: async (params?: PaginationParams & { status?: string; vetId?: string; userId?: string; upcoming?: string; past?: string }): Promise<{ data: Appointment[]; pagination: { currentPage: number; totalPages: number; totalAppointments: number; hasMore: boolean } }> => {
    try {
      const response = await api.get<{ data: Appointment[]; pagination: { currentPage: number; totalPages: number; totalAppointments: number; hasMore: boolean } }>('/admin/appointments', params as Record<string, unknown>);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all vets (admin view)
   */
  getAllVets: async (params?: PaginationParams & { isVerified?: string; isActive?: string; search?: string }): Promise<{ vets: Vet[]; total: number; page: number; limit: number; pagination: { currentPage: number; totalPages: number; totalVets: number; hasMore: boolean } }> => {
    try {
      const response = await api.get<{ vets: Vet[]; total: number; page: number; limit: number; pagination: { currentPage: number; totalPages: number; totalVets: number; hasMore: boolean } }>('/admin/vets', params as Record<string, unknown>);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Toggle vet verification status
   */
  toggleVetVerification: async (id: string): Promise<Vet> => {
    try {
      const response = await api.patch<{ vet: Vet }>(`/admin/vets/${id}/verify`, {});
      return response.vet;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all articles (admin view)
   */
  getAllArticles: async (params?: PaginationParams & { category?: string; isPublished?: string; search?: string }): Promise<{ articles: Article[]; total: number; page: number; limit: number; pagination: { currentPage: number; totalPages: number; totalArticles: number; hasMore: boolean } }> => {
    try {
      const response = await api.get<{ articles: Article[]; total: number; page: number; limit: number; pagination: { currentPage: number; totalPages: number; totalArticles: number; hasMore: boolean } }>('/articles', params as Record<string, unknown>);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create new article
   */
  createArticle: async (articleData: { title: string; content: string; category: string; excerpt?: string; tags?: string[] }): Promise<Article> => {
    try {
      const response = await api.post<{ article: Article }>('/articles', articleData);
      return response.article;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update article
   */
  updateArticle: async (id: string, articleData: Partial<{ title: string; content: string; category: string; excerpt?: string; tags?: string[] }>): Promise<Article> => {
    try {
      const response = await api.put<{ article: Article }>(`/articles/${id}`, articleData);
      return response.article;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete article
   */
  deleteArticle: async (id: string): Promise<void> => {
    try {
      await api.delete(`/articles/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Toggle article publish status
   */
  toggleArticlePublish: async (id: string): Promise<Article> => {
    try {
      const response = await api.patch<{ article: Article }>(`/articles/${id}/publish`, {});
      return response.article;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all pets (admin view)
   */
  getAllPets: async (params?: PaginationParams & { species?: string; owner?: string; search?: string; isActive?: string }): Promise<{ pets: Pet[]; total: number; page: number; limit: number; pagination: { currentPage: number; totalPages: number; totalPets: number; hasMore: boolean } }> => {
    try {
      const response = await api.get<{ pets: Pet[]; total: number; page: number; limit: number; pagination: { currentPage: number; totalPages: number; totalPets: number; hasMore: boolean } }>('/admin/pets', params as Record<string, unknown>);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get single pet by ID
   */
  getPetById: async (id: string): Promise<Pet> => {
    try {
      const response = await api.get<{ pet: Pet }>(`/admin/pets/${id}`);
      return response.pet;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create new pet
   */
  createPet: async (petData: {
    name: string;
    species: string;
    breed: string;
    age?: number;
    ageUnit?: string;
    dateOfBirth?: string;
    weight?: number;
    weightUnit?: string;
    gender?: string;
    color?: string;
    microchipId?: string;
    owner: string;
    allergies?: string[];
    medications?: Medication[];
    specialNeeds?: string;
    photoUrl?: string;
  }): Promise<Pet> => {
    try {
      const response = await api.post<{ pet: Pet }>('/admin/pets', petData);
      return response.pet;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update pet
   */
  updatePet: async (id: string, petData: Partial<{
    name: string;
    species: string;
    breed: string;
    age?: number;
    ageUnit?: string;
    dateOfBirth?: string;
    weight?: number;
    weightUnit?: string;
    gender?: string;
    color?: string;
    microchipId?: string;
    allergies?: string[];
    medications?: Medication[];
    specialNeeds?: string;
    photoUrl?: string;
    isActive?: boolean;
  }>): Promise<Pet> => {
    try {
      const response = await api.put<{ pet: Pet }>(`/admin/pets/${id}`, petData);
      return response.pet;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete pet
   */
  deletePet: async (id: string): Promise<void> => {
    try {
      await api.delete(`/admin/pets/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Toggle pet active status
   */
  togglePetStatus: async (id: string): Promise<Pet> => {
    try {
      const response = await api.patch<{ pet: Pet }>(`/admin/pets/${id}/status`, {});
      return response.pet;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default adminService;
