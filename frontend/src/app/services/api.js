import axios from 'axios'

let _token = null

export const setAccessToken = (token) => {
  _token = token
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach in-memory token to every request
api.interceptors.request.use((config) => {
  if (_token) config.headers.Authorization = `Bearer ${_token}`
  return config
})

// Global error handling
api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (!navigator.onLine)
      return Promise.reject(new Error('Sem conexão com a internet.'))

    if (error.response?.status === 401) {
      setAccessToken(null)
      window.dispatchEvent(new Event('auth:unauthorized'))
      return Promise.reject(new Error('Sessão expirada. Faça login novamente.'))
    }

    if (error.response?.status === 429)
      return Promise.reject(new Error('Muitas tentativas. Aguarde alguns minutos.'))

    if (error.response?.status === 423)
      return Promise.reject(new Error('Conta temporariamente bloqueada.'))

    if (error.code === 'ECONNABORTED')
      return Promise.reject(new Error('Tempo limite excedido. Tente novamente.'))

    const msg = error.response?.data?.error || error.response?.data?.message
    return Promise.reject(new Error(msg || 'Erro inesperado.'))
  }
)
