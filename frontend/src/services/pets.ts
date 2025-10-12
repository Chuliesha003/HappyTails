import api, { handleApiError } from '@/lib/api';
import type { Pet, CreatePetRequest, MedicalRecord, Vaccination, Document } from '@/types/api';

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

  /**
   * Add medical record to a pet
   */
  addMedicalRecord: async (petId: string, record: MedicalRecord): Promise<Pet> => {
    try {
      const response = await api.post<{ pet: Pet }>(`/pets/${petId}/medical-records`, record);
      return response.pet;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Add vaccination to a pet
   */
  addVaccination: async (petId: string, vaccination: Vaccination): Promise<Pet> => {
    try {
      const response = await api.post<{ pet: Pet }>(`/pets/${petId}/vaccinations`, vaccination);
      return response.pet;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload document for a pet
   */
  uploadDocument: async (file: File, documentType: Document['documentType'], description?: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      if (description) {
        formData.append('description', description);
      }
      
      const response = await api.upload<{ success: boolean; message: string; filePath: string; fileName: string; fileType: string; documentType: string }>('/pets/upload', formData);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Add document to a pet
   */
  addDocumentToPet: async (petId: string, document: Omit<Document, 'uploadedAt'>): Promise<Pet> => {
    try {
      const response = await api.post<{ pet: Pet }>(`/pets/${petId}/documents`, document);
      return response.pet;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default petsService;
