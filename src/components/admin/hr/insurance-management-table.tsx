import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import '@/styles/table-style.css'
import { searchInsuranceManagement } from '@/api/adminAPIs'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import MultiFileInput from '@/components/MultiFileInput'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'
import { useLocation, useNavigate } from 'react-router-dom'

interface Attachment {
  url: string
  attachmentDate: string
  _id: string
}

interface InsuranceData {
  _id: string
  name: string
  employeeId: string
  mobilizationDate: string
  effectiveDate: string
  position: string
  dept: string
  placeOfWork: string
  type: string
  dateOfInsurance: string
  yearOfInsurance: string
  calmingDate: string
  receivedCompensation: string
  derivedCompensation: string
  numberOfEmployee: string
  remarks: string
  attachments: Attachment[]
}

export default function InsuranceManagementTable() {
  const types = [
    { name: 'Inclusion', code: 'Inclusion' },
    { name: 'Exclusion', code: 'Exclusion' },
  ]
  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'admin')
  const checkPermission = checkRole?.children.find((c) => c.name === 'hr')

  const hasEditAccess = checkPermission?.edit_authority || false

  const isAdmin = roles.some((role) =>
    ['superadmin', 'admin'].includes(role.title)
  )
  const emptyInsuranceData: InsuranceData = {
    _id: '',
    name: '',
    employeeId: '',
    mobilizationDate: '',
    effectiveDate: '',
    position: '',
    dept: '',
    placeOfWork: '',
    type: '',
    dateOfInsurance: '',
    yearOfInsurance: '',
    calmingDate: '',
    receivedCompensation: '',
    derivedCompensation: '',
    numberOfEmployee: '',
    remarks: '',
    attachments: [],
  }

  const [insuranceData, setInsuranceData] = useState<InsuranceData[]>([])
  const [uploadDialog, setUploadDialog] = useState<boolean>(false)
  const [formData, setFormData] = useState<InsuranceData>(emptyInsuranceData)
  const [selectedInsuranceData, setSelectedInsuranceData] =
    useState<any>(emptyInsuranceData)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const dt = useRef<DataTable<InsuranceData[]>>(null)
  const [searchDate, setSearchDate] = useState<Date | null>(null)
  const [searchDate2, setSearchDate2] = useState<Date | null>(null)
  const [searchKey, setSearchKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [allData, setAllData] = useState<any>([])
  const [selectedType, setSelectedType] = useState(null)
  const [dateOfMobilization, setDateOfMobilization] = useState<string>('')
  const [dateOfInsurance, setDateOfInsurance] = useState<string>('')
  const [calmingDate, setCalmingDate] = useState<string>('')
  const [effectiveDate, setEffectiveDate] = useState<string>('')
  const [filesInput, setFilesInput] = useState<File[]>([])
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<InsuranceData[]>([])

  const [currentPage, setCurrentPage] = useState<number>(0)
  const navigate = useNavigate()
  const location = useLocation()

  const openNew = () => {
    setFormData(emptyInsuranceData)
    setSubmitted(false)
    setUploadDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setUploadDialog(false)
  }

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

  function formatDate(dateTime?: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  const handleFileChange = (newFiles: File[]) => {
    setFilesInput(newFiles)
  }

  const uploadInsuranceData = async () => {
    setSubmitted(true)

    try {
      setLoading2(true)

      const data = new FormData()

      data.append('name', formData.name)
      data.append('employeeId', formData.employeeId)
      data.append('mobilizationDate', formatDate(dateOfMobilization))
      data.append('effectiveDate', formatDate(effectiveDate))
      data.append('position', formData.position)
      data.append('dept', formData.dept)
      data.append('placeOfWork', formData.placeOfWork)
      // @ts-ignore
      data.append('type', formData.type?.code || '')
      data.append('dateOfInsurance', formatDate(dateOfInsurance))
      data.append('yearOfInsurance', formData.yearOfInsurance)
      data.append('calmingDate', formatDate(calmingDate))
      data.append('receivedCompensation', formData.receivedCompensation)
      data.append('derivedCompensation', formData.derivedCompensation)
      data.append('numberOfEmployee', formData.numberOfEmployee)
      data.append('remarks', formData.remarks)
      filesInput.forEach((file) => {
        data.append('attachments', file)
      })

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/insurance/upload`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      console.log(response.data)
      hideDialog()
      fetchInsuranceData()
      toast.success('Data Saved Successfully')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/insurance/delete/multiple/data`,
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
      fetchInsuranceData()
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
              Upload Insurance Data
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

  const deleteProduct = async () => {
    let _products = insuranceData.filter(
      (val: { _id: any }) => val._id !== selectedInsuranceData._id
    )

    try {
      setLoading2(true)
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/insurance/delete/${selectedInsuranceData._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      fetchInsuranceData()
      toast.success('Insurance Removed Successfully')
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

    setInsuranceData(_products)
    setDeleteProductDialog(false)
    setSelectedInsuranceData(emptyInsuranceData)
  }

  const confirmDeleteProduct = (product: any) => {
    setSelectedInsuranceData(product)
    setDeleteProductDialog(true)
  }

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false)
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

  const actionBodyTemplate = (rowData: InsuranceData) => {
    return (
      <div className='flex items-center gap-3'>
        <Link
          to={`/administrative/insurance-management/${rowData._id}?page=${currentPage}`}
        >
          <Button
            icon='pi pi-eye text-blue-500'
            text
            raised
            severity='secondary'
            label='View'
            className='text-sm'
          />
        </Link>
        {hasEditAccess && (
          <Button
            text
            raised
            severity='secondary'
            icon='pi pi-trash text-red-600 font-semibold'
            label='Remove'
            className='text-sm'
            onClick={() => confirmDeleteProduct(rowData)}
          />
        )}
      </div>
    )
  }

  const handleSearch = () => {
    setLoading(true)
    const searchPayload = {
      date_range:
        searchDate && searchDate2
          ? `${formatDate(searchDate)} to ${formatDate(searchDate2)}`
          : '',
      // @ts-ignore
      type: selectedType?.code || '',
      searchQuery: searchKey,
    }

    searchInsuranceManagement(searchPayload).then((result) => {
      setInsuranceData(result?.InsuranceManage)
      setAllData(result)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      date_range: '',
      searchQuery: '',
      type: '',
    }

    setSearchDate(null)
    setSearchDate2(null)
    setSelectedType(null)
    setSearchKey('')

    searchInsuranceManagement(initialPayload).then((result) => {
      setInsuranceData(result?.InsuranceManage)
      setAllData(result)
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
        className='flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white'
        aria-label='Search and filter form'
      >
        <Calendar
          value={searchDate}
          // @ts-ignore
          onChange={(e) => setSearchDate(e.value)}
          inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
          placeholder='Start Date'
          showIcon
        />

        <div>
          <Calendar
            value={searchDate2}
            // @ts-ignore
            onChange={(e) => setSearchDate2(e.value)}
            inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
            placeholder='End Date'
            showIcon
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

        <div>
          <InputText
            type='text'
            placeholder='Search...'
            className='border-none ml-4 focus:ring-0'
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
          />
        </div>

        <button
          onClick={handleSearch}
          className='ml-4 bg-green-500 px-4 py-2.5 rounded-lg'
          type='submit'
        >
          <i className='pi pi-search text-white'></i>
        </button>
      </div>

      <div className='flex w-fit gap-2 border p-4 rounded-md bg-blue-50 text-gray-600 divide-x-2 divide-zinc-400'>
        <h1>Total Inclusion: {allData?.totalInclusion}</h1>
        <h1 className='pl-2'>Total Exclusion: {allData?.totalExclusion}</h1>
        <h1 className='pl-2'>Net Inclusion: {allData?.netInclusion}</h1>
      </div>
    </div>
  )

  const uploadDialogFooter = (
    <>
      <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
      <Button
        label='Upload'
        loading={loading2}
        icon='pi pi-check'
        onClick={uploadInsuranceData}
      />
    </>
  )

  const fetchInsuranceData = () => {
    setLoading(true)
    const initialPayload = {
      date_range: '',
      type: '',
      searchQuery: '',
    }

    searchInsuranceManagement(initialPayload).then((result) => {
      setInsuranceData(result?.InsuranceManage)
      setAllData(result)
      setLoading(false)
    })
  }

  // console.log(allData)

  useEffect(() => {
    fetchInsuranceData()
  }, [])

  // console.log(insuranceData)

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
          value={insuranceData}
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
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} records'
          header={filterSearchForm}
          showGridlines
          emptyMessage='No data found!'
          loading={loading}
          cellSelection
          selectionMode='multiple'
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
            field='employeeId'
            header='ID'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-lg'
            // sortable
          ></Column>

          <Column
            field='name'
            header='Name'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-lg'
            sortable
          ></Column>

          <Column
            field='position'
            header='Position'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-lg'
            // sortable
          ></Column>

          <Column
            field='dept'
            header='Department Name'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-lg'
            sortable
          ></Column>

          <Column
            field='effectiveDate'
            header='Effective Date'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-lg'
            // sortable
          ></Column>

          <Column
            field='type'
            header='Inclusion/Exclusion'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-lg'
            // sortable
          ></Column>

          <Column
            field='remarks'
            header='Remarks'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-lg'
            // sortable
          ></Column>

          <Column
            body={actionBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-lg'
            header='Actions'
            frozen
            exportable={false}
            alignFrozen='right'
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={uploadDialog}
        style={{ width: '50rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Upload Insurance Data'
        modal
        className='p-fluid'
        footer={uploadDialogFooter}
        onHide={hideDialog}
      >
        <div className='grid grid-cols-2 gap-4'>
          <div className='field'>
            <label htmlFor='name' className='font-bold'>
              Name
            </label>
            <InputText
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className='field'>
            <label htmlFor='employeeId' className='font-bold'>
              Employee ID
            </label>
            <InputText
              id='employeeId'
              value={formData.employeeId}
              onChange={(e) =>
                setFormData({ ...formData, employeeId: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor='date' className='font-bold'>
              Date of Mobilization
            </label>
            <div className='border rounded-md'>
              <Calendar
                id='date'
                // @ts-ignore
                onChange={(e) => setDateOfMobilization(e.value)}
                dateFormat='dd/mm/yy'
                inputClassName='border-0 focus:ring-0 cursor-pointer'
                className='focus:ring-0'
                placeholder='Select Date'
              />
            </div>
          </div>

          <div>
            <label htmlFor='date' className='font-bold'>
              Effective Date
            </label>
            <div className='border rounded-md'>
              <Calendar
                id='date'
                // @ts-ignore
                onChange={(e) => setEffectiveDate(e.value)}
                dateFormat='dd/mm/yy'
                inputClassName='border-0 focus:ring-0 cursor-pointer'
                className='focus:ring-0'
                placeholder='Select Date'
              />
            </div>
          </div>
          <div className='field'>
            <label htmlFor='position' className='font-bold'>
              Position
            </label>
            <InputText
              id='position'
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
          </div>
          <div className='field'>
            <label htmlFor='dept' className='font-bold'>
              Department
            </label>
            <InputText
              id='dept'
              value={formData.dept}
              onChange={(e) =>
                setFormData({ ...formData, dept: e.target.value })
              }
            />
          </div>
          <div className='field'>
            <label htmlFor='placeOfWork' className='font-bold'>
              Place of Work
            </label>
            <InputText
              id='placeOfWork'
              value={formData.placeOfWork}
              onChange={(e) =>
                setFormData({ ...formData, placeOfWork: e.target.value })
              }
            />
          </div>
          <div className='field'>
            <label htmlFor='type' className='font-bold'>
              Type
            </label>
            <Dropdown
              id='type'
              value={formData.type}
              options={types}
              onChange={(e) => setFormData({ ...formData, type: e.value })}
              optionLabel='name'
              placeholder='Select Type'
            />
          </div>
          <div className='field'>
            <label htmlFor='dateOfInsurance' className='font-bold'>
              Date of Insurance
            </label>
            <Calendar
              id='date'
              // @ts-ignore
              onChange={(e) => setDateOfInsurance(e.value)}
              dateFormat='dd/mm/yy'
              // inputClassName='border-0 focus:ring-0 cursor-pointer'
              className='focus:ring-0'
              placeholder='Select Date'
            />
          </div>
          <div className='field'>
            <label htmlFor='yearOfInsurance' className='font-bold'>
              Year of Insurance
            </label>
            <InputText
              id='yearOfInsurance'
              value={formData.yearOfInsurance}
              onChange={(e) =>
                setFormData({ ...formData, yearOfInsurance: e.target.value })
              }
            />
          </div>
          <div className='field'>
            <label htmlFor='calmingDate' className='font-bold'>
              Calming Date
            </label>
            <Calendar
              id='date'
              // @ts-ignore
              onChange={(e) => setCalmingDate(e.value)}
              dateFormat='dd/mm/yy'
              // inputClassName='border-0 focus:ring-0 cursor-pointer'
              className='focus:ring-0'
              placeholder='Select Date'
            />
          </div>
          <div className='field'>
            <label htmlFor='receivedCompensation' className='font-bold'>
              Received Compensation
            </label>
            <InputText
              id='receivedCompensation'
              value={formData.receivedCompensation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  receivedCompensation: e.target.value,
                })
              }
            />
          </div>
          <div className='field'>
            <label htmlFor='derivedCompensation' className='font-bold'>
              Derived Compensation
            </label>
            <InputText
              id='derivedCompensation'
              value={formData.derivedCompensation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  derivedCompensation: e.target.value,
                })
              }
            />
          </div>
          <div className='field'>
            <label htmlFor='numberOfEmployee' className='font-bold'>
              Number of Employees
            </label>
            <InputText
              id='numberOfEmployee'
              value={formData.numberOfEmployee}
              onChange={(e) =>
                setFormData({ ...formData, numberOfEmployee: e.target.value })
              }
            />
          </div>

          <div className='field'>
            <label htmlFor='remarks' className='font-bold'>
              Remarks
            </label>
            <InputText
              id='remarks'
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
            />
          </div>
        </div>

        <div className='gap-3 mt-5'>
          <label className='block mb-1 font-semibold'>
            Upload Insurance Claiming Documents
            <span className='text-red-500 ml-1'>*</span>
          </label>

          <div>
            <MultiFileInput onFilesChange={handleFileChange} />
          </div>
        </div>
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
          {selectedInsuranceData && (
            <span className='text-red-500'>
              Are you sure you want to delete{' '}
              <b>{selectedInsuranceData?.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

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
