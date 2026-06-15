import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toolbar } from 'primereact/toolbar'
import { Calendar } from 'primereact/calendar'
import '@/styles/table-style.css'
import { searchVehicleDetectVehicle } from '@/api/tollApi'
import { Dropdown } from 'primereact/dropdown'
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
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/provider/authProvider'

interface Product {
  _id: string | null
  code: string
  name: string
  description: string
  image: string | null
  price: number
  category: string | null
  quantity: number
  inventoryStatus: string
  rating: number
}

interface Props {
  id: string
}

export default function VehicleDetectVehicleTable({ id }: Props) {
  const [searchParams] = useSearchParams()
  const lane = searchParams.get('lane')

  const [products, setProducts] = useState<any>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [time, setTime] = useState(null)
  const [time2, setTime2] = useState(null)
  const [selectedShift, setSelectedShift] = useState(null)

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'toll-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'vehicle-detect-toll'
  )

  const hasEditAccess = checkPermission?.edit_authority || false

  const isToll = roles.some((role) =>
    ['superadmin', 'toll-manager'].includes(role.title)
  )
  const shifts = [
    { name: '12 AM - 08 AM', code: '12 AM - 08 AM' },
    { name: '08 AM - 04 PM', code: '08 AM - 04 PM' },
    { name: '04 PM - 12 AM', code: '04 PM - 12 AM' },
  ]

  function formatDate(dateTime?: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

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
        {hasEditAccess && (
          <button
            className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
            onClick={exportCSV}
          >
            Download Files
          </button>
        )}
      </div>
    )
  }

  function convertToTimeOnly(dateTimeString: any) {
    const date = new Date(dateTimeString)

    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  const handleReset = () => {
    const initialPayload = {
      time_range: '',
      date_range: '',
      shift: '',
      wayTo: '',
      vehicleType: '',
    }

    setDate('')
    setDate2('')
    setTime(null)
    setTime2(null)
    setSelectedShift(null)

    searchVehicleDetectVehicle(initialPayload).then((result) => {
      setProducts(result?.data)
      setLoading(false)
    })
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      time_range:
        time && time2
          ? `${convertToTimeOnly(time)} to ${convertToTimeOnly(time2)}`
          : '',
      date_range:
        date && date2 ? `${formatDate(date)} to ${formatDate(date2)}` : '',
      // @ts-ignore
      shift: selectedShift?.code || '',
      lane: lane,
      types: id,
    }

    // console.log(initialPayload)

    searchVehicleDetectVehicle(initialPayload).then((result) => {
      setProducts(result)
      setLoading(false)
    })
  }

  const filterSearchForm = (
    <div className='flex items-center mx-auto w-3/4 gap-2 border p-2 rounded-md bg-white'>
      <Calendar
        // @ts-ignore
        value={date}
        // @ts-ignore
        onChange={(e) => setDate(e.value)}
        inputClassName="text-xs border-0 focus:ring-0 py-1.5 px-3 w-32"
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
        inputClassName="text-xs border-0 focus:ring-0 py-1.5 px-3 w-32"
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
        inputClassName="text-xs border-0 focus:ring-0 py-1.5 px-3 w-32"
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
        inputClassName="text-xs border-0 focus:ring-0 py-1.5 px-3 w-32"
        placeholder='End Time'
        timeOnly
        showIcon
        icon={() => <i className='pi pi-angle-down' />}
      />

      <Dropdown
        value={selectedShift}
        onChange={(e) => setSelectedShift(e.value)}
        options={shifts}
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

      {/* <button
        className='bg-white text-gray-800 border-gray-600 border px-4 py-3 rounded-md font-bold ml-4'
        onClick={handleReset}
      >
        Reset
      </button> */}
    </div>
  )

  const vehicleIcons = {
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

  const formatVehicleName = (name: string) => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const vehicleBodyTemp = (rowData: any) => {
    return (
      <div className='flex flex-col justify-center items-center'>
        <img
          // @ts-ignore
          src={vehicleIcons[rowData.types]}
          alt={rowData.types}
          className='mb-2'
        />
        <h1 className='text-center font-semibold'>
          {formatVehicleName(rowData.types)}
        </h1>
      </div>
    )
  }

  // initial data load
  useEffect(() => {
    setLoading(true)
    const initialPayload = {
      date_range: '',
      time_range: '',
      shift: '',
      wayTo: '',
      scheduleType: '',
      types: id,
      lane: lane,
    }

    searchVehicleDetectVehicle(initialPayload).then((result) => {
      setProducts(result)
      setLoading(false)
    })
  }, [])

  // console.log(products)

  return (
    <div className='ml-4'>
      <Link
        to={`/toll/vehicle-detect-and-toll/${lane}`}
        className='text-lg font-semibold py-2 px-4 border border-gray-300 rounded-md text-gray-800 hover:border-gray-400 hover:bg-gray-400 hover:text-white'
      >
        <i className='pi pi-arrow-left' /> Go Back
      </Link>

      <div className='mt-6'>
        <Toolbar
          className='rounded-none border-none p-0 bg-backgournd'
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}           size="small"           height={45}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e: any) => {
            if (Array.isArray(e.value)) {
              setSelectedProducts(e.value)
            }
          }}
          dataKey='_id'
          paginator
          rows={50}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} Datas'
          header={filterSearchForm}
          selectionMode='multiple'
          showGridlines
          // cellSelection
          emptyMessage='No data found!'
          loading={loading}
        >
          {/* <Column
            selectionMode='multiple'
            headerStyle={{ width: '3rem' }}
            exportable={false}
            headerClassName='bg-[#ffc2c2] text-sm'
bodyClassName='text-sm truncate max-w-xs'
          ></Column> */}

          <Column
            body={vehicleBodyTemp}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Type Of Vehicle'
          ></Column>

          <Column
            field='time'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Time'
          ></Column>

          <Column
            field='date'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Date'
          ></Column>

          {/* <Column
            body={actionBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
bodyClassName='text-sm truncate max-w-xs'
            header='Actions'
            exportable={false}
          ></Column> */}
        </DataTable>
      </div>
    </div>
  )
}
