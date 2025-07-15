import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import * as XLSX from 'xlsx'
import trailor from '@/assets/ai-assets/vehicles/trailor.svg'
import heavyTruck from '@/assets/ai-assets/vehicles/heavyTruck.svg'
import mediumTruck from '@/assets/ai-assets/vehicles/mediumTruck.svg'
import bus from '@/assets/ai-assets/vehicles/bus.svg'
import smallTruck from '@/assets/ai-assets/vehicles/smalltruck.svg'
import miniBus from '@/assets/ai-assets/vehicles/miniBus.svg'
import microBus from '@/assets/ai-assets/vehicles/microBus.svg'
import pickUp from '@/assets/ai-assets/vehicles/pickup.svg'
import sedan from '@/assets/ai-assets/vehicles/sedan.svg'
import motorBike from '@/assets/ai-assets/vehicles/motorBike.svg'
import redOval from '@/assets/ai-assets/svgs/redOval.svg'
import greenOval from '@/assets/ai-assets/svgs/greenOval.svg'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { useAuth } from '@/provider/authProvider'

type VehicleType =
  | 'trailer'
  | 'heavy_truck'
  | 'medium_truck'
  | 'bus'
  | 'small_truck'
  | 'mini_bus'
  | 'micro_bus'
  | 'four_wheeler'
  | 'private_car'
  | 'motor_cycle'

interface VehicleData {
  vehicle: VehicleType
  toDhaka: number
  toMawa: number
  wayTo: 'all' | 'toMawa' | 'toDhaka'
}

interface TotalVehicleData {
  totalVehicle: number
}

interface ExcelData {
  lane: number
  trailer: number
  heavy_truck: number
  medium_truck: number
  bus: number
  small_truck: number
  mini_bus: number
  micro_bus: number
  four_wheeler: number
  private_car: number
  motor_cycle: number
  shift: string
  totalVehicles: number
  totalAmount: number
}

type ApiResponse = (VehicleData | TotalVehicleData)[]
type Lane = { code: string | number; name: string }
type Shift = { code: string; name: string }

const vehicleIcons: Record<VehicleType, string> = {
  trailer: trailor,
  heavy_truck: heavyTruck,
  medium_truck: mediumTruck,
  bus: bus,
  small_truck: smallTruck,
  mini_bus: miniBus,
  micro_bus: microBus,
  four_wheeler: pickUp,
  private_car: sedan,
  motor_cycle: motorBike,
}

const vehicleNames: Record<VehicleType, string> = {
  trailer: 'Trailer',
  heavy_truck: 'Heavy Truck',
  medium_truck: 'Medium Truck',
  bus: 'Bus',
  small_truck: 'Small Truck',
  mini_bus: 'Mini Bus',
  micro_bus: 'Micro Bus',
  four_wheeler: 'Pickup / Four Wheeler',
  private_car: 'Private Car / Sedan',
  motor_cycle: 'Motorcycle',
}

const AllLanes: Lane[] = [
  { name: 'All', code: 'all' },
  { name: 'To Dhaka', code: 'toDhaka' },
  { name: 'To Mawa', code: 'toMawa' },
  { name: 'Lane 1', code: 1 },
  { name: 'Lane 2', code: 2 },
  { name: 'Lane 3', code: 3 },
  { name: 'Lane 4', code: 4 },
  { name: 'Lane 5', code: 5 },
  { name: 'Lane 6', code: 6 },
  { name: 'Lane 7', code: 7 },
  { name: 'Lane 8', code: 8 },
  { name: 'Lane 9', code: 9 },
  { name: 'Lane 10', code: 10 },
  { name: 'Lane 11', code: 11 },
  { name: 'Lane 12', code: 12 },
]

const AllShifts: Shift[] = [
  { name: 'All Shifts', code: 'all' },
  { name: '12 AM - 08 AM', code: '12 AM - 08 AM' },
  { name: '08 AM - 04 PM', code: '08 AM - 04 PM' },
  { name: '04 PM - 12 AM', code: '04 PM - 12 AM' },
]

// API functions
const fetchVehicleData = async (
  lane?: string | number
): Promise<ApiResponse> => {
  const body: { lane?: string | number; shift?: string } = {}

  if (lane === 'all') {
    body.shift = 'all'
  } else if (lane) {
    body.lane = lane
  }

  const response = await axios.post<ApiResponse>(
    `${import.meta.env.VITE_BASE_URL}/api/v1/its/vehicle-detect/get/today/data`,
    body
  )
  return response.data
}

const fetchExcelData = async (shift: string): Promise<ExcelData[]> => {
  const response = await axios.post<ExcelData[]>(
    `${import.meta.env.VITE_BASE_URL}/api/v1/its/vehicle-detect/get/monthly/exl/lane/data`,
    { shift }
  )
  return response.data
}

