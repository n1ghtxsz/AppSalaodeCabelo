import { useState, useEffect, useCallback } from 'react'
import { appointmentService } from '../services/appointments'

export function useNextAppointment() {
  const [appointment, setAppointment] = useState(undefined) // undefined = não carregado
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  const fetch = useCallback(() => {
    setLoading(true)
    setError(null)
    appointmentService.getNext()
      .then(({ appointment }) => setAppointment(appointment ?? null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { appointment, loading, error, refetch: fetch }
}
