import { api } from './api'

export const appointmentService = {
  getAvailable: (date) => api.get(`/appointments/available?date=${date}`),
  book: (payload) => api.post('/appointments', payload),
  getMyAppointments: () => api.get('/appointments/my'),
  cancel: (id) => api.delete(`/appointments/${id}`),
}
