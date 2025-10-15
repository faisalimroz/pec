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
import { searchElectrical } from '@/api/roadTrafficAPIs'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown'
import { Menu } from 'primereact/menu'
import { toast } from 'sonner'
import MultiFileInput from '@/components/MultiFileInput'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import MultiFileInputTwo from '@/components/MultiFileInputTwo'

interface Attachment {
  url: string
  _id: string
}

interface Product {
  _id: string
  title: string
  date: string
  type: string
  remarks: string
  attachments: Attachment[]
  creator?: string
  creationTimestamp?: string
  updater?: string
  updatingTimestamp?: string
}

export default function ElectricalTable() {
  let emptyProduct: Product = {
    _id: '',
    title: '',
    date: '',
    type: '',
    remarks: '',
    attachments: [],
  }
  const { permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'r&t-manager')
  const checkPermission = checkRole?.children.find((c) => c.name === 'drawing')

  const isRnT = checkPermission?.edit_authority || false

  const codes = [
    { name: 'Bhanga Side', code: 'Bhanga Side' },
    { name: 'Dhaleshwari Side', code: 'Dhaleshwari Side' },
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
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [remarks, setRemarks] = useState('')
  const [formDate, setFormDate] = useState<string>('')
  const [filesInput, setFilesInput] = useState<File[]>([])
  const [selectedCode, setSelectedCode] = useState(null)
  const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)

  const [bulkDialog, setBulkDialog] = useState(false)
  const [file, setFile] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')

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
      formData.append('title', updatedProduct.title)
      formData.append('type', updatedProduct.type)
      formData.append('remarks', updatedProduct.remarks)
      formData.append('date', updatedProduct.date)

      newAttachments.forEach((file) => {
        formData.append('attachments', file)
      })

      removedAttachments.forEach((attachmentId) => {
        formData.append('removedAttachments', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/drawing/electrical/update/${updatedProduct._id}`,
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

  // end

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
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/drawing/electrical/bulk-upload`,
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

  const openNew2 = () => {
    setProduct(emptyProduct)
    setSubmitted(false)
    setBulkDialog(true)
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

  // end bulk upload

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

  const saveProduct = async () => {
    try {
      setLoading2(true)
      const formData = new FormData()

      formData.append('title', title)
      formData.append('type', type)
      formData.append('remarks', remarks)
      formData.append('date', formatDate(formDate))
      filesInput.forEach((file) => {
        formData.append('attachments', file)
      })

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/drawing/electrical/upload`,
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
      toast.success('Data Added Successfully')
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/drawing/electrical/delete/${product._id}`,
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/drawing/electrical/delete/multiple/data`,
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
    if (selectedProducts && selectedProducts.length > 0) {
      dt.current?.exportCSV({ selectionOnly: true })
    } else {
      dt.current?.exportCSV()
    }
  }

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
      <>
        {isRnT && (
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
    if (isRnT) {
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
      month: date ? getMonthName(date) : '',
      year: date2 ? getYear(date2) : '',
      // @ts-ignore
      type: selectedCode?.name || '',
      searchQuery: searchKey,
    }

    searchElectrical(initialPayload).then((result) => {
      setProducts(result?.Electricals)
      setLoading(false)
    })
  }

  const handleReset = () => {
    setLoading(true)

    const initialPayload = {
      month: '',
      year: '',
      searchQuery: '',
      type: '',
    }

    setDate('')
    setDate2('')
    setSearchKey('')
    setSelectedCode(null)

    searchElectrical(initialPayload).then((result) => {
      setProducts(result?.Electricals)
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
      {/* <Calendar
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
      /> */}

      <div>
        <Dropdown
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.value)}
          options={codes}
          optionLabel='name'
          placeholder='Select Side'
          className='border-none rounded-none ml-4 cursor-pointer ring-0'
        />
      </div>

      <IconField iconPosition='left' className='relative'>
        <InputIcon className='pi pi-search' />
        <InputText
          type='search'
          placeholder='Search'
          value={searchKey}
          className='border-none ml-2 focus:ring-0'
          onChange={(e) => setSearchKey(e.target.value)}
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

  const attachmentBodyTemplate = (rowData: any) => {
    return <div>{rowData?.attachments?.length}</div>
  }

  const refetch = () => {
    setLoading(true)
    const initialPayload = {
      month: '',
      year: '',
      type: '',
      searchQuery: '',
    }

    searchElectrical(initialPayload).then((result) => {
      setProducts(result?.Electricals)
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
          className='rounded-none border-none p-0 bg-backgournd'
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
            field='title'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Title'
          ></Column>

          <Column
            field='type'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Side'
          ></Column>

          <Column
            field='date'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Date'
          ></Column>

          <Column
            field='remarks'
            header='Remarks'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          {/* <Column
            body={attachmentBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Attachment'
          ></Column> */}

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
                <h3 className='font-bold'>Date</h3>
                <p>{selectedProduct.date}</p>
              </div>
              <div>
                <h3 className='font-bold'>Title</h3>
                <p className='break-all'>{selectedProduct.title}</p>
              </div>

              <div>
                <h3 className='font-bold'>Side</h3>
                <p>{selectedProduct.type}</p>
              </div>
              <div>
                <h3 className='font-bold'>Remarks</h3>
                <p>{selectedProduct.remarks}</p>
              </div>

              {isRnT && (
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
              <label htmlFor='title' className='font-bold'>
                Title
              </label>
              <InputText
                id='title'
                onChange={(e) => setTitle(e.target.value)}
              />
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

            <div className='field'>
              <label htmlFor='type' className='font-bold'>
                Select Side
              </label>
              <Dropdown
                id='type'
                value={type}
                options={['Bhanga Side', 'Dhaleshwari Side']}
                onChange={(e) => setType(e.target.value)}
                placeholder='Select Type'
              />
            </div>
          </div>

          <div className='gap-3 mt-5'>
            <label className='block mb-1 font-semibold'>
              Upload Document
              <span className='text-red-500 ml-1'>*</span>
            </label>

            <div>
              <MultiFileInputTwo onFilesChange={handleFileChange} />
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
              Are you sure you want to delete <b>{product.title}</b>?
            </span>
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
              <label htmlFor='title' className='font-bold'>
                Title
              </label>
              <InputText
                id='title'
                value={updatedProduct.title}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    title: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='type' className='font-bold'>
                Select Side
              </label>
              <Dropdown
                id='type'
                value={updatedProduct.type}
                options={['Bhanga Side', 'Dhaleshwari Side']}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    type: e.target.value,
                  })
                }
                placeholder='Select Type'
                // optionLabel='name'
                required
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
              <MultiFileInputTwo onFilesChange={handleNewAttachments} />
            </div>
          </div>
        )}
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
              Select File (.xlsx Only):
            </label>
            <br />
            <input
              type='file'
              id='bulkUpload'
              accept='.xlsx'
              // @ts-ignore
              onChange={handleFileChange2}
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
