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
import '@/styles/table-style.css'
import { searchRecruitment } from '@/api/adminAPIs'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown'
import { Link } from 'react-router-dom'
import MultiFileInput from '@/components/MultiFileInput'
import { toast } from 'sonner'

interface FileInfo {
  url: string
  _id: string
}

interface Product {
  _id: string
  employeeId: string
  date: string
  employeeName: string
  designation: string
  workingPlace: string
  joiningDate: string
  boqNo: string
  personalRecord: FileInfo[]
  cause: FileInfo[]
  warning: FileInfo[]
  dismiss: FileInfo[]
  resingLetter: FileInfo[]
  evalution: FileInfo[]
  slNo: string
}

export default function RecruitmentTable() {
  let emptyProduct: Product = {
    _id: '',
    employeeId: '',
    date: '',
    employeeName: '',
    designation: '',
    workingPlace: '',
    joiningDate: '',
    boqNo: '',
    personalRecord: [],
    cause: [],
    warning: [],
    dismiss: [],
    resingLetter: [],
    evalution: [],
    slNo: '',
  }

  const codes = [
    { name: 'Dhaleshwari', code: 'Dhaleshawri' },
    { name: 'Bhanga', code: 'Bhanga' },
    { name: 'Sreenagar', code: 'Sreenagar' },
    { name: 'Dhaka Zone', code: 'Dhaka' },
    { name: 'Gulshan Office', code: 'Gulshan' },
  ]

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
  const [selectedCode, setSelectedCode] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [personalRecord, setPersonalRecord] = useState<any>([])
  const [cause, setCause] = useState<any>([])
  const [warning, setWarning] = useState<any>([])
  const [dismiss, setDismiss] = useState<any>([])
  const [resignLetter, setResignLetter] = useState<any>([])
  const [evaluation, setEvaluation] = useState<any>([])

  const [formData, setFormData] = useState<Product>({
    _id: '',
    employeeId: '',
    date: '',
    employeeName: '',
    designation: '',
    workingPlace: '',
    joiningDate: '',
    boqNo: '',
    personalRecord: [] as FileInfo[],
    cause: [] as FileInfo[],
    warning: [] as FileInfo[],
    dismiss: [] as FileInfo[],
    resingLetter: [] as FileInfo[],
    evalution: [] as FileInfo[],
    slNo: '',
  })

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
      const data = new FormData()

      data.append('employeeName', formData.employeeName)
      data.append('employeeId', formData.employeeId)
      data.append('designation', formData.designation)
      data.append('workingPlace', formData.workingPlace)
      data.append('joiningDate', formatDate(formData.joiningDate))
      data.append('boqNo', formData.boqNo)
      data.append('date', formatDate(date))

      // Append new attachments for each category
      personalRecord.forEach((file: string | Blob) =>
        data.append('personalRecord', file)
      )
      cause.forEach((file: string | Blob) => data.append('cause', file))
      warning.forEach((file: string | Blob) => data.append('warning', file))
      dismiss.forEach((file: string | Blob) => data.append('dismiss', file))
      resignLetter.forEach((file: string | Blob) =>
        data.append('resingLetter', file)
      )
      evaluation.forEach((file: string | Blob) =>
        data.append('evalution', file)
      )

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/greetings/recruitment/upload`,
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
      window.location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading2(false)
    }
  }

  const deleteProduct = () => {
    // @ts-ignore
    let _products = products.filter((val) => val.id !== product.id)

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
    // @ts-ignore
    let _products = products.filter((val) => !selectedProducts.includes(val))

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
        <Link to={`/administrative/recruitment/${rowData._id}`}>
          <Button
            icon='pi pi-eye text-blue-500'
            text
            raised
            severity='secondary'
            label='View Profile'
            className='text-sm'
          />
        </Link>
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
      workingPlace: selectedCode?.code || '',
      searchQuery: searchKey,
    }

    searchRecruitment(initialPayload).then((result) => {
      setProducts(result?.Recruitments)
      setLoading(false)
    })
  }

  const filterSearchForm = (
    <div className='flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white'>
      <div>
        <Dropdown
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.value)}
          options={codes}
          optionLabel='name'
          placeholder='Select Office'
          className='border-none rounded-none ml-4 cursor-pointer ring-0'
        />
      </div>
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
    return <div>{rowData?.personalRecord?.length}</div>
  }

  // initial data load
  useEffect(() => {
    setLoading(true)
    const initialPayload = {
      month: '',
      year: '',
      searchQuery: '',
    }

    searchRecruitment(initialPayload).then((result) => {
      setProducts(result?.Recruitments)
      setLoading(false)
    })
  }, [])

  const handlePersonalRecord = (newFiles: File[]) => {
    setPersonalRecord(newFiles)
  }

  const handleCause = (newFiles: File[]) => {
    setCause(newFiles)
  }

  const handleWarning = (newFiles: File[]) => {
    setWarning(newFiles)
  }

  const handleDismiss = (newFiles: File[]) => {
    setDismiss(newFiles)
  }

  const handleResign = (newFiles: File[]) => {
    setResignLetter(newFiles)
  }

  const handleEvaluation = (newFiles: File[]) => {
    setEvaluation(newFiles)
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
            field='employeeId'
            header='Employee ID'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='employeeName'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Employee Name'
          ></Column>

          <Column
            field='designation'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Designation'
          ></Column>

          <Column
            field='workingPlace'
            header='Working Place'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='joiningDate'
            header='Joining Date'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            body={attachmentBodyTemplate}
            header='Personal Record Card'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            body={actionBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm min-w-[12rem]'
            bodyClassName='text-sm truncate max-w-xs'
            header='Actions'
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
          <div className='grid grid-cols-2 gap-3'>
            <div className='field mb-3'>
              <label htmlFor='employeeName' className='block font-bold mb-2'>
                Employee Name
              </label>
              <InputText
                id='employeeName'
                value={formData.employeeName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='employeeId' className='block font-bold mb-2'>
                Employee ID
              </label>
              <InputText
                id='employeeId'
                value={formData.employeeId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='boqNo' className='block font-bold mb-2'>
                BoqNo
              </label>
              <InputText
                id='boqNo'
                value={formData.boqNo}
                onChange={handleInputChange}
              />
            </div>

            <div className='field mb-3'>
              <label htmlFor='joiningDate' className='block font-bold mb-2'>
                Joining Date
              </label>
              <div className='border rounded-md'>
                <Calendar
                  id='date'
                  // @ts-ignore
                  value={formData.joiningDate}
                  // @ts-ignore
                  onChange={(e) => handleDateChange(e, 'joiningDate')}
                  dateFormat='dd/mm/yy'
                  inputClassName='border-0 focus:ring-0 cursor-pointer'
                  className='focus:ring-0'
                  placeholder='Select Date'
                />
              </div>
            </div>

            <div className='field mb-3'>
              <label htmlFor='workingPlace' className='block font-bold mb-2'>
                Working Place
              </label>
              <InputText
                id='workingPlace'
                value={formData.workingPlace}
                onChange={handleInputChange}
              />
            </div>

            <div className='field mb-3'>
              <label htmlFor='designation' className='block font-bold mb-2'>
                Designation
              </label>
              <InputText
                id='designation'
                value={formData.designation}
                onChange={handleInputChange}
              />
            </div>

            {/* <div>
              <label htmlFor='date' className='font-bold'>
                Date
              </label>
              <div className='border rounded-md'>
                <Calendar
                  id='date'
                  // @ts-ignore
                  value={formData.date}
                  // @ts-ignore
                  onChange={(e) => handleDateChange(e, 'date')}
                  dateFormat='dd/mm/yy'
                  inputClassName='border-0 focus:ring-0 cursor-pointer'
                  className='focus:ring-0'
                  placeholder='Select Date'
                />
              </div>
            </div> */}

            {/* Add more fields for other employee properties */}
          </div>
          <div className='gap-3 mt-5'>
            <label className='block mb-1 font-semibold'>
              Upload Personal Records
            </label>

            <div>
              <MultiFileInput onFilesChange={handlePersonalRecord} />
            </div>
          </div>

          <div className='gap-3 mt-5'>
            <label className='block mb-1 font-semibold'>Upload Cause</label>

            <div>
              <MultiFileInput onFilesChange={handleCause} />
            </div>
          </div>

          <div className='gap-3 mt-5'>
            <label className='block mb-1 font-semibold'>Upload Warnings</label>

            <div>
              <MultiFileInput onFilesChange={handleWarning} />
            </div>
          </div>

          <div className='gap-3 mt-5'>
            <label className='block mb-1 font-semibold'>Upload Dismiss</label>

            <div>
              <MultiFileInput onFilesChange={handleDismiss} />
            </div>
          </div>

          <div className='gap-3 mt-5'>
            <label className='block mb-1 font-semibold'>
              Upload Resign Letter
            </label>

            <div>
              <MultiFileInput onFilesChange={handleResign} />
            </div>
          </div>

          <div className='gap-3 mt-5'>
            <label className='block mb-1 font-semibold'>
              Upload Evaluation
            </label>

            <div>
              <MultiFileInput onFilesChange={handleEvaluation} />
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
