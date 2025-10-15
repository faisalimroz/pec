import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import '../../../styles/table-style.css'
import { procurementWorkingOrder, useProcurementWO } from '@/api/itsAPIs'
import axios from 'axios'
import { toast } from 'sonner'
import MultiFileInput from '@/components/MultiFileInput'
import { InputTextarea } from 'primereact/inputtextarea'
import { Menu } from 'primereact/menu'
import RefreshButton from '@/components/refresh-button'
import { FilePreview } from '@/components/file-preview'
import { useAuth } from '@/provider/authProvider'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

interface Attachment {
  url: string
  _id: string
}

interface Product {
  _id: string | null
  slNo: string
  fileName: string
  date: string
  subject: string
  company: string
  description: string
  refNo: string
  remarks: string
  invoice: Attachment[]
  attachments: Attachment[]
  creator?: string
  creationTimestamp?: string
  updater?: string
  updatingTimestamp?: string
}

export default function ProcurementWorking() {
  let emptyProduct: Product = {
    _id: '',
    slNo: '',
    fileName: '',
    date: '',
    subject: '',
    company: '',
    description: '',
    refNo: '',
    remarks: '',
    invoice: [],
    attachments: [],
  }
  const { permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'its-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'its-procurement'
  )

  const isITS = checkPermission?.edit_authority || false

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
  const [remarks, setRemarks] = useState('')
  const [formDate, setFormDate] = useState<string>('')
  const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [newInvoice, setNewInvoice] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])
  const [removedInvoice, setRemovedInvoice] = useState<string[]>([])
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)

  // all update dialog func here
  const openUpdateDialog = (product: Product) => {
    setUpdatedProduct({ ...product })
    setUpdateProductDialog(true)
  }

  const hideUpdateDialog = () => {
    setUpdateProductDialog(false)
    setUpdatedProduct(null)
    setNewInvoice([])
    setNewAttachments([])
    setRemovedInvoice([])
    setRemovedAttachments([])
  }

  const handleUpdateProduct = async () => {
    if (!updatedProduct) return

    try {
      setLoading2(true)
      const formData = new FormData()
      formData.append('subject', updatedProduct.subject)
      // formData.append('fileName', updatedProduct.fileName)
      formData.append('description', updatedProduct.description)
      formData.append('company', updatedProduct.company)
      formData.append('remarks', updatedProduct.remarks)
      formData.append('date', updatedProduct.date)

      newAttachments.forEach((file) => {
        formData.append('attachments', file)
      })

      newInvoice.forEach((file) => {
        formData.append('invoice', file)
      })

      removedAttachments.forEach((attachmentId) => {
        formData.append('removedAttachments', attachmentId)
      })

      removedInvoice.forEach((attachmentId) => {
        formData.append('removedInvoice', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/procurement/working/${updatedProduct._id}`,
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
    } catch (error) {
      console.error(error)
      toast.error('Failed To Update Data')
    } finally {
      setLoading2(false)
    }
  }

  const handleNewAttachments = (files: File[]) => {
    setNewAttachments(files)
  }
  const handleNewInvice = (files: File[]) => {
    setNewInvoice(files)
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

  const handleRemoveInvoice = (attachmentId: string) => {
    setRemovedInvoice((prev) => [...prev, attachmentId])
    setUpdatedProduct((prev) => {
      if (!prev) return null
      return {
        ...prev,
        invoice: prev.invoice.filter((a) => a._id !== attachmentId),
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

  // ending all update dialog funcs

  const [dataList, setDataList] = useState({
    subject: '',
    company: '',
    description: '',
    refNo: '',
  })
  const [filesInput, setFilesInput] = useState<File[]>([])
  const [invoiceFilesInput, setInvoiceFilesInput] = useState<File[]>([])

  const resetForm = () => {
    setDataList({
      subject: '',
      company: '',
      description: '',
      refNo: '',
    })
    setRemarks('')
    setFormDate('')
    setInvoiceFilesInput([])
    setFilesInput([])
  }

  const openNew = () => {
    setProduct(emptyProduct)
    setSubmitted(false)
    setProductDialog(true)
  }

  const hideDialog = () => {
    resetForm()
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

      // formData.append('fileName', fileName)
      formData.append('subject', dataList.subject)
      formData.append('company', dataList.company)
      formData.append('description', dataList.description)
      formData.append('refNo', dataList.refNo)
      formData.append('remarks', remarks)
      formData.append('date', formatDate(formDate))
      filesInput.forEach((file) => {
        formData.append('attachments', file)
      })
      invoiceFilesInput.forEach((file) => {
        formData.append('invoice', file)
      })

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/procurement/working/upload`,
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
      toast.success('Data Saved Successfully')
      refetch()
    } catch (error) {
      console.error(error)
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/procurement/working/delete/${product._id}`,
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
  //   let _products = products.filter(
  //     (val: Product) => !selectedProducts.includes(val)
  //   )

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
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/procurement/working/delete/multiple/data`,
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

  const leftToolbarTemplate = () => {
    return (
      <div className=''>
        <div className='p-3 bg-main text-base font-semibold text-white rounded-t'>
          Document List
        </div>
        {/* {isITS && (
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
        {isITS && (
          <div className='space-x-2'>
            <button
              className='bg-white text-gray-800 border-gray-600 border-t border-l border-r px-4 py-3 rounded-t-md font-bold text-sm'
              onClick={openNew}
            >
              Upload Document
            </button>
            <button
              className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md text-sm'
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
        <RefreshButton className='ml-2' onClick={handleReset} />
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
    if (isITS) {
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
      date_range:
        date && date2 ? `${formatDate(date)} to ${formatDate(date2)}` : '',
      searchQuery: searchKey,
    }

    procurementWorkingOrder(initialPayload).then((result) => {
      setProducts(result?.MoneysByMonths)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      date_range: '',
      searchQuery: '',
    }

    setDate('')
    setDate2('')
    setSearchKey('')

    procurementWorkingOrder(initialPayload).then((result) => {
      setProducts(result?.MoneysByMonths)
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
        value={date}
        // @ts-ignore
        onChange={(e) => setDate(e.value)}
        inputClassName='border-none rounded-none cursor-pointer focus:ring-0'
        placeholder='Start Date'
        showIcon
        icon={() => <i className='pi pi-angle-down' />}
      />
      <Calendar
        // @ts-ignore
        value={date2}
        // @ts-ignore
        onChange={(e) => setDate2(e.value)}
        inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
        placeholder='End Date'
        showIcon
        icon={() => <i className='pi pi-angle-down' />}
      />
      <IconField iconPosition='left' className='relative'>
        <InputIcon className='pi pi-search' />
        <InputText
          type='search'
          placeholder='Search'
          className='border-none ml-4 focus:ring-0'
          onChange={(e) => setSearchKey(e.target.value)}
          value={searchKey}
        />

        <button
          onClick={handleSearch}
          type='submit'
          className='absolute top-0.5 right-1 border bg-green-500 px-4 py-2.5 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors'
          aria-label='Submit search'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='white'
            className='size-6'
            aria-hidden='true'
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
    return <div>{rowData?.attachments?.length}</div>
  }
  const InvoiceBodyTemplate = (rowData: any) => {
    return <div>{rowData?.invoice?.length}</div>
  }

  // initial data load
  const [payload, setPayload] = useState<any>({
    date_range: '',
    searchQuery: '',
  })

  const { data, isLoading, error, refetch } = useProcurementWO(payload)

  useEffect(() => {
    if (data) {
      setProducts(data?.MoneysByMonths)
    }
  }, [data])

  // useEffect(() => {
  //   setLoading(true)
  //   const initialPayload = {
  //     month: '',
  //     year: '',
  //     searchQuery: '',
  //     department: '',
  //   }

  //   procurementWorkingOrder(initialPayload).then((result) => {
  //     setProducts(result?.MoneysByMonths)
  //     setLoading(false)
  //   })
  // }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setDataList((prev) => ({ ...prev, [id]: value }))
  }

  const handleInputAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setDataList((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (newFiles: File[]) => {
    setFilesInput(newFiles)
  }
  const handleInvoiceFileChange = (newFiles: File[]) => {
    setInvoiceFilesInput(newFiles)
  }

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
          onSelectionChange={(e: {
            value: React.SetStateAction<Product[]>
          }) => {
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
          loading={loading || isLoading}
        >
          {isITS && (
            <Column
              selectionMode='multiple'
              headerStyle={{ width: '3rem' }}
              exportable={false}
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-sm truncate max-w-xs'
            ></Column>
          )}

          <Column
            field='slNo'
            header='SL No.'
            headerClassName='bg-[#ffc2c2] min-w-[8rem]'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          {/* <Column
            field='fileName'
            header='File name'
            headerClassName='bg-[#ffc2c2] min-w-[12rem]'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column> */}

          <Column
            field='date'
            headerClassName='bg-[#ffc2c2] min-w-[8rem]'
            sortable
            header='Date'
          ></Column>

          <Column
            field='subject'
            headerClassName='bg-[#ffc2c2] min-w-[8rem]'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Subject'
          ></Column>

          <Column
            field='description'
            headerClassName='bg-[#ffc2c2] min-w-[16rem]'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Description'
          ></Column>

          <Column
            field='company'
            headerClassName='bg-[#ffc2c2] min-w-[8rem]'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Company'
          ></Column>

          <Column
            field='refNo'
            headerClassName='bg-[#ffc2c2] min-w-[8rem]'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Ref No.'
          ></Column>

          <Column
            body={InvoiceBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Invoice'
          ></Column>
          <Column
            body={attachmentBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Attachment'
          ></Column>

          <Column
            field='remarks'
            header='Remarks'
            headerClassName='bg-[#ffc2c2] min-w-[8rem]'
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

      {/* upload data dialog  */}
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
            {/* <div className='field'>
              <label htmlFor='filename' className='font-bold'>
                File Name
              </label>
              <InputText
                id='filename'
                onChange={(e) => setFileName(e.target.value)}
              />
            </div> */}

            <div className='field'>
              <label htmlFor='subject' className='font-bold'>
                Subject
              </label>
              <InputText
                id='subject'
                value={dataList.subject}
                onChange={handleInputChange}
              />
            </div>

            <div className='field'>
              <label htmlFor='company' className='font-bold'>
                Company
              </label>
              <InputText
                id='company'
                value={dataList.company}
                onChange={handleInputChange}
              />
            </div>

            <div className='field'>
              <label htmlFor='refNo' className='font-bold'>
                Ref No.
              </label>
              <InputText
                id='refNo'
                value={dataList.refNo}
                onChange={handleInputChange}
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
          </div>

          <div className='field mt-3'>
            <label htmlFor='description' className='font-bold'>
              Description
            </label>
            <InputTextarea
              rows={5}
              cols={30}
              id='description'
              value={dataList.description}
              onChange={handleInputAreaChange}
            />
          </div>

          <div className='gap-3 mt-5'>
            <label className='block mb-1 font-semibold'>
              Upload Invoice
              <span className='text-red-500 ml-1'>*</span>
            </label>

            <div>
              <MultiFileInput onFilesChange={handleInvoiceFileChange} />
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

      {/* view data dialog  */}
      <Dialog
        visible={viewProductDialog}
        style={{ width: '50rem' }}
        header='File Details'
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
                <h3 className='font-bold'>SL No.</h3>
                <p className='break-all'>{selectedProduct.slNo}</p>
              </div>
              <div>
                <h3 className='font-bold'>Date</h3>
                <p>{selectedProduct.date}</p>
              </div>
              <div>
                <h3 className='font-bold'>Subject</h3>
                <p className='break-all'>{selectedProduct.subject}</p>
              </div>
              {/* <div>
              <h3 className='font-bold'>FileName</h3>
              <p className='break-all'>{selectedProduct.fileName}</p>
            </div> */}
              <div>
                <h3 className='font-bold'>description</h3>
                <p className='break-all'>{selectedProduct.description}</p>
              </div>
              <div>
                <h3 className='font-bold'>Ref No.</h3>
                <p className='break-all'>{selectedProduct.refNo}</p>
              </div>
              <div>
                <h3 className='font-bold'>Company</h3>
                <p className='break-all'>{selectedProduct.company}</p>
              </div>
              <div>
                <h3 className='font-bold'>Remarks</h3>
                <p className='break-all'>{selectedProduct.remarks}</p>
              </div>
              <div className='col-span-2'>
                <h3 className='font-bold'>Invoice</h3>
                <div className='grid grid-cols-2 gap-4'>
                  {selectedProduct?.invoice?.map((attachment) => (
                    <div
                      key={attachment._id}
                      className='border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer'
                    >
                      <FilePreview url={attachment.url} />
                      <div className='mt-3 flex items-center justify-between gap-2'>
                        <span className='text-sm font-medium text-gray-900 truncate max-w-[80%]'>
                          {attachment.url?.split('/').pop()}
                        </span>
                        <Button
                          icon='pi pi-external-link'
                          onClick={() => window.open(attachment.url, '_blank')}
                          className='p-button-text p-button-rounded flex-shrink-0'
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {isITS && (
                <div className='col-span-2'>
                  <h3 className='font-bold'>Attachments/Download</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    {selectedProduct.attachments.map((attachment) => (
                      <div
                        key={attachment._id}
                        className='border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer'
                      >
                        <FilePreview url={attachment.url} />
                        <div className='mt-3 flex items-center justify-between gap-2'>
                          <span className='text-sm font-medium text-gray-900 truncate max-w-[80%]'>
                            {attachment.url?.split('/').pop()}
                          </span>
                          <Button
                            icon='pi pi-external-link'
                            onClick={() =>
                              window.open(attachment.url, '_blank')
                            }
                            className='p-button-text p-button-rounded flex-shrink-0'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
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

      {/* update data dialog  */}
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
              <label htmlFor='subject' className='font-bold'>
                Subject
              </label>
              <InputText
                id='productName'
                value={updatedProduct.subject}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    subject: e.target.value,
                  })
                }
                required
              />
            </div>
            {/* <div className='field'>
              <label htmlFor='fileName' className='font-bold'>
                FileName
              </label>
              <InputText
                id='fileName'
                value={updatedProduct.fileName}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    fileName: e.target.value,
                  })
                }
              />
            </div> */}
            <div className='field'>
              <label htmlFor='company' className='font-bold'>
                Company
              </label>
              <InputText
                id='company'
                value={updatedProduct.company}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    company: e.target.value,
                  })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='description' className='font-bold'>
                Description
              </label>
              <InputText
                id='description'
                value={updatedProduct.description}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='refNo' className='font-bold'>
                Ref No.
              </label>
              <InputText
                id='refNo'
                value={updatedProduct.refNo}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    refNo: e.target.value,
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
                {updatedProduct?.attachments?.map((attachment) => (
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

            <div className='col-span-2'>
              <h3 className='font-bold mb-2'>Existing Invoice</h3>
              <div className='flex flex-wrap gap-3'>
                {updatedProduct?.invoice?.map((attachment) => (
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
                      onClick={() => handleRemoveInvoice(attachment._id)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className='col-span-2'>
              <h3 className='font-bold mb-2'>Add New Invoice</h3>
              <MultiFileInput onFilesChange={handleNewInvice} />
            </div>
          </div>
        )}
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
