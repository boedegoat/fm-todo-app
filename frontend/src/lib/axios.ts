import axios, { AxiosRequestConfig } from 'axios'
import { getToken, setToken } from 'context/Provider'
import Cookies from 'js-cookie'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api/'

let reqConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  withCredentials: true,
}

export const request = axios.create(reqConfig)
export const authRequest = axios.create(reqConfig)

// axios middleware
// before sending the request, run this func first
authRequest.interceptors.request.use(
  async (config) => {
    if (config.headers) {
      const { tokenLifespan } = Cookies.get()
      if (!tokenLifespan) {
        const { data } = await request.get('/auth/refreshToken')
        setToken(data.token)
      }
      config.headers['token'] = 'Bearer ' + getToken()
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
