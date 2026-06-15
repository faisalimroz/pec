import { searchProcurement, useFinanceProcurement } from '@/api/financeAPIs'
import '@/styles/table-style.css'
import axios from 'axios'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Menu } from 'primereact/menu'
import { Toolbar } from 'primereact/toolbar'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
import { MultiSelect } from 'primereact/multiselect'
import RefreshButton from '../refresh-button'
import { useAuth } from '@/provider/authProvider'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import MultiFileInputTwo from '../MultiFileInputTwo'
import * as XLSX from 'xlsx'

interface Attachment {
  url: string
  _id: string
}

interface Product {
  _id: string | null
  slNo: string
  docTitle: string
  boq: string
  dept: string
  type: string
  date: string
  remarks: string
  attachments: Attachment[]
  creator?: string
  creationTimestamp?: string
  updater?: string
  updatingTimestamp?: string
}

interface dropdownTypes {
  name: string
  code: string
}

export default function RhdBillDetails() {
  const emptyProduct: Product = {
    _id: '',
    slNo: '',
    docTitle: '',
    boq: '',
    dept: '',
    type: '',
    date: '',
    remarks: '',
    attachments: [],
  }
  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'finance-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'finance-procurement'
  )

  const hasEditAccess = checkPermission?.edit_authority || false

  const isFinance = roles.some((role) =>
    ['superadmin', 'finance-manager'].includes(role.title)
  )
  const [products, setProducts] = useState<any>([])
  const [productDialog, setProductDialog] = useState<boolean>(false)
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)
  const [deleteProductsDialog, setDeleteProductsDialog] =
    useState<boolean>(false)
  const [product, setProduct] = useState<any>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [date3, setDate3] = useState<string>('')
  const [date4, setDate4] = useState<string>('')
  const [searchKey, setSearchKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [docTitle, setDocTitle] = useState('')
  const [dept, setDept] = useState('')
  const [remarks, setRemarks] = useState('')
  const [formDate, setFormDate] = useState<string>('')
  const [selectedFormCode, setSelectedFormCode] =
    useState<dropdownTypes | null>(null)
  const [selectedFormType, setSelectedFormType] =
    useState<dropdownTypes | null>(null)
  const [filesInput, setFilesInput] = useState<File[]>([])
  const [selectedCode, setSelectedCode] = useState<dropdownTypes | null>(null)
  const [selectedType, setSelectedType] = useState<dropdownTypes | null>(null)
  const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])
  const [searchDept, setSearchDept] = useState<string>('')
  const [selectedCode3, setSelectedCode3] = useState<string[]>([])
  const [bulkDialog, setBulkDialog] = useState(false)
  const [file, setFile] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')

  const codes = [
    { name: '1.03', code: '1.03' },
    { name: '1.04', code: '1.04' },
    { name: '1.08', code: '1.08' },
    { name: '1.09', code: '1.09' },
    { name: '1.10', code: '1.10' },
    { name: '1.11(i)', code: '1.11(i)' },
    { name: '1.11(ii)', code: '1.11(ii)' },
    { name: '1.11(iii)', code: '1.11(iii)' },
    { name: '1.11(iv)', code: '1.11(iv)' },
    { name: '1.11(v)', code: '1.11(v)' },
    { name: '1.11(vi)', code: '1.11(vi)' },
    { name: '1.11(vii)', code: '1.11(vii)' },
    { name: '1.12', code: '1.12' },
    { name: '1.13', code: '1.13' },
    { name: '1.16', code: '1.16' },
    { name: '2.01', code: '2.01' },
    { name: '2.03', code: '2.03' },
    { name: '2.05', code: '2.05' },
    { name: '2.07', code: '2.07' },
    { name: '2.08', code: '2.08' },
    { name: '2.09', code: '2.09' },
    { name: '2.12', code: '2.12' },
    { name: '2.13', code: '2.13' },
    { name: '2.14', code: '2.14' },
    { name: '2.16', code: '2.16' },
    { name: '2.18', code: '2.18' },
    { name: '2.19', code: '2.19' },
    { name: '3.01', code: '3.01' },
    { name: '3.02', code: '3.02' },
    { name: '3.03', code: '3.03' },
    { name: '3.04', code: '3.04' },
    { name: '3.05', code: '3.05' },
    { name: '3.05(1)', code: '3.05(1)' },
    { name: '3.05(2)', code: '3.05(2)' },
    { name: '3.05(2.1)', code: '3.05(2.1)' },
    { name: '3.05(2.2)', code: '3.05(2.2)' },
    { name: '3.05(2.3)', code: '3.05(2.3)' },
    { name: '3.05(2.4)', code: '3.05(2.4)' },
    { name: '3.05(3)', code: '3.05(3)' },
    { name: '3.05(4)', code: '3.05(4)' },
    { name: '3.05(5)', code: '3.05(5)' },
    { name: '3.05(6)', code: '3.05(6)' },
    { name: '3.06', code: '3.06' },
    { name: '3.06(1.1)', code: '3.06(1.1)' },
    { name: '3.06(1.2)', code: '3.06(1.2)' },
    { name: '3.06(2.1)', code: '3.06(2.1)' },
    { name: '3.06(2.2)', code: '3.06(2.2)' },
    { name: '3.07', code: '3.07' },
    { name: '3.08', code: '3.08' },
    { name: '3.09', code: '3.09' },
    { name: '3.10', code: '3.10' },
    { name: 'H2(1)', code: 'H2(1)' },
    { name: 'H2(2)', code: 'H2(2)' },
    { name: 'H2(3)', code: 'H2(3)' },
    { name: 'H2(4)', code: 'H2(4)' },
    {
      name: 'Appendix G (PO-TCS)-Table-2',
      code: 'Appendix G (PO-TCS)-Table-2',
    },
    {
      name: 'Appendix G (PO-TCS)-Table-3',
      code: 'Appendix G (PO-TCS)-Table-3',
    },
    {
      name: 'Appendix G (PO-TCS)-Table-4',
      code: 'Appendix G (PO-TCS)-Table-4',
    },
    {
      name: 'Appendix G (PO-TCS)-Table-5',
      code: 'Appendix G (PO-TCS)-Table-5',
    },
    { name: 'Appendix G(PO-ITS) Table-2', code: 'Appendix G(PO-ITS) Table-2' },
    { name: 'Appendix G(PO-ITS) Table-3', code: 'Appendix G(PO-ITS) Table-3' },
    { name: 'Appendix G(PO-ITS) Table-4', code: 'Appendix G(PO-ITS) Table-4' },
    { name: 'Appendix G(PO-ITS) Table-5', code: 'Appendix G(PO-ITS) Table-5' },
    {
      name: 'Appendix G (O&M-TCS Table-2',
      code: 'Appendix G (O&M-TCS Table-2',
    },
    {
      name: 'Appendix G (O&M-TCS Table-3',
      code: 'Appendix G (O&M-TCS Table-3',
    },
    {
      name: 'Appendix G (O&M-TCS Table-4',
      code: 'Appendix G (O&M-TCS Table-4',
    },
    {
      name: 'Appendix G (O&M-ITS) Table-2',
      code: 'Appendix G (O&M-ITS) Table-2',
    },
    {
      name: 'Appendix G (O&M-ITS) Table-3',
      code: 'Appendix G (O&M-ITS) Table-3',
    },
    {
      name: 'Appendix G (O&M-ITS) Table-4',
      code: 'Appendix G (O&M-ITS) Table-4',
    },
  ]

  const stringValues = codes.map((item) => item.code)

  const categories = [
    { name: 'All', code: '' },
    { name: 'Quotation', code: 'Quotation' },
    { name: 'Requisition', code: 'Requisition' },
    { name: 'Work Order', code: 'Work Order' },
    { name: 'Invoice', code: 'Invoice' },
    { name: 'Other', code: 'Other' },
  ]

  const categoriesForForm = [
    { name: 'Quotation', code: 'Quotation' },
    { name: 'Requisition', code: 'Requisition' },
    { name: 'Work Order', code: 'Work Order' },
    { name: 'Invoice', code: 'Invoice' },
    { name: 'Other', code: 'Other' },
  ]

  const depts = [
    { name: 'Maintenance', value: 'Maintenance' },
    { name: 'Mechanical', value: 'Mechanical' },
    { name: 'Patrol', value: 'Patrol' },
    { name: 'Building Maintenance', value: 'Building Maintenance' },
    { name: 'Administrative', value: 'Administrative' },
    { name: 'ITS', value: 'ITS' },
    { name: 'Toll', value: 'Toll' },
  ]

  // all update dialog func here
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
      formData.append('docTitle', updatedProduct.docTitle)
      formData.append('type', updatedProduct.type)
      formData.append('boq', updatedProduct.boq)
      formData.append('dept', updatedProduct.dept)
      formData.append('remarks', updatedProduct.remarks)
      formData.append('date', updatedProduct.date)

      newAttachments.forEach((file) => {
        formData.append('attachments', file)
      })

      removedAttachments.forEach((attachmentId) => {
        formData.append('removedAttachments', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/procurement/${updatedProduct._id}`,
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

  // ending all update dialog funcs

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
        `${import.meta.env.VITE_BASE_URL}/api/v1/procurement/bulk_upload`,
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/procurement/delete/multiple/data`,
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
    setLoading2(true)
    try {
      const formData = new FormData()

      formData.append('docTitle', docTitle)
      formData.append('dept', dept)
      formData.append('remarks', remarks)
      // @ts-ignore
      formData.append('boq', selectedFormCode?.code)
      // @ts-ignore
      formData.append('type', selectedFormType?.code)
      formData.append('date', formatDate(formDate))
      filesInput.forEach((file) => {
        formData.append('attachments', file)
      })

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/procurement/upload`,
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
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data
        toast.error(message)
      }
    } finally {
      setLoading2(false)
      setProduct(emptyProduct)
    }
  }

  const confirmDeleteProduct = (product: Product) => {
    setProduct(product)
    setDeleteProductDialog(true)
  }

  const deleteProduct = async () => {
    const _products = products.filter(
      (val: { _id: any }) => val._id !== product._id
    )

    try {
      setLoading2(true)
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/procurement/delete/${product._id}`,
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

  const exportXLSX = () => {
    // Filter out unwanted fields
    const filteredProducts = filterData(products)

    if (selectedProducts && selectedProducts.length > 0) {
      const filteredSelectedProducts = filterData(selectedProducts)
      const worksheet = XLSX.utils.json_to_sheet(filteredSelectedProducts)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Procurement Data')
      XLSX.writeFile(workbook, 'procurement_data.xlsx')
    } else {
      const worksheet = XLSX.utils.json_to_sheet(filteredProducts)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Procurement Data')
      XLSX.writeFile(workbook, 'procurement_data.xlsx')
    }
  }

  const filterData = (data: any[]) => {
    return data.map(
      ({
        __v,
        createdAt,
        updatedAt,
        attachments,
        slNo,
        creator,
        updater,
        creationTimestamp,
        updatingTimestamp,
        _id,
        ...filteredData
      }) => filteredData
    )
  }

  const leftToolbarTemplate = () => {
    return (
      <div className='flex items-center gap-3'>
        <div className='p-3 bg-main text-base font-semibold text-white rounded-t'>
          Document List
        </div>
        {/* {isFinance && (
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
        {/* <button
          onClick={() => setActiveIndex(0)}
          className={`p-3 text-lg font-semibold border text-white rounded-t ${activeIndex === 0 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Quotation
        </button>

        <button
          onClick={() => setActiveIndex(1)}
          className={`p-3 text-lg font-semibold border text-white rounded-t ${activeIndex === 1 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Requisition
        </button> */}
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
              onClick={exportXLSX}
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

  function getMonthName(dateString?: string) {
    if (!dateString) {
      return ''
    }

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
        date3 && date4 ? `${formatDate(date3)} to ${formatDate(date4)}` : '',
      date: date ? formatDate(date) : '',
      searchQuery: searchKey,
      type: selectedType?.code || '',
      //@ts-ignore
      boq: selectedCode3.map((item) => item.code) || [],
      dept: searchDept || '',
    }

    searchProcurement(initialPayload).then((result) => {
      setProducts(result?.Procurments)
      setLoading(false)
    })
  }

  const handleReset = () => {
    setLoading(true)

    const initialPayload = {
      date_range: '',
      date: '',
      searchQuery: '',
      type: '',
      boq: [],
      dept: '',
    }

    setDate('')
    setDate3('')
    setDate4('')
    setSelectedType(null)
    setSearchDept('')
    setSearchKey('')
    setSelectedCode3([])

    searchProcurement(initialPayload).then((result) => {
      setProducts(result?.Procurments)
      setLoading(false)
    })
  }

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
          // @ts-ignore
          value={date3}
          // @ts-ignore
          onChange={(e) => setDate3(e.value)}
          inputClassName="text-xs border-0 focus:ring-0 py-1.5 px-3 w-32"
          placeholder='Start Date'
          showIcon
          icon={() => <i className='pi pi-angle-down' />}
        />
        <Calendar
          // @ts-ignore
          value={date4}
          // @ts-ignore
          onChange={(e) => setDate4(e.value)}
          inputClassName="text-xs border-0 focus:ring-0 py-1.5 px-3 w-32"
          placeholder='End Date'
          showIcon
          icon={() => <i className='pi pi-angle-down' />}
        />
        <Calendar
          // @ts-ignore
          value={date}
          // @ts-ignore
          onChange={(e) => setDate(e.value)}
          inputClassName='border-none rounded-none cursor-pointer focus:ring-0 ring-0'
          placeholder='Select Date'
          showIcon
        />

        <div>
          <Dropdown
            value={selectedType}
            onChange={(e) => setSelectedType(e.value)}
            options={categories}
            optionLabel='name'
            placeholder='Procurement Type'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
          />
        </div>

        <div>
          <Dropdown
            value={searchDept}
            onChange={(e) => setSearchDept(e.value)}
            options={depts}
            optionLabel='name'
            placeholder='Department'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
          />
        </div>

        <div>
          <MultiSelect
            value={selectedCode3}
            onChange={(e) => setSelectedCode3(e.value)}
            options={codes}
            optionLabel='name'
            placeholder='Select BOQ'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
            style={{ maxWidth: '250px', width: '100%' }} // Adjust width
            filter
            showClear
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

  const [payload, setPayload] = useState<any>({
    date: '',
    searchQuery: '',
    boq: '',
    type: '',
    dept: '',
  })

  const { data, isLoading, error, refetch } = useFinanceProcurement(payload)

  // initial data load
  useEffect(() => {
    if (data) {
      setProducts(data?.Procurments)
    }
  }, [data])

  // const refetch = () => {
  //   setLoading(true)
  //   const initialPayload = {
  //     month: '',
  //     year: '',
  //     searchQuery: '',
  //     code: '',
  //     type: '',
  //   }

  //   searchProcurement(initialPayload).then((result) => {
  //     setProducts(result?.Procurments)
  //     setLoading(false)
  //   })
  // }

  // initial data load -Excel
  // useEffect(() => {
  //   setLoading(true)
  //   const initialPayload = {
  //     month: '',
  //     year: '',
  //     searchQuery: '',
  //     code: '',
  //     type: '',
  //   }

  //   searchProcurement(initialPayload).then((result) => {
  //     setProducts(result?.Procurments)
  //     setLoading(false)
  //   })
  // }, [])

  const attachmentBodyTemplate = (rowData: any) => {
    return <div>{rowData?.attachments?.length}</div>
  }

  // console.log(products)

  return (
    <div className=''>
      <h1 className='text-2xl font-bold tracking-tight md:text-3xl pl-4 text-main mb-3'>
        Procurement
      </h1>
      <div className='ml-4'>
        <Toolbar
          className='rounded-none border-none p-0 bg-backgournd'
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>
        <DataTable
          ref={dt}           size="small"           height={45}
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
          scrollable
        >
          {hasEditAccess && (
            <Column
              selectionMode='multiple'
              headerStyle={{ width: '3rem' }}
              exportable={false}
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-xs truncate max-w-xs'
            ></Column>
          )}

          <Column
            field='slNo'
            header='SL No.'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-xs truncate max-w-xs'
            className='min-w-[10rem]'
            sortable
          ></Column>

          <Column
            field='docTitle'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-xs truncate max-w-xs'
            sortable
            className='min-w-[14rem]'
            header='Doc Title'
          ></Column>

          <Column
            field='boq'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-xs truncate max-w-xs'
            sortable
            className='min-w-[14rem]'
            header='BOQ'
          ></Column>

          <Column
            field='dept'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-xs truncate max-w-xs'
            sortable
            className='min-w-[8rem]'
            header='Department'
          ></Column>

          <Column
            field='date'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-xs truncate max-w-xs'
            sortable
            className='min-w-[8rem]'
            header='Date'
          ></Column>

          <Column
            field='remarks'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-xs truncate max-w-xs'
            sortable
            className='min-w-[8rem]'
            header='Remarks'
          ></Column>

          {/* <Column
            body={attachmentBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-xs truncate max-w-xs'
            sortable
            className='min-w-[8rem]'
            header='Attachments'
          ></Column> */}

          <Column
            body={actionBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-xs truncate max-w-xs'
            header='Actions'
            headerStyle={{ width: '3rem' }}
            exportable={false}
          ></Column>
        </DataTable>
      </div>

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
                <p className='break-all'>{selectedProduct.date}</p>
              </div>

              <div>
                <h3 className='font-bold'>Doc Title</h3>
                <p className='break-all'>{selectedProduct.docTitle}</p>
              </div>
              <div>
                <h3 className='font-bold'>Procurement Type</h3>
                <p className='break-all'>{selectedProduct.type}</p>
              </div>
              <div>
                <h3 className='font-bold'>Department</h3>
                <p className='break-all'>{selectedProduct.dept}</p>
              </div>
              <div>
                <h3 className='font-bold'>BOQ</h3>
                <p className='break-all'>{selectedProduct.boq}</p>
              </div>
              <div>
                <h3 className='font-bold'>Remarks</h3>
                <p className='break-all'>{selectedProduct.remarks}</p>
              </div>

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
            <div className='field'>
              <label htmlFor='type' className='font-bold'>
                Procurement Type
              </label>
              <Dropdown
                id='type'
                value={selectedFormType}
                onChange={(e) => setSelectedFormType(e.value)}
                options={categoriesForForm}
                optionLabel='name'
                placeholder='Select Type'
                // className='border-none rounded-none ml-4 cursor-pointer ring-0'
              />
            </div>

            <div className='field'>
              <label htmlFor='code' className='font-bold'>
                Select BOQ
              </label>
              <Dropdown
                id='code'
                value={selectedFormCode}
                onChange={(e) => setSelectedFormCode(e.value)}
                options={codes}
                optionLabel='name'
                placeholder='Select BOQ'
                // className='border-none rounded-none ml-4 cursor-pointer ring-0'
              />
            </div>

            <div className='field'>
              <label htmlFor='docTitle' className='font-bold'>
                Doc Title
              </label>
              <InputText
                id='docTitle'
                onChange={(e) => setDocTitle(e.target.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='dept' className='font-bold'>
                Department
              </label>
              <Dropdown
                value={dept}
                onChange={(e) => setDept(e.value)}
                options={depts}
                optionLabel='name'
                placeholder='Select Department'
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
              Are you sure you want to delete <b>{product.slNo}</b>?
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
              <label htmlFor='docTitle' className='font-bold'>
                Doc Title
              </label>
              <InputText
                id='docTitle'
                value={updatedProduct.docTitle}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    docTitle: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='type' className='font-bold'>
                Select Procurement Type
              </label>
              <Dropdown
                id='type'
                value={updatedProduct.type}
                options={[
                  'Quotation',
                  'Requisition',
                  'Work Order',
                  'Invoice',
                  'Other',
                ]}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    type: e.target.value,
                  })
                }
                placeholder='Select type'
              />
            </div>

            <div className='field'>
              <label htmlFor='code' className='font-bold'>
                Select BOQ
              </label>
              <Dropdown
                id='code'
                value={updatedProduct.boq}
                options={stringValues}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    boq: e.target.value,
                  })
                }
                placeholder='Select BOQ'
              />
            </div>

            <div className='field'>
              <label htmlFor='dept' className='font-bold'>
                Department
              </label>
              <Dropdown
                id='dept'
                value={updatedProduct.dept}
                options={depts}
                optionLabel='name'
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    dept: e.target.value,
                  })
                }
                placeholder='Select Department'
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
