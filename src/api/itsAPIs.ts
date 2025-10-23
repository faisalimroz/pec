import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

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

// ------------- TanStack Query Funcs End ------------------------
//organization

export async function searchOrganization(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/organization/data/search`,
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
//work plan
export async function searchWorkPlan(param: unknown) {
   // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/work-plan/data/search`,
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

// notice
export async function searchNotice(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/notice/data/search`,
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
//system configure
export async function searchSystemConfigure(param: unknown) {
 // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/system-configure/data/search`,
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
//  operation manual
export async function searchOperationManual(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/operation-manual/data/search`,
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

//Monthly Report
export async function searchMonthlyReport(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/monthly-report/data/search`,
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
