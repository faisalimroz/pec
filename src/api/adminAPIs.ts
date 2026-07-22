import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

const token = localStorage.getItem('token')


//vehicle apis
export async function searchVehicleMgtRecord(param: unknown) {
  console.log('paramss', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/vehicle-mgt-record/data/search`,
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

//building report
export async function searchBuildingMonthlyReport(param: unknown) {
  console.log('paramss', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/building/monthly-maintenance/data/search`,
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
export async function searchBuildingToolsReport(param: unknown) {
  console.log('paramss', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/building/tools/data/search`,
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


//letter attachment
export async function searchLetterAttachmentIncoming(param: unknown) {
  console.log('paramss', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/letter-attachment/incoming/data/search`,
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

export async function searchLetterAttachmentOutgoing(param: unknown) {
  console.log('paramss', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/letter-attachment/outgoing/data/search`,
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
//asset management
export async function searchAssetManagement(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/asset-management/data/search`,
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

//medicine inout record
export async function searchMedicineInOutRecord(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/healthcare/medicine-in-out/data/search`,
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
//monthly report
export async function searchHealthcenterMonthlyReport(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/healthcare/monthly-report/data/search`,
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


// planning apis

export async function searchBusinessReport(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/plan/business/search/data`,
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


//vehicle apis

export async function searchMeetingReport(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/plan/meeting/search/data`,
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

export async function searchMonthlyReport(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/plan/monthly/search/data`,
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
export async function searchMedicalEquipment(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/healthcare/medicine-equipment-record/data/search`,
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

export async function searchGardeningTools(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/gardening/tools/data/search`,
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
//fire mgt
export async function searchFireMgt(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/fire/tools/data/search`,
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
//fire mgt
export async function searchFireMgtMonthlyReport(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/fire/monthly-activity/data/search`,
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

//it electronics
export async function searchITMonthlyReport(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/it-electronics/monthly-report/data/search`,
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
//it tools
export async function searchITTools(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/it-electronics/tools/data/search`,
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
//security monthly report
export async function searchSecurityMonthlyReport(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/security/monthly-report/data/search`,
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
//security tools
export async function searchSecurityTools(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/security/tools/data/search`,
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

//finance monthly ipc
export async function searchIpcMonthlyUpdates(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/finance/monthly-ipc/data/search`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
console.log(response.data,'ipcc')
  return response.data
}

//finance ipc records
export async function searchIpcRecords(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/finance/ipc-record/data/search`,
    param,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
console.log(response.data,'ipc records')
  return response.data
}
export async function searchMonthlyRoster(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/plan/monthly-roster//search/data`,
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
export async function searchGardeningMonthlyActivity(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/gardening/monthly-activity/data/search`,
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
export async function searchEmployeePersonalProfile(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/hr/employee-personal/search/data`,
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

//road and traffic
//monthly report 

export async function searchRTMonthlyReport(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/road-traffic/monthly-report/search/data`,
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
//monthly roster
export async function searchRTMonthlyRoaster(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/road-traffic/monthly-roaster/search/data`,
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
//kec letter
export async function searchRTKec(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/road-traffic/kecletters/data/search`,
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

//road and maintenance
//requisition form

export async function searchRTMRequisitionForm(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/road-traffic/requisition-forms/data/search`,
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

//accident
export async function searchRTMAccident(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/road-traffic/accidentreport/data/search`,
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
//completion from
export async function searchRTMCompletionForm(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/road-traffic/completion-forms/data/search`,
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
//reciving materials
export async function searchRTMRecivingMaterials(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/road-traffic/reciving-materials/data/search`,
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
//inspection report
export async function searchRTMInspectionReport(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/road-traffic/inspectionreport/data/search`,
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
//letter attachment
export async function searchRTMLetterAttachment(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/road-traffic/letterattachment/data/search`,
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
//drawing
export async function searchRTMDrawing(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/road-traffic/drawings/data/search`,
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
//miscellaneous
export async function searchRTMMiscellaneous(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/road-traffic/miscellaneous/data/search`,
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














export async function searchTreatmentRecord(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/clinic/treatment-record/search/data`,
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
