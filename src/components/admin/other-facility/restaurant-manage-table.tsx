import { useState, useEffect, useRef } from 'react'
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
import { searchRestaurant } from '@/api/adminAPIs'
import axios from 'axios'
import MultiFileInput from '@/components/MultiFileInput'
import { Menu } from 'primereact/menu'

interface Attachment {
  url: string
  _id: string
}
interface Product {
  _id: string | null
  slNo: string
  riceCost: number
  rhdCost: number
  otherCost: number
  totalCost: number
  date: string
  remarks: string
  attachments: Attachment[]
}

export default function RestaurantManageTable() {
  let emptyProduct: Product = {
    _id: '',
    slNo: '',
    riceCost: 0,
    rhdCost: 0,
    otherCost: 0,
    totalCost: 0,
    date: '',
    remarks: '',
    attachments: [],
  }

  const [products, setProducts] = useState<any>([])
  const [productDialog, setProductDialog] = useState<boolean>(false)
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)
  const [deleteProductsDialog, setDeleteProductsDialog] =
    useState<boolean>(false)
  const [product, setProduct] = useState<any>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [searchKey, setSearchKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [riceCost, setRiceCost] = useState('')
  const [rhdCost, setRHDCost] = useState('')
  const [otherCost, setOtherCost] = useState('')
  const [remarks, setRemarks] = useState('')
  const [filesInput, setFilesInput] = useState<File[]>([])
  const [formDate, setFormDate] = useState<string>('')

  const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<any | null>(null)
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
      formData.append('riceCost', updatedProduct.riceCost)
      formData.append('rhdCost', updatedProduct.rhdCost)
      formData.append('otherCost', updatedProduct.otherCost)
      formData.append('remarks', updatedProduct.remarks)
      formData.append('date', updatedProduct.date)

      newAttachments.forEach((file) => {
        formData.append('attachments', file)
      })

      removedAttachments.forEach((attachmentId) => {
        formData.append('removedAttachments', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/other/restaurant/update/${updatedProduct._id}`,
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

  const handleNewAttachments = (files: File[]) => {
    setNewAttachments(files)
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    setRemovedAttachments((prev) => [...prev, attachmentId])
    setUpdatedProduct((prev: { attachments: any[] }) => {
      if (!prev) return null
      return {
        ...prev,
        attachments: prev.attachments.filter(
          (a: { _id: string }) => a._id !== attachmentId
        ),
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

      formData.append('riceCost', riceCost)
      formData.append('rhdCost', rhdCost)
      formData.append('otherCost', otherCost)
      formData.append('remarks', remarks)
      formData.append('date', formatDate(formDate))
      filesInput.forEach((file) => {
        formData.append('attachments', file)
      })

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/other/restaurant/upload`,
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/other/restaurant/delete/${product._id}`,
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
      month: date ? getMonthName(date) : '',
      year: date2 ? getYear(date2) : '',
      searchQuery: searchKey,
    }

    searchRestaurant(initialPayload).then((result) => {
      setProducts(result?.Restaurant)
      setLoading(false)
    })
  }

  const filterSearchForm = (
    <div className='flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white'>
      <Calendar
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
      />

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

  const attachmentBodyTemplate = (rowData: any) => {
    return <div>{rowData?.attachments?.length}</div>
  }

  const refetch = () => {
    setLoading(true)
    const initialPayload = {
      month: '',
      year: '',
      searchQuery: '',
    }

    searchRestaurant(initialPayload).then((result) => {
      setProducts(result?.Restaurant)
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
          <Column
            selectionMode='multiple'
            headerStyle={{ width: '3rem' }}
            exportable={false}
            headerClassName='bg-[#ffc2c2] text-sm '
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='date'
            headerClassName='bg-[#ffc2c2] text-sm '
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Date'
          ></Column>

          <Column
            field='riceCost'
            header='Rice Cost Of Cafeteria (BDT)'
            headerClassName='bg-[#ffc2c2] text-sm min-w-[12rem]'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='rhdCost'
            header='RHD Cost Of Cafeteria(BDT)'
            headerClassName='bg-[#ffc2c2] text-sm min-w-[12rem]'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='otherCost'
            headerClassName='bg-[#ffc2c2] text-sm min-w-[12rem]'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Entertainment/Other Cost (BDT)'
          ></Column>

          <Column
            field='totalCost'
            headerClassName='bg-[#65CEEEFF] text-sm min-w-[12rem]'
            sortable
            header='Total Cost Of Cafeteria (BDT)'
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
              <label htmlFor='riceCost' className='font-bold'>
                Rice Cost Of Cafeteria (BDT)
              </label>
              <InputText
                id='riceCost'
                value={updatedProduct.riceCost}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    riceCost: e.target.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='rhdCost' className='font-bold'>
                RHD Cost Of Cafeteria (BDT)
              </label>
              <InputText
                id='rhdCost'
                value={updatedProduct.rhdCost}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    rhdCost: e.target.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='otherCost' className='font-bold'>
                Entertainment/Other Cost (BDT)
              </label>
              <InputText
                id='otherCost'
                value={updatedProduct.otherCost}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    otherCost: e.target.value,
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
            <div className='col-span-2'>
              <h3 className='font-bold mb-2'>Add New Attachments</h3>
              <MultiFileInput onFilesChange={handleNewAttachments} />
            </div>
          </div>
        )}
      </Dialog>

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
              <h3 className='font-bold'>Rice Cost Of Cafeteria (BDT)</h3>
              <p className='break-all'>{selectedProduct.riceCost}</p>
            </div>
            <div>
              <h3 className='font-bold'>RHD Cost Of Cafeteria (BDT)</h3>
              <p className='break-all'>{selectedProduct.rhdCost}</p>
            </div>
            <div>
              <h3 className='font-bold'>Entertainment/Other Cost (BDT)</h3>
              <p className='break-all'>{selectedProduct.otherCost}</p>
            </div>
            <div>
              <h3 className='font-bold'>Total Cost Of Cafeteria (BDT)</h3>
              <p className='break-all'>{selectedProduct.totalCost}</p>
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
              <label htmlFor='riceCost' className='font-bold'>
                Rice Cost Of Cafeteria (BDT)
              </label>
              <InputText
                id='riceCost'
                onChange={(e) => setRiceCost(e.target.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='rhdCost' className='font-bold'>
                RHD Cost Of Cafeteria (BDT)
              </label>
              <InputText
                id='rhdCost'
                onChange={(e) => setRHDCost(e.target.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='otherCost' className='font-bold'>
                Entertainment/Other Cost (BDT)
              </label>
              <InputText
                id='otherCost'
                onChange={(e) => setOtherCost(e.target.value)}
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
