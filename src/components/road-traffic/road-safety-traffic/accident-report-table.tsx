import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import { Calendar } from 'primereact/calendar'
import '@/styles/table-style.css'
import { searchAccidentReport } from '@/api/roadTrafficAPIs'
import axios from 'axios'
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
import { Link } from 'react-router-dom'
import { InputNumber } from 'primereact/inputnumber'
import { toast } from 'sonner'
import { InputText } from 'primereact/inputtext'
import RefreshButton from '@/components/refresh-button'
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

export default function AccidentReportTable() {
  let emptyProduct: Product = {
    _id: null,
    code: '',
    name: '',
    image: null,
    description: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'INSTOCK',
  }
  const { permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'r&t-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'patrol-security'
  )

  const isRnT = checkPermission?.edit_authority || false

  const [products, setProducts] = useState<any>([])
  const [productDialog, setProductDialog] = useState<boolean>(false)
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)
  const [deleteProductsDialog, setDeleteProductsDialog] =
    useState<boolean>(false)
  const [product, setProduct] = useState<any>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [time, setTime] = useState(null)
  const [time2, setTime2] = useState(null)
  const [selectedShift, setSelectedShift] = useState(null)
  const [formDate, setFormDate] = useState<string>('')
  const [formTime, setFormTime] = useState(null)
  const [formData, setFormData] = useState<{
    injured: number
    death: number
    lane: number
    locationChainage: string
    wayTo: string
    sedan: number
    bus: number
    truck: number
    motorbike: number
    others: number
    covered_van: number
  }>({
    injured: 0,
    death: 0,
    lane: 0,
    locationChainage: '',
    wayTo: '',
    sedan: 0,
    bus: 0,
    truck: 0,
    motorbike: 0,
    others: 0,
    covered_van: 0,
  })
  const [bulkDialog, setBulkDialog] = useState(false)
  const [file, setFile] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')

  const [totalAccident, setTotalAccident] = useState('')
  const [totalDeath, setTotalDeath] = useState('')
  const [totalInjured, setTotalInjured] = useState('')

  const shifts = [
    { name: '12AM - 08AM', code: '12AM - 08AM' },
    { name: '08AM - 04PM', code: '08AM - 04PM' },
    { name: '04PM - 12AM', code: '04PM - 12AM' },
  ]

  const openNew = () => {
    setProduct(emptyProduct)
    setSubmitted(false)
    setProductDialog(true)
  }

  const openNew2 = () => {
    setProduct(emptyProduct)
    setSubmitted(false)
    setBulkDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setProductDialog(false)
  }

  const hideDialog2 = () => {
    setBulkDialog(false)
    setFile(null)
    setUploadStatus('')
  }

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false)
  }

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false)
  }

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

  const uploadFile = async () => {
    if (!file) {
      setUploadStatus('Please select a file first.')
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/roadsafety/accident/upload-acciden-bulk`,
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

  function formatDate(dateTime?: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  const saveProduct = async () => {
    try {
      setLoading2(true)
      const data = {
        time: convertToTimeOnly(formTime),
        date: formatDate(formDate),
        injured: formData.injured,
        death: formData.death,
        lane: formData.lane,
        locationChainage: formData.locationChainage,
        wayTo: formData.wayTo,
        bus: formData.bus,
        truck: formData.truck,
        motorbike: formData.motorbike,
        sedan: formData.sedan,
        others: formData.others,
        covered_van: formData.covered_van,
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/roadsafety/accident/upload`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const response = res
      console.log(response)
      hideDialog()
      toast.success('Data Saved Successfully')
      refetch()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save product')
    } finally {
      setLoading2(false)
    }
  }

  const deleteProduct = () => {
    let _products = products.filter((val: any) => val.id !== product.id)

    setProducts(_products)
    setDeleteProductDialog(false)
    setProduct(emptyProduct)
  }

  const exportCSV = () => {
    if (selectedProducts && selectedProducts.length > 0) {
      dt.current?.exportCSV({ selectionOnly: true })
    } else {
      dt.current?.exportCSV()
    }
  }

  const deleteSelectedProducts = () => {
    let _products = products.filter(
      (val: any) => !selectedProducts.includes(val)
    )

    setProducts(_products)
    setDeleteProductsDialog(false)
    setSelectedProducts([])
  }

  const rightToolbarTemplate = () => {
    return (
      <>
        {isRnT && (
          <div className='space-x-2'>
            <button
              className='bg-white text-gray-800 border-gray-600 border-t border-l border-r px-4 py-3 rounded-t-md font-bold'
              onClick={openNew}
            >
              Upload Document
            </button>
            {/* <button
          className='bg-white text-gray-800 border-gray-600 border-t border-l border-r px-4 py-3 rounded-t-md font-bold'
          onClick={openNew2}
        >
          Bulk Upload
        </button> */}
            <button
              className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
              onClick={exportCSV}
            >
              Download Files{' '}
              {selectedProducts?.length === 0
                ? '(All)'
                : `(${selectedProducts?.length})`}
            </button>
          </div>
        )}
        <RefreshButton className='text-base ml-2' onClick={handleReset} />
      </>
    )
  }

  const actionBodyTemplate = (rowData: any) => {
    // console.log(rowData)

    return (
      <>
        <Link
          to={`/road-and-traffic/accident-record/${rowData?.vehicleType}`}
          className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
        >
          View Details
        </Link>
      </>
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
      timeRange: '',
      dateRange: '',
      shift: '',
      wayTo: '',
      vehicleType: '',
    }

    setDate('')
    setDate2('')
    setTime(null)
    setTime2(null)
    setSelectedShift(null)

    searchAccidentReport(initialPayload).then((result) => {
      setProducts(result?.data)
      setLoading(false)
    })
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      timeRange:
        time && time2
          ? `${convertToTimeOnly(time)} to ${convertToTimeOnly(time2)}`
          : '',
      dateRange:
        date && date2 ? `${formatDate(date)} to ${formatDate(date2)}` : '',
      // @ts-ignore
      shift: selectedShift?.code || '',
    }

    searchAccidentReport(initialPayload).then((result) => {
      setProducts(result?.data)
      setTotalAccident(result?.totalAccident)
      setTotalDeath(result?.totalDeath)
      setTotalInjured(result?.totalInjured)
      setLoading(false)
    })
  }

  const filterSearchForm = (
    <div className='flex flex-col space-y-5 items-center justify-center'>
      <div
        role='search'
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch()
          }
        }}
        className='flex items-center mx-auto w-full gap-2 border p-2 rounded-md bg-white'
      >
        <Calendar
          // @ts-ignore
          value={date}
          // @ts-ignore
          onChange={(e) => setDate(e.value)}
          inputClassName='border-none rounded-none cursor-pointer focus:ring-0'
          placeholder='Select Date'
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
          placeholder='Select Date'
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
          placeholder='Select Time'
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
          placeholder='Select Time'
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
          type='submit'
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

      <div className='flex w-fit gap-2 divide-x-2 border p-4 rounded-md bg-blue-50 text-gray-600'>
        <h1>Total Accident: {totalAccident}</h1>
        <h1 className='pl-2'>Total Injured: {totalInjured}</h1>
        <h1 className='pl-2'>Total Death: {totalDeath}</h1>
      </div>
    </div>
  )

  const productDialogFooter = (
    <>
      <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
      <Button
        label='Save'
        loading={loading2}
        icon='pi pi-check'
        onClick={saveProduct}
      />
    </>
  )

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

  const deleteProductDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        severity='danger'
        onClick={deleteProduct}
      />
    </>
  )

  const deleteProductsDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        outlined
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        severity='danger'
        onClick={deleteSelectedProducts}
      />
    </>
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
      <div className='flex flex-col justify-center items-center  text-white'>
        {/* <img
          // @ts-ignore
          src={vehicleIcons[rowData.vehicleType]}
          alt={rowData.vehicleType}
          className='mb-2'
        /> */}
        <h1 className='text-center font-semibold'>
          {formatVehicleName(rowData.vehicleType)}
        </h1>
      </div>
    )
  }

  const refetch = () => {
    setLoading(true)
    const initialPayload = {
      timeRange: '',
      dateRange: '',
      shift: '',
      wayTo: '',
    }

    searchAccidentReport(initialPayload).then((result) => {
      setProducts(result?.data)
      setTotalAccident(result?.totalAccident)
      setTotalDeath(result?.totalDeath)
      setTotalInjured(result?.totalInjured)
      setLoading(false)
    })
  }

  // initial data load
  useEffect(() => {
    refetch()
  }, [])

  const handleNumberInputChange = (
    e: { value: number | null },
    field: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.value || 0 }))
  }

  // console.log(products)

  return (
    <div className=''>
      <div className='card'>
        <Toolbar
          className='rounded-none border-none p-0 bg-white'
          // left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e: any) => {
            if (Array.isArray(e.value)) {
              setSelectedProducts(e.value)
            }
          }}
          dataKey='_id'
          paginator
          rows={12}
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
            bodyClassName='text-sm truncate max-w-xs bg-blue-950'
            sortable
            header='Type Of Vehicle'
          ></Column>

          <Column
            field='totalAccident'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Number Of Accidents'
          ></Column>

          {/* <Column
            field='totalInjured'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Injured'
          ></Column>

          <Column
            field='totalDeath'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Death'
          ></Column>

          <Column
            field='direction'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Direction Type'
          ></Column> */}

          <Column
            body={actionBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            header='Actions'
            exportable={false}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={productDialog}
        style={{ width: '42rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Upload Document'
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <>
          <div className='grid grid-cols-2 items-center gap-6'>
            <div className='field'>
              <label htmlFor='time' className='font-bold'>
                Time
              </label>
              <Calendar
                id='calendar-timeonly'
                value={formTime}
                hourFormat='12'
                // @ts-ignore
                onChange={(e) => setFormTime(e.value)}
                placeholder='Select Time'
                timeOnly
              />
            </div>
            <div className='field'>
              <label htmlFor='date' className='font-bold'>
                Date
              </label>
              <Calendar
                // @ts-ignore
                value={formDate}
                // @ts-ignore
                onChange={(e) => setFormDate(e.value)}
                placeholder='Select Date'
              />
            </div>
            <div className='field'>
              <label htmlFor='injured' className='font-bold'>
                Injured
              </label>
              <InputNumber
                id='injured'
                value={formData.injured}
                // @ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'injured')}
              />
            </div>
            <div className='field'>
              <label htmlFor='death' className='font-bold'>
                Death
              </label>
              <InputNumber
                id='death'
                value={formData.death}
                // @ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'death')}
              />
            </div>
            <div className='field'>
              <label htmlFor='locationChainage' className='font-bold'>
                Location Chainage
              </label>
              <InputText
                id='locationChainage'
                onChange={(e) =>
                  setFormData({ ...formData, locationChainage: e.target.value })
                }
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='lane' className='font-bold'>
                Lane No.
              </label>
              <InputNumber
                id='lane'
                value={formData.lane}
                // @ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'lane')}
              />
            </div>
            <div className='field'>
              <label htmlFor='wayTo' className='font-bold'>
                Way To
              </label>
              <Dropdown
                id='wayTo'
                value={formData.wayTo}
                options={['To Dhaka', 'To Mawa', 'To Pacchor', 'To Bhanga']}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, wayTo: e.value }))
                }
                placeholder='Select WayTo'
              />
            </div>
            <div className='field'>
              <label htmlFor='bus' className='font-bold'>
                Bus
              </label>
              <InputNumber
                id='bus'
                value={formData.bus}
                // @ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'bus')}
              />
            </div>

            <div className='field'>
              <label htmlFor='truck' className='font-bold'>
                Truck
              </label>
              <InputNumber
                id='truck'
                value={formData.truck}
                // @ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'truck')}
              />
            </div>

            <div className='field'>
              <label htmlFor='covered_van' className='font-bold'>
                Covered Van
              </label>
              <InputNumber
                id='covered_van'
                value={formData.covered_van}
                // @ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'covered_van')}
              />
            </div>

            <div className='field'>
              <label htmlFor='sedan' className='font-bold'>
                Sedan
              </label>
              <InputNumber
                id='sedan'
                value={formData.sedan}
                // @ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'sedan')}
              />
            </div>

            <div className='field'>
              <label htmlFor='motorbike' className='font-bold'>
                Motor Bike
              </label>
              <InputNumber
                id='motorbike'
                value={formData.motorbike}
                // @ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'motorbike')}
              />
            </div>

            <div className='field'>
              <label htmlFor='others' className='font-bold'>
                Others
              </label>
              <InputNumber
                id='others'
                value={formData.others}
                // @ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'others')}
              />
            </div>
          </div>
        </>
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            style={{ fontSize: '2rem' }}
          />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductsDialog}
        style={{ width: '42rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            style={{ fontSize: '3rem' }}
          />
          {product && (
            <span>Are you sure you want to delete the selected products?</span>
          )}
        </div>
      </Dialog>

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
          <div className='field col-span-2'>
            <label htmlFor='bulkUpload' className='font-bold'>
              Select File:
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
    </div>
  )
}
