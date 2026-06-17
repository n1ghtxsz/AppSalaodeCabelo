import { api } from './api'

export const slotService = {
  get: (serviceId, date, professionalId) => {
    const params = new URLSearchParams({ service_id: serviceId, date })
    if (professionalId) params.set('professional_id', professionalId)
    return api.get(`/api/slots?${params}`)
  },
}
