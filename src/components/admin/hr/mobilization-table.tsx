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
import { searchMobilization } from '@/api/adminAPIs'
import axios from 'axios'
import MultiFileInput from '@/components/MultiFileInput'
import { Menu } from 'primereact/menu'
import { toast } from 'sonner'

interface Attachment {
  url: string
  _id: string
}
interface Product {
  _id: string
  employeeName: string
  employeeId: string
  dept: string
  position: string
  dateOfMobilization: string
  dateOfDemobilization: string
  attachments: Attachment[]
  remarks: string
}

export default function MobilizationTable() {
  let emptyProduct: Product = {
    _id: '',
    employeeName: '',
    employeeId: '',
    dept: '',
    position: '',
    dateOfMobilization: '',
    dateOfDemobilization: '',
    attachments: [],
    remarks: '',
  }

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
  const [remarks, setRemarks] = useState('')
  const [filesInput, setFilesInput] = useState<File[]>([])
  const [formData, setFormData] = useState<any>({
    employeeName: '',
    employeeId: '',
    dept: '',
    position: '',
    dateOfMobilization: '',
    dateOfDemobilization: '',
  })

  const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])

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

      formData.append('employeeName', updatedProduct.employeeName)
      formData.append('employeeId', updatedProduct.employeeId)
      formData.append('dept', updatedProduct.dept)
      formData.append('position', updatedProduct.position)
      formData.append('dateOfMobilization', updatedProduct.dateOfMobilization)
      formData.append(
        'dateOfDemobilization',
        updatedProduct.dateOfDemobilization
      )
      formData.append('remarks', updatedProduct.remarks)

      newAttachments.forEach((file) => {
        formData.append('attachments', file)
      })

      removedAttachments.forEach((attachmentId) => {
        formData.append('removedAttachments', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/mobilization/update/${updatedProduct._id}`,
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

  // ending all update dialog funcs

  const openNew = () => {
    setProduct(emptyProduct)
    setSubmitted(false)
    setProductDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setProductDialog(false)
    setFormData({
      employeeName: '',
      employeeId: '',
      dept: '',
      position: '',
    })
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
      const data = new FormData()

      data.append('employeeName', formData.employeeName)
      data.append('employeeId', formData.employeeId)
      data.append('dept', formData.dept)
      data.append('position', formData.position)
      data.append(
        'dateOfMobilization',
        formData.dateOfMobilization
          ? formatDate(formData.dateOfMobilization)
          : ''
      )
      data.append(
        'dateOfDemobilization',
        formData.dateOfDemobilization
          ? formatDate(formData.dateOfDemobilization)
          : ''
      )
      data.append('remarks', remarks)
      filesInput.forEach((file) => {
        data.append('attachments', file)
      })

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/mobilization/upload`,
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/mobilization/delete/${product._id}`,
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
    dt.current?.exportCSV()
  }

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true)
  }

  const deleteSelectedProducts = () => {
    let _products = products.filter(
      (val: Product) => !selectedProducts.includes(val)
    )

    setProducts(_products)
    setDeleteProductsDialog(false)
    setSelectedProducts([])
  }

  const leftToolbarTemplate = () => {
    return (
      <div className=''>
        <div className='p-3 bg-main text-lg font-semibold text-white rounded-t'>
          Document List
        </div>
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
          Download Files
        </button>
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

  const downloadAllFiles = () => {
    selectedProduct?.attachments.forEach((attachment) => {
      window.open(attachment.url, '_blank')
    })
  }

  const actionBodyTemplate = (rowData: Product) => {
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
        command: () => openUpdateDialog(rowData),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => confirmDeleteProduct(rowData),
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
    return <div>{rowData?.attachments?.length}</div>
  }

  const handleFileChange = (newFiles: File[]) => {
    setFilesInput(newFiles)
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

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      month: date ? getMonthName(date) : '',
      year: date2 ? getYear(date2) : '',
      searchQuery: searchKey,
    }

    searchMobilization(initialPayload).then((result) => {
      setProducts(result?.Mobilizations)
      setLoading(false)
    })
  }

  const filterSearchForm = (
    <div className='flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white'>
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
      </div>
      <IconField iconPosition='left' className='relative'>
        <InputIcon className='pi pi-search' />
        <InputText
          type='search'
          placeholder='Search'
          className='border-none ml-4 focus:ring-0'
          onChange={(e) => setSearchKey(e.target.value)}
        />

        <button
          onClick={() => handleSearch()}
          className='absolute top-0.5 right-1 border bg-green-500 px-4 py-2.5 rounded-lg'
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

  const refetch = () => {
    setLoading(true)
    const initialPayload = {
      month: '',
      year: '',
      searchQuery: '',
    }

    searchMobilization(initialPayload).then((result) => {
      setProducts(result?.Mobilizations)
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
        >
          <Column
            selectionMode='multiple'
            headerStyle={{ width: '3rem' }}
            exportable={false}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='employeeName'
            header='Employee Name'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='employeeId'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='ID No.'
          ></Column>

          <Column
            field='dept'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Department Name'
          ></Column>

          <Column
            field='position'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Position'
          ></Column>

          <Column
            field='dateOfMobilization'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Date of Mobilization'
          ></Column>

          <Column
            field='dateOfDemobilization'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Date of Demobilization'
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
            body={actionBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
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
        header='Document Details'
        modal
        className='p-fluid'
        footer={viewProductDialogFooter}
        onHide={hideViewDialog}
      >
        {selectedProduct && (
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h3 className='font-bold'>Name</h3>
              <p className='break-all'>{selectedProduct?.employeeName}</p>
            </div>
            <div>
              <h3 className='font-bold'>Employee Id</h3>
              <p className='break-all'>{selectedProduct?.employeeId}</p>
            </div>
            <div>
              <h3 className='font-bold'>Department</h3>
              <p className='break-all'>{selectedProduct?.dept}</p>
            </div>
            <div>
              <h3 className='font-bold'>Position</h3>
              <p>{selectedProduct?.position}</p>
            </div>
            <div>
              <h3 className='font-bold'>Date Of Mobilization</h3>
              <p className='break-all'>{selectedProduct?.dateOfMobilization}</p>
            </div>
            <div>
              <h3 className='font-bold'>Date Of Demobilization</h3>
              <p className='break-all'>
                {selectedProduct?.dateOfDemobilization}
              </p>
            </div>
            <div>
              <h3 className='font-bold'>Remarks</h3>
              <p className='break-all'>{selectedProduct?.remarks}</p>
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
                onChange={(e) => setRemarks(e.target.value)}
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
                  onChange={(e) => handleDateChange(e, 'dateOfDemobilization')}
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
              Are you sure you want to delete <b>{product?.employeeName}</b>?
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
              <label htmlFor='employeeName' className='font-bold'>
                Employee Name
              </label>
              <InputText
                id='employeeName'
                value={updatedProduct.employeeName}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    employeeName: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='employeeId' className='font-bold'>
                Employee ID
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
                Department
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
                Date Of Mobilization
              </label>
              <Calendar
                id='date'
                value={
                  new Date(
                    updatedProduct?.dateOfMobilization
                      .split('-')
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
              <label htmlFor='date2' className='font-bold'>
                Date Of Demobilization
              </label>
              <Calendar
                id='date2'
                value={
                  new Date(
                    updatedProduct?.dateOfDemobilization
                      .split('-')
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
    </div>
  )
}
