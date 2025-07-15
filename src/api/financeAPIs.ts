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

export const useRhdBillExl = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchRhdBillExl', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/rhd-exl/bill-details/all/data',
        param
      )
      return data
    },
  })
}

export const useMaintainIpcPdf = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchMaintainIpcPdf', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/ipc-maintain/pdf/all/data',
        param
      )
      return data
    },
  })
}

export const useMonthlyIpcPs = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchMonthlyIpcPs', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/monthly-ipc/ps-data/all/data',
        param
      )
      return data
    },
  })
}

export const useMonthlyInvoiceRecord = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchMir', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/invoice/excel/monthly/all/data',
        param
      )
      return data
    },
  })
}

export const useMonthlySalarySheet = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchMSS', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/salary/monthly-sheet/all/data',
        param
      )
      return data
    },
  })
}

export const useMonthlyPitSheet = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchPitSheet', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/pit/monthly-sheet/all/data',
        param
      )
      return data
    },
  })
}

export const useTollMoneyForCash = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchTMC', param),
    queryFn: async () => {
      const { data } = await api.post('/api/v1/tollcash/money/all/data', param)
      return data
    },
  })
}

export const useTollMoneyForRfid = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchTMRFID', param),
    queryFn: async () => {
      const { data } = await api.post('/api/v1/toll/money-rfid/all/data', param)
      return data
    },
  })
}

export const useFinanceProcurement = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchFinanceProcurement', param),
    queryFn: async () => {
      const { data } = await api.post('/api/v1/procurement/all/data', param)
      return data
    },
  })
}

// ------------- TanStack Query Funcs End ------------------------

export async function searchMonthlyInvoiceExl(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/invoice/excel/monthly/all/data`,
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

export async function searchMonthlyInvoicePdf(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/invoice/pdf/monthly/all/data`,
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

export async function searchTollMoneyForCashExl(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/tollcash/money/all/data`,
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

export async function searchTollMoneyForCashPdf(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/tollcash/pdf/money-cash/all/data`,
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

export async function searchTollMoneyForRfidExl(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/money-rfid/all/data`,
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

export async function searchTollMoneyForRfidPdf(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/pdf/money-rfid/all/data`,
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

export async function searchMonthlySalary(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/salary/monthly-sheet/all/data`,
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

export async function searchMonthlyPit(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/pit/monthly-sheet/all/data`,
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

export async function searchRhdBillExcel(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/rhd-exl/bill-details/all/data`,
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

export async function searchRhdBillPdf(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/rhd-pdf/bill-details/all/data`,
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

export async function searchMaintainIpcPdf(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/ipc-maintain/pdf/all/data`,
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

export async function searchMonthlyIpcPs(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/monthly-ipc/ps-data/all/data`,
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

export async function searchProcurement(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/procurement/all/data`,
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
