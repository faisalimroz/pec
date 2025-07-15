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

export const useDispatched = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchDispatched', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/edms/dispatched/search/data',
        param
      )
      return data
    },
  })
}

export const useReceived = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchReceived', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/edms/received/search/data',
        param
      )
      return data
    },
  })
}

export const useOthers = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchOthers', param),
    queryFn: async () => {
      const { data } = await api.post('api/v1/edms/others/search/data', param)
      return data
    },
  })
}

// normal apis

export async function searchDispatched(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/edms/dispatched/search/data`,
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

export async function searchReceived(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/edms/received/search/data`,
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

export async function searchOthers(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/edms/others/search/data`,
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
