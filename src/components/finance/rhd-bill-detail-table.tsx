import {
  searchRhdBillExcel,
  searchRhdBillPdf,
  useRhdBillExl,
} from '@/api/financeAPIs'
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
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Menu } from 'primereact/menu'
import { TabPanel, TabView } from 'primereact/tabview'
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
  filename: string
  code: string
  date: string
  remarks: string
  attachments: Attachment[]
  creator?: string
  creationTimestamp?: string
  updater?: string
  updatingTimestamp?: string
}

export default function RhdBillDetails() {
  const emptyProduct: Product = {
    _id: '',
    slNo: '',
    filename: '',
    code: '',
    date: '',
    remarks: '',
    attachments: [],
  }

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'finance-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'rhd-bill-details'
  )

  const hasEditAccess = checkPermission?.edit_authority || false

  const isFinance = roles.some((role) =>
    ['superadmin', 'finance-manager'].includes(role.title)
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [products, setProducts] = useState<any>([])
  const [products2, setProducts2] = useState<any>([])
  const [productDialog, setProductDialog] = useState<boolean>(false)
  const [productDialog2, setProductDialog2] = useState<boolean>(false)
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)
  const [deleteProductDialog2, setDeleteProductDialog2] =
    useState<boolean>(false)
  const [deleteProductsDialog, setDeleteProductsDialog] =
    useState<boolean>(false)
  const [product, setProduct] = useState<any>(emptyProduct)
  const [product2, setProduct2] = useState<any>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [selectedProducts2, setSelectedProducts2] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [date3, setDate3] = useState<string>('')
  const [date4, setDate4] = useState<string>('')
  const [searchKey, setSearchKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [fileName, setFileName] = useState('')
  const [remarks, setRemarks] = useState('')
  const [formDate, setFormDate] = useState<string>('')
  const [selectedFormCode, setSelectedFormCode] = useState(null)
  const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    billNo: '',
    mbNo: '',
    details: '',
    currency: '',
    chequeAmount: 0,
    vatAmount: 0,
    taxAmount: 0,
    chequeData: '',
    financial: '',
    chequeNo: '',
    status: '',
  })
  const [filesInput, setFilesInput] = useState<File[]>([])
  const [selectedCode, setSelectedCode] = useState<string[]>([])
  const [totalBilAmount, setTotalBillAmount] = useState(0)
  const [totalVatAmount, setTotalVatAmount] = useState(0)
  const [totalTaxAmount, setTotalTaxAmount] = useState(0)
  const [totalChequeAmount, setTotalChequeAmount] = useState(0)

  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<any | null>(null)
  const [updateProductDialog2, setUpdateProductDialog2] =
    useState<boolean>(false)
  const [updatedProduct2, setUpdatedProduct2] = useState<any | null>(null)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])

  const [bulkDialog, setBulkDialog] = useState(false)
  const [file, setFile] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')

  const codes = [
    { name: '3221110-Commission', code: '3221110-Commission' },
    { name: '3258110-Roads & Highway', code: '3258110-Roads & Highway' },
    {
      name: '4112304-Engineering & Other Equipment',
      code: '4112304-Engineering & Other Equipment',
    },
  ]

  // all update dialog func here for Exl
  const openUpdateDialog = (product: Product) => {
    setUpdatedProduct({ ...product })
    setUpdateProductDialog(true)
  }

  const hideUpdateDialog = () => {
    setUpdateProductDialog(false)
    setUpdatedProduct(null)
  }

  const handleUpdateProduct = async () => {
    if (!updatedProduct) return

    try {
      setLoading2(true)

      const formData = new FormData()

      formData.append('billNo', updatedProduct?.billNo)
      formData.append('mbNo', updatedProduct?.mbNo)
      formData.append('details', updatedProduct?.details)
      formData.append('currency', updatedProduct?.currency)
      formData.append('chequeAmount', updatedProduct?.chequeAmount)
      formData.append('vatAmount', updatedProduct?.vatAmount)
      formData.append('taxAmount', updatedProduct?.taxAmount)
      formData.append('chequeData', updatedProduct?.chequeData)
      formData.append('financial', updatedProduct?.financial)
      formData.append('chequeNo', updatedProduct?.chequeNo)
      formData.append('status', updatedProduct?.status)
      formData.append('remarks', updatedProduct?.remarks)
      formData.append('code', updatedProduct?.code)
      formData.append('date', updatedProduct?.date)

      newAttachments.forEach((file) => {
        formData.append('attachments', file)
      })

      removedAttachments.forEach((attachmentId) => {
        formData.append('removedAttachments', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/rhd-exl/bill-details/${updatedProduct._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      refetchExl()
      hideUpdateDialog()
      toast.success('Data updated successfully')
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data
        toast.error(message)
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

  // ending all update dialog funcs

  // all update dialog func here for Pdf
  const openUpdateDialog2 = (product: Product) => {
    setUpdatedProduct2({ ...product })
    setUpdateProductDialog2(true)
  }

  const hideUpdateDialog2 = () => {
    setUpdateProductDialog2(false)
    setUpdatedProduct2(null)
    setNewAttachments([])
    setRemovedAttachments([])
  }

  // const handleUpdateProduct2 = async () => {
  //   if (!updatedProduct2) return

  //   try {
  //     setLoading2(true)
  //     const formData = new FormData()
  //     formData.append('filename', updatedProduct2.filename)
  //     formData.append('code', updatedProduct2.code)
  //     formData.append('remarks', updatedProduct2.remarks)
  //     formData.append('date', updatedProduct2.date)

  //     newAttachments.forEach((file) => {
  //       formData.append('attachments', file)
  //     })

  //     removedAttachments.forEach((attachmentId) => {
  //       formData.append('removedAttachments', attachmentId)
  //     })

  //     const res = await axios.put(
  //       `${import.meta.env.VITE_BASE_URL}/api/v1/rhd-pdf/bill-details/${updatedProduct2._id}`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     )

  //     refetchPdf()
  //     hideUpdateDialog2()
  //     toast.success('Data updated successfully')
  //   } catch (error: any) {
  //     if (error.response) {
  //       const { message } = error.response.data
  //       toast.error(message)
  //     } else {
  //       console.log(error)
  //     }
  //   } finally {
  //     setLoading2(false)
  //   }
  // }

  const handleNewAttachments = (files: File[]) => {
    setNewAttachments(files)
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    setRemovedAttachments((prev) => [...prev, attachmentId])
    setUpdatedProduct((prev: any) => {
      if (!prev) return null
      return {
        ...prev,
        attachments: prev.attachments.filter(
          (a: { _id: string }) => a._id !== attachmentId
        ),
      }
    })
  }

  // const updateProductDialogFooter2 = (
  //   <>
  //     <Button
  //       label='Cancel'
  //       icon='pi pi-times'
  //       outlined
  //       onClick={hideUpdateDialog2}
  //     />
  //     <Button
  //       label='Update'
  //       icon='pi pi-check'
  //       onClick={handleUpdateProduct2}
  //       loading={loading2}
  //     />
  //   </>
  // )

  // ending all update dialog funcs

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
        `${import.meta.env.VITE_BASE_URL}/api/v1/rhd-exl/bill-details/delete/multiple/data`,
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
      refetchExl()
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/rhd-exl/bill-details/bulk_upload`,
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
      refetchExl()
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

  const hideDeleteProductDialog2 = () => {
    setDeleteProductDialog2(false)
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
    setSubmitted(true)
    try {
      setLoading2(true)

      const data = new FormData()

      data.append('billNo', formData.billNo)
      data.append('mbNo', formData.mbNo)
      data.append('details', formData.details)
      data.append('currency', formData.currency)
      // @ts-ignore
      data.append('chequeAmount', formData.chequeAmount)
      // @ts-ignore
      data.append('vatAmount', formData.vatAmount)
      // @ts-ignore
      data.append('taxAmount', formData.taxAmount)
      data.append('chequeData', formData.chequeData)
      data.append('financial', formData.financial)
      data.append('chequeNo', formData.chequeNo)
      data.append('status', formData.status)
      data.append('remarks', remarks)
      data.append('date', formatDate(formDate))
      // @ts-ignore
      data.append('code', selectedFormCode?.code)

      filesInput.forEach((file) => {
        data.append('attachments', file)
      })

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/rhd-exl/bill-details/upload`,
        data,
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
      refetchExl()
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

  // const saveProduct2 = async () => {
  //   try {
  //     const formData = new FormData()

  //     formData.append('filename', fileName)
  //     // @ts-ignore
  //     formData.append('code', selectedFormCode?.code)
  //     formData.append('date', formatDate(formDate))
  //     formData.append('remarks', remarks)
  //     filesInput.forEach((file) => {
  //       formData.append('attachments', file)
  //     })

  //     const res = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/api/v1/rhd-pdf/bill-details/upload`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     )

  //     const response = res
  //     console.log(response)
  //     hideDialog2()
  //     toast.success('Data Saved Successfully')
  //     refetchPdf()
  //   } catch (error: any) {
  //     if (error.response) {
  //       const { message } = error.response.data
  //       toast.error(message)
  //     } else {
  //       console.log(error)
  //     }
  //   }
  // }

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
        `${import.meta.env.VITE_BASE_URL}/api/v1/rhd-exl/bill-details/delete/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      refetchExl()
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

  const exportXLSX = () => {
    // Filter out unwanted fields
    const filteredProducts = filterData(products)

    if (selectedProducts && selectedProducts.length > 0) {
      const filteredSelectedProducts = filterData(selectedProducts)
      const worksheet = XLSX.utils.json_to_sheet(filteredSelectedProducts)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
      XLSX.writeFile(workbook, 'data.xlsx')
    } else {
      const worksheet = XLSX.utils.json_to_sheet(filteredProducts)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
      XLSX.writeFile(workbook, 'data.xlsx')
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

  const exportCSV = () => {
    if (selectedProducts && selectedProducts.length > 0) {
      dt.current?.exportCSV({ selectionOnly: true })
    } else {
      dt.current?.exportCSV()
    }
  }

  const confirmDeleteProduct2 = (product: Product) => {
    setProduct2(product)
    setDeleteProductDialog2(true)
  }

  // const deleteProduct2 = async () => {
  //   const _products2 = products2.filter(
  //     (val: { _id: any }) => val._id !== product2._id
  //   )

  //   try {
  //     setLoading2(true)
  //     const res = await axios.delete(
  //       `${import.meta.env.VITE_BASE_URL}/api/v1/rhd-pdf/bill-details/delete/${product2._id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     )

  //     refetchPdf()
  //     toast.success('Data Deleted Successfully')
  //   } catch (error: any) {
  //     if (error.response) {
  //       const { message } = error.response.data
  //       toast.error(message)
  //     } else {
  //       console.log(error)
  //     }
  //   } finally {
  //     setLoading2(false)
  //   }

  //   setProducts2(_products2)
  //   setDeleteProductDialog2(false)
  //   setProduct2(emptyProduct)
  // }

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
          onClick={() => setActiveIndex(1)}
          className={`p-3 text-lg font-semibold border text-white rounded-t ${activeIndex === 1 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Document List
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
              Upload Data List
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

  const actionBodyTemplate2 = (rowData: Product) => {
    const menuRef = useRef<Menu>(null)
    const items = [
      {
        label: 'View',
        icon: 'pi pi-eye',
        command: () => viewProduct(rowData),
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => openUpdateDialog2(rowData),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => confirmDeleteProduct2(rowData),
      },
    ]

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
      year: date2 ? date2 : '',
      date_range:
        date3 && date4 ? `${formatDate(date3)} to ${formatDate(date4)}` : '',
      searchQuery: searchKey,
      // @ts-ignore
      code: selectedCode.map((item) => item.code) || [],
    }

    // console.log('dataaaaaaaaaaaaaa ===> ', selectedCode)

    searchRhdBillExcel(initialPayload).then((result) => {
      setProducts(result?.RhdBillExls)
      setTotalBillAmount(result?.totalBillAmountSum)
      setTotalChequeAmount(result?.totalChequeAmountSum)
      setTotalVatAmount(result?.totalvatAmountSum)
      setTotalTaxAmount(result?.totaltaxAmountSum)

      setLoading(false)
    })
  }

  const handleSearch2 = () => {
    setLoading(true)
    const initialPayload = {
      month: date ? getMonthName(date) : '',
      year: date2 ? date2 : '',
      date_range:
        date3 && date4 ? `${formatDate(date3)} to ${formatDate(date4)}` : '',
      searchQuery: searchKey,
      // @ts-ignore
      code: selectedCode.map((item) => item.code) || [],
    }

    searchRhdBillPdf(initialPayload).then((result) => {
      setProducts(result?.RhdBillPdfs)
      setLoading(false)
    })
  }

  const handleReset = () => {
    setLoading(true)

    const initialPayload = {
      month: '',
      year: '',
      date_range: '',
      searchQuery: '',
      code: [],
    }

    setDate('')
    setDate2('')
    setDate3('')
    setDate4('')
    setSearchKey('')
    setSelectedCode([])

    searchRhdBillExcel(initialPayload).then((result) => {
      setProducts(result?.RhdBillExls)
      setTotalBillAmount(result?.totalBillAmountSum)
      setTotalChequeAmount(result?.totalChequeAmountSum)
      setTotalVatAmount(result?.totalvatAmountSum)
      setTotalTaxAmount(result?.totaltaxAmountSum)

      setLoading(false)
    })
  }

  const filterSearchForm = (
    <div className='flex flex-col space-y-3 items-center justify-between'>
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
          inputClassName='border-none rounded-none cursor-pointer focus:ring-0'
          placeholder='Start Date'
          showIcon
          icon={() => <i className='pi pi-angle-down' />}
        />
        <Calendar
          // @ts-ignore
          value={date4}
          // @ts-ignore
          onChange={(e) => setDate4(e.value)}
          inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
          placeholder='End Date'
          showIcon
          icon={() => <i className='pi pi-angle-down' />}
        />
        <Calendar
          // @ts-ignore
          value={date}
          // @ts-ignore
          onChange={(e) => setDate(e.value)}
          view='month'
          dateFormat='MM'
          inputClassName='border-none rounded-none cursor-pointer focus:ring-0 ring-0'
          placeholder='By Month'
          showIcon
          icon={() => <i className='pi pi-angle-down' />}
        />

        <div>
          <Dropdown
            value={date2}
            options={[
              '2020-2021',
              '2021-2022',
              '2022-2023',
              '2023-2024',
              '2024-2025',
              '2025-2026',
              '2026-2027',
              '2027-2028',
              '2028-2029',
              '2029-2030',
            ]}
            onChange={(e) => setDate2(e.value)}
            optionLabel='financial'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
            placeholder='Select Financial Year'
          />
        </div>
        <div>
          <MultiSelect
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.value)}
            options={codes}
            optionLabel='name'
            showClear
            filter
            placeholder='Select Code'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
            style={{ maxWidth: '250px', width: '100%' }} // Adjust width
          />
        </div>
        <IconField iconPosition='left' className='relative'>
          <InputIcon className='pi pi-search' />
          <InputText
            type='search'
            placeholder='Search'
            className='border-none ml-4 focus:ring-0'
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
          />

          {activeIndex === 0 ? (
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
          ) : (
            <button
              onClick={() => handleSearch2()}
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
          )}
        </IconField>
      </div>

      <div>
        {/* <h1 className='text-sm font-semibold border p-4 rounded-md bg-gray-500 text-white'>
          Total Cheque: {totalChequeAmount} | Total Tax: {totalTaxAmount} | Total Vat: {totalVatAmount} | Total Addition Amount: {totalBilAmount} 
        </h1> */}

        <div className='flex w-fit gap-2 divide-x-2 border p-4 rounded-md bg-blue-50 text-gray-600 text-xs'>
          <h1>Total Cheque Amount: {totalChequeAmount}</h1>
          <h1 className='pl-2'>Total Tax Amount: {totalTaxAmount}</h1>
          <h1 className='pl-2'>Total Vat Amount: {totalVatAmount}</h1>
          <h1 className='pl-2'>Total Payment Amount: {totalBilAmount}</h1>
        </div>
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

  // const productDialogFooter2 = (
  //   <>
  //     <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
  //     <Button label='Save' icon='pi pi-check' onClick={saveProduct2} />
  //   </>
  // )

  const deleteProductDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        severity='danger'
        onClick={deleteProduct}
      />
    </>
  )

  // const deleteProductDialogFooter2 = (
  //   <>
  //     <Button
  //       label='No'
  //       icon='pi pi-times'
  //       outlined
  //       onClick={hideDeleteProductDialog2}
  //     />
  //     <Button
  //       label='Yes'
  //       icon='pi pi-check'
  //       severity='danger'
  //       onClick={deleteProduct2}
  //     />
  //   </>
  // )

  const [payload, setPayload] = useState<any>({
    month: '',
    year: '',
    searchQuery: '',
    code: '',
  })

  const { data, isLoading, error, refetch: refetchExl } = useRhdBillExl(payload)

  useEffect(() => {
    if (data) {
      setProducts(data?.RhdBillExls)
      setTotalBillAmount(data?.totalBillAmountSum)
      setTotalChequeAmount(data?.totalChequeAmountSum)
      setTotalVatAmount(data?.totalvatAmountSum)
      setTotalTaxAmount(data?.totaltaxAmountSum)
    }
  }, [data])

  // const refetchExl = () => {
  //   setLoading(true)
  //   const initialPayload = {
  //     month: '',
  //     year: '',
  //     searchQuery: '',
  //     code: '',
  //   }

  //   searchRhdBillExcel(initialPayload).then((result) => {
  //     setProducts(result?.RhdBillExls)
  //     setTotalBillAmount(result?.totalBillAmountSum)
  //     setLoading(false)
  //   })
  // }

  // initial data load -Excel

  // useEffect(() => {
  //   refetchExl()
  // }, [])

  // const refetchPdf = () => {

  //   setLoading(true)
  //   const initialPayload = {
  //     month: '',
  //     year: '',
  //     searchQuery: '',
  //     code: '',
  //   }

  //   searchRhdBillPdf(initialPayload).then((result) => {
  //     setProducts2(result?.RhdBillPdfs)
  //     setLoading(false)
  //   })
  // }

  // initial data load - PDF
  // useEffect(() => {
  //   refetchPdf()
  // }, [])

  const attachmentBodyTemplate = (rowData: any) => {
    return <div>{rowData?.attachments?.length}</div>
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleNumberInputChange = (
    e: { value: number | null },
    field: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.value || 0 }))
  }

  // console.log(products)

  return (
    <div className=''>
      <h1 className='text-2xl font-bold tracking-tight md:text-3xl pl-4 text-main mb-3'>
        {activeIndex === 0 ? 'Bill Details - Excel' : 'Bill Details - PDF'}
      </h1>
      <div className='ml-4'>
        <Toolbar
          className='rounded-none border-none p-0 bg-backgournd'
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {/* 1st tab  */}
          <TabPanel>
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
              loading={isLoading || loading}
              scrollable
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
                field='slNo'
                header='SL No.'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                className='min-w-[10rem]'
                sortable
              ></Column>

              <Column
                field='code'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Code'
              ></Column>

              <Column
                field='billNo'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[8rem]'
                header='Bill No'
              ></Column>

              <Column
                field='mbNo'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[8rem]'
                header='MB No'
              ></Column>

              <Column
                field='details'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[8rem]'
                header='Details'
              ></Column>

              <Column
                field='currency'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[8rem]'
                header='Currency'
              ></Column>

              <Column
                field='date'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[10rem]'
                header='Cheque Date'
              ></Column>

              <Column
                field='financial'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Financial Year'
              ></Column>

              <Column
                field='chequeNo'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Cheque No.'
              ></Column>

              <Column
                field='chequeAmount'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Cheque Amount'
              ></Column>

              <Column
                field='taxAmount'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Tax Amount'
              ></Column>

              <Column
                field='vatAmount'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Vat Amount'
              ></Column>

              <Column
                field='totalBillAmount'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Total Bill Amount'
              ></Column>

              <Column
                field='status'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[8rem]'
                header='Status'
              ></Column>

              <Column
                field='remarks'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Remarks'
              ></Column>

              <Column
                body={attachmentBodyTemplate}
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                header='Attachment'
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
          </TabPanel>

          {/* 2nd Tab  */}
          {/* <TabPanel>
            <DataTable
              ref={dt}           size="small"           height={45}
              value={products2}
              selection={selectedProducts2}
              onSelectionChange={(e: {
                value: React.SetStateAction<Product[]>
              }) => {
                if (Array.isArray(e.value)) {
                  setSelectedProducts2(e.value)
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
              <Column
                selectionMode='multiple'
                headerStyle={{ width: '3rem' }}
                exportable={false}
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
              ></Column>

              <Column
                field='slNo'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                header='SL No.'
              ></Column>
              <Column
                field='filename'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                header='PDF File Name'
              ></Column>

              <Column
                field='date'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                header='Date'
              ></Column>

              <Column
                field='code'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                header='Code'
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
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
              ></Column>

              <Column
                body={actionBodyTemplate2}
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                header='Actions'
                headerStyle={{ width: '3rem' }}
                exportable={false}
              ></Column>
            </DataTable>
          </TabPanel> */}
        </TabView>
      </div>

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

      {/* update data dialog for pdf  */}
      {/* <Dialog
        visible={updateProductDialog2}
        style={{ width: '50rem' }}
        header='Update PDF Details'
        modal
        className='p-fluid'
        footer={updateProductDialogFooter2}
        onHide={hideUpdateDialog2}
      >
        {updatedProduct2 && (
          <div className='grid grid-cols-2 gap-4'>
            <div className='field'>
              <label htmlFor='filename' className='font-bold'>
                PDF File Name
              </label>
              <InputText
                id='filename'
                value={updatedProduct2?.filename}
                onChange={(e) =>
                  setUpdatedProduct2({
                    ...updatedProduct2,
                    filename: e.target.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='code' className='font-bold'>
                Select Code
              </label>
              <Dropdown
                id='code'
                value={updatedProduct2?.code}
                onChange={(e) =>
                  setUpdatedProduct2({
                    ...updatedProduct2,
                    code: e.target.value,
                  })
                }
                options={[
                  '3221110-Commission',
                  '3258110-Roads & Highway',
                  '4112304-Engineering & Other Equipment plaza',
                ]}
                placeholder='Select Code'
                // className='border-none rounded-none ml-4 cursor-pointer ring-0'
              />
            </div>

            <div className='field'>
              <label htmlFor='remarks' className='font-bold'>
                Remarks
              </label>
              <InputText
                id='remarks'
                value={updatedProduct2?.remarks}
                onChange={(e) =>
                  setUpdatedProduct2({
                    ...updatedProduct2,
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
                  new Date(updatedProduct2.date.split('-').reverse().join('-'))
                }
                onChange={(e) =>
                  setUpdatedProduct2({
                    ...updatedProduct2,
                    date: e.value ? formatDate(e.value) : '',
                  })
                }
                dateFormat='dd/mm/yy'
              />
            </div>
            <div className='col-span-2'>
              <h3 className='font-bold mb-2'>Existing Attachments</h3>
              <div className='flex flex-wrap gap-3'>
                {updatedProduct2.attachments.map(
                  (attachment: { _id: any; url: any }) => (
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
                  )
                )}
              </div>
            </div>
            <div className='col-span-2'>
              <h3 className='font-bold mb-2'>Add New Attachments</h3>
              <MultiFileInput onFilesChange={handleNewAttachments} />
            </div>
          </div>
        )}
      </Dialog> */}

      {/* update data dialog for Exl  */}
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
          <>
            <div className='grid grid-cols-2 items-center gap-6'>
              <div className='field'>
                <label htmlFor='code' className='font-bold'>
                  Select Code
                </label>
                <Dropdown
                  id='code'
                  value={updatedProduct?.code}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      code: e.target.value,
                    })
                  }
                  options={[
                    '3221110-Commission',
                    '3258110-Roads & Highway',
                    '4112304-Engineering & Other Equipment plaza',
                  ]}
                  placeholder='Select Code'
                  // className='border-none rounded-none ml-4 cursor-pointer ring-0'
                />
              </div>

              <div className='field'>
                <label htmlFor='billNo' className='font-bold'>
                  Bill No
                </label>
                <InputText
                  id='billNo'
                  value={updatedProduct?.billNo}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      billNo: e.target.value,
                    })
                  }
                />
              </div>
              <div className='field'>
                <label htmlFor='mbNo' className='font-bold'>
                  MB No
                </label>
                <InputText
                  id='mbNo'
                  value={updatedProduct?.mbNo}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      mbNo: e.target.value,
                    })
                  }
                />
              </div>
              <div className='field'>
                <label htmlFor='details' className='font-bold'>
                  Details
                </label>
                <InputText
                  id='details'
                  value={updatedProduct?.details}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      details: e.target.value,
                    })
                  }
                />
              </div>
              <div className='field'>
                <label htmlFor='currency' className='font-bold'>
                  Currency
                </label>

                <Dropdown
                  id='currency'
                  value={updatedProduct?.currency}
                  options={['USD', 'BDT']}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      currency: e.target.value,
                    })
                  }
                  placeholder='Select Currency'
                />
              </div>
              <div className='field'>
                <label htmlFor='chequeAmount' className='font-bold'>
                  Cheque Amount
                </label>
                <InputNumber
                  id='chequeAmount'
                  value={updatedProduct?.chequeAmount}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      chequeAmount: e.value,
                    })
                  }
                />
              </div>
              <div className='field'>
                <label htmlFor='vatAmount' className='font-bold'>
                  VAT Amount
                </label>
                <InputNumber
                  id='vatAmount'
                  value={updatedProduct?.vatAmount}
                  // @ts-ignore
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      vatAmount: e.value,
                    })
                  }
                />
              </div>
              <div className='field'>
                <label htmlFor='taxAmount' className='font-bold'>
                  Tax Amount
                </label>
                <InputNumber
                  id='taxAmount'
                  value={updatedProduct?.taxAmount}
                  // @ts-ignore
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      taxAmount: e.value,
                    })
                  }
                />
              </div>
              {/* <div className='field'>
                <label htmlFor='chequeData' className='font-bold'>
                  Cheque Date
                </label>
                <div className='border rounded-md'>
                  <Calendar
                    id='chequedate'
                    value={
                      new Date(
                        updatedProduct.date.split('-').reverse().join('-')
                      )
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
              </div> */}
              <div>
                <label htmlFor='date' className='font-bold'>
                  Cheque Date
                </label>
                <div className='border rounded-md'>
                  <Calendar
                    id='date'
                    value={
                      new Date(
                        updatedProduct.date.split('-').reverse().join('-')
                      )
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
              </div>
              <div className='field'>
                <label htmlFor='financial' className='font-bold'>
                  Financial Year
                </label>

                <Dropdown
                  id='financial'
                  value={updatedProduct?.financial}
                  options={[
                    '2020-2021',
                    '2021-2022',
                    '2022-2023',
                    '2023-2024',
                    '2024-2025',
                    '2025-2026',
                    '2026-2027',
                    '2027-2028',
                    '2028-2029',
                    '2029-2030',
                  ]}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      financial: e.target.value,
                    })
                  }
                  placeholder='Select Financial Year'
                />
              </div>
              <div className='field'>
                <label htmlFor='chequeNo' className='font-bold'>
                  Cheque No
                </label>
                <InputText
                  id='chequeNo'
                  value={updatedProduct?.chequeNo}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      chequeNo: e.target.value,
                    })
                  }
                />
              </div>
              <div className='field'>
                <label htmlFor='status' className='font-bold'>
                  Status
                </label>
                <Dropdown
                  id='status'
                  value={updatedProduct?.status}
                  options={[
                    'Success',
                    'Pending',
                    'Failed',
                    'Received',
                    'Ongoing',
                    'Not Received',
                  ]}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      status: e.target.value,
                    })
                  }
                  placeholder='Select Status'
                />
              </div>

              <div className='field'>
                <label htmlFor='remarks' className='font-bold'>
                  Remarks
                </label>
                <InputText
                  id='remarks'
                  value={updatedProduct?.remarks}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      remarks: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className='col-span-2 mt-4'>
              <h3 className='font-bold mb-2'>Existing Attachments</h3>
              <div className='flex flex-wrap gap-3'>
                {updatedProduct.attachments.map(
                  (attachment: { _id: any; url: any }) => (
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
                  )
                )}
              </div>
            </div>
            <div className='col-span-2 mt-4'>
              <h3 className='font-bold mb-2'>Add New Attachments</h3>
              <MultiFileInputTwo onFilesChange={handleNewAttachments} />
            </div>
          </>
        )}
      </Dialog>

      {/* Form Dialog (Upload Data List)  */}
      <Dialog
        visible={productDialog}
        style={{ width: '52rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Upload Data List'
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <>
          <div className='grid grid-cols-2 items-center gap-6'>
            <div className='field'>
              <label htmlFor='code' className='font-bold'>
                Select Code
              </label>
              <Dropdown
                id='code'
                value={selectedFormCode}
                onChange={(e) => setSelectedFormCode(e.value)}
                options={codes}
                optionLabel='name'
                placeholder='Select Code'
                // className='border-none rounded-none ml-4 cursor-pointer ring-0'
              />
            </div>

            <div className='field'>
              <label htmlFor='billNo' className='font-bold'>
                Bill No
              </label>
              <InputText
                id='billNo'
                value={formData.billNo}
                onChange={handleInputChange}
              />
            </div>
            <div className='field'>
              <label htmlFor='mbNo' className='font-bold'>
                MB No
              </label>
              <InputText
                id='mbNo'
                value={formData.mbNo}
                onChange={handleInputChange}
              />
            </div>
            <div className='field'>
              <label htmlFor='details' className='font-bold'>
                Details
              </label>
              <InputText
                id='details'
                value={formData.details}
                onChange={handleInputChange}
              />
            </div>
            <div className='field'>
              <label htmlFor='currency' className='font-bold'>
                Currency
              </label>

              <Dropdown
                id='currency'
                value={formData.currency}
                options={['USD', 'BDT']}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, currency: e.value }))
                }
                placeholder='Select Currency'
              />
            </div>
            <div className='field'>
              <label htmlFor='chequeAmount' className='font-bold'>
                Cheque Amount
              </label>
              <InputNumber
                id='chequeAmount'
                value={formData.chequeAmount}
                onValueChange={(e) =>
                  // @ts-ignore
                  handleNumberInputChange(e, 'chequeAmount')
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='vatAmount' className='font-bold'>
                VAT Amount
              </label>
              <InputNumber
                id='vatAmount'
                value={formData.vatAmount}
                // @ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'vatAmount')}
              />
            </div>
            <div className='field'>
              <label htmlFor='taxAmount' className='font-bold'>
                Tax Amount
              </label>
              <InputNumber
                id='taxAmount'
                value={formData.taxAmount}
                // @ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'taxAmount')}
              />
            </div>
            <div>
              <label htmlFor='date' className='font-bold'>
                Cheque Date
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

            {/* <div className='field'>
              <label htmlFor='chequeData' className='font-bold'>
                Cheque Date
              </label>
              <div className='border rounded-md'>
                <Calendar
                  id='chequedate'
                  // @ts-ignore
                  onChange={(e) => setFormDate(e.value)}
                  dateFormat='dd/mm/yy'
                  inputClassName='border-0 focus:ring-0 cursor-pointer'
                  className='focus:ring-0'
                  placeholder='Select Date'
                />
              </div>
            </div> */}

            <div className='field'>
              <label htmlFor='financial' className='font-bold'>
                Financial Year
              </label>

              <Dropdown
                id='financial'
                value={formData.financial}
                options={[
                  '2020-2021',
                  '2021-2022',
                  '2022-2023',
                  '2023-2024',
                  '2024-2025',
                  '2025-2026',
                  '2026-2027',
                  '2027-2028',
                  '2028-2029',
                  '2029-2030',
                ]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, financial: e.value }))
                }
                placeholder='Select Financial Year'
              />
            </div>
            <div className='field'>
              <label htmlFor='chequeNo' className='font-bold'>
                Cheque No
              </label>
              <InputText
                id='chequeNo'
                value={formData.chequeNo}
                onChange={handleInputChange}
              />
            </div>
            <div className='field'>
              <label htmlFor='status' className='font-bold'>
                Status
              </label>
              <Dropdown
                id='status'
                value={formData.status}
                options={[
                  'Success',
                  'Pending',
                  'Failed',
                  'Received',
                  'Ongoing',
                  'Not Received',
                ]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.value }))
                }
                placeholder='Select Status'
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

      {/* Dialog (Form Document list)  */}
      {/* <Dialog
        visible={productDialog2}
        style={{ width: '42rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Upload Document List'
        modal
        className='p-fluid'
        footer={productDialogFooter2}
        onHide={hideDialog2}
      >
        <>
          <div className='grid grid-cols-2 items-center gap-6'>
            <div className='field'>
              <label htmlFor='fileName' className='font-bold'>
                PDF File Name
              </label>
              <InputText
                id='fileName'
                onChange={(e) => setFileName(e.target.value)}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !fileName,
                })}
              />
              {submitted && !fileName && (
                <small className='p-error'>File Name is required.</small>
              )}
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

            <div className='field'>
              <label htmlFor='code' className='font-bold'>
                Select Code
              </label>
              <Dropdown
                id='code'
                value={selectedFormCode}
                onChange={(e) => setSelectedFormCode(e.value)}
                options={codes}
                optionLabel='name'
                placeholder='Select Code'
                // className='border-none rounded-none ml-4 cursor-pointer ring-0'
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
      </Dialog> */}

      {/* delete dialog for Exl  */}
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
              Are you sure you want to delete <b>{product.billNo}</b>?
            </span>
          )}
        </div>
      </Dialog>

      {/* delete dialog for Pdf  */}
      {/* <Dialog
        visible={deleteProductDialog2}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteProductDialogFooter2}
        onHide={hideDeleteProductDialog2}
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            style={{ fontSize: '2rem' }}
          />
          {product2 && (
            <span>
              Are you sure you want to delete <b>{product2.filename}</b>?
            </span>
          )}
        </div>
      </Dialog> */}

      {/* view product dialog pdf  */}
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
                <h3 className='font-bold'>Date</h3>
                <p className='break-all'>{selectedProduct?.date}</p>
              </div>
              <div>
                <h3 className='font-bold'>Code</h3>
                <p className='break-all'>{selectedProduct?.code}</p>
              </div>
              <div>
                <h3 className='font-bold'>Bill No.</h3>
                <p className='break-all'>{selectedProduct?.billNo}</p>
              </div>
              <div>
                <h3 className='font-bold'>MB No.</h3>
                <p className='break-all'>{selectedProduct?.mbNo}</p>
              </div>
              <div>
                <h3 className='font-bold'>Details</h3>
                <p className='break-all'>{selectedProduct?.details}</p>
              </div>
              <div>
                <h3 className='font-bold'>Currency</h3>
                <p className='break-all'>{selectedProduct?.currency}</p>
              </div>
              <div>
                <h3 className='font-bold'>Cheque Amount</h3>
                <p className='break-all'>{selectedProduct?.chequeAmount}</p>
              </div>
              <div>
                <h3 className='font-bold'>Vat Amount</h3>
                <p className='break-all'>{selectedProduct?.vatAmount}</p>
              </div>
              <div>
                <h3 className='font-bold'>Tax Amount</h3>
                <p className='break-all'>{selectedProduct?.taxAmount}</p>
              </div>
              <div>
                <h3 className='font-bold'>Cheque Data</h3>
                <p className='break-all'>{selectedProduct?.chequeData}</p>
              </div>
              <div>
                <h3 className='font-bold'>Financial</h3>
                <p className='break-all'>{selectedProduct?.financial}</p>
              </div>
              <div>
                <h3 className='font-bold'>Cheque No.</h3>
                <p className='break-all'>{selectedProduct?.chequeNo}</p>
              </div>
              <div>
                <h3 className='font-bold'>Status</h3>
                <p className='break-all'>{selectedProduct?.status}</p>
              </div>

              <div>
                <h3 className='font-bold'>Remarks</h3>
                <p className='break-all'>{selectedProduct.remarks}</p>
              </div>

              {hasEditAccess && (
                <div className='col-span-2'>
                  <h3 className='font-bold'>Attachments/Download</h3>
                  <div className='w-fit mt-2 flex flex-col justify-start'>
                    {selectedProduct.attachments.map(
                      (attachment: any, index: number) => (
                        <Button
                          key={attachment._id}
                          label={`File No. ${index + 1}: ${attachment?.url?.split('/').pop()}`}
                          icon='pi pi-file'
                          onClick={() => window.open(attachment.url, '_blank')}
                          className='hover:text-blue-600/70 px-0 py-2 border rounded-md focus:border-0 focus:ring-0 focus:ring-offset-0'
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
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
