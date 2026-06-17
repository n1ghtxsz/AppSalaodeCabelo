import { useState, useEffect } from 'react'
import { slotService } from '../services/slots'

export function useAvailableSlots(serviceId, date, professionalId) {
  const [slots, setSlots]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!serviceId || !date) return
    setLoading(true)
    setError(null)
    slotService.get(serviceId, date, professionalId || null)
      .then(({ slots }) => setSlots(slots || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [serviceId, date, professionalId])

  return { slots, loading, error }
}
