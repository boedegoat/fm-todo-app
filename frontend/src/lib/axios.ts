import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api/'
export const request = () =>
  axios.create({
    baseURL: API_BASE_URL,
    headers: {
      token: 'Bearer ' + localStorage.token,
    },
  })
