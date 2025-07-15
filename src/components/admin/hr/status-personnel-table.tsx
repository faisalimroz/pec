import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import '@/styles/table-style.css'
import { searchStatusPersonnel } from '@/api/adminAPIs'
import { Calendar } from 'primereact/calendar'
import RefreshButton from '@/components/refresh-button'
import { Dialog } from 'primereact/dialog'
import axios from 'axios'
import { toast } from 'sonner'
import { useAuth } from '@/provider/authProvider'

interface Product {
  id: string | null
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

export default function StatusPersonnelTable() {
  let emptyProduct: Product = {
    id: null,
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
  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'admin')
  const checkPermission = checkRole?.children.find((c) => c.name === 'hr')

  const hasEditAccess = checkPermission?.edit_authority || false

  const isAdmin = roles.some((role) =>
    ['superadmin', 'admin'].includes(role.title)
  )
  const [products, setProducts] = useState<any>([])
  const [product, setProduct] = useState<any>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const toast1 = useRef<Toast>(null)
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [searchKey, setSearchKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [allData, setAllData] = useState<any>([])
  const [searchDate, setSearchDate] = useState<Date | null>(null)
  const [searchDate2, setSearchDate2] = useState<Date | null>(null)
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)

  function getMonthName(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { month: 'long' })
  }

  function formatDate(dateTime?: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  function getYear(dateString: string) {
    const date = new Date(dateString)
    return date.getFullYear()
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      date_range:
        searchDate && searchDate2
          ? `${formatDate(searchDate)} to ${formatDate(searchDate2)}`
          : '',
      searchQuery: searchKey,
    }

    searchStatusPersonnel(initialPayload).then((result) => {
      setProducts(result?.data)
      setLoading(false)
    })
  }

  const handleReset = () => {
    setLoading(true)

    const initialPayload = {
      date_range: '',
      searchQuery: '',
    }

    setSearchDate(null)
    setSearchDate2(null)
    setSearchKey('')

    searchStatusPersonnel(initialPayload).then((result) => {
      setProducts(result?.data)
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
        {/* <Calendar
          // @ts-ignore
          value={date2}
          // @ts-ignore
          onChange={(e) => setDate2(e.value)}
          dateFormat='mm/dd/yy'
          inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
          placeholder='Select Date'
          showIcon
          icon={() => <i className='pi pi-angle-down' />}
        />

        <div>
          <InputText
            type='text'
            placeholder='Position'
            className='border-none ml-4 focus:ring-0'
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>

        <div>
          <InputText
            type='text'
            placeholder='Department                                  '
            className='border-none ml-4 focus:ring-0'
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div> */}

        <div>
          <Calendar
            value={searchDate}
            // @ts-ignore
            onChange={(e) => setSearchDate(e.value)}
            inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
            placeholder='Start Date'
            showIcon
          />
        </div>
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

      <div className='flex w-fit gap-2 divide-x-2 border p-4 rounded-md bg-blue-50 text-gray-600'>
        <h1>Total Mobilization: {allData?.totalMobilization}</h1>
        <h1 className='pl-2'>
          Total De-Mobilization: {allData?.totalDemobilization}
        </h1>
        <h1 className='pl-2'>Current Employee: {allData?.totalEmployee}</h1>
      </div>
    </div>
  )
  const attachmentBodyTemplate = (rowData: any) => {
    const date = rowData?.dateOfDemobilization
    return date === '' ? (
      <span className='text-lg text-gray-500'>---/--/---</span>
    ) : (
      <span>{date}</span>
    )
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
      setLoading(true)
      const selectedIds = selectedProducts.map((product: any) => product._id)

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
      setLoading(false)
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
        disabled={loading}
      >
        Delete
      </button>
    </div>
  )

  // multi delete func end

  const rightToolbarTemplate = () => {
    return (
      <div className='space-x-2'>
        {hasEditAccess && (
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

  const refetch = () => {
    setLoading(true)
    const initialPayload = {
      searchQuery: '',
      date_range: '',
    }

    searchStatusPersonnel(initialPayload).then((result) => {
      setProducts(result?.data)
      setAllData(result)
      setLoading(false)
    })
  }

  // initial data load
  useEffect(() => {
    refetch()
  }, [])

  // console.log(allData)

  return (
    <div className='ml-4'>
      <Toast ref={toast1} />
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
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} Datas'
          header={filterSearchForm}
          selectionMode='multiple'
          showGridlines
          cellSelection
          emptyMessage='No data found!'
          loading={loading}
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

          {/* <Column
            field='serial'
            header='Serial No.'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column> */}

          <Column
            field='boqNo'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='BOQ No.'
          ></Column>

          <Column
            field='employeeId'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            // sortable
            header='Employee ID'
          ></Column>

          <Column
            field='employeeName'
            header='Employee Name'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='position'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            // sortable
            header='Position'
          ></Column>

          <Column
            field='dept'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Department'
          ></Column>

          <Column
            field='dateOfMobilization'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            // sortable
            header='Date of Mobilization'
          ></Column>

          <Column
            body={attachmentBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            // sortable
            header='Date of Demobilization'
          ></Column>

          <Column
            field='branch'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Branch'
          ></Column>

          {/* <Column
            field='remarks'
            header='Remarks'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column> */}

          {/* <Column
            body={actionBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            header='Actions'
            headerStyle={{ width: '3rem' }}
            exportable={false}
          ></Column> */}
        </DataTable>
      </div>

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
