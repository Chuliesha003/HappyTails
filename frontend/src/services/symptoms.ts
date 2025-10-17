import api, { handleApiError } from '@/lib/api';
import type { SymptomAnalysisRequest, SymptomAnalysisResponse, SymptomCheck } from '@/types/api';

// Symptoms Service
export const symptomsService = {
  /**
   * Analyze symptoms using AI
   */
  analyzeSymptoms: async (data: SymptomAnalysisRequest): Promise<{ ok: boolean; data?: any; error?: string }> => {
    try {
      // api.post returns response.data already
      const response = await api.post<unknown>('/symptom-checker/analyze', data);
      const r = response as Record<string, any>;

      // If backend uses { success, data } shape
      if (r && typeof r === 'object' && ('success' in r || 'ok' in r)) {
        return { ok: !!r.success || !!r.ok, data: r.data, error: r.message || r.error };
      }

      // If backend returned direct payload (conditions etc.)
      if (r && 'conditions' in r) {
        return { ok: true, data: r };
      }

      // Fallback
      return { ok: true, data: r };
    } catch (error) {
      const e = handleApiError(error);
      return { ok: false, error: e.message };
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
  ): Promise<{ ok: boolean; data?: any; error?: string }> => {
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
      
      const response = await api.upload<unknown>('/symptom-checker/analyze', formData);
      const r = response as Record<string, any>;

      if (r && typeof r === 'object' && ('success' in r || 'ok' in r)) {
        return { ok: !!r.success || !!r.ok, data: r.data, error: r.message || r.error };
      }

      if (r && 'conditions' in r) return { ok: true, data: r };

      return { ok: true, data: r };
    } catch (error) {
      const e = handleApiError(error);
      return { ok: false, error: e.message };
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
