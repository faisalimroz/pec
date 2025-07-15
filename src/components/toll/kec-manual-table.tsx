import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Calendar } from 'primereact/calendar'
import '../../styles/table-style.css'
import { searchKecManual, useKecManual } from '@/api/tollApi'
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
import { toast } from 'sonner'
import axios from 'axios'
import { Dialog } from 'primereact/dialog'
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
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [totalOverallVehicles, setTotalOverallVehicles] = useState<number>(0)
  const [selectedLane, setSelectedLane] = useState(null)
  const [selectedShift, setSelectedShift] = useState(null)
  const [selectedDataType, setSelectedDataType] = useState(null)
  const [allData, setAllData] = useState<any>([])

  const [bulkDialog, setBulkDialog] = useState(false)
  const [file, setFile] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')

  const [fDate, setFDate] = useState<string>('')
  const [dataType, setDataType] = useState('')

  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleteDate, setDeleteDate] = useState('')
  const [loading2, setLoading2] = useState(false)

  const [todaysDate, setTodaysDate] = useState('')

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'toll-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'kec-manual-data'
  )

  const hasEditAccess = checkPermission?.edit_authority || false

  const isToll = roles.some((role) =>
    ['superadmin', 'toll-manager'].includes(role.title)
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

  const types = [
    { name: 'Toll', value: 'Toll' },
    { name: 'Exemption', value: 'Exemption' },
  ]

  const uploadFile = async () => {
    if (!file) {
      setUploadStatus('Please select a file first.')
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append('date', formatDate(fDate))
    formData.append('dataType', dataType)
    formData.append('file', file)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/bulk_upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      toast.success('File uploaded successfully!')
      setFile(null)
      refetch()
      hideDialog2()
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('An error occurred while uploading. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const hideDialog2 = () => {
    setBulkDialog(false)
    setFile(null)
    setUploadStatus('')
  }

  const hideDialog3 = () => {
    setDeleteDialog(false)
    setDeleteDate('')
  }

  const openNew2 = () => {
    setBulkDialog(true)
  }

  const openNew3 = () => {
    setDeleteDialog(true)
  }

  const productDialogFooter2 = (
    <>
      <Button
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDialog2}
      />
      <Button
        label='Save'
        icon='pi pi-upload'
        className='p-button-text'
        onClick={uploadFile}
        disabled={!file || uploading}
      />
    </>
  )

  const deleteData = async () => {
    try {
      setLoading2(true)

      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/delete/using/date`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          data: {
            date: formatDate(deleteDate),
          },
        }
      )

      window.location.reload()
      toast.success('Data Deleted Successfully')
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data
        toast.error(message)
      } else {
        console.log(error)
      }
    } finally {
      setLoading2(false)
    }
    setDeleteDialog(false)
    setDeleteDate('')
  }

  const productDialogFooter3 = (
    <>
      <Button
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDialog3}
      />
      <Button
        label='Delete'
        icon='pi pi-trash'
        className='p-button-text'
        onClick={deleteData}
        disabled={!deleteDate || loading2}
      />
    </>
  )

  const handleFileChange = (e: { target: { files: any[] } }) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile)
      setUploadStatus('')
    } else {
      setFile(null)
      setUploadStatus('Please select a valid .xlsx file.')
    }
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
      <>
        {hasEditAccess && (
          <div className='space-x-2'>
            <button
              className='bg-white text-gray-800 border-gray-600 border-t border-l border-r px-4 py-3 rounded-t-md font-bold'
              onClick={openNew2}
            >
              Bulk Upload
            </button>
            <button
              className='bg-red-600 text-white border-t border-l border-r px-4 py-3 rounded-t-md font-bold'
              onClick={openNew3}
            >
              Delete
            </button>
            <button
              className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
              onClick={exportCSV}
            >
              Download Files
            </button>
          </div>
        )}
        <RefreshButton className='text-base ml-2' onClick={handleReset} />
      </>
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
    const date = new Date(dateTime)

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      date: date ? formatDate(date) : '',
      // @ts-ignore
      lane: selectedLane || '',
      // @ts-ignore
      shift: selectedShift || '',
      // @ts-ignore
      dataType: selectedDataType || '',
    }

    // console.log(initialPayload)

    searchKecManual(initialPayload).then((result) => {
      setProducts(result?.laneData)
      setTotalOverallVehicles(result?.overallTotals?.totalOverallVehicles)
      setAllData(result?.overallTotals)
      setTodaysDate(result?.date)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      month: '',
      shift: '',
      lane: '',
      dataType: '',
    }

    setDate('')
    setSelectedShift(null)
    setSelectedLane(null)
    setSelectedDataType(null)
    searchKecManual(initialPayload).then((result) => {
      setProducts(result?.laneData)
      setTotalOverallVehicles(result?.overallTotals?.totalOverallVehicles)
      setAllData(result?.overallTotals)
      setTodaysDate(result?.date)
      setLoading(false)
    })
  }

  const filterSearchForm = (
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
        <Dropdown
          value={selectedDataType}
          onChange={(e) => setSelectedDataType(e.value)}
          options={types}
          optionLabel='name'
          placeholder='Type'
          className='border-none rounded-none ml-4 cursor-pointer ring-0'
        />
      </div>

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
    date: '',
    lane: '',
    shift: '',
    dataType: '',
  })

  const { data, isLoading, error, refetch } = useKecManual(payload)

  // initial data load
  useEffect(() => {
    if (data) {
      setProducts(data?.laneData)
      setTotalOverallVehicles(data?.overallTotals?.totalOverallVehicles)
      setAllData(data?.overallTotals)
      setTodaysDate(data?.date)
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

  //   searchKecManual(initialPayload).then((result) => {
  //     setProducts(result?.data)
  //     setAllData(result)
  //     setTotalOverallVehicles(result.totalOverallVehicles)
  //     setTotalOverallAmount(result.totalOverallAmount)
  //     setLoading(false)
  //   })
  // }, [])

  // console.log(allData)

  const totalSummary = (
    <div className='flex justify-center items-center bg-gray-100 p-4 rounded'>
      <div className='text-lg font-bold text-center'>
        <span className='font-bold'>Total Vehicle Passing:</span>{' '}
        {totalOverallVehicles}
        <br />
        <span className='font-bold'>Data Showing For Date:</span> {todaysDate}
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
          header='Lane No.'
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
          headerClassName='min-w-[12rem]'
          rowSpan={2}
        />
        {/* <Column
          header='Toll Collection'
          headerClassName='min-w-[8rem]'
          rowSpan={2}
        />
        <Column header='Action' headerClassName='min-w-[8rem]' rowSpan={2} /> */}
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
        {/* <Column />
        <Column /> */}
      </Row>
    </ColumnGroup>
  )

  return (
    <>
      <div className='ml-4'>
        <div>
          <Toolbar
            className='rounded-none border-none p-0 bg-white'
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
            {/* <Column
            field='totalAmount'
            body={(rowData) => `${rowData.totalAmount?.toLocaleString()}`}
          /> */}
            {/* <Column
            body={actionBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            header='Action'
            exportable={false}
          ></Column> */}
          </DataTable>
        </div>
      </div>

      {/* Bulk Upload Dialog  */}
      <Dialog
        visible={bulkDialog}
        style={{ width: '42rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Upload Bulk Data'
        modal
        className='p-fluid'
        footer={productDialogFooter2}
        onHide={hideDialog2}
      >
        <div className='grid grid-cols-2 items-center gap-6'>
          <div>
            <label htmlFor='date' className='font-bold'>
              Date
            </label>
            <div className='border rounded-md'>
              <Calendar
                id='date'
                // @ts-ignore
                onChange={(e) => setFDate(e.value)}
                dateFormat='dd/mm/yy'
                placeholder='Select Date'
              />
            </div>
          </div>

          <div>
            <Dropdown
              value={dataType}
              onChange={(e) => setDataType(e.value)}
              options={types}
              optionLabel='name'
              placeholder='Select Type'
              className='mt-5'
            />
          </div>

          <div className='field col-span-2'>
            <label htmlFor='bulkUpload' className='font-bold'>
              Select File (.xlsx Only):
            </label>
            <br />
            <input
              type='file'
              id='bulkUpload'
              accept='.xlsx'
              // @ts-ignore
              onChange={handleFileChange}
              disabled={uploading}
              className='mt-3'
            />
            {/* {file && <p>Selected file: {file?.name}</p>} */}
            {uploadStatus && (
              <p
                className={
                  uploadStatus.includes('success')
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {uploadStatus}
              </p>
            )}
          </div>
        </div>
      </Dialog>

      {/* Delete Item Dialog  */}
      <Dialog
        visible={deleteDialog}
        style={{ width: '42rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Delete By Date'
        modal
        className='p-fluid'
        footer={productDialogFooter3}
        onHide={hideDialog3}
      >
        <div className='w-fit justify-center mx-auto gap-6'>
          <div>
            <h1 className='font-bold text-center mb-2 text-xl'>Date</h1>
            <div className='border rounded-md'>
              <Calendar
                id='date'
                // @ts-ignore
                onChange={(e) => setDeleteDate(e.value)}
                dateFormat='dd/mm/yy'
                placeholder='Select Date'
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
