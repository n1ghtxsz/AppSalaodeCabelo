import { api } from './api'

export const serviceService = {
  list: () => api.get('/api/services'),
}
