import axios from 'axios'

export const api = axios.create({
  baseURL: '/api'
})

export const OverlaysAPI = {
  list: () => api.get('/overlays').then(r => r.data),
  create: (payload) => api.post('/overlays', payload).then(r => r.data),
  update: (id, payload) => api.patch(`/overlays/${id}`, payload).then(r => r.data),
  remove: (id) => api.delete(`/overlays/${id}`).then(r => r.data)
}

export const SettingsAPI = {
  get: () => api.get('/settings').then(r => r.data),
  save: (payload) => api.patch('/settings', payload).then(r => r.data)
}
