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

// hr apis

export async function searchMobilization(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/hr/mobilization/search/data`,
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

export async function searchStatusPersonnel(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/hr/employee-personal/status/personnel`,
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

  return response.data
}

export async function searchAttendanceManagement(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/hr/attendance/search/data`,
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

export async function searchInsuranceManagement(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/hr/insurance/search/data`,
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

export async function searchInsuranceManagementNew(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/hr/employee-personal/insurance/search/data`,
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

export async function searchInsuranceClaiming(param: unknown) {
  console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/hr/insurance-claiming/search/data`,
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

export async function searchSalaryManagement(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/hr/salary/search/data`,
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

export async function searchLeaveManagement(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/hr/leave/search/data`,
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

export async function searchWelfareManagement(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/hr/welfare/search/data`,
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

// clinic center apis

export async function searchMedicineRecord(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/clinic/medicine-record/search/data`,
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

  return response.data
}


// greetings apis

export async function searchGreetings(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/greetings/greetings/search/data`,
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

export async function searchStatusOfPersonnel(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/greetings/status-personeel/search/data`,
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

export async function searchRecruitment(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/greetings/recruitment/search/data`,
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

export async function searchApplicationOfEmployees(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/greetings/application/search/data`,
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

// general management apis

export async function searchCommodityManagement(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/general/commodity/search/data`,
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

export async function searchUtilityConsumption(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/general/unity/search/data`,
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

// labor management apis

export async function searchLaborManagement(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/labor-management/search/data`,
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

// salary apis

export async function searchSalary(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/salary/search/data`,
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

// other facilities apis

export async function searchAccommodationFacility(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/other/accommodation/search/data`,
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

export async function searchRestaurant(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/other/restaurant/search/data`,
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

// official letter api

export async function searchOfficialLetter(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/admin/an-official-letter/search/data`,
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

// asset management apis



// Admin Panel Apis

export async function searchTollCollector(param: unknown) {
  // console.log('param', param)

  const response = await axios.post(
    `${BASE_URL}/api/v1/auth/tc/get/all`,
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
