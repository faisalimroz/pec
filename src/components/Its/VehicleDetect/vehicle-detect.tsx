import React, { useState, useEffect, useRef, useCallback } from 'react'
import { classNames } from 'primereact/utils'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Calendar } from 'primereact/calendar'
import '../../../styles/table-style.css'
import { trainingApi } from '@/api/itsAPIs'
import axios from 'axios'

interface Product {
  id: string | null
  fileName: string
  date: string
  subject: string
  image: string | null
  price: number
  category: string | null
  quantity: number
  inventoryStatus: string
  rating: number
}

export default function TrainingData() {
  const op = useRef<null>(null)

  let emptyProduct: Product = {
    id: null,
    fileName: '',
    date: '',
    image: null,
    subject: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'INSTOCK',
  }

  const [products, setProducts] = useState<any>([])
  const [productDialog, setProductDialog] = useState<boolean>(false)
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)
  const [deleteProductsDialog, setDeleteProductsDialog] =
    useState<boolean>(false)
  const [product, setProduct] = useState<any>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [searchKey, setSearchKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const cameraRef = useRef<HTMLInputElement | null>(null)
  const [showImages, setShowImages] = useState([])
  const [submitImageList, setSubmitImageList] = useState<File[]>([])
  const [fileName, setFileName] = useState('')
  const [remarks, setRemarks] = useState('')
  const [formDate, setFormDate] = useState<string>('')

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

      formData.append('filename', fileName)
      formData.append('remarks', remarks)
      formData.append('date', formatDate(formDate))
      for (let i = 0; i < submitImageList.length; i++) {
        formData.append('attachments', submitImageList[i])
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/salary/monthly-sheet/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      const response = res

      console.log(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading2(false)
    }
  }

  const editProduct = (product: Product) => {
    setProduct({ ...product })
    setProductDialog(true)
  }

  const confirmDeleteProduct = (product: Product) => {
    setProduct(product)
    setDeleteProductDialog(true)
  }

  const deleteProduct = () => {
    let _products = products.filter((val: { id: any }) => val.id !== product.id)

    setProducts(_products)
    setDeleteProductDialog(false)
    setProduct(emptyProduct)
    toast.current?.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Deleted',
      life: 3000,
    })
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
    toast.current?.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Products Deleted',
      life: 3000,
    })
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

  const actionBodyTemplate = (rowData: Product) => {
    return (
      <>
        <Button
          icon='pi pi-ellipsis-v'
          outlined
          className='border-none'
          // @ts-ignore
          onClick={(e) => op.current?.toggle(e)}
        />
        <OverlayPanel ref={op}>
          <div className='flex flex-col space-y-2'>
            <a href=''>Edit</a>
            <a href=''>Delete</a>
            <a href=''>Download Attachment</a>
          </div>
        </OverlayPanel>
        {/* <Button
          icon='pi pi-pencil'
          rounded
          outlined
          className='mr-2'
          onClick={() => editProduct(rowData)}
        /> */}
        {/* <Button
          icon='pi pi-trash'
          rounded
          outlined
          severity='danger'
          onClick={() => confirmDeleteProduct(rowData)}
        /> */}
      </>
    )
  }

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

    trainingApi(initialPayload).then((result) => {
      setProducts(result)
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
    return <div>{rowData?.attachment?.length}</div>
  }

  const pictureBodyTemplate = (rowData: any) => {
    return <div>{rowData?.pictures?.length}</div>
  }

  const videoBodyTemplate = (rowData: any) => {
    return <div>{rowData?.video ? 1 : 0}</div>
  }

  const onUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }

    const imageList = e.target.files
    let imageUrlList: any = [...showImages]

    const maxSize = 5 * 1024 * 1024

    for (let i = 0; i < imageList.length; i++) {
      if (imageList[0].size > maxSize) {
        alert('Limit Crossed. Max file size is 5MB.')
        return
      }
      imageUrlList.push(imageList[i].name)
    }

    if (imageUrlList.length > 10) {
      alert('Limit Crossed. Max file limit is 10.')
      return
    }

    let finalImageList = Array.from(imageList).concat(submitImageList)
    setSubmitImageList(finalImageList)
    setShowImages(imageUrlList)

    console.log(finalImageList)
  }

  const onDeleteImage = (id: any) => {
    setShowImages(showImages.filter((_, index) => index !== id))
    setSubmitImageList(submitImageList.filter((_, index) => index !== id))
  }

  const onUploadImageButtonClicked = useCallback(() => {
    if (!cameraRef.current) {
      return
    }
    cameraRef.current.click()
  }, [])

  // initial data load
  useEffect(() => {
    setLoading(true)
    const initialPayload = {
      month: '',
      year: '',
      searchQuery: '',
      department: '',
    }

    trainingApi(initialPayload).then((result) => {
      setProducts(result)
      setLoading(false)
    })
  }, [])

  // console.log(products)

  return (
    <div className='ml-4'>
      <Toast ref={toast} />
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
            header='SL No.'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='date'
            header='Date'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='subject'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Subject'
          ></Column>

          <Column
            field='location'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Location'
          ></Column>

          <Column
            field='trainer'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Shift'
          ></Column>

          <Column
            body={attachmentBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Attachment'
          ></Column>

          <Column
            body={pictureBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Total Vehicle Passing'
          ></Column>

          <Column
            body={videoBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Total Toll Collection'
          ></Column>

          <Column
            field='remarks'
            header='Vehicle Type'
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
              <label htmlFor='filename' className='font-bold'>
                File Name
              </label>
              <InputText
                id='filename'
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

            <div className='gap-3'>
              <label className='block mb-1 font-semibold'>
                Upload Document
                <span className='text-red-500'>*</span>
              </label>

              <div>
                <button
                  type='button'
                  onClick={onUploadImageButtonClicked}
                  className='bg-gray-500 text-white px-2 py-3 rounded-lg top-3.5 right-2'
                >
                  Click to Upload
                </button>
                <input
                  type='file'
                  ref={cameraRef}
                  onChange={onUploadImage}
                  multiple
                  accept='.pdf, image/*'
                  className='hidden'
                />
              </div>
            </div>
          </div>

          <div className='border border-dashed px-3 py-10 rounded-xl mt-5'>
            {showImages.map((imageUrl, id) => (
              <div
                key={id}
                className='flex flex-row-reverse items-center justify-end mb-1 gap-3'
              >
                <span>{imageUrl}</span>
                <button
                  type='button'
                  onClick={() => onDeleteImage(id)}
                  className='text-red-500'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='size-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                    />
                  </svg>
                </button>
              </div>
            ))}
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
