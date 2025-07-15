import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import '@/styles/table-style.css'
import { accidentList } from '@/api/roadTrafficAPIs'
import axios from 'axios'
import { Menu } from 'primereact/menu'
import { toast } from 'sonner'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'

interface VehicleType {
  title: string
  _id: string
}

interface Product {
  _id: string
  time: string
  date: string
  location: string
  locationChainage: string
  wayTo: string
  shift: string
  zone: string
  injured: number
  death: number
  lane: number
  vehicleType: VehicleType[]
  bus: number
  truck: number
  motorbike: number
  sedan: number
  covered_van: number
  others: number
}

export default function OnePageTable() {
  let emptyProduct: Product = {
    _id: '',
    time: '',
    date: '',
    location: '',
    locationChainage: '',
    wayTo: '',
    shift: '',
    zone: '',
    injured: 0,
    death: 0,
    lane: 0,
    vehicleType: [],
    bus: 0,
    truck: 0,
    motorbike: 0,
    sedan: 0,
    covered_van: 0,
    others: 0,
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
  const [searchKey, setSearchKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [fileName, setFileName] = useState('')
  const [location, setLocation] = useState('')
  const [remarks, setRemarks] = useState('')
  const [formDate, setFormDate] = useState<string>('')
  const [filesInput, setFilesInput] = useState<File[]>([])
  const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])
  const [selectedRoles, setSelectedRoles] = useState<RoleOption[]>([])
  const [formTime, setFormTime] = useState(null)

  const [totalBus, setTotalBus] = useState(0)
  const [totalTruck, setTotalTruck] = useState(0)
  const [totalMotorbike, setTotalMotorbike] = useState(0)
  const [totalSedan, setTotalSedan] = useState(0)
  const [totalCoveredVan, setTotalCoveredVan] = useState(0)
  const [totalOthers, setTotalOthers] = useState(0)
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)

  const openUpdateDialog = (product: Product) => {
    setUpdatedProduct({ ...product })

    let busCount = 0
    let truckCount = 0
    let motorbikeCount = 0
    let sedanCount = 0
    let coveredVanCount = 0
    let othersCount = 0

    product.vehicleType.forEach((r) => {
      const type = r.title.toLowerCase()
      if (type === 'bus') busCount++
      else if (type === 'truck') truckCount++
      else if (type === 'motorbike') motorbikeCount++
      else if (type === 'sedan') sedanCount++
      else if (type === 'covered_van') coveredVanCount++
      else othersCount++
    })

    setTotalBus(busCount)
    setTotalTruck(truckCount)
    setTotalMotorbike(motorbikeCount)
    setTotalSedan(sedanCount)
    setTotalCoveredVan(coveredVanCount)
    setTotalOthers(othersCount)

    const initialSelectedRoles = product.vehicleType.map(
      (r) =>
        roleOptions.find((option) => option.id === r.title) || {
          id: r.title,
          label: r.title,
        }
    )
    setSelectedRoles(initialSelectedRoles)
    setUpdateProductDialog(true)
  }

  const hideUpdateDialog = () => {
    setUpdateProductDialog(false)
    setUpdatedProduct(null)
    setNewAttachments([])
    setRemovedAttachments([])
    setSelectedRoles([])
  }

  const handleUpdateProduct = async () => {
    if (!updatedProduct) return

    try {
      setLoading2(true)
      const formData = {
        time: updatedProduct.time,
        date: updatedProduct.date,
        injured: updatedProduct.injured,
        death: updatedProduct.death,
        lane: updatedProduct.lane,
        locationChainage: updatedProduct.locationChainage,
        wayTo: updatedProduct.wayTo,
        bus: updatedProduct.bus,
        truck: updatedProduct.truck,
        motorbike: updatedProduct.motorbike,
        sedan: updatedProduct.sedan,
        covered_van: updatedProduct.covered_van,
        others: updatedProduct.others,
      }

      // console.log(formData)

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/roadsafety/accident/update/${updatedProduct._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      hideUpdateDialog()
      toast.success('Updated successfully')
      refetch()
    } catch (error) {
      console.error(error)
      toast.error('Failed to update')
    } finally {
      setLoading2(false)
    }
  }

  const updateProductDialogFooter = (
    <>
      <Button
        label='Cancel'
        icon='pi pi-times'
        outlined
        onClick={hideUpdateDialog}
      />
      <Button
        label='Update'
        icon='pi pi-check'
        onClick={handleUpdateProduct}
        loading={loading2}
      />
    </>
  )

  const openNew = () => {
    setProduct(emptyProduct)
    setSubmitted(false)
    setProductDialog(true)
  }

  const handleFileChange = (newFiles: File[]) => {
    setFilesInput(newFiles)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setProductDialog(false)
  }

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false)
  }

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false)
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

  function timeStringToDate(timeString: string): Date | null {
    if (!timeString) return null

    const [hours, minutes, seconds] = timeString.split(':').map(Number)
    const now = new Date()

    now.setHours(hours)
    now.setMinutes(minutes)
    now.setSeconds(seconds)
    now.setMilliseconds(0)

    return now
  }

  const saveProduct = async () => {
    try {
      setLoading2(true)
      const formData = new FormData()

      formData.append('filename', fileName)
      formData.append('location', location)
      formData.append('remarks', remarks)
      formData.append('date', formatDate(formDate))
      filesInput.forEach((file) => {
        formData.append('attachments', file)
      })

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/roadsafety/accident/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      const response = res
      console.log(response)
      hideDialog()
      refetch()
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
  }

  const confirmDeleteProduct = (product: Product) => {
    setProduct(product)
    setDeleteProductDialog(true)
  }

  const deleteProduct = async () => {
    let _products = products.filter(
      (val: { _id: any }) => val._id !== product._id
    )

    try {
      setLoading2(true)
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/roadsafety/accident/delete/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      refetch()
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

    setProducts(_products)
    setDeleteProductDialog(false)
    setProduct(emptyProduct)
  }

  // multi delete funcs
  const confirmDeleteSelected = () => {
    if (selectedProducts.length > 0) {
      setDeleteMultipleDialog(true)
    }
  }

  const hideDeleteMultipleDialog = () => {
    setDeleteMultipleDialog(false)
  }

  const deleteSelectedProducts = async () => {
    try {
      setLoading2(true)
      const selectedIds = selectedProducts.map((product) => product._id)

      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/roadsafety/accident/delete/multiple/data`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          data: {
            ids: selectedIds,
          },
        }
      )

      setDeleteMultipleDialog(false)
      toast.success('Selected items deleted successfully')
      refetch()
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data
        toast.error(message)
      } else {
        console.error('Error deleting items:', error)
        toast.error('Failed to delete selected items')
      }
    } finally {
      setLoading2(false)
    }

    setSelectedProducts([])
  }

  const deleteMultipleDialogFooter = (
    <div className='flex justify-end gap-2'>
      <button
        type='button'
        className='text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-semibold py-2 px-4 rounded border'
        onClick={hideDeleteMultipleDialog}
      >
        Cancel
      </button>
      <button
        type='button'
        className='bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded'
        onClick={deleteSelectedProducts}
        disabled={loading2}
      >
        Delete
      </button>
    </div>
  )

  // multi delete func end

  const exportCSV = () => {
    dt.current?.exportCSV()
  }

  // const confirmDeleteSelected = () => {
  //   setDeleteProductsDialog(true)
  // }

  // const deleteSelectedProducts = () => {
  //   let _products = products.filter(
  //     (val: Product) => !selectedProducts.includes(val)
  //   )

  //   setProducts(_products)
  //   setDeleteProductsDialog(false)
  //   setSelectedProducts([])
  // }

  const leftToolbarTemplate = () => {
    return (
      <div className=''>
        <div className='p-3 bg-main text-base font-semibold text-white rounded-t'>
          Document List
        </div>
        {/* {isRnT && (
          <button
            onClick={confirmDeleteSelected}
            disabled={!selectedProducts || selectedProducts.length === 0}
            className={`p-3 text-lg font-semibold text-white rounded-t ${
              selectedProducts && selectedProducts.length > 0
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Delete Selected ({selectedProducts?.length || 0})
          </button>
        )} */}
        {/* <Button
          label='Upload Document'
          icon='pi pi-file-pdf'
          severity='success'
          onClick={openNew}
        /> */}
        {/* <Button
          label='Delete'
          icon='pi pi-trash'
          severity='danger'
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
        /> */}
      </div>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <div className='space-x-2'>
        {isRnT && (
          <button
            onClick={confirmDeleteSelected}
            disabled={!selectedProducts || selectedProducts.length === 0}
            className={`p-3 text-lg font-semibold text-white rounded-t ${
              selectedProducts && selectedProducts.length > 0
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Delete Selected ({selectedProducts?.length || 0})
          </button>
        )}
        <RefreshButton className='text-base' onClick={handleReset} />
      </div>
    )
  }

  const hideViewDialog = () => {
    setViewProductDialog(false)
    setSelectedProduct(null)
  }

  const viewProduct = (product: Product) => {
    setSelectedProduct(product)
    setViewProductDialog(true)
  }

  const actionBodyTemplate = (rowData: Product) => {
    const menuRef = useRef<Menu>(null)
    let items
    if (isRnT) {
      items = [
        {
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => openUpdateDialog(rowData),
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => confirmDeleteProduct(rowData),
        },
      ]
    }

    return (
      <div className='flex justify-content-center'>
        <Menu model={items} popup ref={menuRef} />
        <Button
          icon='pi pi-ellipsis-v'
          onClick={(e) => menuRef.current?.toggle(e)}
          aria-controls='popup_menu'
          aria-haspopup
          className='p-button-rounded p-button-text'
        />
      </div>
    )
  }

  const viewProductDialogFooter = (
    <>
      <Button
        label='Close'
        icon='pi pi-times'
        outlined
        onClick={hideViewDialog}
      />
      {/* <Button
        label='Download All'
        icon='pi pi-download'
        onClick={downloadAllFiles}
      /> */}
    </>
  )

  function getMonthName(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { month: 'long' })
  }

  function getYear(dateString: string) {
    const date = new Date(dateString)
    return date.getFullYear()
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      month: date ? getMonthName(date) : '',
      year: date2 ? getYear(date2) : '',
      searchQuery: searchKey,
    }

    accidentList(initialPayload).then((result) => {
      setProducts(result?.AccidentReport)
      setLoading(false)
    })
  }

  const handleReset = () => {
    setLoading(true)

    const initialPayload = {
      month: '',
      year: '',
      searchQuery: '',
    }

    setDate('')
    setDate2('')
    setSearchKey('')

    accidentList(initialPayload).then((result) => {
      setProducts(result?.AccidentReport)
      setLoading(false)
    })
  }

  const filterSearchForm = (
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
      className='flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white'
    >
      <Calendar
        // @ts-ignore
        value={date}
        // @ts-ignore
        onChange={(e) => setDate(e.value)}
        view='month'
        dateFormat='MM'
        inputClassName='border-none rounded-none cursor-pointer focus:ring-0'
        placeholder='By Month'
        showIcon
        icon={() => <i className='pi pi-angle-down' />}
      />

      <Calendar
        // @ts-ignore
        value={date2}
        // @ts-ignore
        onChange={(e) => setDate2(e.value)}
        view='year'
        dateFormat='yy'
        inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
        placeholder='By Year'
        showIcon
        icon={() => <i className='pi pi-angle-down' />}
      />

      <IconField iconPosition='left' className='relative'>
        <InputIcon className='pi pi-search' />
        <InputText
          type='search'
          placeholder='Search'
          className='border-none ml-2 focus:ring-0'
          onChange={(e) => setSearchKey(e.target.value)}
          value={searchKey}
        />

        <button
          onClick={() => handleSearch()}
          className='absolute top-0.5 right-1 border bg-green-500 px-4 py-2.5 rounded-lg'
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
      </IconField>
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

  const deleteProductDialogFooter = (
    <div className='flex justify-end gap-2'>
      <button
        type='button'
        className='text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-semibold py-2 px-4 rounded border'
        onClick={hideDeleteProductDialog}
      >
        No
      </button>
      <button
        type='button'
        className='bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded'
        onClick={deleteProduct}
      >
        Yes
      </button>
    </div>
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

  //   const attachmentBodyTemplate = (rowData: any) => {
  //     return <div>{rowData?.attachments?.length}</div>
  //   }

  interface RoleOption {
    id: string
    label: string
  }

  const roleOptions: RoleOption[] = [
    { id: 'bus', label: 'Bus' },
    { id: 'truck', label: 'Truck' },
    { id: 'covered van', label: 'Covered Van' },
    { id: 'sedan', label: 'Sedan' },
    { id: 'motorbike', label: 'Motorbike' },
    { id: 'others', label: 'Others' },
  ]

  const attachmentBodyTemplate = (rowData: any) => {
    return (
      <div>
        {rowData?.vehicleType?.map((item: any) => (
          <li key={item._id}>
            {roleOptions.find((option) => option.id === item.title)?.label ||
              item.title}
          </li>
        ))}
      </div>
    )
  }

  const refetch = () => {
    setLoading(true)
    const initialPayload = {
      month: '',
      year: '',
      searchQuery: '',
    }

    accidentList(initialPayload).then((result) => {
      setProducts(result?.AccidentReport)
      setLoading(false)
    })
  }

  // initial data load
  useEffect(() => {
    refetch()
  }, [])

  console.log(products)

  return (
    <div className='ml-4'>
      <div className='card'>
        <Toolbar
          className='rounded-none border-none p-0 bg-white'
          left={leftToolbarTemplate}
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
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} Datas'
          header={filterSearchForm}
          selectionMode='multiple'
          showGridlines
          cellSelection
          emptyMessage='No data found!'
          loading={loading}
        >
          {isRnT && (
            <Column
              selectionMode='multiple'
              headerStyle={{ width: '3rem' }}
              exportable={false}
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-sm truncate max-w-xs'
            ></Column>
          )}

          <Column
            body={attachmentBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Vehicles'
          ></Column>

          <Column
            field='date'
            header='Date.'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='time'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Time'
          ></Column>

          <Column
            field='injured'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Injured'
          ></Column>

          <Column
            field='death'
            header='Death'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>
          <Column
            field='lane'
            header='Lane'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>
          <Column
            field='location'
            header='Location'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>
          <Column
            field='shift'
            header='Shift'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>
          <Column
            field='wayTo'
            header='Direction'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>
          <Column
            field='locationChainage'
            header='Chainage'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>
          <Column
            field='zone'
            header='Zone'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            body={actionBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            header='Actions'
            headerStyle={{ width: '3rem' }}
            exportable={false}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className='flex flex-col mx-auto text-center space-y-2'>
          <i
            className='pi pi-exclamation-triangle mr-3 text-red-600'
            style={{ fontSize: '2rem' }}
          />
          {product && (
            <span className='text-red-500'>
              Are you sure you want to delete <b>{product.filename}</b>?
            </span>
          )}
        </div>
      </Dialog>

      {/* update data dialog  */}
      <Dialog
        visible={updateProductDialog}
        style={{ width: '50rem' }}
        header='Update Accident Info'
        modal
        className='p-fluid'
        footer={updateProductDialogFooter}
        onHide={hideUpdateDialog}
      >
        {updatedProduct && (
          <div className='grid grid-cols-2 gap-4'>
            <div className='field'>
              <label htmlFor='date' className='font-bold'>
                Date
              </label>
              <Calendar
                id='date'
                value={
                  new Date(updatedProduct.date.split('-').reverse().join('-'))
                }
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    date: e.value ? formatDate(e.value) : '',
                  })
                }
                dateFormat='dd/mm/yy'
              />
            </div>

            <div className='field'>
              <label htmlFor='time' className='font-bold'>
                Time
              </label>
              <Calendar
                id='time'
                value={timeStringToDate(updatedProduct.time)}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    // @ts-ignore
                    time: convertToTimeOnly(e.value),
                  })
                }
                timeOnly
              />
            </div>

            <div className='field'>
              <label htmlFor='injured' className='font-bold'>
                Injured
              </label>
              <InputNumber
                id='injured'
                value={updatedProduct.injured}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    //@ts-ignore
                    injured: e.value,
                  })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='death' className='font-bold'>
                Death
              </label>
              <InputNumber
                id='death'
                value={updatedProduct.death}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    //@ts-ignore
                    death: e.value,
                  })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='lane' className='font-bold'>
                Lane
              </label>
              <InputNumber
                id='lane'
                value={updatedProduct.lane}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    //@ts-ignore
                    lane: e.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='locationChainage' className='font-bold'>
                Location Chainage
              </label>
              <InputText
                id='locationChainage'
                value={updatedProduct.locationChainage}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    locationChainage: e.target.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='wayTo' className='font-bold'>
                Way To
              </label>
              <Dropdown
                id='wayTo'
                value={updatedProduct.wayTo}
                options={['To Dhaka', 'To Mawa', 'To Pacchor', 'To Bhanga']}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    wayTo: e.target.value,
                  })
                }
                placeholder='Update Direction'
              />
            </div>

            <div className='field'>
              <label htmlFor='bus' className='font-bold'>
                Bus
              </label>
              <InputNumber
                id='bus'
                value={totalBus}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    //@ts-ignore
                    bus: e.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='truck' className='font-bold'>
                Truck
              </label>
              <InputNumber
                id='truck'
                value={totalTruck}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    //@ts-ignore
                    truck: e.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='motorbike' className='font-bold'>
                Motorbike
              </label>
              <InputNumber
                id='motorbike'
                value={totalMotorbike}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    //@ts-ignore
                    motorbike: e.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='sedan' className='font-bold'>
                Sedan
              </label>
              <InputNumber
                id='sedan'
                value={totalSedan}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    //@ts-ignore
                    sedan: e.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='others' className='font-bold'>
                Others
              </label>
              <InputNumber
                id='others'
                value={totalOthers}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    //@ts-ignore
                    others: e.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='covered_van' className='font-bold'>
                Covered Van
              </label>
              <InputNumber
                id='covered_van'
                value={totalCoveredVan}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    //@ts-ignore
                    covered_van: e.value,
                  })
                }
              />
            </div>
          </div>
        )}
      </Dialog>
      {/* multi-delete confirmation dialog */}
      <Dialog
        visible={deleteMultipleDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm Multiple Delete'
        modal
        footer={deleteMultipleDialogFooter}
        onHide={hideDeleteMultipleDialog}
      >
        <div className='flex flex-col justify-center'>
          <i
            className='pi pi-exclamation-triangle mr-3 text-center my-2'
            style={{ fontSize: '2rem' }}
          />
          <span className='text-center'>
            Are you sure you want to delete {selectedProducts.length} selected{' '}
            {selectedProducts.length === 1 ? 'Document' : 'Documents'}?
          </span>
        </div>
      </Dialog>
    </div>
  )
}
