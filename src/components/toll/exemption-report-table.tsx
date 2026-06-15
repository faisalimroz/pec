import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import '../../styles/table-style.css'
import { searchExemptionReport } from '@/api/tollApi'
import axios from 'axios'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
import { Menu } from 'primereact/menu'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'

interface Product {
  id: string | null
  code: string
  date: string
  name: string
  description: string
  image: string | null
  price: number
  category: string | null
  quantity: number
  inventoryStatus: string
  rating: number
}

export default function ExemptionReportTable() {
  const op = useRef<null>(null)
  const navigate = useNavigate()

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'toll-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'special-audit'
  )

  const hasEditAccess = checkPermission?.edit_authority || false

  const isToll = roles.some((role) =>
    ['superadmin', 'toll-manager'].includes(role.title)
  )
  let emptyProduct: Product = {
    id: null,
    code: '',
    date: '',
    name: '',
    image: null,
    description: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'INSTOCK',
  }

  const codes = [
    { name: 'Dhaleshwari', code: 'dhaleshwari' },
    { name: 'Bhanga', code: 'bhanga' },
    { name: 'Abdullahpur', code: 'abdullahpur' },
    { name: 'Sreenagar', code: 'sreenagar' },
    { name: 'Pulia', code: 'pulia' },
    { name: 'Maligram', code: 'maligram ' },
  ]

  const locs = [
    { name: 'Dhaleshwari', value: 'dhaleshwari' },
    { name: 'Bhanga', value: 'bhanga' },
    { name: 'Abdullahpur', value: 'abdullahpur' },
    { name: 'Sreenagar', value: 'sreenagar' },
    { name: 'Pulia', value: 'pulia' },
    { name: 'Maligram', value: 'maligram ' },
  ]

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
  const [formDate, setFormDate] = useState<string>('')
  const [selectedCode, setSelectedCode] = useState(null)
  const [dataList, setDataList] = useState({
    types: '',
    lane: 0,
    totalpass: 0,
    shift: '',
    location: '',
    vehiclenum: '',
    organization: '',
  })

  const [bulkDialog, setBulkDialog] = useState(false)
  const [downloadFiles, setDownloadFiles] = useState(false)
  const [deleteData, setDeleteData] = useState(false)
  const [file, setFile] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [bulkDate, setBulkDate] = useState<string>('')
  const [bulkLocation, setBulkLocation] = useState<string>('')
  const [deleteDate, setDeleteDate] = useState('')
  const [getDate, setGetDate] = useState('')
  const [loading3, setLoading3] = useState(false)
  const [loading4, setLoading4] = useState(false)
  const [xlFiles, setXlFiles] = useState<any[]>([])
  const [getLocation, setGetLocation] = useState('')
  const [deleteLocation, setDeleteLocation] = useState('')
  const [downloadDate, setDownloadDate] = useState('')

  const uploadFile = async () => {
    if (!file) {
      setUploadStatus('Please select a file first.')
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append('date', formatDate(bulkDate))
    formData.append('location', bulkLocation)
    formData.append('file', file)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/special/exemption/upload-special-exemption`,
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

  const DeleteData1 = async () => {
    const _products = products.filter(
      (val: { _id: any }) => val._id !== product._id
    )

    try {
      setLoading3(true)

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/special/exemption/special-exemption/delete-by-location-date`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          data: {
            date: formatDate(deleteDate),
            location: deleteLocation,
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
      setLoading3(false)
    }

    setProducts(_products)
    setDeleteData(false)
    setDeleteDate('')
    setDeleteLocation('')
  }

  const GetAttachments = async () => {
    try {
      setLoading4(true)
      // console.log('dateeeeeeee ===> ', getDate)
      // console.log('location ===> ', getLocation)
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/exemption_file/by-location-date`,
        {
          data: {
            date: downloadDate,
            location: getLocation,
          },
        }
      )

      setXlFiles(response?.data?.data)

      // window.location.reload()
      toast.success('Data get Successfully')
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data
        toast.error(message)
      } else {
        console.log(error)
      }
    } finally {
      setLoading4(false)
    }
    // setDownloadFiles(false)
    setGetDate('')
    setGetLocation('')
  }

  const hideDialog2 = () => {
    setBulkDialog(false)
    setFile(null)
    setUploadStatus('')
  }
  const hideDialog3 = () => {
    setDownloadFiles(false)
    setGetDate('')
    setGetLocation('')
  }
  const hideDialog4 = () => {
    setDeleteData(false)
    setDeleteDate('')
    setDeleteLocation('')
  }

  const openNew2 = () => {
    setBulkDialog(true)
  }
  const openNew3 = (rowData: Product) => {
    setProduct(rowData)
    setDownloadFiles(true)
    setDownloadDate(rowData.date)
  }
  const openNew4 = (product: Product) => {
    setProduct(product)
    setDeleteData(true)
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

  const productDialogFooter3 = (
    <>
      <Button
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDialog3}
      />
      <Button
        label='Download'
        icon='pi pi-download'
        className='p-button-text'
        onClick={GetAttachments}
        disabled={!getLocation || loading4}
      />
    </>
  )

  const productDialogFooter4 = (
    <>
      <Button
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDialog4}
      />
      <Button
        label='Delete'
        icon='pi pi-trash'
        className='p-button-text'
        onClick={DeleteData1}
        disabled={(!deleteDate && !deleteLocation) || loading3}
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setDataList((prev) => ({ ...prev, [id]: value }))
  }

  const handleNumberInputChange = (
    e: { value: number | null },
    field: number
  ) => {
    setDataList((prev) => ({ ...prev, [field]: e.value || 0 }))
  }

  const openNew = () => {
    setProduct(emptyProduct)
    setSubmitted(false)
    setProductDialog(true)
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

  const saveProduct = async () => {
    try {
      setLoading2(true)
      const data = {
        types: dataList.types,
        datetime: formatDate(formDate),
        lane: dataList.lane,
        totalpass: dataList.totalpass,
        shift: dataList.shift,
        location: dataList.location,
        vehiclenum: dataList.vehiclenum,
        organization: dataList.organization,
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/special/exemption/upload`,
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
      refetch()
      toast.success('Data Saved Successfully')
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

  const editProduct = (product: Product) => {
    setProduct({ ...product })
    setProductDialog(true)
  }

  const confirmDeleteProduct = (product: Product) => {
    setProduct(product)
    setDeleteProductDialog(true)
    setDeleteDate(product.date)
  }

  const deleteProduct = async () => {
    let _products = products.filter((val: any) => val.id !== product.id)

    try {
      setLoading3(true)

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/special/exemption/special-exemption/delete-by-location-date`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          data: {
            date: deleteDate,
            location: deleteLocation,
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
      setLoading3(false)
    }

    setDeleteDate('')
    setDeleteLocation('')
    setProducts(_products)
    setDeleteProductDialog(false)
    setProduct(emptyProduct)
  }

  const exportCSV = () => {
    dt.current?.exportCSV()
  }

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true)
  }

  const deleteSelectedProducts = () => {
    let _products = products.filter(
      (val: any) => !selectedProducts.includes(val)
    )

    setProducts(_products)
    setDeleteProductsDialog(false)
    setSelectedProducts([])
  }

  const leftToolbarTemplate = () => {
    return (
      <div className=''>
        <div className='p-3 bg-main text-lg font-semibold text-white rounded-t'>
          Document List
        </div>
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
      <>
        {hasEditAccess && (
          <div className='space-x-2'>
            <button
              className='bg-white text-gray-800 border-gray-600 border-t border-l border-r px-4 py-3 rounded-t-md font-bold'
              onClick={openNew}
            >
              Upload Document
            </button>
            <button
              className='bg-white text-gray-800 border-gray-600 border-t border-l border-r px-4 py-3 rounded-t-md font-bold'
              onClick={openNew2}
            >
              Bulk Upload
            </button>
            <button
              className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
              onClick={exportCSV}
            >
              Download Files
            </button>

            {/* <button
          className='bg-blue-500 text-white border-blue-300 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
          onClick={() => navigate('/toll/exemption-report/update-delete')}
        >
          Delete Lists
        </button> */}
          </div>
        )}
        <RefreshButton className='text-base ml-2' onClick={handleReset} />
      </>
    )
  }

  const actionBodyTemplate = (rowData: Product) => {
    const menuRef = useRef<Menu>(null)
    let items
    if (hasEditAccess) {
      items = [
        // {
        //   label: 'View',
        //   icon: 'pi pi-eye',
        //   command: () => viewProduct(rowData),
        // },
        {
          label: 'Download Files',
          icon: 'pi pi-download',
          command: () => openNew3(rowData),
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
      // @ts-ignore
      location: selectedCode?.code || '',
    }

    searchExemptionReport(initialPayload).then((result) => {
      setProducts(result)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      month: '',
      location: '',
      year: '',
    }

    setDate('')
    setDate2('')
    setSelectedCode(null)

    searchExemptionReport(initialPayload).then((result) => {
      setProducts(result)
      setLoading(false)
    })
  }

  const filterSearchForm = (
    <>
      <div className='flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white'>
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

        <div>
          <Dropdown
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.value)}
            options={codes}
            optionLabel='name'
            placeholder='Select Location'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
          />
        </div>

        <button
          onClick={() => handleSearch()}
          className='border bg-green-500 px-4 py-2.5 rounded-lg'
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
      <p className='text-2xl mt-4 font-bold text-center'>
        Data Showing For : (
        {date ? getMonthName(date) : getMonthName(new Date().toISOString())},
        {date2 ? getYear(date2) : getYear(new Date().toISOString())})
      </p>
    </>
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
    <>
      <Button
        label='Cancel'
        icon='pi pi-times'
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label='Delete'
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

  const refetch = () => {
    setLoading(true)
    const initialPayload = {
      month: '',
      year: '',
      location: '',
    }

    searchExemptionReport(initialPayload).then((result) => {
      setProducts(result)
      setLoading(false)
    })
  }

  // initial data load
  useEffect(() => {
    refetch()
  }, [])

  // console.log(products)

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header='Date' rowSpan={3} frozen />
      </Row>
      <Row>
        <Column
          header='Traffic'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          colSpan={6}
        />
        <Column header='Toll' headerClassName='bg-blue-400' colSpan={6} />
        <Column header='Totals' colSpan={3} />
      </Row>
      <Row>
        <Column
          field='trafficDhaleshwari'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          header='Dhaleshwari'
        ></Column>

        <Column
          field='trafficBhanga'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          header='Bhanga'
        ></Column>

        <Column
          field='trafficAbdullahpur'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          header='Abdullahpur'
        ></Column>

        <Column
          field='trafficSreenagar'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          header='Sreenagar'
        ></Column>

        <Column
          field='trafficPulia'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          header='Pulia'
        ></Column>

        <Column
          field='trafficmaligram'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          header='Maligram'
        ></Column>

        {/* Toll  */}

        <Column
          field='tollDhaleshwari'
          headerClassName='bg-blue-400'
          header='Dhaleshwari'
        ></Column>

        <Column
          field='tollBhanga'
          headerClassName='bg-blue-400'
          header='Bhanga'
        ></Column>

        <Column
          field='tollAbdullahpur'
          headerClassName='bg-blue-400'
          header='Abdullahpur'
        ></Column>

        <Column
          field='tollSreenagar'
          headerClassName='bg-blue-400'
          header='Sreenagar'
        ></Column>

        <Column
          field='tollPulia'
          headerClassName='bg-blue-400'
          header='Pulia'
        ></Column>

        <Column
          field='tollmaligram'
          headerClassName='bg-blue-400'
          header='Maligram'
        ></Column>

        <Column
          headerClassName='bg-[#ffc2c2] min-w-[8rem]'
          header='Total Traffic'
        ></Column>

        <Column
          headerClassName='bg-blue-400 min-w-[8rem]'
          header='Total Toll'
        ></Column>

        <Column
          rowSpan={3}
          header='Actions'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
        ></Column>
      </Row>
    </ColumnGroup>
  )

  return (
    <div className='ml-4'>
      <div className='card'>
        <Toolbar
          className='rounded-none border-none p-0 bg-backgournd'
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}           size="small"           height={45}
          value={products}
          // selection={selectedProducts}
          // onSelectionChange={(e: {
          //   value: React.SetStateAction<Product[]>
          // }) => {
          //   if (Array.isArray(e.value)) {
          //     setSelectedProducts(e.value)
          //   }
          // }}
          dataKey='date'
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} Datas'
          header={filterSearchForm}
          // selectionMode='multiple'
          showGridlines
          // cellSelection
          emptyMessage='No data found!'
          loading={loading}
          headerColumnGroup={headerGroup}
          scrollable
          scrollHeight='600px'
        >
          {/* Traffic  */}
          <Column
            field='date'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            className='min-w-[8rem]'
            frozen
          />

          <Column
            field='dhaleshwari_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='bhanga_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='abdullahpur_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='sreenagar_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='pulia_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='maligram_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          {/* Toll  */}
          <Column
            field='dhaleshwari_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='bhanga_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='abdullahpur_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='sreenagar_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='pulia_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='maligram_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='total_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='total_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column body={actionBodyTemplate} exportable={false}></Column>
        </DataTable>
      </div>

      {/* upload data dialog  */}
      <Dialog
        visible={productDialog}
        style={{ width: '52rem' }}
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
              <label htmlFor='types' className='font-bold'>
                Vehicle Type
              </label>
              <Dropdown
                id='types'
                value={dataList.types}
                options={[
                  'Bus',
                  'Heavy Truck',
                  'Medium Truck',
                  'Micro Bus',
                  'Mini Bus',
                  'Motor Cycle',
                  'Four Wheeler',
                  'Private Car',
                  'Small Truck',
                  'Trailer',
                ].map((item) => ({
                  label: item,
                  value: item.toLowerCase().replace(/ /g, '_'),
                }))}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, types: e.value }))
                }
                placeholder='Select Vehicle type'
              />
            </div>

            <div className='field'>
              <label htmlFor='lane' className='font-bold'>
                Lane
              </label>
              <Dropdown
                id='lane'
                value={dataList.lane}
                options={[1, 2, 3, 4, 5, 6]}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, lane: e.value }))
                }
                placeholder='Select Lane'
              />
            </div>

            <div className='field'>
              <label htmlFor='totalpass'>Total Pass</label>
              <InputNumber
                id='totalpass'
                value={dataList.totalpass}
                //@ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'totalpass')}
              />
            </div>

            <div className='field'>
              <label htmlFor='shift' className='font-bold'>
                Shift
              </label>
              <Dropdown
                id='shift'
                value={dataList.shift}
                options={['12 AM - 08 AM', '08 AM - 04 PM', '04 PM - 12 AM']}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, shift: e.value }))
                }
                placeholder='Select Shift'
              />
            </div>

            <div className='field'>
              <label htmlFor='location' className='font-bold'>
                Location
              </label>
              <Dropdown
                id='location'
                value={dataList.location}
                options={[
                  'Dhaleshwari',
                  'Bhanga',
                  'Abdullahpur',
                  'Sreenagar',
                  'Pulia',
                  'Maligram',
                ].map((option) => ({
                  label: option.charAt(0).toUpperCase() + option.slice(1),
                  value: option,
                }))}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, location: e.value }))
                }
                placeholder='Select Location'
              />
            </div>

            <div className='field'>
              <label htmlFor='vehiclenum' className='font-bold'>
                Vehicle Number
              </label>
              <InputText
                id='vehiclenum'
                value={dataList.vehiclenum}
                onChange={handleInputChange}
              />
            </div>

            <div className='field'>
              <label htmlFor='organization' className='font-bold'>
                Organization
              </label>
              <Dropdown
                id='organization'
                value={dataList.organization}
                options={[
                  'vip',
                  'dc',
                  'rab',
                  'police',
                  'mp',
                  'army',
                  'freedom fighter',
                  'rhd',
                  'o&m',
                  'navy',
                ].map((option) => ({
                  label: option.charAt(0).toUpperCase() + option.slice(1),
                  value: option,
                }))}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, organization: e.value }))
                }
                placeholder='Select Organization'
              />
            </div>

            <div>
              <label htmlFor='date' className='font-bold'>
                Date
              </label>
              <div className='border rounded-md'>
                <Calendar
                  id='date'
                  // @ts-ignore
                  onChange={(e) => setFormDate(e.value)}
                  dateFormat='dd/mm/yy'
                  inputClassName='border-0 focus:ring-0 cursor-pointer'
                  className='focus:ring-0'
                  placeholder='Select Date'
                />
              </div>
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
        <div className='flex justify-center items-center gap-6 my-6'>
          {/* <div>
            <label htmlFor='date' className='font-bold'>
              Date
            </label>
            <div className='border rounded-md'>
              <Calendar
                id='date'
                value={new Date(deleteDate.split('-').reverse().join('-'))}
                dateFormat='dd/mm/yy'
                disabled
              />
            </div>
          </div> */}

          <div>
            <Dropdown
              value={deleteLocation}
              onChange={(e) => setDeleteLocation(e.value)}
              options={locs}
              optionLabel='name'
              placeholder='Select Location'
              className='w-[300px]'
            />
          </div>
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
          <div>
            <label htmlFor='date' className='font-bold'>
              Date
            </label>
            <div className='border rounded-md'>
              <Calendar
                id='date'
                // @ts-ignore
                onChange={(e) => setBulkDate(e.value)}
                dateFormat='dd/mm/yy'
                placeholder='Select Date'
              />
            </div>
          </div>

          <div>
            <Dropdown
              value={bulkLocation}
              onChange={(e) => setBulkLocation(e.value)}
              options={locs}
              optionLabel='name'
              placeholder='Select Location'
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

      {/* Download xlxs Files  */}
      <Dialog
        visible={downloadFiles}
        style={{ width: '42rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Download Files'
        modal
        className='p-fluid'
        footer={productDialogFooter3}
        onHide={hideDialog3}
      >
        <div className='grid grid-cols-2 items-center gap-6'>
          {/* Date Selection */}
          {/* <div>
            <label htmlFor='date' className='font-bold'>
              Date
            </label>
            <div className='border rounded-md'>
              <Calendar
                id='date'
                // @ts-ignore
                onChange={(e) => setGetDate(e.value)}
                dateFormat='dd/mm/yy'
                placeholder='Select Date'
              />
            </div>
          </div> */}

          {/* Location Selection */}
          <div>
            <Dropdown
              value={getLocation}
              onChange={(e) => setGetLocation(e.value)}
              options={locs}
              optionLabel='name'
              placeholder='Select Location'
              className='mt-5'
            />
          </div>
        </div>

        {/* File List Display */}
        {xlFiles?.length > 0 ? (
          <div className='mt-4 p-3 border rounded-md'>
            <h3 className='font-semibold'>Available Files:</h3>
            <ul className='mt-2'>
              {xlFiles.map((fileData: any, index: number) => (
                <li key={index} className='mt-2'>
                  <a
                    href={fileData.file}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-500 underline'
                  >
                    {`File ${index + 1}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className='mt-4 text-gray-500'>No files available for download.</p>
        )}
      </Dialog>

      {/* Delete Data  */}
      <Dialog
        visible={deleteData}
        style={{ width: '42rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Delete Data'
        modal
        className='p-fluid'
        footer={productDialogFooter4}
        onHide={hideDialog4}
      >
        <div className='grid grid-cols-2 items-center gap-6'>
          <div>
            <label htmlFor='date' className='font-bold'>
              Date - {deleteDate}
            </label>
            <div className='border rounded-md'>
              <Calendar
                id='date'
                value={new Date(deleteDate.split('-').reverse().join('-'))}
                dateFormat='dd/mm/yy'
                disabled
              />
            </div>
          </div>

          <div>
            <Dropdown
              value={deleteLocation}
              onChange={(e) => setDeleteLocation(e.value)}
              options={locs}
              optionLabel='name'
              placeholder='Select Location'
              className='mt-5'
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