const TotalVehicle: React.FC = () => {
  const [selectedLane, setSelectedLane] = useState<Lane | null>(null)
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [isExporting, setIsExporting] = useState<boolean>(false)

  const { permissions } = useAuth()
  const aiDashboardPermission = permissions.find(
    (p) => p.name === 'ai-dashboard'
  )
  const dashboardPermission = aiDashboardPermission?.children.find(
    (c) => c.name === 'ai-dashboard'
  )

  const hasEditAccess = dashboardPermission?.edit_authority || false

  // TanStack Query for vehicle data
  const {
    data: apiData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['vehicleData', selectedLane?.code],
    queryFn: () => fetchVehicleData(selectedLane?.code),
    staleTime: 5 * 60 * 1000, // 5 minutes
    // refetchInterval: 30 * 1000,  // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  })

  // Process the API data
  const vehicleData =
    apiData?.filter((item): item is VehicleData => 'vehicle' in item) || []
  const totalVehicles =
    apiData?.find((item): item is TotalVehicleData => 'totalVehicle' in item)
      ?.totalVehicle || 0

  const formatColumnName = (name: string): string => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const exportToExcel = async () => {
    if (!hasEditAccess) return

    setIsExporting(true)
    try {
      const shift = selectedShift?.code ?? 'all'
      const excelData = await fetchExcelData(shift)

      const formattedData = excelData.map((row) => {
        const newRow: { [key: string]: any } = {}
        Object.entries(row).forEach(([key, value]) => {
          newRow[formatColumnName(key)] = value
        })
        return newRow
      })

      const worksheet = XLSX.utils.json_to_sheet(formattedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Data')

      // Generating Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })
      const data = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      // Save the file
      const fileName = `monthly_vehicle_data_${new Date().toISOString().split('T')[0]}.xlsx`
      // @ts-ignore
      if (navigator.msSaveBlob) {
        // For IE and Edge browsers
        // @ts-ignore
        navigator.msSaveBlob(data, fileName)
      } else {
        // For other browsers
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(data)
        link.download = fileName
        link.click()
      }
    } catch (error) {
      console.error('Error exporting data:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleLaneChange = (lane: Lane | null) => {
    setSelectedLane(lane)
    // No need to manually refetch - TanStack Query will handle this automatically
  }

  return (
    <div className='space-y-4'>
      <div>
        <div className='p-3 bg-[#283751] rounded-t-xl flex flex-col justify-between items-center'>
          <h1 className='text-sm font-semibold text-white uppercase'>
            total vehicle passing today {totalVehicles}
          </h1>

          <div className='my-4 flex items-center gap-6'>
            <Dropdown
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.value)}
              options={AllShifts}
              optionLabel='name'
              placeholder='Select Shift'
              className='w-fit text-xs'
            />
            {hasEditAccess && (
              <Button
                label='Export'
                icon='pi pi-download'
                onClick={exportToExcel}
                loading={isExporting}
                disabled={isExporting}
                className='bg-transparent border-gray-500 text-white px-2 py-2'
              />
            )}
          </div>
        </div>
      </div>

      <div className='bg-white p-3 flex items-center gap-6 justify-between rounded-[12px]'>
        <div className='bg-white p-3 flex items-center gap-6 justify-center text-xs'>
          <div className='flex items-center gap-2 font-semibold'>
            <img src={redOval} alt='' />
            <h1>To Dhaka</h1>
          </div>

          <div className='flex items-center gap-2 font-semibold'>
            <img src={greenOval} alt='' />
            <h1>To Mawa</h1>
          </div>
        </div>

        <div>
          <Dropdown
            value={selectedLane}
            onChange={(e) => handleLaneChange(e.value)}
            options={AllLanes}
            optionLabel='name'
            placeholder='Select Lane'
            className='w-fit'
            checkmark={true}
            highlightOnSelect={false}
            showClear
          />
        </div>
      </div>

      <div className='space-y-[37px]'>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center py-10 bg-white rounded-md'>
            <div className='w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin'></div>
            <p className='mt-4 text-gray-600'>Loading vehicle data...</p>
          </div>
        ) : error ? (
          <div className='flex flex-col items-center justify-center py-10 bg-white rounded-md'>
            <p className='text-red-600 mb-4'>Error loading vehicle data</p>
            <Button
              label='Retry'
              icon='pi pi-refresh'
              onClick={() => refetch()}
              className='bg-blue-500 text-white px-4 py-2'
            />
          </div>
        ) : vehicleData.length === 0 ? (
          <div className='flex items-center justify-center py-10 bg-white'>
            <p className='text-gray-600'>No vehicle data available</p>
          </div>
        ) : (
          vehicleData.map((item) => (
            <div
              key={item.vehicle}
              className='bg-white flex items-center gap-6 justify-between pl-3'
            >
              <div className='flex gap-4 font-semibold text-xl'>
                <img src={vehicleIcons[item.vehicle]} alt={item.vehicle} />
                <h1 className='text-sm'>{vehicleNames[item.vehicle]}</h1>
              </div>

              <div className='flex items-center gap-2 font-semibold'>
                {item.wayTo === 'all' && (
                  <>
                    <h1 className='p-6 bg-red-400/70 h-16 w-16 flex items-center justify-center'>
                      {item.toDhaka}
                    </h1>
                    <h1 className='p-6 bg-green-400/70 h-16 w-16 flex items-center justify-center'>
                      {item.toMawa}
                    </h1>
                  </>
                )}
                {item.wayTo === 'toDhaka' && (
                  <h1 className='p-6 bg-red-400/70 h-16 w-16 flex items-center justify-center'>
                    {item.toDhaka}
                  </h1>
                )}
                {item.wayTo === 'toMawa' && (
                  <h1 className='p-6 bg-green-400/70 h-16 w-16 flex items-center justify-center'>
                    {item.toMawa}
                  </h1>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TotalVehicle
