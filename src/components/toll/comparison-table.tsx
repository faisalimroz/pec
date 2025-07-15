import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'
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
import { searchComparison } from '@/api/tollApi'
import { Calendar } from 'primereact/calendar'
import RefreshButton from '@/components/refresh-button'
import { Toolbar } from 'primereact/toolbar'
import { useAuth } from '@/provider/authProvider'

interface VehicleData {
  lane: string
  type: string
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
  totalVehicles: number
}

export default function VehicleComparison() {
  const [data, setData] = useState<VehicleData[]>([])
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(null)
  const [selectedLane, setSelectedLane] = useState(null)
  const [selectedShift, setSelectedShift] = useState(null)
  const dt = useRef<DataTable<VehicleData[]>>(null)

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'toll-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'comparison'
  )

  const hasEditAccess = checkPermission?.edit_authority || false

  const calculateTotalVehicles = (dataObj: any) => {
    return (
      (dataObj.trailer || 0) +
      (dataObj.heavy_truck || 0) +
      (dataObj.medium_truck || 0) +
      (dataObj.bus || 0) +
      (dataObj.small_truck || 0) +
      (dataObj.mini_bus || 0) +
      (dataObj.micro_bus || 0) +
      (dataObj.four_wheeler || 0) +
      (dataObj.private_car || 0) +
      (dataObj.motor_cycle || 0)
    )
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const initialPayload = {
        data: '',
        lane: '',
        shift: '',
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/get/comparison/all/data`,
        initialPayload
      )

      const rData = response.data?.data
      setDate(response.data?.date)

      console.log('data', rData)

      const transformedData = rData.flatMap((item: any, index: number) => {
        const laneNumber = item.lane
        return [
          {
            ...item.aiData,
            type: 'AI CCTV',
            lane: laneNumber,
            totalVehicles: calculateTotalVehicles(item.aiData),
          },
          {
            ...item.kecData,
            type: 'RHD',
            lane: laneNumber,
            totalVehicles: calculateTotalVehicles(item.kecData),
          },
          {
            ...item.difference,
            type: 'DIFFERENCE',
            lane: laneNumber,
            totalVehicles: calculateTotalVehicles(item.difference),
          },
        ]
      })

      setData(transformedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const exportCSV = () => {
    dt.current?.exportCSV()
  }

  const rightToolbarTemplate = () => {
    return (
      <div className='space-x-2'>
        {hasEditAccess && (
          <button
            className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
            onClick={exportCSV}
          >
            Download Files
          </button>
        )}
        <RefreshButton className='text-base ml-2' onClick={handleReset} />
      </div>
    )
  }

  const rowClassName = (data: VehicleData) => {
    switch (data.type) {
      case 'AI CCTV':
        return 'bg-red-50'
      case 'RHD':
        return 'bg-blue-50'
      default:
        return ''
    }
  }

  const vehicleHeaderTemplate = (image: string, label: string) => (
    <div className='flex flex-col items-center gap-1'>
      <img src={image} alt={label} className='h-8 w-8' />
      <span className='text-xs whitespace-nowrap'>{label}</span>
    </div>
  )

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header='Lane No' rowSpan={2} className='w-16 text-center' />
        <Column header='Data' rowSpan={2} className='w-24 text-center' />
        <Column
          header={vehicleHeaderTemplate(trailor, 'Trailer')}
          className='w-20 text-center'
        />
        <Column
          header={vehicleHeaderTemplate(heavyTruck, 'Heavy Truck')}
          className='w-20 text-center'
        />
        <Column
          header={vehicleHeaderTemplate(mediumTruck, 'Medium Truck')}
          className='w-20 text-center'
        />
        <Column
          header={vehicleHeaderTemplate(bus, 'Bus')}
          className='w-20 text-center'
        />
        <Column
          header={vehicleHeaderTemplate(smallTruck, 'Small Truck')}
          className='w-20 text-center'
        />
        <Column
          header={vehicleHeaderTemplate(miniBus, 'Mini Bus')}
          className='w-20 text-center'
        />
        <Column
          header={vehicleHeaderTemplate(microBus, 'Micro Bus')}
          className='w-20 text-center'
        />
        <Column
          header={vehicleHeaderTemplate(pickUp, 'Four Wheeler')}
          className='w-20 text-center'
        />
        <Column
          header={vehicleHeaderTemplate(sedan, 'Private Car')}
          className='w-20 text-center'
        />
        <Column
          header={vehicleHeaderTemplate(motorBike, 'Motor Cycle')}
          className='w-20 text-center'
        />
        <Column
          header='Total'
          rowSpan={2}
          className='w-20 text-center font-bold'
        />
      </Row>
    </ColumnGroup>
  )

  const lanes = [
    { label: 'Lane 1', value: 1 },
    { label: 'Lane 2', value: 2 },
    { label: 'Lane 3', value: 3 },
    { label: 'Lane 4', value: 4 },
    { label: 'Lane 5', value: 5 },
    { label: 'Lane 6', value: 6 },
    { label: 'Lane 7', value: 7 },
    { label: 'Lane 8', value: 8 },
    { label: 'Lane 9', value: 9 },
    { label: 'Lane 10', value: 10 },
    { label: 'Lane 11', value: 11 },
    { label: 'Lane 12', value: 12 },
  ]

  const shifts = [
    { label: '12 AM - 08 AM', value: '12 AM - 08 AM' },
    { label: '08 AM - 04 PM', value: '08 AM - 04 PM' },
    { label: '04 PM - 12 AM', value: '04 PM - 12 AM' },
  ]

  function formatDate(dateTime?: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      date: date ? formatDate(date) : '',
      // @ts-ignore
      lane: selectedLane || '',
      // @ts-ignore
      shift: selectedShift || '',
    }

    searchComparison(initialPayload).then((result) => {
      const rData = result?.data

      const transformedData = rData.flatMap((item: any, index: number) => {
        const laneNumber = item.lane
        return [
          {
            ...item.aiData,
            type: 'AI CCTV',
            lane: laneNumber,
            totalVehicles: calculateTotalVehicles(item.aiData),
          },
          {
            ...item.kecData,
            type: 'RHD',
            lane: laneNumber,
            totalVehicles: calculateTotalVehicles(item.kecData),
          },
          {
            ...item.difference,
            type: 'DIFFERENCE',
            lane: laneNumber,
            totalVehicles: calculateTotalVehicles(item.difference),
          },
        ]
      })

      setData(transformedData)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      date: '',
      lane: '',
      shift: '',
    }

    setDate(null)
    setSelectedLane(null)
    setSelectedShift(null)
    searchComparison(initialPayload).then((result) => {
      const rData = result?.data

      const transformedData = rData.flatMap((item: any, index: number) => {
        const laneNumber = item.lane
        return [
          {
            ...item.aiData,
            type: 'AI CCTV',
            lane: laneNumber,
            totalVehicles: calculateTotalVehicles(item.aiData),
          },
          {
            ...item.kecData,
            type: 'RHD',
            lane: laneNumber,
            totalVehicles: calculateTotalVehicles(item.kecData),
          },
          {
            ...item.difference,
            type: 'DIFFERENCE',
            lane: laneNumber,
            totalVehicles: calculateTotalVehicles(item.difference),
          },
        ]
      })

      setData(transformedData)
      setLoading(false)
    })
  }

  // console.log(data)

  const filterSearchForm = (
    <>
      <div className='flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white'>
        <div>
          <Calendar
            // @ts-ignore
            value={date}
            // @ts-ignore
            onChange={(e) => setDate(e.value)}
            inputClassName='border-none rounded-none cursor-pointer focus:ring-0 bg-transparent'
            placeholder='By Date'
          />
        </div>

        <div>
          <Dropdown
            value={selectedLane}
            onChange={(e) => setSelectedLane(e.value)}
            options={lanes}
            placeholder='By Lane'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
          />
        </div>

        <div>
          <Dropdown
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.value)}
            options={shifts}
            placeholder='By Shift'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
          />
        </div>

        <div>
          <button
            onClick={() => handleSearch()}
            className='border bg-green-500 px-4 py-2.5 rounded-lg ml-4'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='white'
              className='size-6'
            >
              <path
                fillRule='evenodd'
                d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
      </div>
      <p className='text-center my-4'>Date - {date ? formatDate(date) : ''}</p>
    </>
  )

  // console.log(data)

  return (
    <div className='ml-4'>
      <Toolbar
        className='rounded-none border-none p-0 bg-white'
        right={rightToolbarTemplate}
      ></Toolbar>
      <div className='card'>
        <DataTable
          ref={dt}
          value={data}
          headerColumnGroup={headerGroup}
          rowClassName={rowClassName}
          showGridlines
          className='border'
          size='small'
          loading={loading}
          rowGroupMode='rowspan'
          groupRowsBy='lane'
          sortMode='single'
          sortField='lane'
          sortOrder={1}
          scrollable
          header={filterSearchForm}
          scrollHeight='600px'
        >
          <Column
            field='lane'
            header='Lane No'
            className='text-center'
            style={{ width: '8rem', verticalAlign: 'middle' }}
          />
          <Column
            field='type'
            header='Data'
            className='text-center'
            style={{ width: '6rem' }}
          />
          <Column
            field='trailer'
            className='text-center'
            style={{ width: '7rem' }}
          />
          <Column
            field='heavy_truck'
            className='text-center'
            style={{ width: '7rem' }}
          />
          <Column
            field='medium_truck'
            className='text-center'
            style={{ width: '7rem' }}
          />
          <Column
            field='bus'
            className='text-center'
            style={{ width: '7rem' }}
          />
          <Column
            field='small_truck'
            className='text-center'
            style={{ width: '7rem' }}
          />
          <Column
            field='mini_bus'
            className='text-center'
            style={{ width: '7rem' }}
          />
          <Column
            field='micro_bus'
            className='text-center'
            style={{ width: '7rem' }}
          />
          <Column
            field='four_wheeler'
            className='text-center'
            style={{ width: '7rem' }}
          />
          <Column
            field='private_car'
            className='text-center'
            style={{ width: '7rem' }}
          />
          <Column
            field='motor_cycle'
            className='text-center'
            style={{ width: '7rem' }}
          />
          <Column
            field='totalVehicles'
            className='text-center font-bold'
            style={{ width: '8rem' }}
          />
        </DataTable>
      </div>
    </div>
  )
}
