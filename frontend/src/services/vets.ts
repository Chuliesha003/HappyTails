import api, { handleApiError } from '@/lib/api';
import type { Vet, CreateVetRequest, VetSearchParams } from '@/types/api';

// Vets Service
export const vetsService = {
  /**
   * Get all vets with optional filters
   */
  getAllVets: async (params?: VetSearchParams): Promise<Vet[]> => {
    try {
      const response = await api.get<{ vets: Vet[] }>('/vets', params as Record<string, unknown>);
      return response.vets;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Search for nearby vets based on location
   */
  searchNearbyVets: async (
    latitude: number,
    longitude: number,
    maxDistance?: number
  ): Promise<Vet[]> => {
    try {
      const params: VetSearchParams = {
        latitude,
        longitude,
        maxDistance: maxDistance || 50, // Default 50 miles
      };
      
      const response = await api.get<{ vets: Vet[] }>('/vets/nearby', params as Record<string, unknown>);
      return response.vets;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single vet by ID
   */
  getVetById: async (id: string): Promise<Vet> => {
    try {
      const response = await api.get<{ vet: Vet }>(`/vets/${id}`);
      return response.vet;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new vet (admin only)
   */
  createVet: async (data: CreateVetRequest): Promise<Vet> => {
    try {
      const response = await api.post<{ vet: Vet }>('/vets', data);
      return response.vet;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a vet (admin only)
   */
  updateVet: async (id: string, data: Partial<CreateVetRequest>): Promise<Vet> => {
    try {
      const response = await api.put<{ vet: Vet }>(`/vets/${id}`, data);
      return response.vet;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a vet (admin only)
   */
  deleteVet: async (id: string): Promise<void> => {
    try {
      await api.delete(`/vets/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Verify a vet (admin only)
   */
  verifyVet: async (id: string): Promise<Vet> => {
    try {
      const response = await api.patch<{ vet: Vet }>(`/vets/${id}/verify`, {});
      return response.vet;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default vetsService;
