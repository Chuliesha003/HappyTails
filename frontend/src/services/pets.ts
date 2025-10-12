import api, { handleApiError } from '@/lib/api';
import type { Pet, CreatePetRequest } from '@/types/api';

// Pets Service
export const petsService = {
  /**
   * Get all pets for the current user
   */
  getAllPets: async (): Promise<Pet[]> => {
    try {
      const response = await api.get<{ pets: Pet[] }>('/pets');
      return response.pets;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single pet by ID
   */
  getPetById: async (id: string): Promise<Pet> => {
    try {
      const response = await api.get<{ pet: Pet }>(`/pets/${id}`);
      return response.pet;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new pet
   */
  createPet: async (data: CreatePetRequest): Promise<Pet> => {
    try {
      const response = await api.post<{ pet: Pet }>('/pets', data);
      return response.pet;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a pet
   */
  updatePet: async (id: string, data: Partial<CreatePetRequest>): Promise<Pet> => {
    try {
      const response = await api.put<{ pet: Pet }>(`/pets/${id}`, data);
      return response.pet;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a pet
   */
  deletePet: async (id: string): Promise<void> => {
    try {
      await api.delete(`/pets/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload pet photo
   */
  uploadPhoto: async (petId: string, file: File): Promise<Pet> => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.upload<{ pet: Pet }>(`/pets/${petId}/photo`, formData);
      return response.pet;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default petsService;
