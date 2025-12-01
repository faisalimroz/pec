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

export const useSearchTollTraffic = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchTollTraffic', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/toll/collection/traffic/report/all/data',
        param
      )
      return data
    },
  })
}

export const useMonthlyTrafficReport = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('monthlyTrafficReport', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/toll/collection/traffic/monthly/report',
        param
      )
      return data
    },
  })
}

export const useManualMonthlyTrafficR = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('ManualMonthlyTrafficR', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/toll/kecmanual/get/monthly/report',
        param
      )
      return data
    },
  })
}

export const useVehicleDetectToll = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('vehicleDetectToll', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/vehicle-detect/search/all/data',
        param
      )
      return data
    },
  })
}

export const useEtcCard = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('etcCard', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/toll/collection/etc/card/report/all/data',
        param
      )
      return data
    },
  })
}

export const useTollOfToll = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('tollOfToll', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/toll/collection/traffic/monthly/graph/data',
        param
      )
      return data
    },
  })
}

export const useMonthlyRoster = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('monthlyRoster', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/toll/monthlyroaster/search/data',
        param
      )
      return data
    },
  })
}

export const useKecManual = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('kecManual', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/toll/kecmanual/get/search/data',
        param
      )
       console.log(data,'dfsdddfdfdff')
      return data
      
    },
  })
 
  
}
export const useShiftKecManual = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('shiftManual', param),
    queryFn: async () => {
      const { data } = await api.post(
        'api/v1/toll/shiftmanual/search/data',
        param
      )
      return data
    },
  })
  
}


// ------------- TanStack Query Funcs End ------------------------

export async function searchTOllCollectTraffic(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/collection/traffic/report/all/data`,
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

export async function searchGraphToll(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/collection/traffic/monthly/graph/data`,
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

export async function searchGraphManualMonthly(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/get/monthly/graph/data`,
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

export async function searchGraphManualYearly(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/get/graph/data`,
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




export async function searchEtcCard(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/collection/etc/card/report/all/data`,
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

export async function searchMonthlyTrafficReport(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/collection/traffic/monthly/report`,
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

export async function searchManualMonthlyTrafficR(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/kecmanual/get/monthly/report`,
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

export async function searchMonthlyTrafficGraph(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/collection/traffic/monthly/report/graph`,
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

// Special Audit APIs

export async function searchExemptionReport(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/special/exemption/report/all/data`,
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

export async function searchTopTenOrg(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/special/exemption/top/organization/data`,
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

export async function searchTopTenVehicle(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/special/exemption/top/vehicle/data`,
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

export async function searchTopTenAll(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/special/exemption/all/organization/data`,
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

export async function searchTopAll(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/special/exemption/vehicles`,
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
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/special/others/search/data`,
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

// training and others apis

export async function searchTrainingOthers(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/training/others/search/data`,
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

// monthly toll revenue

export async function searchMonthlyTollRev(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/monthly/revenue/search/data`,
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

export async function searchMonthlyRoster(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/monthlyroaster/search/data`,
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
export async function searchMainBridgeBills(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/main-bridge/data/search`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
console.log(response.data)
  return response.data
}

export async function searchVehicleDetectToll(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/vehicle-detect/search/all/data`,
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

export async function searchVehicleDetectLane(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/vehicle-detect/search/lane/data`,
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

export async function searchVehicleDetectVehicle(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/vehicle-detect/search/vehicle/data`,
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

export async function searchTollCollectModify(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/collection/traffic/vehicles`,
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

export async function searchEtcCardModify(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/collection/etc/card/vehicles`,
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

export async function searchExemptionModify(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/special/exemption/vehicles`,
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

export async function searchComparison(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/kecmanual/get/comparison/all/data`,
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

export async function searchKecManual(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/kecmanual/get/search/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
console.log(response.data,'fghfghf')
  return response.data
}
export async function searchShiftManual(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/shiftmanual/search/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
console.log(response.data,'fghfghf')
  return response.data
}

export async function searchTollTrafficVer(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/kecmanual/get/monthly/all/data`,
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


export async function searchDailyReport(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/daily-report/data/search`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  
  )
  console.log(response.data)
  return response.data
}

export async function searchEmployeeReport(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/employee-personal-profile/data/search`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
 console.log(response.data)
  return response.data
}

export async function searchHierarchy(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/hieararchy`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
 console.log(response.data)
  return response.data
}


export async function searchAllWimData(param: unknown) {
  //   console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/toll/all-wim-data/data/search`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
 console.log(response.data)
  return response.data
}


export async function getWimShiftStats(payload: {
  location?: string;
  date_range?: string; // "DD-MM-YYYY to DD-MM-YYYY"
  shiftNames?: string[]; // e.g. ["Shift: 1st","Shift: 2nd"]
}) {
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/v1/toll/limited-wim-data/stats/shift`,
    payload,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }
  );
  return res.data?.data ?? [];
}