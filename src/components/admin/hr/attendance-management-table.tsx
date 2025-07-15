import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import '@/styles/table-style.css'
import { searchAttendanceManagement } from '@/api/adminAPIs'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown'
import MultiFileInput from '@/components/MultiFileInput'
import { Menu } from 'primereact/menu'
import { toast } from 'sonner'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

interface Attachment {
  url: string
  _id: string
}

interface Product {
  _id: string
  date: string
  name: string
  employeeId: string
  position: string
  dept: string
  shiftManage: string
  dateOfDemobilization: string
  dateOfMobilization: string
  inTime: string
  outTime: string
  totalHours: string
  remarks: string
  attachments: Attachment[]
  creator?: string
  creationTimestamp?: string
  updater?: string
  updatingTimestamp?: string
}

export default function AttendanceManagementTable() {
  let emptyProduct: Product = {
    _id: '',
    date: '',
    name: '',
    employeeId: '',
    position: '',
    dept: '',
    shiftManage: '',
    dateOfDemobilization: '',
    dateOfMobilization: '',
    inTime: '',
    outTime: '',
    totalHours: '',
    remarks: '',
    attachments: [],
  }
  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'admin')
  const checkPermission = checkRole?.children.find((c) => c.name === 'hr')

  const hasEditAccess = checkPermission?.edit_authority || false

  const isAdmin = roles.some((role) =>
    ['superadmin', 'admin'].includes(role.title)
  )
  const codes = [
    { name: 'Shift 1 (08:00 - 16:00)', code: 'SFT1' },
    { name: 'Shift 2 (16:00 - 24:00)', code: 'SFT2' },
    { name: 'Shift 3 (00:00 - 08:00)', code: 'SFT3' },
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
  const [searchKey2, setSearchKey2] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [name, setName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [position, setPosition] = useState('')
  const [dept, setDept] = useState('')
  const [shiftManage, setShiftManage] = useState('')
  const [inTime, setInTime] = useState<string>('')
  const [outTime, setOutTime] = useState<string>('')
  const [remarks, setRemarks] = useState('')
  const [formDate, setFormDate] = useState<string>('')
  const [formDate2, setFormDate2] = useState<string>('')
  const [formDate3, setFormDate3] = useState<string>('')
  const [selectedCode, setSelectedCode] = useState(null)
  const [filesInput, setFilesInput] = useState<File[]>([])
  const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)

  const openUpdateDialog = (product: Product) => {
    setUpdatedProduct({ ...product })
    setUpdateProductDialog(true)
  }

  const hideUpdateDialog = () => {
    setUpdateProductDialog(false)
    setUpdatedProduct(null)
    setNewAttachments([])
    setRemovedAttachments([])
  }

  const handleUpdateProduct = async () => {
    if (!updatedProduct) return

    try {
      setLoading2(true)
      const formData = new FormData()
      formData.append('name', updatedProduct.name)
      formData.append('employeeId', updatedProduct.employeeId)
      formData.append('position', updatedProduct.position)
      formData.append('dept', updatedProduct.dept)
      formData.append('shiftManage', updatedProduct.shiftManage)
      formData.append(
        'dateOfDemobilization',
        updatedProduct.dateOfDemobilization
      )
      formData.append('dateOfMobilization', updatedProduct.dateOfMobilization)
      formData.append('inTime', updatedProduct.inTime)
      formData.append('outTime', updatedProduct.outTime)
      formData.append('remarks', updatedProduct.remarks)
      formData.append('date', updatedProduct.date)

      newAttachments.forEach((file) => {
        formData.append('attachments', file)
      })

      removedAttachments.forEach((attachmentId) => {
        formData.append('removedAttachments', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/attendance/update/${updatedProduct._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      refetch()
      hideUpdateDialog()
      toast.success('Data Updated Successfully')
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

  const handleNewAttachments = (files: File[]) => {
    setNewAttachments(files)
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    setRemovedAttachments((prev) => [...prev, attachmentId])
    setUpdatedProduct((prev) => {
      if (!prev) return null
      return {
        ...prev,
        attachments: prev.attachments.filter((a) => a._id !== attachmentId),
      }
    })
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

  function formatTime(dateTime: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  const saveProduct = async () => {
    try {
      setLoading2(true)
      const formData = new FormData()
      formData.append('name', name)
      formData.append('employeeId', employeeId)
      formData.append('position', position)
      formData.append('dept', dept)
      formData.append('shiftManage', shiftManage)
      formData.append('inTime', formatTime(inTime))
      formData.append('outTime', formatTime(outTime))
      formData.append('remarks', remarks)
      formData.append('date', formatDate(formDate))
      formData.append('dateOfDemobilization', formatDate(formDate2))
      formData.append('dateOfMobilization', formatDate(formDate3))
      filesInput.forEach((file) => {
        formData.append('attachments', file)
      })

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/attendance/upload`,
        formData,
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/attendance/delete/${product._id}`,
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

  const exportCSV = () => {
    if (selectedProducts && selectedProducts.length > 0) {
      dt.current?.exportCSV({ selectionOnly: true })
    } else {
      dt.current?.exportCSV()
    }
  }

  // const confirmDeleteSelected = () => {
  //   setDeleteProductsDialog(true)
  // }

  // const deleteSelectedProducts = () => {
  //   // @ts-ignore
  //   let _products = products.filter((val) => !selectedProducts.includes(val))

  //   setProducts(_products)
  //   setDeleteProductsDialog(false)
  //   setSelectedProducts([])
  // }

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
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/attendance/delete/multiple/data`,
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

  const hideViewDialog = () => {
    setViewProductDialog(false)
    setSelectedProduct(null)
  }

  const viewProduct = (product: Product) => {
    setSelectedProduct(product)
    setViewProductDialog(true)
  }

  const downloadAllFiles = () => {
    selectedProduct?.attachments.forEach((attachment) => {
      window.open(attachment.url, '_blank')
    })
  }

  const downloadAttachmentsAsZip = async (attachments: any) => {
    const zip = new JSZip()
    const folder = zip.folder('attachments')

    console.log('dataaaaaaaaaaaaaa===> ', attachments)

    for (const attachment of attachments) {
      try {
        const response = await fetch(attachment.url)
        const blob = await response.blob()
        const filename = attachment.url.split('/').pop()
        //@ts-ignore
        folder.file(filename, blob)
      } catch (error) {
        console.error(`Failed to fetch ${attachment.url}:`, error)
      }
    }

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'attachments.zip')
  }

  const actionBodyTemplate = (rowData: Product) => {
    const menuRef = useRef<Menu>(null)
    const items = [
      {
        label: 'View',
        icon: 'pi pi-eye',
        command: () => viewProduct(rowData),
      },
    ]
    if (hasEditAccess) {
      items.push(
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
        {
          label: 'Download All Attachments (Zip)',
          icon: 'pi pi-download',
          command: () => downloadAttachmentsAsZip(rowData.attachments),
        }
      )
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
      //@ts-ignore
      shiftManage: selectedCode ? selectedCode?.name : '',
      date: date ? getMonthName(date) : '',
      year: date2 ? getYear(date2) : '',
      searchQuery: searchKey,
    }

    searchAttendanceManagement(initialPayload).then((result) => {
      setProducts(result?.Attendances)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      shiftManage: '',
      date: '',
      year: '',
      searchQuery: '',
    }

    setDate('')
    setDate2('')
    setSearchKey('')
    setSearchKey2('')
    setSelectedCode(null)

    searchAttendanceManagement(initialPayload).then((result) => {
      setProducts(result?.Attendances)
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
      <Calendar
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
          onChange={(e) => setSearchKey2(e.target.value)}
          value={searchKey2}
        />
      </div>

      <div>
        <InputText
          type='text'
          placeholder='Department                                  '
          className='border-none ml-4 focus:ring-0'
          onChange={(e) => setSearchKey(e.target.value)}
          value={searchKey}
        />
      </div>
      <div>
        <Dropdown
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.value)}
          options={codes}
          optionLabel='name'
          placeholder='By Shift'
          className='border-none rounded-none ml-4 cursor-pointer ring-0'
        />
      </div>

      <div>
        <button
          onClick={() => handleSearch()}
          className='ml-4 right-1 border bg-green-500 px-4 py-2.5 rounded-lg'
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

  const attachmentBodyTemplate = (rowData: any) => {
    const date = rowData?.dateOfDemobilization
    return date === '' ? (
      <span className='text-lg text-gray-500'>---/--/---</span>
    ) : (
      <span>{date}</span>
    )
  }

  const attachmentBodyTemplate2 = (rowData: any) => {
    return <div>{rowData?.attachments?.length}</div>
  }

  const refetch = () => {
    setLoading(true)
    const initialPayload = {
      month: '',
      year: '',
      searchQuery: '',
    }

    searchAttendanceManagement(initialPayload).then((result) => {
      setProducts(result?.Attendances)

      setLoading(false)
    })
  }

  // initial data load
  useEffect(() => {
    refetch()
  }, [])

  // console.log(products)

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
          scrollable
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
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            // sortable
            header='ID'
            className='min-w-[14rem]'
          ></Column>

          <Column
            field='name'
            header='Employee Name'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            className='min-w-[14rem]'
          ></Column>

          <Column
            field='position'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Position'
            className='min-w-[12rem]'
          ></Column>

          <Column
            field='dept'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Department Name'
            className='min-w-[14rem]'
          ></Column>

          <Column
            field='dateOfMobilization'
            headerClassName='bg-[#ffc2c2] text-sm min-w-[14rem]'
            bodyClassName='text-sm truncate max-w-xs'
            // sortable
            header='Date of Mobilization'
          ></Column>

          <Column
            field='dateOfDemobilization'
            headerClassName='bg-[#ffc2c2] text-sm min-w-[14rem]'
            bodyClassName='text-sm truncate max-w-xs'
            // sortable
            header='Date of Demobilization'
          ></Column>

          <Column
            field='shiftManage'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            // sortable
            header='Shift Management'
            className='min-w-[14rem]'
          ></Column>

          <Column
            field='inTime'
            headerClassName='bg-[#A8ECB5] text-sm'
            // sortable
            header='In Time'
            className='min-w-[8rem]'
          ></Column>

          <Column
            field='outTime'
            headerClassName='bg-[#A8ECB5] text-sm'
            // sortable
            header='Out Time'
            className='min-w-[8rem]'
          ></Column>

          <Column
            field='totalHours'
            headerClassName='bg-[#A8ECB5] text-sm'
            // sortable
            header='Total Hours'
            className='min-w-[10rem]'
          ></Column>

          <Column
            body={attachmentBodyTemplate2}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            // sortable
            header='Attachment'
          ></Column>

          <Column
            field='remarks'
            header='Remarks'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            // sortable
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
        visible={viewProductDialog}
        style={{ width: '50rem' }}
        header='Document Details'
        modal
        className='p-fluid'
        footer={viewProductDialogFooter}
        onHide={hideViewDialog}
      >
        {selectedProduct && (
          <>
            <div className='mb-6 border border-gray-200 rounded-lg'>
              <div className='bg-gray-50 px-4 py-2 border-b border-gray-200'>
                <h3 className='text-gray-700 font-semibold'>
                  Document History
                </h3>
              </div>
              <div className='p-4 space-y-4'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h4 className='text-sm font-medium text-gray-500'>
                      Created By
                    </h4>
                    <div className='mt-1'>
                      <p className='text-sm text-gray-900'>
                        {selectedProduct?.creator || 'N/A'}
                      </p>
                      {selectedProduct?.creationTimestamp && (
                        <p className='text-sm text-gray-600'>
                          <span>
                            Date:{' '}
                            {selectedProduct.creationTimestamp.split(' ')[0]}
                          </span>
                          <span className='mx-1'>•</span>
                          <span>
                            Time:{' '}
                            {selectedProduct.creationTimestamp.split(' ')[1]}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className='text-sm font-medium text-gray-500'>
                      Last Modified By
                    </h4>
                    <div className='mt-1'>
                      <p className='text-sm text-gray-900'>
                        {selectedProduct?.updater || 'N/A'}
                      </p>
                      {selectedProduct?.updatingTimestamp && (
                        <p className='text-sm text-gray-600'>
                          <span>
                            Date:{' '}
                            {selectedProduct.updatingTimestamp.split(' ')[0]}
                          </span>
                          <span className='mx-1'>•</span>
                          <span>
                            Time:{' '}
                            {selectedProduct.updatingTimestamp.split(' ')[1]}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h3 className='font-bold'>Name</h3>
                <p className='break-all'>{selectedProduct.name}</p>
              </div>
              <div>
                <h3 className='font-bold'>Employee ID No.</h3>
                <p className='break-all'>{selectedProduct.employeeId}</p>
              </div>
              <div>
                <h3 className='font-bold'>Department Name</h3>
                <p className='break-all'>{selectedProduct.dept}</p>
              </div>
              <div>
                <h3 className='font-bold'>Position</h3>
                <p className='break-all'>{selectedProduct.position}</p>
              </div>
              <div>
                <h3 className='font-bold'>Date Of Mobilization</h3>
                <p className='break-all'>
                  {selectedProduct.dateOfMobilization}
                </p>
              </div>
              <div>
                <h3 className='font-bold'>Date Of Demobilization</h3>
                <p className='break-all'>
                  {selectedProduct.dateOfDemobilization}
                </p>
              </div>
              <div>
                <h3 className='font-bold'>Shift Management</h3>
                <p className='break-all'>{selectedProduct.shiftManage}</p>
              </div>
              <div>
                <h3 className='font-bold'>In Time</h3>
                <p className='break-all'>{selectedProduct.inTime}</p>
              </div>
              <div>
                <h3 className='font-bold'>Out Time</h3>
                <p className='break-all'>{selectedProduct.outTime}</p>
              </div>
              <div>
                <h3 className='font-bold'>Total Hours</h3>
                <p className='break-all'>{selectedProduct.totalHours}</p>
              </div>
              <div>
                <h3 className='font-bold'>Date</h3>
                <p className='break-all'>{selectedProduct.date}</p>
              </div>
              <div>
                <h3 className='font-bold'>Remarks</h3>
                <p className='break-all'>{selectedProduct.remarks}</p>
              </div>

              {hasEditAccess && (
                <div className='col-span-2'>
                  <h3 className='font-bold'>Attachments/Download</h3>
                  <div className='w-fit mt-2 flex flex-col justify-start'>
                    {selectedProduct.attachments.map((attachment, index) => (
                      <Button
                        key={attachment._id}
                        label={`File No. ${index + 1}: ${attachment?.url?.split('/').pop()}`}
                        icon='pi pi-file'
                        onClick={() => window.open(attachment.url, '_blank')}
                        className='hover:text-blue-600/70 px-0 py-2 border rounded-md focus:border-0 focus:ring-0 focus:ring-offset-0'
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </Dialog>

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
              <label htmlFor='name' className='font-bold'>
                Name
              </label>
              <InputText id='name' onChange={(e) => setName(e.target.value)} />
            </div>

            <div className='field'>
              <label htmlFor='employeeId' className='font-bold'>
                Employee ID No.
              </label>
              <InputText
                id='employeeId'
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='dept' className='font-bold'>
                Department Name
              </label>
              <InputText
                id='dept'
                onChange={(e) => setDept(e.target.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='position' className='font-bold'>
                Position
              </label>
              <InputText
                id='position'
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor='dateOfMobilization' className='font-bold'>
                Date of Mobilization
              </label>
              <div className='border rounded-md'>
                <Calendar
                  id='dateOfMobilization'
                  // @ts-ignore
                  onChange={(e) => setFormDate3(e.value)}
                  dateFormat='dd/mm/yy'
                  inputClassName='border-0 focus:ring-0 cursor-pointer'
                  className='focus:ring-0'
                  placeholder='Select Date of Mobilization'
                />
              </div>
            </div>

            <div>
              <label htmlFor='dateOfDemobilization' className='font-bold'>
                Date of Demobilization
              </label>
              <div className='border rounded-md'>
                <Calendar
                  id='dateOfDemobilization'
                  // @ts-ignore
                  onChange={(e) => setFormDate2(e.value)}
                  dateFormat='dd/mm/yy'
                  inputClassName='border-0 focus:ring-0 cursor-pointer'
                  className='focus:ring-0'
                  placeholder='Select Date of Demobilization'
                />
              </div>
            </div>

            <div className='field'>
              <label htmlFor='shiftManage' className='font-bold'>
                Select Shift
              </label>
              <Dropdown
                id='shiftManage'
                value={shiftManage}
                options={[
                  'Shift 1 (08:00 - 16:00)',
                  'Shift 2 (16:00 - 24:00)',
                  'Shift 3 (00:00 - 08:00)',
                ]}
                onChange={(e) => setShiftManage(e.target.value)}
                placeholder='Select Shift'
              />
            </div>

            <div>
              <label htmlFor='inTime' className='font-bold'>
                In Time
              </label>
              <div>
                <Calendar
                  id='inTime'
                  hourFormat='24'
                  showSeconds
                  timeOnly
                  //@ts-ignore
                  value={inTime}
                  onChange={(e: any) => setInTime(e.value)}
                  placeholder='Select In Time'
                />
              </div>
            </div>

            <div>
              <label htmlFor='outTime' className='font-bold'>
                Out Time
              </label>
              <div>
                <Calendar
                  id='outTime'
                  hourFormat='24'
                  showSeconds
                  timeOnly
                  //@ts-ignore
                  value={outTime}
                  // @ts-ignore
                  onChange={(e) => setOutTime(e.value)}
                  placeholder='Select Out Time'
                />
              </div>
            </div>

            <div className='field'>
              <label htmlFor='remarks' className='font-bold'>
                Remarks
              </label>
              <InputText
                id='remarks'
                onChange={(e) => setRemarks(e.target.value)}
                required
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
          <div className='gap-3 mt-5'>
            <label className='block mb-1 font-semibold'>
              Upload Document
              <span className='text-red-500 ml-1'>*</span>
            </label>

            <div>
              <MultiFileInput onFilesChange={handleFileChange} />
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
        <div className='flex flex-col mx-auto text-center space-y-2'>
          <i
            className='pi pi-exclamation-triangle mr-3 text-red-600'
            style={{ fontSize: '2rem' }}
          />
          {product && (
            <span className='text-red-500'>
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

      <Dialog
        visible={updateProductDialog}
        style={{ width: '50rem' }}
        header='Update Document'
        modal
        className='p-fluid'
        footer={updateProductDialogFooter}
        onHide={hideUpdateDialog}
      >
        {updatedProduct && (
          <div className='grid grid-cols-2 gap-4'>
            <div className='field'>
              <label htmlFor='name' className='font-bold'>
                Name
              </label>
              <InputText
                id='name'
                value={updatedProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    name: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='employeeId' className='font-bold'>
                Employee ID No.
              </label>
              <InputText
                id='employeeId'
                value={updatedProduct.employeeId}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    employeeId: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='dept' className='font-bold'>
                Department Name
              </label>
              <InputText
                id='dept'
                value={updatedProduct.dept}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    dept: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='position' className='font-bold'>
                Position
              </label>
              <InputText
                id='position'
                value={updatedProduct.position}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    position: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='dateOfMobilization' className='font-bold'>
                Date of Mobilization
              </label>
              <Calendar
                id='dateOfMobilization'
                value={
                  new Date(
                    updatedProduct?.dateOfMobilization
                      ?.split('-')
                      .reverse()
                      .join('-')
                  )
                }
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    dateOfMobilization: e.value ? formatDate(e.value) : '',
                  })
                }
                dateFormat='dd/mm/yy'
              />
            </div>

            <div className='field'>
              <label htmlFor='dateOfDemobilization' className='font-bold'>
                Date of Demobilization
              </label>
              <Calendar
                id='dateOfDemobilization'
                value={
                  new Date(
                    updatedProduct?.dateOfDemobilization
                      ?.split('-')
                      .reverse()
                      .join('-')
                  )
                }
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    dateOfDemobilization: e.value ? formatDate(e.value) : '',
                  })
                }
                dateFormat='dd/mm/yy'
              />
            </div>

            <div className='field'>
              <label htmlFor='shiftManage' className='font-bold'>
                Select Shift
              </label>
              <Dropdown
                id='shiftManage'
                value={updatedProduct.shiftManage}
                options={[
                  'Shift 1 (08:00 - 16:00)',
                  'Shift 2 (16:00 - 24:00)',
                  'Shift 3 (00:00 - 08:00)',
                ]}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    shiftManage: e.target.value,
                  })
                }
                placeholder='Select Shift'
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='inTime' className='font-bold'>
                In Time
              </label>
              <Calendar
                id='inTime'
                hourFormat='24'
                showSeconds
                timeOnly
                value={
                  updatedProduct.inTime
                    ? new Date(`1970-01-01T${updatedProduct.inTime}`)
                    : null
                }
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    inTime: e.value ? formatTime(e.value) : '',
                  })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='outTime' className='font-bold'>
                Out Time
              </label>
              <Calendar
                id='outTime'
                hourFormat='24'
                showSeconds
                timeOnly
                value={
                  updatedProduct.inTime
                    ? new Date(`1970-01-01T${updatedProduct.outTime}`)
                    : null
                }
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    outTime: e.value ? formatTime(e.value) : '',
                  })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='remarks' className='font-bold'>
                Remarks
              </label>
              <InputText
                id='remarks'
                value={updatedProduct.remarks}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    remarks: e.target.value,
                  })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='date' className='font-bold'>
                Date
              </label>
              <Calendar
                id='date'
                value={
                  new Date(updatedProduct.date?.split('-').reverse().join('-'))
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
            <div className='col-span-2'>
              <h3 className='font-bold mb-2'>Existing Attachments</h3>
              <div className='flex flex-wrap gap-3'>
                {updatedProduct.attachments.map((attachment) => (
                  <div
                    key={attachment._id}
                    className='flex items-center gap-2 bg-gray-100 p-1 rounded-md'
                  >
                    <a
                      href={attachment.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      {attachment.url?.split('/').pop()}
                    </a>
                    <Button
                      icon='pi pi-times text-red-500'
                      className='p-button-rounded text-sm text-red-500 ml-2'
                      onClick={() => handleRemoveAttachment(attachment._id)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className='col-span-2'>
              <h3 className='font-bold mb-2'>Add New Attachments</h3>
              <MultiFileInput onFilesChange={handleNewAttachments} />
            </div>
          </div>
        )}
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
