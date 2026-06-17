import { useState, useEffect, useCallback } from 'react'
import { appointmentService } from '../services/appointments'

export function useAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    appointmentService.getMy()
      .then(({ appointments }) => setAppointments(appointments || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { refetch() }, [refetch])

  return { appointments, loading, error, refetch }
}
