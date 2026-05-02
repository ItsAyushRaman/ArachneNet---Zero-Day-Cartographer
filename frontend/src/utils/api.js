import axios from 'axios'

const DEFAULT_BACKEND_URL = 'http://localhost:8000'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL

const api = axios.create({
  baseURL: BACKEND_URL,
})

export const getBackendUrl = () => BACKEND_URL

export const getWebSocketUrl = (path = '/ws/live') => {
  const url = new URL(BACKEND_URL)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  url.pathname = path
  url.search = ''
  url.hash = ''
  return url.toString()
}

export const fetchThreats = async () => {
  const { data } = await api.get('/api/threats')
  return data
}

export const fetchThreatById = async (id) => {
  const { data } = await api.get(`/api/threats/${id}`)
  return data
}

export const generatePatch = async (threatId) => {
  const { data } = await api.post('/api/generate', { threat_id: threatId })
  return data
}

export const refreshThreats = async () => {
  const { data } = await api.post('/api/refresh')
  return data
}

export const fetchStatus = async () => {
  const { data } = await api.get('/api/status')
  return data
}

export default api
