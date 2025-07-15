import React, { useState, useEffect, useRef, useCallback } from 'react'
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
import '../../styles/table-style.css'
import { searchItsStaffSummary, useSearchItsStaffSummary } from '@/api/itsAPIs'
import axios from 'axios'
import './its.css'
import img1 from './staffIcon.png'
import { toast } from 'sonner'
import RefreshButton from '../refresh-button'
import { InputNumber } from 'primereact/inputnumber'
import { useAuth } from '@/provider/authProvider'

interface Product {
  _id: string | null
  code: string
  name: string
  description: string
  image: string | null
  price: number
  category: string | null
  quantity: number
  inventoryStatus: string
  rating: number
  orderNo: number
}

export default function ItsStaffSummary() {
  let emptyProduct: Product = {
    _id: null,
    code: '',
    name: '',
    image: null,
    description: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    orderNo: 0,
    inventoryStatus: 'INSTOCK',
  }

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'its-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'about-its'
  )

  const hasEditAccess = checkPermission?.edit_authority || false

  const isITS = roles.some((role) =>
    ['superadmin', 'its-manager'].includes(role.title)
  )
  const [chunkedProducts, setChunkedProducts] = useState([])
  const [products, setProducts] = useState<any>([])
  const [productDialog, setProductDialog] = useState<boolean>(false)
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)
  const [product, setProduct] = useState<any>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [searchKey, setSearchKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const cameraRef = useRef<HTMLInputElement | null>(null)
  const [showImages, setShowImages] = useState([])
  const [submitImageList, setSubmitImageList] = useState<File[]>([])
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [address, setAddress] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [email, setEmail] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [department, setDepartment] = useState('')
  const [orderNo, setOrderNo] = useState('')
  const [formDate, setFormDate] = useState<string>('')

  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<any | null>(null)
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null)
  const [newProfileImagePreview, setNewProfileImagePreview] = useState<
    string | null
  >(null)

  const [payload, setPayload] = useState<any>({
    month: '',
    year: '',
    searchQuery: '',
  })

  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useSearchItsStaffSummary(payload)

  useEffect(() => {
    if (invoiceData) {
      setProducts(invoiceData?.itsStaffData)
    }
  }, [invoiceData])

  // all update dialog func here

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setNewProfileImage(file)

      // Create a preview URL
      const previewURL = URL.createObjectURL(file)
      setNewProfileImagePreview(previewURL)
    } else {
      setNewProfileImage(null)
      setNewProfileImagePreview(null)
    }
  }
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
      formData.append('name', updatedProduct.name)
      formData.append('position', updatedProduct.position)
      formData.append('employeeId', updatedProduct.employeeId)
      formData.append('address', updatedProduct.address)
      formData.append('contactNo', updatedProduct.contactNo)
      formData.append('email', updatedProduct.email)
      formData.append('bloodGroup', updatedProduct.bloodGroup)
      formData.append('department', updatedProduct.department)
      formData.append('orderNo', updatedProduct.orderNo)
      formData.append('date', updatedProduct.date)
      if (newProfileImage) {
        formData.append('image', newProfileImage)
      }

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/staff/${updatedProduct._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      hideUpdateDialog()
      toast.success('Data updated successfully')
      window.location.reload()
    } catch (error) {
      console.error(error)
      toast.error('Failed To Update Data')
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

  const chunkArray = (array: any, chunkSize: any) => {
    const chunks = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  const cardWrapperTemplate = (rowData: any) => {
    return (
      <div className='flex flex-wrap -mx-2'>
        {rowData.map((data: any, index: any) => (
          <div key={index} className='w-full sm:w-1/2 p-2'>
            {cardTemplate(data)}
          </div>
        ))}
      </div>
    )
  }

  const cardTemplate = (rowData: any) => {
    const labels = [
      { key: 'name', label: 'Name:', value: rowData.name },
      { key: 'position', label: 'Position:', value: rowData.position },
      { key: 'staffId', label: 'Staff ID:', value: rowData.employeeId },
      { key: 'address', label: 'Address:', value: rowData.address },
      { key: 'contact', label: 'Contact No:', value: rowData.contactNo },
      { key: 'email', label: 'Email:', value: rowData.email },
      { key: 'joining', label: 'Joining Date:', value: rowData.date },
      { key: 'blood', label: 'Blood Group:', value: rowData.bloodGroup },
    ]

    return (
      <div className='bg-white shadow-md rounded-lg h-full relative p-4'>
        <div className='flex flex-col sm:flex-row  items-center gap-6'>
          {/* Image section */}
          <div className='w-[200px] sm:w-1/4 flex-shrink-0'>
            <img
              src={
                rowData.image ||
                `https://avatar.iran.liara.run/username?username=${rowData.name.replace(/\s+/g, '+')}}`
              }
              alt={rowData.name}
              className='w-full h-auto object-cover rounded'
            />
          </div>

          {/* Details section */}
          <div className='flex-grow'>
            <div className='grid grid-cols-1 space-y-2'>
              {labels.map(({ key, label, value }) => (
                <div key={key} className='flex mb-2'>
                  <div className='w-32 flex-shrink-0 flex items-start'>
                    <img
                      src={img1 || '/placeholder.svg'}
                      alt='icon'
                      className='w-3 h-3 mr-2 mt-1'
                    />
                    <span className='text-sm font-medium'>{label}</span>
                  </div>
                  <div className='text-sm flex-grow break-words'>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons section */}
        {hasEditAccess && (
          <div className='flex justify-end gap-2 p-2 absolute bottom-0 right-0'>
            <button
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm'
              onClick={() => confirmDeleteProduct(rowData)}
            >
              Remove
            </button>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm'
              onClick={() => openUpdateDialog(rowData)}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    )
  }

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

      formData.append('name', name)
      formData.append('position', position)
      formData.append('employeeId', employeeId)
      formData.append('address', address)
      formData.append('contactNo', contactNo)
      formData.append('email', email)
      formData.append('bloodGroup', bloodGroup)
      formData.append('department', department)
      formData.append('orderNo', orderNo)
      formData.append('date', formatDate(formDate))
      for (let i = 0; i < submitImageList.length; i++) {
        formData.append('image', submitImageList[i])
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/staff/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      const response = res
      hideDialog()
      window.location.reload()
      console.log(response)
    } catch (error: any) {
      console.error(error)
      const msg = error.response.data.message
      toast.error(msg)
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/staff/delete/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      const newProduct = res.data
      setProducts((prevProducts: any) => [...prevProducts, newProduct])
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

  const leftToolbarTemplate = () => {
    return (
      <div className=''>
        <div className='p-3 bg-main text-base font-semibold text-white rounded-t'>
          Document List
        </div>
      </div>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <>
        {hasEditAccess && (
          <div className='space-x-2'>
            <button
              className='bg-white text-gray-800 border-gray-600 border-t text-sm border-l border-r px-4 py-3 rounded-t-md font-bold'
              onClick={openNew}
            >
              Upload Document
            </button>
            <button
              className='bg-gray-600 text-white border-gray-600 border-t text-sm border-l border-r font-bold px-4 py-3 rounded-t-md'
              onClick={exportCSV}
            >
              Download Files
            </button>
          </div>
        )}
        <RefreshButton className='ml-2' onClick={handleReset} />
      </>
    )
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      date: date ? formatDate(date) : '',
      searchQuery: searchKey,
    }

    searchItsStaffSummary(initialPayload).then((result) => {
      setProducts(result?.itsStaffData)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      date: '',
      searchQuery: '',
    }

    setDate('')
    setSearchKey('')

    searchItsStaffSummary(initialPayload).then((result) => {
      setProducts(result?.itsStaffData)
      setLoading(false)
    })
  }

  const filterSearchForm = (
    <>
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
          // view='dd/mm/yy'
          dateFormat='dd/mm/yy'
          inputClassName='border-none rounded-none cursor-pointer focus:ring-0'
          placeholder='Select Joining Date'
          showIcon
          icon={() => <i className='pi pi-angle-down' />}
        />

        <IconField iconPosition='left' className='relative'>
          <InputIcon className='pi pi-search' />
          <InputText
            type='search'
            placeholder='Search...'
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
    console.log(finalImageList[0])
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
  // useEffect(() => {
  //   setLoading(true)
  //   const initialPayload = {
  //     month: '',
  //     year: '',
  //     searchQuery: '',
  //   }

  //   searchItsStaffSummary(initialPayload).then((result) => {
  //     setProducts(result?.itsStaffData)
  //     setLoading(false)
  //   })
  // }, [])

  useEffect(() => {
    // @ts-ignore
    setChunkedProducts(chunkArray(products, 2))
  }, [products])

  console.log(chunkedProducts)

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
          value={chunkedProducts}
          dataKey='_id'
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate={`Showing {first} to {last} of ${products.length} Datas`}
          header={filterSearchForm}
          showGridlines
          emptyMessage='No data found!'
          loading={invoiceLoading}
          className='data-table-cards'
          totalRecords={products.length}
        >
          <Column body={cardWrapperTemplate}></Column>
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
              <label htmlFor='orderNo' className='font-bold'>
                OrderNo
              </label>
              <InputNumber
                id='orderNo'
                onValueChange={(e: any) => setOrderNo(e.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='name' className='font-bold'>
                Name
              </label>
              <InputText
                id='name'
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !name,
                })}
              />
              {submitted && !name && (
                <small className='p-error'>Name is required.</small>
              )}
            </div>

            <div className='field'>
              <label htmlFor='position' className='font-bold'>
                Position
              </label>
              <InputText
                id='position'
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='employeeId' className='font-bold'>
                Staff ID
              </label>
              <InputText
                id='employeeId'
                onChange={(e) => setEmployeeId(e.target.value)}
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
              <label htmlFor='contactNo' className='font-bold'>
                Contact No.
              </label>
              <InputText
                id='contactNo'
                onChange={(e) => setContactNo(e.target.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='email' className='font-bold'>
                Email
              </label>
              <InputText
                id='email'
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='bloodGroup' className='font-bold'>
                Blood Group
              </label>
              <InputText
                id='bloodGroup'
                onChange={(e) => setBloodGroup(e.target.value)}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='department' className='font-bold'>
                Department
              </label>
              <InputText
                id='department'
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor='date' className='font-bold'>
                Joining Date
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

            <div className='gap-3'>
              <label className='block mb-1 font-semibold'>
                Upload Image
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

          <div className=' px-3 py-10 rounded-xl mt-5'>
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
          <>
            <div className='field mb-3'>
              <label htmlFor='profileImage' className='block font-bold mb-2'>
                Profile Image
              </label>
              <div className='flex items-center'>
                <img
                  src={newProfileImagePreview || updatedProduct?.image}
                  alt='Profile Preview'
                  className='w-16 h-16 object-cover rounded-full mr-4'
                />
                <input
                  type='file'
                  id='profileImage'
                  accept='image/*'
                  onChange={handleProfileImageChange}
                  className='border p-2 rounded'
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='field'>
                <label htmlFor='orderNo' className='font-bold'>
                  OrderNo
                </label>
                <InputNumber
                  id='orderNo'
                  value={updatedProduct.orderNo}
                  onValueChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      orderNo: e.value,
                    })
                  }
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='name' className='font-bold'>
                  Name
                </label>
                <InputText
                  id='name'
                  value={updatedProduct.name}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      name: e.target.value,
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
                <label htmlFor='employeeId' className='font-bold'>
                  Staff ID
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
                <label htmlFor='address' className='font-bold'>
                  Address
                </label>
                <InputText
                  id='address'
                  value={updatedProduct.address}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      address: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='contactNo' className='font-bold'>
                  Contact No.
                </label>
                <InputText
                  id='contactNo'
                  value={updatedProduct.contactNo}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      contactNo: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='email' className='font-bold'>
                  Email
                </label>
                <InputText
                  id='email'
                  value={updatedProduct.email}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='bloodGroup' className='font-bold'>
                  Blood Group
                </label>
                <InputText
                  id='bloodGroup'
                  value={updatedProduct.bloodGroup}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      bloodGroup: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className='field'>
                <label htmlFor='department' className='font-bold'>
                  Department
                </label>
                <InputText
                  id='department'
                  value={updatedProduct.department}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      department: e.target.value,
                    })
                  }
                  required
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
            </div>
          </>
        )}
      </Dialog>
    </div>
  )
}
