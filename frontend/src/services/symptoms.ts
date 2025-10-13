import api, { handleApiError } from '@/lib/api';
import type { SymptomAnalysisRequest, SymptomAnalysisResponse, SymptomCheck } from '@/types/api';

// Symptoms Service
export const symptomsService = {
  /**
   * Analyze symptoms using AI
   */
  analyzeSymptoms: async (data: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> => {
    try {
      const response = await api.post<unknown>(
        '/symptom-checker/analyze',
        data
      );
      // Backend may return { success, data } or direct payload
      const r = response as Record<string, unknown>;
      if (r && 'conditions' in r) return r as unknown as SymptomAnalysisResponse;
      if (r && 'data' in r && r.data && typeof r.data === 'object' && 'conditions' in (r.data as object)) {
        return r.data as SymptomAnalysisResponse;
      }
      return r as unknown as SymptomAnalysisResponse;
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
      
      const response = await api.upload<unknown>(
        '/symptom-checker/analyze',
        formData
      );
      const r = response as Record<string, unknown>;
      if (r && 'conditions' in r) return r as unknown as SymptomAnalysisResponse;
      if (r && 'data' in r && r.data && typeof r.data === 'object' && 'conditions' in (r.data as object)) {
        return r.data as SymptomAnalysisResponse;
      }
      return r as unknown as SymptomAnalysisResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get symptom check history for current user
   */
  getSymptomCheckHistory: async (limit?: number): Promise<SymptomCheck[]> => {
    try {
      const params = limit ? { limit: limit.toString() } : {};
      const response = await api.get<{ success: boolean; data: SymptomCheck[]; count: number }>(
        '/symptom-checker/history',
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default symptomsService;
