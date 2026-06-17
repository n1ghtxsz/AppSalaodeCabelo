import { api } from './api'

export const appointmentService = {
  getNext:  ()             => api.get('/api/appointments/next'),
  getMy:    ()             => api.get('/api/appointments/my'),
  create:   (payload)      => api.post('/api/appointments', payload),
  cancel:   (id, reason)   => api.patch(`/api/appointments/${id}/cancel`, { cancel_reason: reason }),
}
