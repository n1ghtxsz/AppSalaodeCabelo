import { useState, useEffect } from 'react'
import { professionalService } from '../services/professionals'

export function useProfessionals() {
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)

  useEffect(() => {
    professionalService.list()
      .then(({ professionals }) => setProfessionals(professionals || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { professionals, loading, error }
}
