import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api/'
export const request = axios.create({
  baseURL: API_BASE_URL,
})

// axios middleware
// before sending the request, run this func first
request.interceptors.request.use((config) => {
  if (config.headers) {
    const token = localStorage.token
    config.headers['token'] = 'Bearer ' + token
  }
  return config
})
