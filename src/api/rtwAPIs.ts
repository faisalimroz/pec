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

export const useProcurement = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchFinanceProcurement', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/road-traffic/procurement/data/search',
        param
      )
      return data
    },
  })
}

// ------------- TanStack Query Funcs End ------------------------

// rtw technical documentation

export async function searchRtwDrawings(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/road-traffic/rhd-letter/data/search`,
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



export async function searchMaterialsList(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/quality-material-test-report/data/search`,
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

export async function searchSurveyReport(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/technical-documentation-survey-report/data/search`,
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
export async function searchTechMaintenanceManual(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/technical-documentation-maintanence-manual/data/search`,
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
// monitoring and reporting
export async function searchDailyWaterLevelReport(param: unknown) {


  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/daily-water-level-report/data/search`,
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
export async function searchRTWMonitoringMonthlyReport(param: unknown) {
 

  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/monitoring-monthly-report/data/search`,
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
export async function searchRTWTechDrawing(param: unknown) {
  
  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/technical-documentation-drawing/data/search`,
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


export async function searchTechMateiralTestReport(param: unknown) {


  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/technical-documentation-materials/data/search`,
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
// quality safety apis
export async function searcQualityhMateiralTestReport(param: unknown) {


  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/quality-material-test-report/data/search`,
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
export async function searchSafety(param: unknown) {
  

  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/quality-safety/data/search`,
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
// communication and correspondense
export async function searchOfficialLetters(param: unknown) {
  

  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/letter-and-official-correspondence/search/data`,
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
export async function searchMeetingMinutes(param: unknown) {


  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/meeting-minutes/data/search`,
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
// financial documentation apis

export async function searchRtwBills(param: unknown) {
  
  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/rtw-bills/data/search`,
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
//visual records
export async function searchPictures(param: unknown) {
  

  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/visual-records/search/data`,
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

// additional notes apis

export async function searchBackupFrequency(param: unknown) {


  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/additional-notes-backup-frequency/data/search`,
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

export async function searchDocumentControlManager(param: unknown) {


  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/additional-notes-control-manager/data/search`,
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

export async function searchDocumentRevisionLog(param: unknown) {


  const response = await axios.post(
    `${BASE_URL}/api/v1/rtw/additional-notes-revision-log/data/search`,
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