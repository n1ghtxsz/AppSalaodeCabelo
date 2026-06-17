import { api } from './api'

export const professionalService = {
  list: () => api.get('/api/professionals'),
}
