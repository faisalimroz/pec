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
import { searchGreetings } from '@/api/adminAPIs'
import axios from 'axios'
import { Menu } from 'primereact/menu'
import { toast } from 'sonner'
import { InputTextarea } from 'primereact/inputtextarea'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'

interface Product {
  _id: string
  slNo: string
  title: string
  description: string
  img: string
}

export default function GreetingsTable() {
  let emptyProduct: Product = {
    _id: '',
    slNo: '',
    title: '',
    description: '',
    img: '',
  }

 const { roles } = useAuth()
  const isAdmin = roles.some((role) =>
    ['superadmin', 'admin'].includes(role.title)
  )

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
  const [description, setDescription] = useState('')
  const [formData, setFormData] = useState<any>({
    img: '',
  })
  const [newImage, setNewImage] = useState<File | null>(null)
  const [ImagePreview, setImagePreview] = useState<string | null>(null)
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null)
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)

  const [filesInput, setFilesInput] = useState<File[]>([])

  const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<any | null>(null)

  // all update dialog func here
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
      formData.append('title', updatedProduct.title)
      formData.append('description', updatedProduct.description)

      if (newImage) {
        formData.append('img', newImage)
      }

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/greetings/greetings/update/${updatedProduct._id}`,
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

  // ending all update dialog funcs

  const openNew = () => {
    setProduct(emptyProduct)
    setSubmitted(false)
    setProductDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setProductDialog(false)
    setProduct(emptyProduct)
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

      data.append('title', title)
      data.append('description', description)
      if (formData.img) {
        data.append('img', formData.img)
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/greetings/greetings/upload`,
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/greetings/greetings/delete/${product._id}`,
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
          `${import.meta.env.VITE_BASE_URL}/api/v1/admin/greetings/greetings/delete/multiple/data`,
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
  
    // multi delete func end

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

  const leftToolbarTemplate = () => {
    return (
      <div className=''>
        {isAdmin && <button
            onClick={confirmDeleteSelected}
            disabled={!selectedProducts || selectedProducts.length === 0}
            className={`p-3 text-lg font-semibold text-white rounded-t ${
              selectedProducts && selectedProducts.length > 0
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Delete Selected ({selectedProducts?.length || 0})
          </button>}
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
      {isAdmin && <div className='space-x-2'>
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
        
      </div>}
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

  const actionBodyTemplate = (rowData: Product) => {
    const menuRef = useRef<Menu>(null)
    const items = [
      {
        label: 'View',
        icon: 'pi pi-eye',
        command: () => viewProduct(rowData),
      },
    ]
    if(isAdmin){
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

  const handleFileChange = (newFiles: File[]) => {
    setFilesInput(newFiles)
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

    searchGreetings(initialPayload).then((result) => {
      setProducts(result?.Applications)
      setLoading(false)
    })
  }

   const handleReset = () => {
          const initialPayload = {
            year: '',
            searchQuery: '',
            month: '',
          }
      
          searchGreetings(initialPayload).then((result) => {
            setProducts(result?.greetings)
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

  const attachmentBodyTemplate = (rowData: any) => {
    return (
      <div className='w-fit'>
        <img className='w-[100%] h-auto' src={rowData?.img} alt='image' />
      </div>
    )
  }

  const refetch = () => {
    setLoading(true)
    const initialPayload = {
      month: '',
      year: '',
      searchQuery: '',
    }

    searchGreetings(initialPayload).then((result) => {
      setProducts(result?.greetings)
      setLoading(false)
    })
  }

  // initial data load
  useEffect(() => {
    refetch()
  }, [])

  // console.log(products)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev: any) => ({ ...prev, img: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageChangeUpdate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setNewImage(file)

      // Create a preview URL
      const previewURL = URL.createObjectURL(file)
      setNewImagePreview(previewURL)
    } else {
      setNewImage(null)
      setNewImagePreview(null)
    }
  }

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
          //  header={filterSearchForm}
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

          {/* <Column
            field='slNo'
            header='Sl. No.'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column> */}

          <Column
            field='title'
            header='Title'
            headerClassName='bg-[#ffc2c2] text-sm min-w-[200px]'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='description'
            header='Description'
            headerClassName='bg-[#ffc2c2] text-sm min-w-[400px]'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            body={attachmentBodyTemplate}
            header='Image'
            headerClassName='bg-[#ffc2c2] w-fit'
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
              <h3 className='font-bold'>SL No.</h3>
              <p className='break-all'>{selectedProduct.slNo}</p>
            </div>

            <div>
              <h3 className='font-bold'>Title</h3>
              <p className='break-all'>{selectedProduct?.title}</p>
            </div>
            <div>
              <h3 className='font-bold'>Description</h3>
              <p className='break-all'>{selectedProduct.description}</p>
            </div>
            <div>
              <h3 className='font-bold'>Image</h3>
              <img src={selectedProduct?.img} alt='image' />
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
              <label htmlFor='title' className='font-bold'>
                Title
              </label>
              <InputText
                id='title'
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='description' className='font-bold'>
                Description
              </label>
              <InputTextarea
                id='description'
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
        </>
        <div className='field col-span-2'>
          <label htmlFor='img' className='block mb-1 font-semibold'>
            Upload Image
          </label>
          <input
            type='file'
            id='img'
            accept='image/*'
            onChange={handleImageChange}
            className='w-full'
          />
          {ImagePreview && (
            <img
              src={ImagePreview}
              alt='Image Preview'
              className='mt-2 w-52 h-auto object-cover'
            />
          )}
        </div>
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
              Are you sure you want to delete <b>{product.title}</b>?
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
              <label htmlFor='description' className='font-bold'>
                Description
              </label>
              <InputTextarea
                id='description'
                value={updatedProduct.description}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className='field mb-3'>
              <label htmlFor='Image' className='block font-bold mb-2'>
                Change Image
              </label>
              <div className='flex items-center'>
                <img
                  src={newImagePreview || updatedProduct?.img}
                  alt=' Preview'
                  className='w-52 h-auto object-cover mr-4'
                />
                <br />
                <input
                  type='file'
                  id='Image'
                  accept='image/*'
                  onChange={handleImageChangeUpdate}
                  className='border p-2 rounded'
                />
              </div>
            </div>
          </div>
        )}
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
