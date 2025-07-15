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

export const useSearchItsStaffSummary = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchItsStaffSummary', param),
    queryFn: async () => {
      const { data } = await api.post('/api/v1/its/staff/all/data', param)
      return data
    },
  })
}

export const useSearchItsDutyRoster = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchItsDutyRoster', param),
    queryFn: async () => {
      const { data } = await api.post('/api/v1/its/duty-roster/all/data', param)
      return data
    },
  })
}

export const useRhd = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchItsRhd', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/official-letter/rhd/all/data',
        param
      )
      return data
    },
  })
}

export const useOlMisc = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchOlMisc', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/official-letter/miscellaneous/all/data',
        param
      )
      return data
    },
  })
}

export const useProcurementQuotation = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchProQuot', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/procurement/quotation/all/data',
        param
      )
      return data
    },
  })
}

export const useProcurementWO = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchProWO', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/procurement/working/all/data',
        param
      )
      return data
    },
  })
}

export const useProcurementInvoice = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchProInvoice', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/procurement/invoice/all/data',
        param
      )
      return data
    },
  })
}

export const useProcurementRequisition = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchProRequisition', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/procurement/requisition/all/data',
        param
      )
      return data
    },
  })
}

export const useProcurementPaidService = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchProPaidService', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/procurement/paidservice/all/data',
        param
      )
      return data
    },
  })
}

export const useTrainingManual = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchTrainingManual', param),
    queryFn: async () => {
      const { data } = await api.post('/api/v1/its/traning/all/data', param)
      return data
    },
  })
}

export const useWarrantyCP = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchWarrantyCP', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/warranty/claim/all/data',
        param
      )
      return data
    },
  })
}

export const useWarrantyPL = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchWarrantyPL', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/warranty/product/all/data',
        param
      )
      return data
    },
  })
}

// ------------- Diagram Apis --------------
export const useDiagramNetwork = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchDiagramNetwork', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/diagram/its/network/all/data',
        param
      )
      return data
    },
  })
}

export const useDiagramTollPlaza = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchDiagramTollPlaza', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/diagram/its/toll-plaza/all/data',
        param
      )
      return data
    },
  })
}

export const useDiagramExpressway = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchDiagramExpressway', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/diagram/its/expressway/all/data',
        param
      )
      return data
    },
  })
}

export const useDiagramMisc = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchDiagramMisc', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/diagram/its/miscellaneous/all/data',
        param
      )
      return data
    },
  })
}

export const useDiagramElecTP = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchDiagramElecTP', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/diagram/electricity/toll-plaza/all/data',
        param
      )
      return data
    },
  })
}

export const useDiagramElecOffice = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchDiagramElecOffice', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/diagram/electricity/office/all/data',
        param
      )
      return data
    },
  })
}

export const useDiagramElecTC = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchDiagramElecTC', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/diagram/electricity/toll-camp/all/data',
        param
      )
      return data
    },
  })
}

export const useDiagramElecAlarm = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchDiagramElecAlarm', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/diagram/electricity/alarm/all/data',
        param
      )
      return data
    },
  })
}

export const useDiagramElecExp = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchDiagramElecExp', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/diagram/electricity/expressway/all/data',
        param
      )
      return data
    },
  })
}

export const useDiagramElecMisc = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchDiagramElecMisc', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/diagram/electricity/miscellaneous/all/data',
        param
      )
      return data
    },
  })
}

export const useInventoryEquip = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchInventoryEquip', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/inventory/electricity/equipment/all/data',
        param
      )
      return data
    },
  })
}

export const useInventorySP = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchInventorySP', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/inventory/electricity/spare/all/data',
        param
      )
      return data
    },
  })
}

export const useInventoryTools = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchInventoryTools', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/inventory/electricity/tool/all/data',
        param
      )
      return data
    },
  })
}

export const useInventoryStationary = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchInventoryStationary', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/inventory/electricity/stationary/all/data',
        param
      )
      return data
    },
  })
}

