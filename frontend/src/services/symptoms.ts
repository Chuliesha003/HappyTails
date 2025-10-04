import api, { handleApiError } from '@/lib/api';
import type { SymptomAnalysisRequest, SymptomAnalysisResponse } from '@/types/api';

// Symptoms Service
export const symptomsService = {
  /**
   * Analyze symptoms using AI
   */
  analyzeSymptoms: async (data: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> => {
    try {
      const response = await api.post<SymptomAnalysisResponse>(
        '/symptom-checker/analyze',
        data
      );
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Analyze symptoms with photo upload
   */
  analyzeSymptomsWithPhoto: async (
    symptoms: string,
    photo: File,
    petType?: string,
    petAge?: number
  ): Promise<SymptomAnalysisResponse> => {
    try {
      const formData = new FormData();
      formData.append('symptoms', symptoms);
      formData.append('photo', photo);
      
      if (petType) {
        formData.append('petType', petType);
      }
      
      if (petAge !== undefined) {
        formData.append('petAge', petAge.toString());
      }
      
      const response = await api.upload<SymptomAnalysisResponse>(
        '/symptom-checker/analyze',
        formData
      );
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default symptomsService;
