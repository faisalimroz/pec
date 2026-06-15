import { useState, useEffect, useRef } from 'react'
import { classNames } from 'primereact/utils'
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
import { searchVehicleMgtRecord } from '@/api/adminAPIs'
import axios from 'axios'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
import { TabView, TabPanel } from 'primereact/tabview'
import { Dropdown } from 'primereact/dropdown'
import MultiFileInput from '@/components/MultiFileInput'
import { Menu } from 'primereact/menu'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import ButtonGroupWithIcon from '@/components/ui/common-all-buttons'
import FileIcon from '@/components/icons/FileIcon'
import { Checkbox } from 'primereact/checkbox'
import { useLocation } from 'react-router-dom'

interface Attachment {
  url: string
  _id: string
}

interface Product {
  _id: string | null
  slNo: string
  vehicleName: string
  taxTokenReport: string
  status: string
  regNo: string
  taxExpiryDate: string
  vehicleClass: string
  remarks: string
  fitnessDuration: string
  attachments: Attachment[]
  creator?: string
  creationTimestamp?: string
  approved?: boolean
  updater?: string
  updatingTimestamp?: string
}

export default function MonthlyReport() {
  const emptyProduct: Product = {
    _id: '',
    slNo: '',
    vehicleName: '',
    taxTokenReport: '',
    vehicleClass: '',
    regNo: '',
    status: '',
    approved: false,
    taxExpiryDate: '',
    remarks: '',
    fitnessDuration: '',
    attachments: [],
  }

  const { roles, permissions } = useAuth()
  const { pathname } = useLocation();
  const showAll = pathname.startsWith('/edms');
  const adminManagerPermission = permissions.find((p) => p.name === 'admin');
  console.log('adminManagerPermission', adminManagerPermission);
  const adminPermission = adminManagerPermission?.children?.find((child) => child.name === 'vehicle-management');

  const hasEditAccess =  adminPermission?.edit_authority === true;

  const [activeIndex, setActiveIndex] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [productDialog, setProductDialog] = useState(false)
  const [deleteProductDialog, setDeleteProductDialog] = useState(false)
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false)
  const [product, setProduct] = useState<Product>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState(false)
  const dt = useRef<DataTable<Product[]>>(null)

  // filters
  const [date, setDate] = useState<Date | null>(null)
  const [date2, setDate2] = useState<Date | null>(null)
  const [taxExpiryDate, setTaxExpiryDate] = useState<Date | null>(null)
  const [approved, setApproved] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [vehicleName, setVehicleName] = useState('')
  const [taxTokenReport, setTaxTokenReport] = useState('')
  const [regNo, setRegNo] = useState('')
  const [remarks, setRemarks] = useState('')
  const [vehicleClass, setVehicleClass] = useState('')
  const [status, setStatus] = useState<string>('')

  // CREATE dialog: keep both raw Date[] and the string payload
  const [fitnessRange, setFitnessRange] = useState<Date[] | null>(null)
  const [fitnessDuration, setFitnessDuration] = useState<string>('')

  const [filesInput, setFilesInput] = useState<File[]>([])
  const [selectedCode, setSelectedCode] = useState<{ name: string; code: string } | null>(null)
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)

  const [viewProductDialog, setViewProductDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [updateProductDialog, setUpdateProductDialog] = useState(false)
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])
  const [bulkDialog, setBulkDialog] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')

  // UPDATE dialog: local Date[] range state for the calendar
  const [fitnessRangeEdit, setFitnessRangeEdit] = useState<Date[] | null>(null)

  const statusType = [
    { name: 'Exemption', code: 'Exemption' },
    { name: 'Non Exemption', code: 'Non Exemption' }
  ]
  const itemTemplate = (option: { name: string; code: string }) => (
    <div className="flex items-center gap-2">
      <FileIcon />
      <span>{option.name}</span>
    </div>
  )

  // helpers
  const formatDate = (d?: Date | null) => {
    if (!d) return ''
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  const parseDDMMYYYY = (s: string) => {
    if (!s) return null
    const [dd, mm, yyraw] = s.split('/').map((x) => parseInt(x, 10))
    if (!dd || !mm || !yyraw) return null
    const fullYear = yyraw < 100 ? 2000 + yyraw : yyraw
    return new Date(fullYear, mm - 1, dd)
  }

  const parseFitnessStringToRange = (s: string): Date[] | null => {
    if (!s) return null
    const parts = s.split(' - ')
    if (parts.length !== 2) return null
    const d1 = parseDDMMYYYY(parts[0])
    const d2 = parseDDMMYYYY(parts[1])
    return d1 && d2 ? [d1, d2] : null
  }

  const stringifyRange = (val: any): string => {
    if (Array.isArray(val) && val[0] instanceof Date && val[1] instanceof Date) {
      return `${formatDate(val[0])} - ${formatDate(val[1])}`
    }
    return ''
  }

  // update dialog open/close
  const openUpdateDialog = (p: Product) => {
    setUpdatedProduct({ ...p })
    setFitnessRangeEdit(parseFitnessStringToRange(p.fitnessDuration))
    setUpdateProductDialog(true)
  }
  const hideUpdateDialog = () => {
    setUpdateProductDialog(false)
    setUpdatedProduct(null)
    setFitnessRangeEdit(null)
    setNewAttachments([])
    setRemovedAttachments([])
  }

  const handleUpdateProduct = async () => {
    if (!updatedProduct) return

    // guard: require a proper range string if your backend expects it
    if (!updatedProduct.fitnessDuration || !updatedProduct.fitnessDuration.includes(' - ')) {
      toast.error('Please select a valid Fitness Duration range.')
      return
    }

    try {
      setLoading2(true)
      const formData = new FormData()
      formData.append('vehicleName', updatedProduct.vehicleName)
      formData.append('taxTokenReport', updatedProduct.taxTokenReport)
      formData.append('regNo', updatedProduct.regNo)
      formData.append('remarks', updatedProduct.remarks)
      formData.append('taxExpiryDate', updatedProduct.taxExpiryDate)
      formData.append('status', updatedProduct.status)
      formData.append('approved', updatedProduct.approved ? 'true' : 'false')
      formData.append('vehicleClass', updatedProduct.vehicleClass)
      formData.append('fitnessDuration', updatedProduct.fitnessDuration)

      newAttachments.forEach((f) => formData.append('attachments', f))
      removedAttachments.forEach((id) => formData.append('removedAttachments', id))
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/vehicle-mgt-record/update/by/${updatedProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      refetch()
      hideUpdateDialog()
      toast.success('Data updated successfully')
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

  const handleNewAttachments = (files: File[]) => setNewAttachments(files)
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

  // bulk upload
  const uploadFile = async () => {
    if (!file) {
      setUploadStatus('Please select a file first.')
      return
    }
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/vehicle-mgt-record/bulk-upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
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

  const openNew2 = () => {
    setProduct(emptyProduct)
    setSubmitted(false)
    setBulkDialog(true)
  }

  const productDialogFooter2 = (
    <>
      <Button label='Cancel' icon='pi pi-times' className='p-button-text' onClick={hideDialog2} />
      <Button label='Save' icon='pi pi-upload' className='p-button-text' onClick={uploadFile} disabled={!file || uploading} />
    </>
  )

  const handleFileChange2 = (e: { target: { files: any[] } }) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile)
      setUploadStatus('')
    } else {
      setFile(null)
      setUploadStatus('Please select a valid .xlsx file.')
    }
  }

  const updateProductDialogFooter = (
    <>
      <Button label='Cancel' icon='pi pi-times' outlined onClick={hideUpdateDialog} />
      <Button label='Update' icon='pi pi-check' onClick={handleUpdateProduct} loading={loading2} />
    </>
  )

  // create dialog
  const handleFileChange = (newFiles: File[]) => setFilesInput(newFiles)
  const openNew = () => {
    setProduct(emptyProduct)
    setSubmitted(false)
    setProductDialog(true)
  }
  const hideDialog = () => {
    setSubmitted(false)
    setProductDialog(false)
  }
const saveProduct = async () => {
    // --- 1. VALIDATION SHORTCUT ---
    const requiredFields = [
      { value: vehicleName, name: 'Vehicle Name' },
      { value: taxTokenReport, name: 'Tax Token Report' },
      { value: regNo, name: 'Reg No' },
      { value: remarks, name: 'Remarks' },
      { value: vehicleClass, name: 'Vehicle Class' },
      { value: status, name: 'Status' },
      { value: taxExpiryDate, name: 'Tax Expiry Date' },
      { value: fitnessDuration, name: 'Fitness Duration' }
    ];

    for (const field of requiredFields) {
      if (!field.value) {
        toast.warning(`${field.name} is required!`);
        return;
      }
    }

    // Specific validation for Fitness Duration range
    if (!fitnessDuration.includes(' - ')) {
      toast.error('Please select a valid Fitness Duration range.')
      return
    }

    try {
      setLoading2(true)
      const formData = new FormData()

      formData.append('vehicleName', vehicleName)
      formData.append('taxTokenReport', taxTokenReport)
 
      formData.append('regNo', regNo)
      formData.append('remarks', remarks)
      formData.append('vehicleClass', vehicleClass)
      formData.append('approved', approved ? 'true' : 'false');
      formData.append('status', status)
      formData.append('taxExpiryDate', formatDate(taxExpiryDate))
      formData.append('fitnessDuration', fitnessDuration)

      // Append files only if they exist
      if (filesInput && filesInput.length > 0) {
        filesInput.forEach((file) => {
          formData.append('attachments', file)
        })
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/vehicle-mgt-record/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data', // Kept as per standard layout
          },
        }
      )

      // --- 2. RESET ALL FIELDS HERE ---
      setVehicleName('')
      setTaxTokenReport('')
      setRegNo('')
      setRemarks('')
      setVehicleClass('')
      setApproved(false)
      setStatus('')
      setTaxExpiryDate(null)
      setFitnessDuration('')
      setFilesInput([])
      setFitnessRange([])
      hideDialog()
      toast.success('Data Saved Successfully')
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

  // deletes
  const confirmDeleteProduct = (p: Product) => {
    setProduct(p)
    setDeleteProductDialog(true)
  }

  const deleteProduct = async () => {
    const _products = products.filter((val) => val._id !== product._id)
    try {
      setLoading2(true)
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/vehicle-mgt-record/delete/by/${product._id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
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

  const confirmDeleteSelected = () => {
    if (selectedProducts.length > 0) setDeleteMultipleDialog(true)
  }
  const hideDeleteMultipleDialog = () => setDeleteMultipleDialog(false)

  const deleteSelectedProducts = async () => {
    try {
      setLoading2(true)
      const selectedIds = selectedProducts.map((p) => p._id)
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/vehicle-mgt-record/delete-multiple`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          data: { ids: selectedIds },
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

  // toolbar
  const leftToolbarTemplate = () => (
    <div className='flex items-center gap-3'>
      <div className='px-2 py-2 bg-main text-sm font-semibold text-white rounded-lg'>
        Document List
      </div>
    </div>
  )

  const rightToolbarTemplate = () => (
    <>
      {hasEditAccess && (
        <ButtonGroupWithIcon
          selectedProducts={selectedProducts}
          openNew={openNew}
          openNew2={openNew2}
          exportCSV={() => {
            if (selectedProducts.length > 0) dt.current?.exportCSV({ selectionOnly: true })
            else dt.current?.exportCSV()
          }}
          confirmDeleteSelected={confirmDeleteSelected}
        />
      )}
      <RefreshButton handleReset={handleReset} />
    </>
  )

  // view dialog
  const hideViewDialog = () => {
    setViewProductDialog(false)
    setSelectedProduct(null)
  }
  const viewProduct = (p: Product) => {
    setSelectedProduct(p)
    setViewProductDialog(true)
  }

  const downloadAttachmentsAsZip = async (attachments: Attachment[]) => {
    const zip = new JSZip()
    const folder = zip.folder('attachments')
    for (const attachment of attachments) {
      try {
        const response = await fetch(attachment.url)
        const blob = await response.blob()
        const fname = attachment.url.split('/').pop() || 'file'
        //@ts-ignore
        folder.file(fname, blob)
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
      { label: 'View', icon: 'pi pi-eye', command: () => viewProduct(rowData) },
    ]
    if (hasEditAccess) {
      items.push(
        { label: 'Edit', icon: 'pi pi-pencil', command: () => openUpdateDialog(rowData) },
        { label: 'Delete', icon: 'pi pi-trash', command: () => confirmDeleteProduct(rowData) },
        { label: 'Download All Attachments (Zip)', icon: 'pi pi-download', command: () => downloadAttachmentsAsZip(rowData.attachments) }
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

  // search/reset/refetch
  const handleSearch = () => {
    setLoading(true)
    const payload = {
      status: selectedCode?.code || '',
      date_range: date && date2 ? `${formatDate(date)} to ${formatDate(date2)}` : '',
      searchQuery: searchKey,
    }

    searchVehicleMgtRecord(payload).then((result) => {
      const rows = Array.isArray(result?.data) ? result.data : [];
      setProducts(rows)
      setLoading(false)
    })
  }

  const handleReset = () => {
    setDate(null)
    setDate2(null)
    setSearchKey('')
    setSelectedCode(null)

    const payload = {
      status: '',
      date_range: '',
      searchQuery: '',
    }
    setLoading(true)
    searchVehicleMgtRecord(payload).then((result) => {
      const rows = Array.isArray(result?.data) ? result.data : [];
      setProducts(rows)
      setLoading(false)
    })
  }

  const refetch = () => {
    setLoading(true)
    const payload = {
      status: '',
      date_range: '',
      searchQuery: '',
    }
    searchVehicleMgtRecord(payload).then((result) => {
      const rows = Array.isArray(result?.data) ? result.data : [];
      setProducts(rows)
      setLoading(false)
    })
  }

  useEffect(() => {
    refetch()
  }, [])

  const attachmentBodyTemplate = (rowData: any) => <div>{rowData?.attachments?.length}</div>

  const filterSearchForm = (
    <div className='flex items-center justify-center'>
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
        className='flex w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white'
      >
        <Calendar
          value={date}
          onChange={(e) => setDate(e.value as Date | null)}
          dateFormat="dd/mm/yy"
          inputClassName="text-xs border-0 focus:ring-0 py-1.5 px-3 w-32"
          placeholder='Start Date'
          showIcon
          icon={() => <i className='pi pi-angle-down' />}
        />
        <Calendar
          value={date2}
          onChange={(e) => setDate2(e.value as Date | null)}
          dateFormat="dd/mm/yy"
          inputClassName="text-xs border-0 focus:ring-0 py-1.5 px-3 w-32"
          placeholder='End Date'
          showIcon
          icon={() => <i className='pi pi-angle-down' />}
        />
        <div>
          <Dropdown
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.value)}
            options={statusType}
            itemTemplate={itemTemplate}
            optionLabel='name'
            placeholder='Status '
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
          />
        </div>
        <IconField iconPosition='left' className='relative'>
          <InputIcon className="pi pi-search text-sm" />
          <InputText
            type='search'
            placeholder='Search'
            className="text-xs border-0 focus:ring-0 py-3.5 pl-8 pr-4 w-48"
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
          />

          <button
            onClick={handleSearch}
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
    </div>
  )

  const productDialogFooter = (
    <>
      <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
      <Button label='Save' loading={loading2} icon='pi pi-check' onClick={saveProduct} />
    </>
  )
  const deleteProductDialogFooter = (
    <>
      <Button label='No' icon='pi pi-times' outlined onClick={() => setDeleteProductDialog(false)} />
      <Button label='Yes' icon='pi pi-check' severity='danger' onClick={deleteProduct} />
    </>
  )
  const deleteProductsDialogFooter = (
    <>
      <Button label='No' icon='pi pi-times' outlined onClick={() => setDeleteProductsDialog(false)} />
      <Button label='Yes' icon='pi pi-check' severity='danger' onClick={deleteSelectedProducts} />
    </>
  )

  return (
    <div className=''>
      <div className='ml-4'>
        <Toolbar
          className='rounded-none border-none p-0 bg-background'
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        />

        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel>
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
            >
              {hasEditAccess && (
                <Column
                  selectionMode='multiple'
                  headerStyle={{ width: '3rem' }}
                  exportable={false}
                  headerClassName='bg-[#ffc2c2] text-sm'
                  bodyClassName='text-xs truncate max-w-xs'
                />
              )}

              <Column field='slNo' header='SL No.' headerClassName='bg-[#ffc2c2] text-sm' bodyClassName='text-xs truncate max-w-xs' className='min-w-[10rem]' />
              <Column field='vehicleName' header='Vehicle Name' headerClassName='bg-[#ffc2c2] text-sm' bodyClassName='text-xs truncate max-w-xs' className='min-w-[8rem]' />
              <Column field='regNo' header='Registration Number' headerClassName='bg-[#ffc2c2] text-sm' bodyClassName='text-xs truncate max-w-xs' className='min-w-[12rem]' />
              <Column field='fitnessDuration' header='Fitness Duration' headerClassName='bg-[#ffc2c2] text-sm' bodyClassName='text-xs truncate max-w-xs' className='min-w-[12rem]' />
              <Column field='vehicleClass' header='Vehicle Class' headerClassName='bg-[#ffc2c2] text-sm' bodyClassName='text-xs truncate max-w-xs' className='min-w-[12rem]' />
              <Column field='taxTokenReport' header='Tax & Token Report' headerClassName='bg-[#ffc2c2] text-sm' bodyClassName='text-xs truncate max-w-xs' className='min-w-[12rem]' />
              <Column field='status' header='Status' headerClassName='bg-[#ffc2c2] text-sm' bodyClassName='text-xs truncate max-w-xs' className='min-w-[8rem]' />
              <Column field='taxExpiryDate' header='Road Tax Expiry Date' headerClassName='bg-[#ffc2c2] text-sm' bodyClassName='text-xs truncate max-w-xs' className='min-w-[12rem]' />
              <Column body={attachmentBodyTemplate} header='Attachment' headerClassName='bg-[#ffc2c2] text-sm' bodyClassName='text-xs truncate max-w-xs' className='min-w-[12rem]' />
              <Column field='remarks' header='Remarks' headerClassName='bg-[#ffc2c2] text sm' bodyClassName='text-xs truncate max-w-xs' sortable className='min-w-[12rem]' />
              <Column body={actionBodyTemplate} header='Actions' headerClassName='bg-[#ffc2c2] text-sm' bodyClassName='text-xs truncate max-w-xs' headerStyle={{ width: '3rem' }} exportable={false} />
            </DataTable>
          </TabPanel>
        </TabView>
      </div>

      {/* Update Document */}
      <Dialog
        visible={updateProductDialog}
        style={{ width: '60rem' }}
        header='Update Document'
        modal
        className='p-fluid'
        footer={updateProductDialogFooter}
        onHide={hideUpdateDialog}
      >
        {updatedProduct && (
          <div className='grid grid-cols-2 gap-4'>
            <div className='field'>
              <label htmlFor='taxTokenReport' className='font-bold'>Tax & Token Report</label>
              <InputText
                id='taxTokenReport'
                value={updatedProduct.taxTokenReport}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, taxTokenReport: e.target.value })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='vehicleName' className='font-bold'>Vehicle Name</label>
              <InputText
                id='vehicleName'
                value={updatedProduct.vehicleName}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, vehicleName: e.target.value })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='vehicleClass' className='font-bold'>Vehicle Class</label>
              <InputText
                id='vehicleClass'
                value={updatedProduct.vehicleClass}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, vehicleClass: e.target.value })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='remarks' className='font-bold'>Remarks</label>
              <InputText
                id='remarks'
                value={updatedProduct.remarks}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, remarks: e.target.value })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='regNo' className='font-bold'>Registration Number</label>
              <InputText
                id='regNo'
                value={updatedProduct.regNo}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, regNo: e.target.value })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='status' className='font-bold'>Status</label>
              <Dropdown
                id='status'
                value={updatedProduct.status}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, status: e.value })
                }
                options={statusType}
                itemTemplate={itemTemplate}
                optionLabel='name'
                optionValue='code'
                placeholder='Status'
                className='w-full'
              />
            </div>
            <div className='field'>
              <label htmlFor='taxExpiryDate' className='font-bold'>Road Tax Expiry Date</label>
              <Calendar
                id='taxExpiryDate'
                value={updatedProduct.taxExpiryDate
                  ? parseDDMMYYYY(updatedProduct.taxExpiryDate)
                  : null}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    taxExpiryDate: e.value ? formatDate(e.value as Date) : '',
                  })
                }
                dateFormat='dd/mm/yy'
              />
            </div>

            <div className='field'>
              <label htmlFor='fitnessDuration' className='font-bold'>Fitness Duration</label>
              <Calendar
                id='fitnessDuration'
                selectionMode='range'
               
                value={fitnessRangeEdit}
                onChange={(e) => {
                  const val = e.value as Date[] | null
                  setFitnessRangeEdit(val)
                  if (Array.isArray(val) && val[0] && val[1]) {
                    setUpdatedProduct({
                      ...updatedProduct,
                      fitnessDuration: stringifyRange(val),
                    })
                  } else {
                    setUpdatedProduct({
                      ...updatedProduct,
                      fitnessDuration: '',
                    })
                  }
                }}
                dateFormat='dd/mm/yy'
                readOnlyInput
                hideOnRangeSelection
              />
            </div>

            <div className='col-span-2'>
              <h3 className='font-bold mb-2'>Existing Attachments</h3>
              <div className='flex flex-wrap gap-3'>
                {updatedProduct.attachments.map((attachment) => (
                  <div key={attachment._id} className='flex items-center gap-2 bg-gray-100 p-1 rounded-md'>
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

      {/* Bulk Upload */}
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
              Select File (.xlsx Only):
            </label>
            <br />
            <input
              type='file'
              id='bulkUpload'
              accept='.xlsx'
              onChange={handleFileChange2 as any}
              disabled={uploading}
              className='mt-3'
            />
            {uploadStatus && (
              <p className={uploadStatus.includes('success') ? 'text-green-500' : 'text-red-500'}>
                {uploadStatus}
              </p>
            )}
          </div>
        </div>
      </Dialog>

      {/* View Details */}
      <Dialog
        visible={viewProductDialog}
        style={{ width: '50rem' }}
        header='File Details'
        modal
        className='p-fluid'
        footer={
          <Button label='Close' icon='pi pi-times' outlined onClick={hideViewDialog} />
        }
        onHide={hideViewDialog}
      >
        {selectedProduct && (
          <>
            <div className='mb-6 border border-gray-200 rounded-lg'>
              <div className='bg-gray-50 px-4 py-2 border-b border-gray-200'>
                <h3 className='text-gray-700 font-semibold'>Document History</h3>
              </div>
              <div className='p-4 space-y-4'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h4 className='text-sm font-medium text-gray-500'>Created By</h4>
                    <div className='mt-1'>
                      <p className='text-sm text-gray-900'>{selectedProduct?.creator || 'N/A'}</p>
                      {selectedProduct?.creationTimestamp && (
                        <p className='text-sm text-gray-600'>
                          <span>Date: {selectedProduct.creationTimestamp.split(' ')[0]}</span>
                          <span className='mx-1'>•</span>
                          <span>Time: {selectedProduct.creationTimestamp.split(' ')[1]}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className='text-sm font-medium text-gray-500'>Last Modified By</h4>
                    <div className='mt-1'>
                      <p className='text-sm text-gray-900'>{selectedProduct?.updater || 'N/A'}</p>
                      {selectedProduct?.updatingTimestamp && (
                        <p className='text-sm text-gray-600'>
                          <span>Date: {selectedProduct.updatingTimestamp.split(' ')[0]}</span>
                          <span className='mx-1'>•</span>
                          <span>Time: {selectedProduct.updatingTimestamp.split(' ')[1]}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div><h3 className='font-bold'>SL No.</h3><p className='break-all'>{selectedProduct.slNo}</p></div>
              <div><h3 className='font-bold'>Road Tax Expiry Date</h3><p>{selectedProduct.taxExpiryDate}</p></div>
              <div><h3 className='font-bold'>Vehicle Name</h3><p className='break-all'>{selectedProduct.vehicleName}</p></div>
              <div><h3 className='font-bold'>Vehicle Class</h3><p className='break-all'>{selectedProduct.vehicleClass}</p></div>
              <div><h3 className='font-bold'>Status</h3><p className='break-all'>{selectedProduct.status}</p></div>
              <div><h3 className='font-bold'>Registration Number</h3><p className='break-all'>{selectedProduct.regNo}</p></div>
              <div><h3 className='font-bold'>Fitness Duration</h3><p className='break-all'>{selectedProduct.fitnessDuration}</p></div>
              <div><h3 className='font-bold'>Remarks</h3><p className='break-all'>{selectedProduct.remarks}</p></div>

           
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
           
            </div>
          </>
        )}
      </Dialog>

      {/* Create / Upload Document */}
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
              <label htmlFor='vehicleName' className='font-bold'>Vehicle Name</label>
              <InputText
                id='vehicleName'
                onChange={(e) => setVehicleName(e.target.value)}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !vehicleName })}
              />
              {submitted && !vehicleName && (
                <small className='p-error'>Vehicle Name is required.</small>
              )}
            </div>
            <div className='field'>
              <label htmlFor='taxTokenReport' className='font-bold'>Tax & Token Report</label>
              <InputText id='taxTokenReport' onChange={(e) => setTaxTokenReport(e.target.value)} required />
            </div>
            <div className='field'>
              <label htmlFor='vehicleClass' className='font-bold'>Vehicle Class</label>
              <InputText id='vehicleClass' onChange={(e) => setVehicleClass(e.target.value)} required />
            </div>
            <div className='field'>
              <label htmlFor='regNo' className='font-bold'>Registration Number</label>
              <InputText id='regNo' onChange={(e) => setRegNo(e.target.value)} required />
            </div>
            <div className='field'>
              <label htmlFor='status' className='font-bold'>Status</label>
              <Dropdown
                id='status'
                value={status}
                onChange={(e) => setStatus(e.value)}
                options={statusType}
                optionLabel='name'
                optionValue='code'   // store plain string
                placeholder='Status'
                itemTemplate={itemTemplate}
                className='w-full'
              />
            </div>
            <div className='field'>
              <label htmlFor='remarks' className='font-bold'>Remarks</label>
              <InputText id='remarks' onChange={(e) => setRemarks(e.target.value)} required />
            </div>

            <div>
              <label htmlFor='taxExpiryDate' className='font-bold'>Road Tax Expiry Date</label>
              <div className='border rounded-md'>
                <Calendar
                  id='taxExpiryDate'
                  value={taxExpiryDate}
                  onChange={(e) => setTaxExpiryDate(e.value as Date | null)}
                  dateFormat='dd/mm/yy'
                  inputClassName='border-0 focus:ring-0 cursor-pointer'
                  className='focus:ring-0'
                  placeholder='Select Date'
                />
              </div>
            </div>

            <div>
              <label htmlFor='fitnessDuration' className='font-bold'>Fitness Duration</label>
              <div className='border rounded-md'>
                <Calendar
                  id='fitnessDuration'
                  selectionMode='range'
                  value={fitnessRange}
                  onChange={(e) => {
                    const val = e.value as Date[] | null
                    setFitnessRange(val)
                    if (Array.isArray(val) && val[0] && val[1]) {
                      setFitnessDuration(`${formatDate(val[0])} - ${formatDate(val[1])}`)
                    } else {
                      setFitnessDuration('')
                    }
                  }}
                  dateFormat='dd/mm/yy'
                  readOnlyInput
                  hideOnRangeSelection
                  inputClassName='border-0 focus:ring-0 cursor-pointer'
                  className='focus:ring-0'
                  placeholder='Select Date Range'
                />
              </div>
            </div>

          </div>

          <div className='gap-3 mt-5'>
            <label className='block mb-1 font-semibold'>
              Upload Document 
            </label>
            <div>
              <MultiFileInput onFilesChange={setFilesInput} />
            </div>
          </div>
          
        </>
      </Dialog>

      {/* Delete dialogs */}
      <Dialog
        visible={deleteProductDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteProductDialogFooter}
        onHide={() => setDeleteProductDialog(false)}
      >
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
          {product && <span>Are you sure you want to delete <b>{product.slNo}</b>?</span>}
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductsDialog}
        style={{ width: '42rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteProductsDialogFooter}
        onHide={() => setDeleteProductsDialog(false)}
      >
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '3rem' }} />
          <span>Are you sure you want to delete the selected products?</span>
        </div>
      </Dialog>

      <Dialog
        visible={deleteMultipleDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm Multiple Delete'
        modal
        footer={(
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
        )}
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
