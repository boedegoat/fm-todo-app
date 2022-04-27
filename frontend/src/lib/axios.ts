import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api/'

export const request = axios.create({
  baseURL: API_BASE_URL,
})

export const authRequest = axios.create({
  baseURL: API_BASE_URL,
})

// axios middleware
// before sending the request, run this func first
authRequest.interceptors.request.use(
  (config) => {
    if (config.headers) {
      const token = localStorage.token
      if (!token) {
        throw new axios.Cancel('token not available')
      }
      config.headers['token'] = 'Bearer ' + token
    }
    return config
  },
  (err) => Promise.reject(err)
)
