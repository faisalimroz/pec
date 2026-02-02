import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Calendar } from 'primereact/calendar'
import '../../styles/table-style.css'
import { searchVehicleDetectToll, useVehicleDetectToll } from '@/api/tollApi'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
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
import { Dropdown } from 'primereact/dropdown'
import { Link } from 'react-router-dom'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'

interface Product {
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
  timestamp: string
  shift: string
  totalVehicles: number
  totalAmount: number
}

export default function VehicleDetectTollTable() {
  const [products, setProducts] = useState<any>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [totalOverallVehicles, setTotalOverallVehicles] = useState<number>(0)
  const [totalOverallAmount, setTotalOverallAmount] = useState<number>(0)
  const [time, setTime] = useState(null)
  const [time2, setTime2] = useState(null)
  const [shift, setShift] = useState(null)
  const [allData, setAllData] = useState<any>([])

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'toll-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'vehicle-detect-toll'
  )

  const hasEditAccess = checkPermission?.edit_authority || false

  const isToll = roles.some((role) =>
    ['superadmin', 'toll-manager'].includes(role.title)
  )
  const cities = [
    { name: '12 AM - 08 AM', code: '12 AM - 08 AM' },
    { name: '08 AM - 04 PM', code: '08 AM - 04 PM' },
    { name: '04 PM - 12 AM', code: '04 PM - 12 AM' },
  ]

  const exportCSV = () => {
    dt.current?.exportCSV()
  }

  const leftToolbarTemplate = () => {
    return (
      <div className=''>
        <div className='p-3 bg-main text-lg font-semibold text-white rounded-t'>
          Document List
        </div>
      </div>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <div className='space-x-2'>
        {/* <button
          className='bg-white text-gray-800 border-gray-600 border-t border-l border-r px-4 py-3 rounded-t-md font-bold'
          
        >
          Upload Document
        </button> */}
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

  function formatDate(dateTime?: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  function convertToTimeOnly(dateTime: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      date_range:
        date && date2 ? `${formatDate(date)} to ${formatDate(date2)}` : '',
      time_range:
        time && time2
          ? `${convertToTimeOnly(time)} to ${convertToTimeOnly(time2)}`
          : '',
      // @ts-ignore
      shift: shift?.code || '',
    }

    // console.log(initialPayload)

    searchVehicleDetectToll(initialPayload).then((result) => {
      setProducts(result?.data)
      setTotalOverallVehicles(result.totalOverallVehicles)
      setTotalOverallAmount(result.totalOverallAmount)
      setAllData(result)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      date_range: '',
      time_range: '',
      shift: '',
    }

    setDate('')
    setDate2('')
    setTime(null)
    setTime2(null)
    setShift(null)

    searchVehicleDetectToll(initialPayload).then((result) => {
      setProducts(result?.data)
      setTotalOverallVehicles(result.totalOverallVehicles)
      setTotalOverallAmount(result.totalOverallAmount)
      setAllData(result)
      setLoading(false)
    })
  }

  const filterSearchForm = (
    <div className='flex items-center mx-auto w-fit gap-2 border p-2 rounded-md bg-white'>
      <Calendar
        // @ts-ignore
        value={date}
        // @ts-ignore
        onChange={(e) => setDate(e.value)}
        inputClassName='border-none rounded-none cursor-pointer focus:ring-0'
        placeholder='Start Date'
        showIcon
        icon={() => <i className='pi pi-angle-down' />}
      />

      <h1 className='font-semibold'>To</h1>

      <Calendar
        // @ts-ignore
        value={date2}
        // @ts-ignore
        onChange={(e) => setDate2(e.value)}
        inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
        placeholder='End Date'
        showIcon
        icon={() => <i className='pi pi-angle-down' />}
      />

      <Calendar
        id='calendar-timeonly'
        value={time}
        hourFormat='12'
        // @ts-ignore
        onChange={(e) => setTime(e.value)}
        inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
        placeholder='Start Time'
        timeOnly
        showIcon
        icon={() => <i className='pi pi-angle-down' />}
      />

      <h1 className='font-semibold'>To</h1>

      <Calendar
        id='calendar-timeonly'
        value={time2}
        hourFormat='12'
        // @ts-ignore
        onChange={(e) => setTime2(e.value)}
        inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
        placeholder='End Time'
        timeOnly
        showIcon
        icon={() => <i className='pi pi-angle-down' />}
      />

      <Dropdown
        value={shift}
        onChange={(e) => setShift(e.value)}
        options={cities}
        optionLabel='name'
        showClear
        placeholder='By Shift'
        className='w-fit'
      />

      <button
        onClick={() => handleSearch()}
        className='border bg-green-500 px-4 py-2.5 rounded-lg ml-2'
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
  )

  const [payload, setPayload] = useState<any>({
    date_range: '',
    time_range: '',
    shift: '',
    wayTo: '',
    scheduleType: '',
  })

  const { data, isLoading, error, refetch } = useVehicleDetectToll(payload)

  // initial data load
  useEffect(() => {
    if (data) {
      setProducts(data?.data)
      setTotalOverallVehicles(data?.totalOverallVehicles)
      setTotalOverallAmount(data?.totalOverallAmount)
      setAllData(data)
    }
  }, [data])

  // initial data load
  // useEffect(() => {
  //   setLoading(true)
  //   const initialPayload = {
  //     date_range: '',
  //     time_range: '',
  //     shift: '',
  //     wayTo: '',
  //     scheduleType: '',
  //   }

  //   searchVehicleDetectToll(initialPayload).then((result) => {
  //     setProducts(result?.data)
  //     setAllData(result)
  //     setTotalOverallVehicles(result.totalOverallVehicles)
  //     setTotalOverallAmount(result.totalOverallAmount)
  //     setLoading(false)
  //   })
  // }, [])

  // console.log(allData)

  const totalSummary = (
    <div className='flex justify-between items-center bg-gray-100 p-4 rounded'>
      <div className='text-lg font-bold'>
        <span className='font-bold'>Todays Total Vehicle Passing:</span>{' '}
        {totalOverallVehicles}
      </div>

      <div className='text-lg font-bold'>
        {' '}
        Data Showing For Date: {new Date().toLocaleDateString()}
      </div>

      <div className='text-lg font-bold'>
        <span className='font-bold'>Total Toll Collection:</span> ৳{' '}
        {totalOverallAmount.toLocaleString()}
      </div>
    </div>
  )

  const vehicleHeaderTemplate = (image: string, label: string) => (
    <div className='flex flex-col items-center'>
      <img src={image} alt={label} className='mb-2' />
      <span className='text-xs'>{label}</span>
    </div>
  )

  const actionBodyTemplate = (rowData: Product) => {
    return (
      <>
        <div className='flex items-center gap-3'>
          <Link to={`/toll/vehicle-detect-and-toll/${rowData.lane}`}>
            <Button
              icon='pi pi-eye text-blue-500 text-lg'
              text
              className='text-sm'
            />
          </Link>
        </div>
      </>
    )
  }

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          header='Toll Booth'
          headerClassName='min-w-[8rem]'
          rowSpan={2}
          frozen
        />
        <Column
          header={vehicleHeaderTemplate(trailor, 'Trailer')}
          headerClassName='min-w-[8rem]'
        />
        <Column
          header={vehicleHeaderTemplate(heavyTruck, 'Heavy Truck')}
          headerClassName='min-w-[8rem]'
        />
        <Column
          header={vehicleHeaderTemplate(mediumTruck, 'Medium Truck')}
          headerClassName='min-w-[8rem]'
        />
        <Column
          header={vehicleHeaderTemplate(bus, 'Bus')}
          headerClassName='min-w-[8rem]'
        />
        <Column
          header={vehicleHeaderTemplate(smallTruck, 'Small Truck')}
          headerClassName='min-w-[8rem]'
        />
        <Column
          header={vehicleHeaderTemplate(miniBus, 'Mini Bus')}
          headerClassName='min-w-[8rem]'
        />
        <Column
          header={vehicleHeaderTemplate(microBus, 'Micro Bus')}
          headerClassName='min-w-[8rem]'
        />
        <Column
          header={vehicleHeaderTemplate(pickUp, 'Four Wheeler')}
          headerClassName='min-w-[8rem]'
        />
        <Column
          header={vehicleHeaderTemplate(sedan, 'Private Car')}
          headerClassName='min-w-[8rem]'
        />
        <Column
          header={vehicleHeaderTemplate(motorBike, 'Motor Cycle')}
          headerClassName='min-w-[8rem]'
        />
        <Column header='Shift' headerClassName='min-w-[12rem]' rowSpan={2} />
        <Column
          header='Vehicle Passing'
          headerClassName='min-w-[8rem]'
          rowSpan={2}
        />
        <Column
          header='Toll Collection'
          headerClassName='min-w-[8rem]'
          rowSpan={2}
        />
        <Column header='Action' headerClassName='min-w-[8rem]' rowSpan={2} />
      </Row>
    </ColumnGroup>
  )

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer='Total'
          colSpan={1}
          footerStyle={{ textAlign: 'right' }}
        />
        <Column footer={allData?.totaltrailer} />
        <Column footer={allData?.totalheavy_truck} />
        <Column footer={allData?.totalmedium_truck} />
        <Column footer={allData?.totalbus} />
        <Column footer={allData?.totalsmall_truck} />
        <Column footer={allData?.totalmini_bus} />
        <Column footer={allData?.totalmicro_bus} />
        <Column footer={allData?.totalfour_wheeler} />
        <Column footer={allData?.totalprivate_car} />
        <Column footer={allData?.totalmotor_cycle} />
        <Column />
        <Column />
        <Column />
        <Column />
      </Row>
    </ColumnGroup>
  )

  return (
    <div className='ml-4'>
      <Toast ref={toast} />
      <div>
        <Toolbar
          className='rounded-none border-none p-0 bg-backgournd'
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        {totalSummary}

        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e: {
            value: React.SetStateAction<Product[]>
          }) => {
            if (Array.isArray(e.value)) {
              setSelectedProducts(e.value)
            }
          }}
          dataKey='_id'
          rows={12}
          header={filterSearchForm}
          showGridlines
          emptyMessage='No data found!'
          loading={isLoading || loading}
          headerColumnGroup={headerGroup}
          footerColumnGroup={footerGroup}
          scrollable
          scrollHeight='600px'
        >
          <Column field='lane' frozen />
          <Column field='trailer' />
          <Column field='heavy_truck' />
          <Column field='medium_truck' />
          <Column field='bus' />
          <Column field='small_truck' />
          <Column field='mini_bus' />
          <Column field='micro_bus' />
          <Column field='four_wheeler' />
          <Column field='private_car' />
          <Column field='motor_cycle' />
          <Column field='shift' />
          <Column field='totalVehicles' />
          <Column
            field='totalAmount'
            body={(rowData) => `${rowData.totalAmount.toLocaleString()}`}
          />
          <Column
            body={actionBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            header='Action'
            exportable={false}
          ></Column>
        </DataTable>
      </div>
    </div>
  )
}
