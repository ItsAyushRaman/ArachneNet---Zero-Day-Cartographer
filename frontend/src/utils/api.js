import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

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
