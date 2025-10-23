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
        '/api/v1/mb-pmis/procurement/data/search',
        param
      )
      return data
    },
  })
}

// ------------- TanStack Query Funcs End ------------------------

// rtw technical documentation

export async function searchMBTechDrawings(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/technical-documentation-drawing/data/search`,
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



export async function searchMBTechMaterialsList(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/technical-documentation-materials/data/search`,
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

export async function searchMBTechSurveyReport(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/technical-documentation-survey-report/data/search`,
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
export async function searchMBTechMaintenanceManual(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/technical-documentation-maintanence-manual/data/search`,
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
export async function searchMBTechOthers(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/technical-documentation-others/data/search`,
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
export async function searchMonitoring(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/monitoring-report/data/search`,
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

export async function searchMateiralTestReport(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/quality-material-test-report/data/search`,
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
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/quality-safety/data/search`,
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
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/letter-and-official-correspondence/search/data`,
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
export async function searchMeetingMinutes(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/communication-meeting-minutes/data/search`,
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

export async function searchMBBills(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/financial-bills/data/search`,
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
export async function searchMBPictures(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/visual-records/search/data`,
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
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/additional-notes-backup-frequency/data/search`,
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
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/additional-notes-control-manager/data/search`,
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
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/mb-pmis/additional-notes-revision-log/data/search`,
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