export const useInventoryItsEquip = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchInventoryItsEquip', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/inventory/its/equipment/all/data',
        param
      )
      return data
    },
  })
}

export const useInventoryItsSP = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchInventoryItsSP', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/inventory/its/spare/all/data',
        param
      )
      return data
    },
  })
}

export const useInventoryItsTools = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchInventoryItsTools', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/inventory/its/tool/all/data',
        param
      )
      return data
    },
  })
}

export const useInventoryItsStationary = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchInventoryItsStationary', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/inventory/its/stationary/all/data',
        param
      )
      return data
    },
  })
}

export const useOnmElecAfter = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchOnmElecAF', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/om-activates/electricity/after/all/data',
        param
      )
      return data
    },
  })
}

export const useOnmElecGeneral = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchOnmElecGeneral', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/om-activates/electricity/general/all/data',
        param
      )
      return data
    },
  })
}

export const useOnmElecPreventive = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchOnmElecPreventive', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/om-activates/electricity/preventive/all/data',
        param
      )
      return data
    },
  })
}

export const useOnmElecWorking = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchOnmElecWorking', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/om-activates/electricity/working/all/data',
        param
      )
      return data
    },
  })
}

export const useOnmElecImplement = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchOnmElecImplement', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/om-activates/electricity/implementation/all/data',
        param
      )
      return data
    },
  })
}

export const useOnmAM = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchOnmAM', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/om-activates/its/after/all/data',
        param
      )
      return data
    },
  })
}

export const useOnmGeneral = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchGeneral', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/om-activates/its/general/all/data',
        param
      )
      return data
    },
  })
}

export const useOnmPM = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchPM', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/om-activates/its/preventive/all/data',
        param
      )
      return data
    },
  })
}

export const useOnmWorking = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchOnmWorking', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/om-activates/its/working/all/data',
        param
      )
      return data
    },
  })
}

export const useOnmImplementation = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchOnmImplementation', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/om-activates/its/implementation/all/data',
        param
      )
      return data
    },
  })
}

export const useToRhdIR = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchToRhdIR', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/report/to-rhd/incident-report/all/data',
        param
      )
      return data
    },
  })
}

export const useToRhdDaily = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchToRhdDaily', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/report/to-rhd/daily-report/all/data',
        param
      )
      return data
    },
  })
}

export const useReportDC = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchReportDC', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/report/monitoring/daily/all/data',
        param
      )
      return data
    },
  })
}

export const useReportNetwork = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchReportNetwork', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/report/monitoring/internet/all/data',
        param
      )
      return data
    },
  })
}

export const useReportAC = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchReportAC', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/report/monitoring/access-control/all/data',
        param
      )
      return data
    },
  })
}

export const useReportAttendance = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchReportAttendance', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/report/monitoring/attendance/all/data',
        param
      )
      return data
    },
  })
}

export const useReportTmc = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchReportTmc', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/report/monitoring/tmc/all/data',
        param
      )
      return data
    },
  })
}

export const useReportVmsPole = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchReportVmsPole', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/report/monitoring/vms-screen/all/data',
        param
      )
      return data
    },
  })
}

export const useReportTS = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchReportTS', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/report/monitoring/toll-system/all/data',
        param
      )
      return data
    },
  })
}

export const useReportTpTb = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchReportTpTb', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/report/monitoring/booth/all/data',
        param
      )
      return data
    },
  })
}

export const useReportMisc = (param: unknown) => {
  return useQuery({
    queryKey: createQueryKey('searchReportMisc', param),
    queryFn: async () => {
      const { data } = await api.post(
        '/api/v1/its/report/monitoring/miscellaneous/all/data',
        param
      )
      return data
    },
  })
}

// ------------- TanStack Query Funcs End ------------------------

