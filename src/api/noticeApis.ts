import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

const token = localStorage.getItem('token')

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add an interceptor to include the token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Helper function to create a query key
const createQueryKey = (endpoint: string, param: unknown) => [endpoint, param]

// --------------- TanStack Query Funcs Start ------------------

export const useSearchNotice = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchST', param),
    queryFn: async () => {
      const { data } = await api.post('/api/v1/admin/notice/search/data', param)
      return data
    },
  })
}

export const useSearchUserLog = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchUserLog', param),
    queryFn: async () => {
      const { data } = await api.post('/api/v1/logs/search/all/data', param)
      return data
    },
  })
}

// --------------- TanStack Query Funcs End ------------------

export async function searchNotice(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/notice/search/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data
}

export async function searchUserLog(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/logs/search/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data
}
