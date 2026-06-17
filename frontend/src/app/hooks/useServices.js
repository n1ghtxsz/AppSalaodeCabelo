import { useState, useEffect } from 'react'
import { serviceService } from '../services/services'

export function useServices() {
  const [services, setServices]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    serviceService.list()
      .then(({ services, categories }) => {
        setServices(services || [])
        setCategories(categories || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { services, categories, loading, error }
}
