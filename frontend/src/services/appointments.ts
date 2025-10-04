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
  cancelAppointment: async (id: string): Promise<Appointment> => {
    try {
      return await appointmentsService.updateAppointmentStatus(id, 'cancelled');
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
