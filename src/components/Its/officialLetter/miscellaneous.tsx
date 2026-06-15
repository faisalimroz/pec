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
import '../../../styles/table-style.css'
import { searchOfficialMiscellaneous, useOlMisc } from '@/api/itsAPIs'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
import MultiFileInput from '@/components/MultiFileInput'
import { Menu } from 'primereact/menu'
import RefreshButton from '@/components/refresh-button'
import { FilePreview } from '@/components/file-preview'

interface Attachment {
  url: string
  _id: string
}

interface Product {
  _id: string
  slNo: string
  date: string
  subject: string
  address: string
  refNo: string
  status: string
  remarks: string
  attachments: Attachment[]
}
export default function OfficialMiscellaneous() {
  let emptyProduct: Product = {
    _id: '',
    slNo: '',
    date: '',
    subject: '',
    address: '',
    refNo: '',
    status: '',
    remarks: '',
    attachments: [],
  }

  const [activeIndex, setActiveIndex] = useState(0)
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
  const [subject, setSubject] = useState('')
  const [refNo, setRefNo] = useState('')
  const [address, setAddress] = useState('')
  const [wayto, setWayto] = useState('')
  const [remarks, setRemarks] = useState('')
  const [formDate, setFormDate] = useState<string>('')
  const [selectedCode, setSelectedCode] = useState(null)
  const [filesInput, setFilesInput] = useState<File[]>([])

  const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])

  const status = [
    { name: 'From', status: 'From' },
    { name: 'To', status: 'To' },
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
      formData.append('subject', updatedProduct.subject)
      formData.append('status', updatedProduct.status)
      formData.append('refNo', updatedProduct.refNo)
      formData.append('remarks', updatedProduct.remarks)
      formData.append('date', updatedProduct.date)

      newAttachments.forEach((file) => {
        formData.append('attachments', file)
      })

      removedAttachments.forEach((attachmentId) => {
        formData.append('removedAttachments', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/official-letter/miscellaneous/${updatedProduct._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      hideUpdateDialog()
      toast.success('Data Updated Successfully')
      refetch()
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

      formData.append('subject', subject)
      formData.append('refNo', refNo)
      formData.append('address', address)
      formData.append('status', wayto)
      formData.append('remarks', remarks)
      formData.append('date', formatDate(formDate))
      filesInput.forEach((file) => {
        formData.append('attachments', file)
      })

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/official-letter/miscellaneous/upload`,
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/official-letter/miscellaneous/delete/${product._id}`,
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

  const hideViewDialog = () => {
    setViewProductDialog(false)
    setSelectedProduct(null)
  }

  const viewProduct = (product: Product) => {
    setSelectedProduct(product)
    setViewProductDialog(true)
  }

  const deleteSelectedProducts = () => {
    let _products = products.filter(
      (val: any) => !selectedProducts.includes(val)
    )

    setProducts(_products)
    setDeleteProductsDialog(false)
    setSelectedProducts([])
    toast.success('Data Saved Successfully')
  }

  const leftToolbarTemplate = () => {
    return (
      <div className='flex items-center gap-3'>
        <button
          onClick={() => setActiveIndex(1)}
          className={`p-3 text-lg font-semibold border text-white rounded-t ${activeIndex === 1 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Document List
        </button>
      </div>
    )
  }

  const rightToolbarTemplate = () => {
    return (
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
          Download Files
        </button>
        <RefreshButton onClick={handleReset} />
      </div>
    )
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

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      date_range:
        date && date2 ? `${formatDate(date)} to ${formatDate(date2)}` : '',
      // @ts-ignore
      status: selectedCode?.name || '',
      searchQuery: searchKey,
    }

    searchOfficialMiscellaneous(initialPayload).then((result) => {
      setProducts(result?.MoneysByMonths)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      date_range: '',
      status: '',
      searchQuery: '',
    }

    setDate('')
    setDate2('')
    setSelectedCode(null)
    setSearchKey('')

    searchOfficialMiscellaneous(initialPayload).then((result) => {
      setProducts(result?.MoneysByMonths)
      setLoading(false)
    })
  }

  const filterSearchForm = (
    <div className=''>
      <form
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
        <div>
          <Dropdown
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.value)}
            options={status}
            optionLabel='name'
            placeholder='Select Way'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
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
      </form>
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
    date_range: '',
    searchQuery: '',
    status: '',
  })

  const { data, isLoading, error, refetch } = useOlMisc(payload)

  // initial data load
  useEffect(() => {
    if (data) {
      setProducts(data?.MoneysByMonths)
    }
  }, [data])

  // initial data load
  // useEffect(() => {
  //   setLoading(true)
  //   const initialPayload = {
  //     month: '',
  //     year: '',
  //     searchQuery: '',
  //     code: '',
  //   }

  //   searchOfficialMiscellaneous(initialPayload).then((result) => {
  //     setProducts(result?.MoneysByMonths)
  //     setLoading(false)
  //   })
  // }, [])

  const attachmentBodyTemplate = (rowData: any) => {
    return <div>{rowData?.attachments?.length}</div>
  }

  // console.log(products)

  const handleFileChange = (newFiles: File[]) => {
    setFilesInput(newFiles)
  }

  return (
    <div className=''>
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
          loading={loading || isLoading}
          scrollable
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
            header='SL No.'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            className='min-w-[10rem]'
            sortable
          ></Column>

          <Column
            field='date'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            className='min-w-[12rem]'
            header='Date'
          ></Column>

          <Column
            field='subject'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            className='min-w-[8rem]'
            header='Subject'
          ></Column>

          <Column
            field='address'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            className='min-w-[8rem]'
            header='Address'
          ></Column>

          <Column
            field='status'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            className='min-w-[8rem]'
            header='Way'
          ></Column>

          <Column
            field='refNo'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            className='min-w-[8rem]'
            header='Ref No'
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
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            className='min-w-[12rem]'
            header='Remarks'
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
            <div className='field'>
              <label htmlFor='subject' className='font-bold'>
                Subject
              </label>
              <InputText
                id='subject'
                onChange={(e) => setSubject(e.target.value)}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !subject,
                })}
              />
              {submitted && !subject && (
                <small className='p-error'>Subject is required.</small>
              )}
            </div>

            <div className='field'>
              <label htmlFor='refNo' className='font-bold'>
                Ref No.
              </label>
              <InputText
                id='refNo'
                onChange={(e) => setRefNo(e.target.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='address' className='font-bold'>
                Address
              </label>
              <InputText
                id='address'
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='status' className='font-bold'>
                Select Way
              </label>
              <Dropdown
                id='status'
                value={wayto}
                options={['From', 'To']}
                onChange={(e) => setWayto(e.target.value)}
                placeholder='Select Way'
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
                  value={formDate}
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
            <div>
              <h3 className='font-bold'>Address</h3>
              <p className='break-all'>{selectedProduct.address}</p>
            </div>
            <div>
              <h3 className='font-bold'>Ref No.</h3>
              <p className='break-all'>{selectedProduct.refNo}</p>
            </div>
            <div>
              <h3 className='font-bold'>Way</h3>
              <p className='break-all'>{selectedProduct.status}</p>
            </div>
            <div>
              <h3 className='font-bold'>Remarks</h3>
              <p className='break-all'>{selectedProduct.remarks}</p>
            </div>
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
                        onClick={() => window.open(attachment.url, '_blank')}
                        className='p-button-text p-button-rounded flex-shrink-0'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
        <div className='flex flex-col mx-auto text-center space-y-2'>
          <i
            className='pi pi-exclamation-triangle mr-3 text-red-600'
            style={{ fontSize: '2rem' }}
          />
          {product && (
            <span className='text-red-500'>
              Are you sure you want to delete <b>{product.productName}</b>?
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
            <div className='field'>
              <label htmlFor='address' className='font-bold'>
                Address
              </label>
              <InputText
                id='refNo'
                value={updatedProduct.address}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    address: e.target.value,
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
              <label htmlFor='status' className='font-bold'>
                Select Way
              </label>
              <Dropdown
                id='type'
                value={updatedProduct.status}
                options={['From', 'To']}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    status: e.target.value,
                  })
                }
                placeholder='Select Way'
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
              <MultiFileInput onFilesChange={handleNewAttachments} />
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
    </div>
  )
}