export async function searchItsStaffSummary(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/staff/all/data`,
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

export async function searchItsDutyRoster(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/duty-roster/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function searchOfficialRhdData(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/official-letter/rhd/all/data`,
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

export async function searchOfficialMiscellaneous(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/official-letter/miscellaneous/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function procurementQuotation(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/procurement/quotation/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function procurementWorkingOrder(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/procurement/working/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function procurementInvoice(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/procurement/invoice/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function procurementRequisition(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/procurement/requisition/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function procurementPaidService(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/procurement/paidservice/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function trainingApi(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/traning/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function warrantyClaimReport(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/warranty/claim/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function warrantyProductReport(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/warranty/product/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

//Diagram Part Started...................................

///===================Diagram ITS Part Started=======================

export async function DiagramItsNetwork(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/diagram/its/network/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function DiagramItsTollPlaza(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/diagram/its/toll-plaza/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function DiagramItsExpressway(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/diagram/its/expressway/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function DiagramItsMiscellaneous(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/diagram/its/miscellaneous/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

//====================Diagram Electricity Part =======================

export async function DiagramElectricityTollPlaza(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/diagram/electricity/toll-plaza/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function DiagramElectricityOffice(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/diagram/electricity/office/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function DiagramElectricityTollCamp(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/diagram/electricity/toll-camp/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function DiagramElectricityAlarm(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/diagram/electricity/alarm/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function DiagramElectricityExpressway(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/diagram/electricity/expressway/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function DiagramElectricityMiscellaneous(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/diagram/electricity/miscellaneous/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}
//Diagram Part End........................................

//Inventory Part Starting................................

///==========Inventory Electricity Part========================
export async function InventoryElectricityEquip(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/inventory/electricity/equipment/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function InventoryElectricitySaprePart(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/inventory/electricity/spare/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function InventoryElectricityTool(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/inventory/electricity/tool/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function InventoryElectricityStationary(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/inventory/electricity/stationary/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

///=====================Inventory ITS Part======================
export async function InventoryItsEquip(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/inventory/its/equipment/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function InventoryItsSaprePart(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/inventory/its/spare/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function InventoryItsTool(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/inventory/its/tool/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function InventoryItsStationary(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/inventory/its/stationary/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

//Inventory Part End

//O&M Activates Part Start

//==============Electricity=====================
export async function OmElecAfter(param: unknown) {
  // console.log(param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/om-activates/electricity/after/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function OmElecGeneral(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/om-activates/electricity/general/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function OmElecPreventive(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/om-activates/electricity/preventive/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function OmElecWorking(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/om-activates/electricity/working/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function OmElecImplementation(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/om-activates/electricity/implementation/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

//==============ITS=====================
export async function OmItsAfter(param: unknown) {
  console.log(param)
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/om-activates/its/after/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function OmItsGeneral(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/om-activates/its/general/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function OmItsPreventive(param: unknown) {
  // console.log(param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/om-activates/its/preventive/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function OmItsWorking(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/om-activates/its/working/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function OmItsImplementation(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/om-activates/its/implementation/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

//O&M Activities End.........................................

//////Report Api Start.........................................

///===============Monitoring============================

export async function MonitoringDaily(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/monitoring/daily/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function MonitoringInternet(param: unknown) {
  console.log(param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/monitoring/internet/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function MonitoringAccessControll(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/monitoring/access-control/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function MonitoringAttendance(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/monitoring/attendance/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function MonitoringTmc(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/monitoring/tmc/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function MonitoringVmc(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/monitoring/vms-screen/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function MonitoringToll(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/monitoring/toll-system/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function MonitoringBooth(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/monitoring/booth/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function MonitoringMiscellaneous(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/monitoring/miscellaneous/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function toRhdMonthly(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/to-rhd/monthly-report/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function toRhdDaily(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/to-rhd/daily-report/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function toRhdYearly(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/to-rhd/yearly-report/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}

export async function toRhdIncident(param: unknown) {
  const response = await axios.post(
    `${BASE_URL}/api/v1/its/report/to-rhd/incident-report/all/data`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log('dataaaaaaaaaaaaaaaaaaaa===', response.data)
  return response.data
}
