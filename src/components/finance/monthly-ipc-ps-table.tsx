import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { toast } from 'sonner'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import '@/styles/table-style.css'
import {
  searchMonthlyIpcPs,
  searchMonthlyInvoicePdf,
  useMonthlyIpcPs,
} from '@/api/financeAPIs'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown'
import { TabView, TabPanel } from 'primereact/tabview'
import { InputNumber } from 'primereact/inputnumber'
// import MultiFileInput from '../MultiFileInput'
import { Menu } from 'primereact/menu'
import * as XLSX from 'xlsx'
import { MultiSelect } from 'primereact/multiselect'
import RefreshButton from '../refresh-button'
import { useAuth } from '@/provider/authProvider'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import MultiFileInputTwo from '../MultiFileInputTwo'

interface Attachment {
  url: string
  _id: string
}
interface Product {
  _id: string | null
  slNo: string
  docName: string
  DocDate: string
  boq: string
  remarks: string
  attachments: Attachment[]
  creator?: string
  creationTimestamp?: string
  updater?: string
  updatingTimestamp?: string
}

export default function MonthlyIpcPsTable() {
  let emptyProduct: Product = {
    _id: '',
    slNo: '',
    docName: '',
    DocDate: '',
    boq: '',
    remarks: '',
    attachments: [],
  }
  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'finance-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'maintain-ipc-ps-data'
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
  const [deleteProductsDialog, setDeleteProductsDialog] =
    useState<boolean>(false)
  const [product, setProduct] = useState<any>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [selectedProducts2, setSelectedProducts2] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const dt = useRef<DataTable<Product[]>>(null)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [date3, setDate3] = useState<string>('')
  const [date4, setDate4] = useState<string>('')
  const [searchKey, setSearchKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [docName, setDocName] = useState('')
  const [remarks, setRemarks] = useState('')
  const [formDate, setFormDate] = useState<string>('')
  const [selectedCode, setSelectedCode] = useState(null)
  const [selectedCode2, setSelectedCode2] = useState(null)
  const [selectedCode3, setSelectedCode3] = useState<string[]>([])

  const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [dataList, setDataList] = useState({
    payment: '',
    particular: '',
    vendorName: '',
    invoicePay: 0,
    vatAmount: 0,
    taxAmount: 0,
    managementCost: 0,
    ipc: '',
    monthPsVehicle: '',
    month: '',
  })
  const [filesInput, setFilesInput] = useState<File[]>([])
  const [allData, setAllData] = useState<any>([])

  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<any | null>(null)

  const [updateProductDialogPdf, setUpdateProductDialogPdf] =
    useState<boolean>(false)
  const [updatedProductPdf, setUpdatedProductPdf] = useState<any | null>(null)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])

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

  // all update dialog func here Exl
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
      formData.append('payment', updatedProduct.payment || '')
      formData.append('particular', updatedProduct.particular || '')
      formData.append('vendorName', updatedProduct.vendorName || '')
      formData.append('invoicePay', updatedProduct.invoicePay || 0)
      formData.append('vatAmount', updatedProduct.vatAmount || 0)
      formData.append('taxAmount', updatedProduct.taxAmount || 0)
      formData.append('managementCost', updatedProduct.managementCost || 0)
      formData.append('ipc', updatedProduct.ipc || '')
      formData.append('monthPsVehicle', updatedProduct.monthPsVehicle || '')
      formData.append('month', updatedProduct.month || '')
      formData.append('remarks', updatedProduct.remarks || '')
      formData.append('paymentDate', updatedProduct.paymentDate || '')
      formData.append('boq', updatedProduct.boq || '')

      newAttachments.forEach((file) => {
        formData.append('attachments', file)
      })

      removedAttachments.forEach((attachmentId) => {
        formData.append('removedAttachments', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/monthly-ipc/ps-data/${updatedProduct._id}`,
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

  // ending all update dialog funcs Exl

  // all update dialog func here Pdf
  const openUpdateDialogPDf = (product: Product) => {
    setUpdatedProductPdf({ ...product })
    setUpdateProductDialogPdf(true)
  }

  const hideUpdateDialogPdf = () => {
    setUpdateProductDialogPdf(false)
    setUpdatedProductPdf(null)
  }

  // const handleUpdateProductPdf = async () => {
  //   if (!updatedProductPdf) return

  //   try {
  //     setLoading2(true)
  //     const formData = new FormData()
  //     formData.append('docName', updatedProductPdf.docName)
  //     formData.append('boq', updatedProductPdf.boq)
  //     formData.append('remarks', updatedProductPdf.remarks)
  //     formData.append('DocDate', updatedProductPdf.DocDate)

  //     newAttachments.forEach((file) => {
  //       formData.append('attachments', file)
  //     })

  //     removedAttachments.forEach((attachmentId) => {
  //       formData.append('removedAttachments', attachmentId)
  //     })

  //     const res = await axios.put(
  //       `${import.meta.env.VITE_BASE_URL}/api/v1/invoice/pdf/monthly/${updatedProduct._id}`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     )

  //     const updatedProductData = res.data
  //     setProducts2((prevProducts: Product[]) =>
  //       prevProducts.map((p) =>
  //         p._id === updatedProductData._id ? updatedProductData : p
  //       )
  //     )

  //     hideUpdateDialog()
  //     toast.success('Data updated successfully')
  //     refetchPdf()
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

  // const updateProductDialogFooterPdf = (
  //   <>
  //     <Button
  //       label='Cancel'
  //       icon='pi pi-times'
  //       outlined
  //       onClick={hideUpdateDialogPdf}
  //     />
  //     <Button
  //       label='Update'
  //       icon='pi pi-check'
  //       onClick={handleUpdateProductPdf}
  //       loading={loading2}
  //     />
  //   </>
  // )

  // ending all update dialog funcs Pdf

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
        `${import.meta.env.VITE_BASE_URL}/api/v1/monthly-ipc/ps-data/bulk_upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      console.log(response.data)
      toast.success('File uploaded successfully!')
      setFile(null)
      hideDialog2()
      refetchExl()
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/monthly-ipc/ps-data/delete/multiple/data`,
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

      const formData = new FormData()

      formData.append('vendorName', dataList.vendorName)
      formData.append('ipc', dataList.ipc)
      formData.append('month', dataList.month)
      formData.append('monthPsVehicle', dataList.monthPsVehicle)
      // @ts-ignore
      formData.append('invoicePay', dataList.invoicePay)
      // @ts-ignore
      formData.append('vatAmount', dataList.vatAmount)
      // @ts-ignore
      formData.append('taxAmount', dataList.taxAmount)
      // @ts-ignore
      formData.append('managementCost', dataList.managementCost)
      formData.append('remarks', remarks)
      // @ts-ignore
      formData.append('boq', selectedCode2?.code)
      formData.append('paymentDate', formatDate(formDate))

      filesInput.forEach((file) => {
        formData.append('attachments', file)
      })

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/monthly-ipc/ps-data`,
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
  //     setLoading2(true)
  //     const formData = new FormData()

  //     formData.append('docName', docName)
  //     formData.append('DocDate', formatDate(formDate))
  //     formData.append('remarks', remarks)
  //     // @ts-ignore
  //     formData.append('boq', selectedCode?.code)
  //     filesInput.forEach((file) => {
  //       formData.append('attachments', file)
  //     })

  //     const res = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/api/v1/invoice/pdf/monthly/upload`,
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
  //   } finally {
  //     setLoading2(false)
  //   }
  // }

  const confirmDeleteProduct = (product: Product) => {
    setProduct(product)
    setDeleteProductDialog(true)
  }

  const confirmDeleteProductPDF = (product: Product) => {
    // console.log('sk')
    setProduct(product)
    setDeleteProductsDialog(true)
  }

  // const deleteProduct = () => {
  //   let _products = products.filter((val: { id: any }) => val.id !== product.id)

  //   setProducts(_products)
  //   setDeleteProductDialog(false)
  //   setProduct(emptyProduct)
  //   toast.current?.show({
  //     severity: 'success',
  //     summary: 'Successful',
  //     detail: 'Product Deleted',
  //     life: 3000,
  //   })
  // }

  const deleteProduct = async () => {
    let _products = products.filter(
      (val: { _id: any }) => val._id !== product._id
    )

    try {
      setLoading2(true)
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/monthly-ipc/ps-data/delete/${product._id}`,
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

  // const deleteProductpdf = async () => {
  //   let _products = products2.filter(
  //     (val: { _id: any }) => val._id !== product._id
  //   )

  //   try {
  //     setLoading2(true)
  //     const res = await axios.delete(
  //       `${import.meta.env.VITE_BASE_URL}/api/v1/invoice/pdf/monthly/delete/${product._id}`,
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

  //   setProducts2(_products)
  //   setDeleteProductsDialog(false)
  //   setProduct(emptyProduct)
  // }

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

  // const deleteSelectedProducts = () => {
  //   let _products = products.filter(
  //     (val: Product) => !selectedProducts.includes(val)
  //   )

  //   setProducts(_products)
  //   setDeleteProductsDialog(false)
  //   setSelectedProducts([])
  //   toast.current?.show({
  //     severity: 'success',
  //     summary: 'Successful',
  //     detail: 'Products Deleted',
  //     life: 3000,
  //   })
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

  const hideViewDialog = () => {
    setViewProductDialog(false)
    setSelectedProduct(null)
  }

  const viewProduct = (product: Product) => {
    setSelectedProduct(product)
    setViewProductDialog(true)
  }

  const actionBodyTemplatePdf = (rowData: Product) => {
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
        command: () => openUpdateDialogPDf(rowData),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => confirmDeleteProductPDF(rowData),
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

  // const actionBodyTemplate = (rowData: Product) => {
  //   return (
  //     <>
  //       <Button
  //         icon='pi pi-ellipsis-v'
  //         outlined
  //         className='border-none'
  //         // @ts-ignore
  //         onClick={(e) => op.current?.toggle(e)}
  //       />
  //       <OverlayPanel ref={op}>
  //         <div className='flex flex-col space-y-2'>
  //           <a href=''>Edit</a>
  //           <a href=''>Delete</a>
  //           <a href=''>Download Attachment</a>
  //         </div>
  //       </OverlayPanel>
  //       {/* <Button
  //         icon='pi pi-pencil'
  //         rounded
  //         outlined
  //         className='mr-2'
  //         onClick={() => editProduct(rowData)}
  //       /> */}
  //       {/* <Button
  //         icon='pi pi-trash'
  //         rounded
  //         outlined
  //         severity='danger'
  //         onClick={() => confirmDeleteProduct(rowData)}
  //       /> */}
  //     </>
  //   )
  // }

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
      date_range:
        date3 && date4 ? `${formatDate(date3)} to ${formatDate(date4)}` : '',
      // @ts-ignore
      boq: selectedCode3.map((item) => item.code) || [],
      searchQuery: searchKey,
    }

    searchMonthlyIpcPs(initialPayload).then((result) => {
      setProducts(result?.payments)
      setAllData(result)
      setLoading(false)
    })
  }

  const handleSearch2 = () => {
    setLoading(true)
    const initialPayload = {
      month: date ? getMonthName(date) : '',
      year: date2 ? getYear(date2) : '',
      // @ts-ignore
      boq: selectedCode?.code || [],
      searchQuery: searchKey,
    }

    searchMonthlyInvoicePdf(initialPayload).then((result) => {
      setProducts(result?.payments)
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
      boq: [],
    }

    setDate('')
    setDate2('')
    setDate3('')
    setDate4('')
    setSearchKey('')
    setSelectedCode3([])

    searchMonthlyIpcPs(initialPayload).then((result) => {
      setProducts(result?.payments)
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
        <Calendar
          // @ts-ignore
          value={date2}
          // @ts-ignore
          onChange={(e) => setDate2(e.value)}
          view='year'
          dateFormat='yy'
          inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0 ring-0'
          placeholder='By Year'
          showIcon
          icon={() => <i className='pi pi-angle-down' />}
        />
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
          <InputIcon className='pi pi-search' />
          <InputText
            type='search'
            placeholder='Search'
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

      {activeIndex === 0 && (
        <div className='flex w-fit gap-2 divide-x-2 border p-4 rounded-md bg-blue-50 text-gray-600 text-xs'>
          <h1>Total Invoice Payment Value: {allData?.totalInvoicePay}</h1>
          <h1 className='pl-2'>Total Vat Amount: {allData?.totalVatAmount}</h1>
          <h1 className='pl-2'>Total Tax Amount: {allData?.totalTaxAmount}</h1>
          <h1 className='pl-2'>
            Total Management Cost: {allData?.totalManagementCost}
          </h1>
          <h1 className='pl-2'>Total Payment Amount: {allData?.AlltotalPay}</h1>
        </div>
      )}
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
  //     <Button
  //       label='Cancel'
  //       icon='pi pi-times'
  //       outlined
  //       onClick={hideDialog2}
  //     />
  //     <Button
  //       label='Save'
  //       loading={loading2}
  //       icon='pi pi-check'
  //       onClick={saveProduct2}
  //     />
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

  // const deleteProductPDFDialogFooter = (
  //   <>
  //     <Button
  //       label='No'
  //       icon='pi pi-times'
  //       outlined
  //       onClick={hideDeleteProductsDialog}
  //     />
  //     <Button
  //       label='Yes'
  //       icon='pi pi-check'
  //       severity='danger'
  //       onClick={deleteProductpdf}
  //     />
  //   </>
  // )

  const [payload, setPayload] = useState<any>({
    month: '',
    year: '',
    searchQuery: '',
    boq: [],
  })

  const {
    data,
    isLoading,
    error,
    refetch: refetchExl,
  } = useMonthlyIpcPs(payload)

  // initial data load
  useEffect(() => {
    if (data) {
      setProducts(data?.payments)
      setAllData(data)
    }
  }, [data])

  // const refetchExl = () => {
  //   setLoading(true)
  //   const initialPayload = {
  //     month: '',
  //     year: '',
  //     searchQuery: '',
  //     department: '',
  //   }

  //   searchMonthlyIpcPs(initialPayload).then((result) => {
  //     setProducts(result?.payments)
  //     setAllData(result)
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
  //     department: '',
  //   }

  //   searchMonthlyInvoicePdf(initialPayload).then((result) => {
  //     setProducts2(result?.payments)
  //     setLoading(false)
  //   })
  // }

  // initial data load - PDF
  useEffect(() => {
    refetchExl()
  }, [])

  const attachmentBodyTemplate = (rowData: any) => {
    return <div>{rowData?.attachments?.length}</div>
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setDataList((prev) => ({ ...prev, [id]: value }))
  }

  const handleNumberInputChange = (
    e: { value: number | null },
    field: string
  ) => {
    setDataList((prev) => ({ ...prev, [field]: e.value || 0 }))
  }

  const handleFileChange = (newFiles: File[]) => {
    setFilesInput(newFiles)
  }

  const stringValues = codes.map((item) => item.code)

  // console.log(products)

  return (
    <div className=''>
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

              {/* <Column
                field='paymentDate'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[14rem]'
                header='Invoice Payment Date'
              ></Column> */}

              <Column
                field='vendorName'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Vendor Name'
              ></Column>

              <Column
                field='boq'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[8rem]'
                header='BOQ #'
              ></Column>

              <Column
                field='invoicePay'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Invoice Payment Value (BDT)'
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
                field='taxAmount'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Tax Amount'
              ></Column>

              <Column
                field='managementCost'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Management Cost 10%'
              ></Column>

              <Column
                field='totalPay'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='Total Payment Amount'
              ></Column>

              <Column
                field='ipc'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[8rem]'
                header='IPC'
              ></Column>

              {/* <Column
                field='monthPsVehicle'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[12rem]'
                header='PS/Month/Vehicles'
              ></Column> */}

              {/* <Column
                field='month'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[8rem]'
                header='Month'
              ></Column> */}

              <Column
                field='remarks'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                className='min-w-[8rem]'
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
              ref={dt}
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
                header='SL NO.'
              ></Column>

              <Column
                field='DocDate'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                header='Date'
              ></Column>

              <Column
                field='docName'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                header='Doc Name'
              ></Column>

              <Column
                field='boq'
                headerClassName='bg-[#ffc2c2] text-sm'
                bodyClassName='text-sm truncate max-w-xs'
                sortable
                header='BOQ #'
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
                body={actionBodyTemplatePdf}
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

      {/* Dialog for View Detail */}
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
                <h3 className='font-bold'>Vendor Name</h3>
                <p className='break-all'>{selectedProduct?.vendorName}</p>
              </div>

              <div>
                <h3 className='font-bold'>Invoice Pay</h3>
                <p className='break-all'>{selectedProduct?.invoicePay}</p>
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
                <h3 className='font-bold'>Management Cost</h3>
                <p className='break-all'>{selectedProduct?.managementCost}</p>
              </div>

              <div>
                <h3 className='font-bold'>IPC</h3>
                <p className='break-all'>{selectedProduct?.ipc}</p>
              </div>

              <div>
                <h3 className='font-bold'>BOQ</h3>
                <p className='break-all'>{selectedProduct?.boq}</p>
              </div>

              {/* <div>
              <h3 className='font-bold'>Month PS Vehicle</h3>
              <p className='break-all'>{selectedProduct?.monthPSVehicle}</p>
            </div> */}

              {/* <div>
              <h3 className='font-bold'>Month</h3>
              <p className='break-all'>{selectedProduct?.month}</p>
            </div> */}

              <div>
                <h3 className='font-bold'>Payment Date</h3>
                <p className='break-all'>{selectedProduct?.paymentDate}</p>
              </div>

              <div>
                <h3 className='font-bold'>Remarks</h3>
                <p className='break-all'>{selectedProduct?.remarks}</p>
              </div>

              {hasEditAccess && (
                <div className='col-span-2'>
                  <h3 className='font-bold'>Attachments/Download</h3>
                  <div className='w-fit mt-2 flex flex-col justify-start'>
                    {selectedProduct.attachments.map(
                      (
                        attachment: {
                          _id: any
                          url: any
                        },
                        index: number
                      ) => (
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

      {/* Dialog for Data List */}
      <Dialog
        visible={productDialog}
        style={{ width: '42rem' }}
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
              <label htmlFor='vendorName' className='font-bold'>
                Vendor Name
              </label>
              <InputText
                id='vendorName'
                value={dataList.vendorName}
                onChange={handleInputChange}
              />
            </div>

            <div className='field'>
              <label htmlFor='ipc' className='font-bold'>
                IPC
              </label>
              <InputText
                id='ipc'
                value={dataList.ipc}
                onChange={handleInputChange}
              />
            </div>

            <div className='field'>
              <label htmlFor='invoicePay' className='font-bold'>
                Invoice Payment Value
              </label>
              <InputNumber
                id='invoicePay'
                value={dataList.invoicePay}
                onValueChange={(e) =>
                  // @ts-ignore
                  handleNumberInputChange(e, 'invoicePay')
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='vatAmount' className='font-bold'>
                Vat Amount
              </label>
              <InputNumber
                id='vatAmount'
                value={dataList.vatAmount}
                onValueChange={(e) =>
                  // @ts-ignore
                  handleNumberInputChange(e, 'vatAmount')
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='taxAmount' className='font-bold'>
                Tax Amount
              </label>
              <InputNumber
                id='taxAmount'
                value={dataList.taxAmount}
                onValueChange={(e) =>
                  // @ts-ignore
                  handleNumberInputChange(e, 'taxAmount')
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='managementCost' className='font-bold'>
                Management Cost
              </label>
              <InputNumber
                id='managementCost'
                value={dataList.managementCost}
                onValueChange={(e) =>
                  // @ts-ignore
                  handleNumberInputChange(e, 'managementCost')
                }
              />
            </div>

            {/* <div className='field'>
              <label htmlFor='monthPsVehicle' className='font-bold'>
                PS/MONTH/VEHICLE
              </label>
              <InputText
                id='monthPsVehicle'
                value={dataList.monthPsVehicle}
                onChange={handleInputChange}
              />
            </div> */}

            {/* <div className='field'>
              <label htmlFor='month' className='font-bold'>
                Month
              </label>
              <Dropdown
                id='month'
                value={dataList.month}
                options={[
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ]}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, month: e.value }))
                }
                placeholder='Select Month'
              />
            </div> */}

            <div className='field'>
              <label htmlFor='boq' className='font-bold'>
                BOQ
              </label>
              <Dropdown
                id='boq'
                value={selectedCode2}
                options={codes}
                optionLabel='name'
                onChange={(e) => setSelectedCode2(e.value)}
                placeholder='Select BOQ'
                filter
                showClear
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
                Payment Date
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
              <label htmlFor='docName' className='font-bold'>
                Doc Name
              </label>
              <InputText
                id='docName'
                onChange={(e) => setDocName(e.target.value)}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !docName,
                })}
              />
              {submitted && !docName && (
                <small className='p-error'>Doc Name is required.</small>
              )}
            </div>

            <div className='field'>
              <label htmlFor='boq' className='font-bold'>
                BOQ
              </label>
              <Dropdown
                id='boq'
                value={selectedCode}
                options={codes}
                optionLabel='name'
                onChange={(e) => setSelectedCode(e.value)}
                placeholder='Select BOQ'
                filter
                showClear
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
              <MultiFileInput onFilesChange={handleFileChange} />
            </div>
          </div>
        </>
      </Dialog> */}

      {/* delete product dialog  */}
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

      {/* update data dialog -Exl  */}
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
                <label htmlFor='vendorName' className='font-bold'>
                  Vendor Name
                </label>
                <InputText
                  id='vendorName'
                  value={updatedProduct?.vendorName}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      vendorName: e.target.value,
                    })
                  }
                />
              </div>

              <div className='field'>
                <label htmlFor='ipc' className='font-bold'>
                  IPC
                </label>
                <InputText
                  id='ipc'
                  value={updatedProduct?.ipc}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      ipc: e.target.value,
                    })
                  }
                />
              </div>

              <div className='field'>
                <label htmlFor='invoicePay' className='font-bold'>
                  Invoice Payment Value
                </label>
                <InputNumber
                  id='invoicePay'
                  value={updatedProduct?.invoicePay}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      invoicePay: e.value,
                    })
                  }
                />
              </div>

              <div className='field'>
                <label htmlFor='vatAmount' className='font-bold'>
                  Vat Amount
                </label>
                <InputNumber
                  id='vatAmount'
                  value={updatedProduct?.vatAmount}
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
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      taxAmount: e.value,
                    })
                  }
                />
              </div>

              <div className='field'>
                <label htmlFor='managementCost' className='font-bold'>
                  Management Cost
                </label>
                <InputNumber
                  id='managementCost'
                  value={updatedProduct?.managementCost}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      managementCost: e.value,
                    })
                  }
                />
              </div>

              {/* <div className='field'>
                <label htmlFor='monthPsVehicle' className='font-bold'>
                  PS/MONTH/VEHICLE
                </label>
                <InputText
                  id='monthPsVehicle'
                  value={updatedProduct?.monthPsVehicle}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      monthPsVehicle: e.target.value,
                    })
                  }
                />
              </div> */}

              {/* <div className='field'>
                <label htmlFor='month' className='font-bold'>
                  Month
                </label>
                <Dropdown
                  id='month'
                  value={updatedProduct?.month}
                  options={[
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ]}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      month: e.target.value,
                    })
                  }
                  placeholder='Select Month'
                />
              </div> */}

              <div className='field'>
                <label htmlFor='boq' className='font-bold'>
                  BOQ
                </label>
                <Dropdown
                  id='boq'
                  value={updatedProduct?.boq || ''}
                  options={stringValues}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      boq: e.target.value,
                    })
                  }
                  filter
                  showClear
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
                  required
                />
              </div>

              <div>
                <label htmlFor='date' className='font-bold'>
                  Payment Date
                </label>
                <div className='border rounded-md'>
                  <Calendar
                    id='date'
                    value={
                      new Date(
                        updatedProduct.paymentDate
                          .split('-')
                          .reverse()
                          .join('-')
                      )
                    }
                    onChange={(e) =>
                      setUpdatedProduct({
                        ...updatedProduct,
                        paymentDate: e.value ? formatDate(e.value) : '',
                      })
                    }
                    dateFormat='dd/mm/yy'
                    inputClassName='border-0 focus:ring-0 cursor-pointer'
                    className='focus:ring-0'
                    placeholder='Select Date'
                  />
                </div>
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

      {/* update data dialog -Pdf  */}
      {/* <Dialog
        visible={updateProductDialogPdf}
        style={{ width: '50rem' }}
        header='Update Document List'
        modal
        className='p-fluid'
        footer={updateProductDialogFooterPdf}
        onHide={hideUpdateDialogPdf}
      >
        {updatedProductPdf && (
          <div className='grid grid-cols-2 gap-4'>
            <div className='field'>
              <label htmlFor='docName' className='font-bold'>
                DocName
              </label>
              <InputText
                id='docName'
                value={updatedProductPdf.docName}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProductPdf,
                    docName: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='boq' className='font-bold'>
                BOQ
              </label>
              <Dropdown
                id='boq'
                value={updatedProductPdf?.boq || ''}
                options={stringValues}
                onChange={(e) =>
                  setUpdatedProductPdf({
                    ...updatedProductPdf,
                    boq: e.target.value,
                  })
                }
                filter
                showClear
              />
            </div>

            <div className='field'>
              <label htmlFor='remarks' className='font-bold'>
                Remarks
              </label>
              <InputText
                id='remarks'
                value={updatedProductPdf.remarks}
                onChange={(e) =>
                  setUpdatedProductPdf({
                    ...updatedProductPdf,
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
                  new Date(
                    updatedProductPdf.DocDate.split('-').reverse().join('-')
                  )
                }
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    DocDate: e.value ? formatDate(e.value) : '',
                  })
                }
                dateFormat='dd/mm/yy'
              />
            </div>
            <div className='col-span-2'>
              <h3 className='font-bold mb-2'>Existing Attachments</h3>
              <div className='flex flex-wrap gap-3'>
                {updatedProductPdf.attachments.map((attachment: any) => (
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
      </Dialog> */}

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
