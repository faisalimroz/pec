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
import { searchEmployeePersonalProfile } from '@/api/adminAPIs'
import axios from 'axios'
import { toast } from 'sonner'
import MultiFileInput from '@/components/MultiFileInput'
import { Dropdown } from 'primereact/dropdown'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'
import { useLocation, useNavigate } from 'react-router-dom'
import EmPersonalDetail from './em-personal-detail'

interface Product {
  _id: string
  employeeName: string
  employeeId: string
  dept: string
  firmName: string
  position: string
  salary?: string
  boqNo?: string
  location?: string
  branch?: string
  mobile?: string
  address?: string
  email?: string
  dateOfMobilization: string
  dateOfDemobilization: string
  remarks: string
  cvCertificates?: Attachment[]
  agreement?: Attachment[]
  showcaseLetter?: Attachment[]
  warningLetter?: Attachment[]
  termination?: Attachment[]
  insuranceClaiming?: Attachment[]
  profileImg?: string
  slNo: string
}

interface Attachment {
  url: string
  _id: string
}
//@ts-ignore
<style jsx>{`
  .selectable-text {
    user-select: text !important;
    -webkit-user-select: text !important;
  }
`}</style>

export default function EmPersonalProfileTable() {
  const types = [
    { name: 'Current-employee', code: 'Current-employee' },
    { name: 'Demobilize', code: 'Demobilize' },
  ]

  let emptyProduct: Product = {
    _id: '',
    employeeName: '',
    employeeId: '',
    firmName: '',
    dept: '',
    position: '',
    salary: '',
    boqNo: '',
    location: '',
    branch: '',
    mobile: '',
    address: '',
    email: '',
    dateOfMobilization: '',
    dateOfDemobilization: '',
    remarks: '',
    cvCertificates: [],
    agreement: [],
    showcaseLetter: [],
    warningLetter: [],
    termination: [],
    insuranceClaiming: [],
    profileImg: '',
    slNo: '',
  }

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'admin')
  const checkPermission = checkRole?.children.find((c) => c.name === 'hr')

  const hasEditAccess = checkPermission?.edit_authority || false

  const isAdmin = roles.some((role) =>
    ['superadmin', 'admin'].includes(role.title)
  )

  const navigate = useNavigate()
  const location = useLocation()

  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)
  const [products, setProducts] = useState<any>([])
  const [productDialog, setProductDialog] = useState<boolean>(false)
  const [product, setProduct] = useState<any>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [searchKey, setSearchKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [cvCertificates, setCvCertificates] = useState<File[]>([])
  const [selectedType, setSelectedType] = useState(null)
  const [agreement, setAgreement] = useState<File[]>([])
  const [showcaseLetter, setShowcaseLetter] = useState<File[]>([])
  const [warningLetter, setWarningLetter] = useState<File[]>([])
  const [searchDate, setSearchDate] = useState<Date | null>(null)
  const [searchDate2, setSearchDate2] = useState<Date | null>(null)
  const [termination, setTermination] = useState<File[]>([])
  const [insuranceClaiming, setInsuranceClaiming] = useState<File[]>([])
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  )
  const [formData, setFormData] = useState<any>({
    employeeName: '',
    employeeId: '',
    dept: '',
    firmName: '',
    position: '',
    dateOfMobilization: '',
    dateOfDemobilization: '',
    remarks: '',
    salary: '',
    boqNo: '',
    location: '',
    branch: '',
    mobile: '',
    address: '',
    email: '',
    cvCertificates: [],
    agreement: [],
    showcaseLetter: [],
    warningLetter: [],
    termination: [],
    insuranceClaiming: [],
    profileImg: '',
  })
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)
  const [viewDialogVisible, setViewDialogVisible] = useState<boolean>(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')

  // Replace current page initialization useEffect
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const page = parseInt(searchParams.get('page') || '0', 10)
    setCurrentPage(page)
  }, [location.search])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)

    // Reset to first page if no page parameter exists
    if (!searchParams.has('page')) {
      setCurrentPage(0)
    }
  }, [location.search])

  // Modify onPage function
  const onPage = (event: any) => {
    const newPage = event.page
    setCurrentPage(newPage)
    navigate(`?page=${newPage}`, { replace: true })
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
      const data = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof Date) {
          data.append(key, formatDate(value))
        } else if (value instanceof File) {
          data.append(key, value)
        } else if (value !== null) {
          // @ts-ignore
          data.append(key, value.toString())
        }
      })

      cvCertificates.forEach((file) => {
        data.append('cvCertificates', file)
      })

      agreement.forEach((file) => {
        data.append('agreement', file)
      })

      showcaseLetter.forEach((file) => {
        data.append('showcaseLetter', file)
      })

      warningLetter.forEach((file) => {
        data.append('warningLetter', file)
      })

      termination.forEach((file) => {
        data.append('termination', file)
      })

      insuranceClaiming.forEach((file) => {
        data.append('insuranceClaiming', file)
      })

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/employee-personal/upload`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      const response = res
      console.log(response)
      hideDialog()
      toast.success('Data Saved Successfully')
      refetch();
          // Reset form data after successful save
    setFormData({
      employeeName: '',
      employeeId: '',
      dept: '',
      firmName: '',
      position: '',
      dateOfMobilization: '',
      dateOfDemobilization: '',
      remarks: '',
      salary: '',
      boqNo: '',
      location: '',
      branch: '',
      mobile: '',
      address: '',
      email: '',
      cvCertificates: [],
      agreement: [],
      showcaseLetter: [],
      warningLetter: [],
      termination: [],
      insuranceClaiming: [],
      profileImg: '',
    });

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

  const exportCSV = () => {
    if (selectedProducts && selectedProducts.length > 0) {
      dt.current?.exportCSV({ selectionOnly: true })
    } else {
      dt.current?.exportCSV()
    }
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/employee-personal/delete/multiple/data`,
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
      refetch()
      toast.success('Selected items deleted successfully')
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

  const leftToolbarTemplate = () => {
    return (
      <div className=''>
        <div className='p-3 bg-main text-base font-semibold text-white rounded-t'>
          Document List
        </div>
        {/* {isAdmin && (
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
              className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
              onClick={exportCSV}
            >
              Download Files{' '}
              {selectedProducts?.length === 0
                ? '(All)'
                : `(${selectedProducts?.length})`}
            </button>
            <button
              onClick={confirmDeleteSelected}
              disabled={!selectedProducts || selectedProducts.length === 0}
              className={`py-3 px-4 text-base font-semibold text-white rounded-t-md ${
                selectedProducts && selectedProducts.length > 0
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Delete Selected ({selectedProducts?.length || 0})
            </button>
          </div>
        )}
        <RefreshButton className='text-base ml-2' onClick={handleReset} />
      </>
    )
  }

  const confirmDeleteProduct = (product: Product) => {
    setProduct(product)
    setDeleteProductDialog(true)
  }

  const actionBodyTemplate = (rowData: Product) => {
    return (
      <>
        <div className='flex items-center gap-2'>
          <Button
            icon='pi pi-eye text-blue-500'
            text
            raised
            severity='secondary'
            label='View Profile'
            className='text-xs px-2 py-2'
            onClick={() => {
              setSelectedEmployeeId(rowData._id)
              setViewDialogVisible(true)
            }}
          />
          {hasEditAccess && (
            <Button
              text
              raised
              severity='secondary'
              icon='pi pi-trash text-red-600 font-semibold'
              label='Remove'
              className='text-xs px-2 py-2'
              onClick={() => confirmDeleteProduct(rowData)}
            />
          )}
        </div>
      </>
    )
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      date_range:
        searchDate && searchDate2
          ? `${formatDate(searchDate)} to ${formatDate(searchDate2)}`
          : '',
      searchQuery: searchKey,
      //@ts-ignore
      employeType: selectedType?.code || '',
    }

    searchEmployeePersonalProfile(initialPayload).then((result) => {
      setProducts(result?.EmployeePersonals)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      date_range: '',
      searchQuery: '',
      employeType: '',
    }

    setSearchDate(null)
    setSearchDate2(null)
    setSelectedType(null)
    setSearchKey('')
    setCurrentPage(0)

    searchEmployeePersonalProfile(initialPayload).then((result) => {
      setProducts(result?.EmployeePersonals)
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
      aria-label='Search and filter form'
    >
      <div>
        {/* <Calendar
          value={searchDate}
          // @ts-ignore
          onChange={(e) => setSearchDate(e.value)}
          inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
          placeholder='Start Date'
          showIcon
        /> */}
         <Calendar
                    // @ts-ignore
                      value={searchDate}
                    // @ts-ignore
                    onChange={(e) => setSearchDate(e.value)}

                    dateFormat="dd/mm/yy"
                    inputClassName='border-none rounded-none cursor-pointer focus:ring-0'
                    placeholder='Start Date'
                    showIcon
                    icon={() => <i className='pi pi-angle-down' />}
                />
      </div>
      <div>
        {/* <Calendar
          value={searchDate2}
          // @ts-ignore
          onChange={(e) => setSearchDate2(e.value)}
          inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
          placeholder='End Date'
          showIcon
        /> */}
          <Calendar
                    // @ts-ignore
                   value={searchDate2}
                    // @ts-ignore
                   onChange={(e) => setSearchDate2(e.value)}

                    dateFormat="dd/mm/yy"
                    inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
                    placeholder='End Date'
                    showIcon
                    icon={() => <i className='pi pi-angle-down' />}
                />
      </div>

      <div>
        <Dropdown
          value={selectedType}
          onChange={(e) => setSelectedType(e.value)}
          options={types}
          optionLabel='name'
          placeholder='Select Type'
          className='border-none rounded-none ml-4 cursor-pointer ring-0'
        />
      </div>

      <IconField iconPosition='left' className='relative w-fit'>
        <InputIcon className='pi pi-search' />
        <InputText
          type='search'
          placeholder='Search...'
          className='border-none ml-4 focus:ring-0'
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

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev: any) => ({ ...prev, profileImg: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveProfileImage = () => {
    setProfileImagePreview(null)
    setFormData((prev: any) => ({ ...prev, profileImg: '' }))
    // Reset the file input
    const fileInput = document.getElementById('profileImg') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleCvCertificates = (newFiles: File[]) => {
    setCvCertificates(newFiles)
  }

  const handleAgreement = (newFiles: File[]) => {
    setAgreement(newFiles)
  }
  const handleShowcaseLetter = (newFiles: File[]) => {
    setShowcaseLetter(newFiles)
  }
  const handleWarningLetter = (newFiles: File[]) => {
    setWarningLetter(newFiles)
  }
  const handleTermination = (newFiles: File[]) => {
    setTermination(newFiles)
  }
  const handleInsuranceClaiming = (newFiles: File[]) => {
    setInsuranceClaiming(newFiles)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev: any) => ({ ...prev, [id]: value }))
  }

  const handleDateChange = (
    e: { value: Date | Date[] | null },
    field: string
  ) => {
    if (e.value instanceof Date) {
      setFormData((prev: any) => ({ ...prev, [field]: e.value }))
    } else if (Array.isArray(e.value) && e.value[0] instanceof Date) {
      setFormData((prev: any) => ({
        ...prev,
        [field]: e.value,
      }))
    } else {
      setFormData((prev: any) => ({ ...prev, [field]: '' }))
    }
  }

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false)
  }

  const deleteProduct = async () => {
    let _products = products.filter(
      (val: { _id: any }) => val._id !== product._id
    )

    try {
      setLoading2(true)
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/employee-personal/delete/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      refetch()
      toast.success('Employee Removed Successfully')
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

  const refetch = () => {
    setLoading(true)
    const initialPayload = {
      date_range: '',
      searchQuery: '',
    }

    searchEmployeePersonalProfile(initialPayload).then((result) => {
      setProducts(result?.EmployeePersonals)
      setLoading(false)
    })
  }

  // initial data load
  useEffect(() => {
    refetch()
  }, [])

  // console.log(products)

  return (
    <>
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
            rows={20}
            first={currentPage * 20}
            onPage={onPage}
            paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
            currentPageReportTemplate='Showing {first} to {last} of {totalRecords} Datas'
            header={filterSearchForm}
            selectionMode='multiple'
            showGridlines
            emptyMessage='No data found!'
            loading={loading}
            scrollable
            // selectionPageOnly={true} 
            // metaKeySelection={false} 
            scrollHeight='600px'
            removableSort
          >
            {hasEditAccess && (
              <Column
                selectionMode='multiple'
                headerStyle={{ width: '3rem' }}
                exportable={false}
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
              ></Column>
            )}

            <Column
              field='boqNo'
              header='BOQ'
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-sm truncate max-w-lg'
              sortable
              showClearButton
            ></Column>

            <Column
              field='employeeId'
              headerClassName='bg-[#ffc2c2] text-sm text-sm min-w-[8rem]'
              bodyClassName='text-sm truncate max-w-lg'
              // sortable
              header='Employee ID'
            ></Column>

            <Column
              field='employeeName'
              headerClassName='bg-[#ffc2c2] text-sm min-w-[8rem]'
              bodyClassName='text-sm truncate max-w-lg'
              sortable
              header='Employee Name'
            ></Column>

            <Column
              field='position'
              headerClassName='bg-[#ffc2c2] text-sm min-w-[16rem]'
              bodyClassName='text-sm'
              // sortable
              header='Position'
            ></Column>

            <Column
              field='dept'
              headerClassName='bg-[#ffc2c2] text-sm min-w-[8rem]'
              bodyClassName='text-sm'
              sortable
              header='Department'
            ></Column>

            <Column
              field='dateOfMobilization'
              header='Date of Mobilization'
              headerClassName='bg-[#ffc2c2] text-sm text-sm min-w-[8rem]'
              bodyClassName='text-sm truncate max-w-lg'
              // sortable
            ></Column>

            <Column
              field='dateOfDemobilization'
              header='Date of Demobilization'
              headerClassName='bg-[#ffc2c2] text-sm min-w-[8rem]'
              bodyClassName='text-sm truncate max-w-lg'
              // sortable
            ></Column>

            <Column
              field='firmName'
              header='Firm Name'
              headerClassName='bg-[#ffc2c2] text-sm min-w-[8rem]'
              bodyClassName='text-sm truncate max-w-lg'
              // sortable
            ></Column>

            <Column
              field='branch'
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-sm truncate max-w-lg'
              sortable
              header='Branch'
            ></Column>

            <Column
              field='mobile'
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-sm truncate max-w-lg'
              // sortable
              header='Mobile'
            ></Column>

            <Column
              field='salary'
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-sm truncate max-w-lg'
              sortable
              header='Salary'
            ></Column>

            <Column
              body={actionBodyTemplate}
              headerClassName='bg-[#ffc2c2] text-sm min-w-[240px]'
              bodyClassName='text-sm'
              header='Action'
              exportable={false}
              frozen
              alignFrozen='right'
            ></Column>
          </DataTable>
        </div>

        {/* upload data dialog  */}
        <Dialog
          visible={productDialog}
          style={{ width: '60rem' }}
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
                <label htmlFor='employeeName' className='font-bold'>
                  Employee Name
                </label>
                <InputText
                  id='employeeName'
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='employeeId' className='font-bold'>
                  Employee ID
                </label>
                <InputText
                  id='employeeId'
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='dept' className='font-bold'>
                  Department
                </label>
                <InputText
                  id='dept'
                  value={formData.dept}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='position' className='font-bold'>
                  Position
                </label>
                <InputText
                  id='position'
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='remarks' className='font-bold'>
                  Remarks
                </label>
                <InputText
                  id='remarks'
                  value={formData.remarks}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='salary' className='font-bold'>
                  Salary
                </label>
                <InputText
                  id='salary'
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='boqNo' className='font-bold'>
                  BoqNo
                </label>
                <InputText
                  id='boqNo'
                  value={formData.boqNo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='location' className='font-bold'>
                  Location
                </label>
                <InputText
                  id='location'
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='branch' className='font-bold'>
                  Branch
                </label>
                <InputText
                  id='branch'
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='mobile' className='font-bold'>
                  Mobile
                </label>
                <InputText
                  id='mobile'
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='address' className='font-bold'>
                  Address
                </label>
                <InputText
                  id='address'
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='email' className='font-bold'>
                  Email
                </label>
                <InputText
                  id='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor='date' className='font-bold'>
                  Date Of Mobilization
                </label>
                <div className='border rounded-md'>
                  <Calendar
                    id='date'
                    value={formData.dateOfMobilization}
                    // @ts-ignore
                    onChange={(e) => handleDateChange(e, 'dateOfMobilization')}
                    dateFormat='dd/mm/yy'
                    inputClassName='border-0 focus:ring-0 cursor-pointer'
                    className='focus:ring-0'
                    placeholder='Select Date'
                  />
                </div>
              </div>

              <div>
                <label htmlFor='date' className='font-bold'>
                  Date Of Demobilization
                </label>
                <div className='border rounded-md'>
                  <Calendar
                    id='date'
                    value={formData.dateOfDemobilization}
                    // @ts-ignore
                    onChange={(e) =>
                      // @ts-ignore
                      handleDateChange(e, 'dateOfDemobilization')
                    }
                    dateFormat='dd/mm/yy'
                    inputClassName='border-0 focus:ring-0 cursor-pointer'
                    className='focus:ring-0'
                    placeholder='Select Date'
                  />
                </div>
              </div>
              <div className='field'>
                <label htmlFor='firmName' className='font-bold'>
                  Firm Name
                </label>
                <InputText
                  id='firmName'
                  value={formData.firmName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className='gap-3 mt-5'>
              <label className='block mb-1 font-semibold'>
                Upload CV Certificate Files
              </label>

              <div>
                <MultiFileInput onFilesChange={handleCvCertificates} />
              </div>
            </div>

            <div className='gap-3 mt-5'>
              <label className='block mb-1 font-semibold'>
                Upload Agreements Files
              </label>

              <div>
                <MultiFileInput onFilesChange={handleAgreement} />
              </div>
            </div>

            <div className='gap-3 mt-5'>
              <label className='block mb-1 font-semibold'>
                Upload Showcase Letter Files
              </label>

              <div>
                <MultiFileInput onFilesChange={handleShowcaseLetter} />
              </div>
            </div>

            <div className='gap-3 mt-5'>
              <label className='block mb-1 font-semibold'>
                Upload Warning Letter Files
              </label>

              <div>
                <MultiFileInput onFilesChange={handleWarningLetter} />
              </div>
            </div>

            <div className='gap-3 mt-5'>
              <label className='block mb-1 font-semibold'>
                Upload Resignation or Termination Files
              </label>

              <div>
                <MultiFileInput onFilesChange={handleTermination} />
              </div>
            </div>

            <div className='gap-3 mt-5'>
              <label className='block mb-1 font-semibold'>
                Upload Insurance Claiming Files
              </label>

              <div>
                <MultiFileInput onFilesChange={handleInsuranceClaiming} />
              </div>
            </div>

            <div className='field col-span-2'>
              <label htmlFor='profileImg' className='block mb-1 font-semibold'>
                Profile Image
              </label>
              <input
                type='file'
                id='profileImg'
                accept='image/*'
                onChange={handleProfileImageChange}
                className='w-full'
              />
              {profileImagePreview && (
                <div className='mt-4 relative w-fit'>
                  <img
                    src={profileImagePreview}
                    alt='Profile Preview'
                    className='rounded-full w-24 h-24 object-cover'
                  />
                  <button
                    onClick={handleRemoveProfileImage}
                    className='absolute -top-1 -right-1 px-2 py-0.5 bg-red-500 text-white rounded-full'
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          </>
        </Dialog>

        {/* delete data dialog  */}
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
                Are you sure you want to delete <b>{product.employeeName}</b>?
              </span>
            )}
          </div>
        </Dialog>

        {/* multi delete dialog  */}
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

        {/* View Employee Detail Dialog */}
        <Dialog
          visible={viewDialogVisible}
          style={{ width: '90vw' }}
          header='Employee Details'
          modal
          className='p-fluid'
          onHide={() => setViewDialogVisible(false)}
          maximizable
          footer={
            <button
              className='text-white font-semibold py-2 px-6 rounded-md bg-red-500'
              onClick={() => setViewDialogVisible(false)}
            >
              Close
            </button>
          }
        >
          <div
            className='overflow-y-auto'
            // style={{ height: 'calc(90vh - 120px)' }}
          >
            {selectedEmployeeId && (
              <EmPersonalDetail id={selectedEmployeeId} isDialog={true} />
            )}
          </div>
        </Dialog>
      </div>
    </>
  )
}
