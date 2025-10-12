import api, { handleApiError } from '@/lib/api';
import type { Vet, CreateVetRequest, VetSearchParams } from '@/types/api';

// The wrapper may return either T directly or { vets: T } / { vet: T }.
// These helpers unwrap both shapes without using `any`.

function unwrapArray(res: unknown): Vet[] {
  if (Array.isArray(res)) return res as Vet[];
  if (res && typeof res === 'object' && 'vets' in (res as Record<string, unknown>)) {
    const obj = res as { vets?: unknown };
    if (Array.isArray(obj.vets)) return obj.vets as Vet[];
  }
  return [];
}

function unwrapOne(res: unknown): Vet {
  if (res && typeof res === 'object' && 'vet' in (res as Record<string, unknown>)) {
    const obj = res as { vet?: unknown };
    return obj.vet as Vet;
  }
  return res as Vet;
}

export const vetsService = {
  /**
   * Get all vets with optional filters
   */
  getAllVets: async (params?: VetSearchParams): Promise<Vet[]> => {
    try {
      // IMPORTANT: pass plain params object; your wrapper will map to axios { params }
      const res = await api.get('/vets', params);
      return unwrapArray(res);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Search for nearby vets based on location
   * Your backend accepts: latitude, longitude, maxDistance (km)
   */
  searchNearbyVets: async (
    latitude: number,
    longitude: number,
    maxDistance = 50
  ): Promise<Vet[]> => {
    try {
      // IMPORTANT: DO NOT wrap with { params: ... }
      const res = await api.get('/vets/nearby', {
        latitude,
        longitude,
        maxDistance,
      });
      return unwrapArray(res);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single vet by ID
   */
  getVetById: async (id: string): Promise<Vet> => {
    try {
      const res = await api.get(`/vets/${id}`);
      return unwrapOne(res);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new vet (admin only)
   */
  createVet: async (payload: CreateVetRequest): Promise<Vet> => {
    try {
      const res = await api.post('/vets', payload);
      return unwrapOne(res);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a vet (admin only)
   */
  updateVet: async (id: string, payload: Partial<CreateVetRequest>): Promise<Vet> => {
    try {
      const res = await api.put(`/vets/${id}`, payload);
      return unwrapOne(res);
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
      const res = await api.patch(`/vets/${id}/verify`, {});
      return unwrapOne(res);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default vetsService;
