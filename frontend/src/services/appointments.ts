import api, { handleApiError } from '@/lib/api';
import type { Appointment, CreateAppointmentRequest } from '@/types/api';

// Appointments Service
export const appointmentsService = {
  /**
   * Get all appointments for the current user
   */
  getAllAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await api.get<{ appointments: Appointment[] }>('/appointments');
      return response.appointments;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single appointment by ID
   */
  getAppointmentById: async (id: string): Promise<Appointment> => {
    try {
      const response = await api.get<{ appointment: Appointment }>(`/appointments/${id}`);
      return response.appointment;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new appointment
   */
  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    try {
      const response = await api.post<{ appointment: Appointment }>('/appointments', data);
      return response.appointment;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update appointment status
   */
  updateAppointmentStatus: async (
    id: string,
    status: 'confirmed' | 'cancelled' | 'completed'
  ): Promise<Appointment> => {
    try {
      const response = await api.patch<{ appointment: Appointment }>(
        `/appointments/${id}/status`,
        { status }
      );
      return response.appointment;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Cancel an appointment
   */
  cancelAppointment: async (id: string): Promise<void> => {
    try {
      console.log('[SERVICE] Cancelling appointment:', id);
      const response = await api.delete<{ success: boolean; message: string }>(`/appointments/${id}`);
      console.log('[SERVICE] Cancel response:', response);
      return;
    } catch (error) {
      console.error('[SERVICE] Cancel error:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Update an appointment (owner or admin)
   */
  updateAppointment: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    try {
      const response = await api.put<{ appointment: Appointment }>(`/appointments/${id}`, data);
      return response.appointment;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete (cancel) an appointment by id
   */
  deleteAppointment: async (id: string): Promise<void> => {
    try {
      await api.delete(`/appointments/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get upcoming appointments
   */
  getUpcomingAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await api.get<{ appointments: Appointment[] }>('/appointments/upcoming');
      return response.appointments;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get past appointments
   */
  getPastAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await api.get<{ appointments: Appointment[] }>('/appointments/past');
      return response.appointments;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default appointmentsService;
