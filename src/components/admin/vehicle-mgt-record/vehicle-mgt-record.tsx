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
import '@/styles/table-style.css'
import { searchAssetManagement } from '@/api/adminAPIs'
import axios from 'axios'
import MultiFileInput from '@/components/MultiFileInput'
import { Menu } from 'primereact/menu'
import { toast } from 'sonner'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { Dropdown } from 'primereact/dropdown';
interface Vehicle {
  _id: string;
  slNo: string;
  vehicleName: string;
  registrationNumber: string;
  vehicleClass: string;
  status: string;
  fitnessDuration: string;
  taxAndTokenReport: string;
  roadTaxExpiry: Date;
  creator?: string;
  creationTimestamp?: string;
  updater?: string;
  updatingTimestamp?: string;
  attachments: Attachment[]
}
interface Attachment {
  url: string
  _id: string
}
const options = [
  { label: 'Exemption', value: 'exemption' },
  { label: 'Non Exemption', value: 'non-exemption' },
];
export default function AssetManagementTable() {
  let emptyVehicle: Vehicle = {
    _id: '',
    slNo: '',
    vehicleName: '',
    registrationNumber: '',
    vehicleClass: '',
    status: '',
    fitnessDuration: '',
    taxAndTokenReport: '',
    roadTaxExpiry: new Date(),
    creator: '',
    creationTimestamp: '',
    updater: '',
    updatingTimestamp: '',
    attachments: [],
  };

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'admin')
  const checkPermission = checkRole?.children.find((c) => c.name === 'hr')

  const hasEditAccess = checkPermission?.edit_authority || false

  const isAdmin = roles.some((role) =>
    ['superadmin', 'admin'].includes(role.title)
  )
  const [products, setProducts] = useState<any>([])
  const [productDialog, setProductDialog] = useState<boolean>(false)
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)
  const [deleteProductsDialog, setDeleteProductsDialog] =
    useState<boolean>(false)
  const [product, setProduct] = useState<any>(emptyVehicle)
  const [selectedProducts, setSelectedProducts] = useState<Vehicle[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const dt = useRef<DataTable<Vehicle[]>>(null)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [dropdownStatus, setDropdownStatus] = useState<string>('')
  const [searchKey, setSearchKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [itemName, setItemName] = useState('')
  const [vehicleClass, setvehicleClass] = useState('')
  const [vehicleName, setVehicleName] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [taxToken, setTaxToken] = useState('')
  const [assetId, setAssetId] = useState('')
  const [fitnessDuration, setFitnessDuration] = useState('')
  const [chalanNo, setChalanNo] = useState('')
  const [quantity, setQuantity] = useState('')
  const [usingLocation, setUsingLoaction] = useState('')
  const [status, setStatus] = useState('')
  const [filesInput, setFilesInput] = useState<File[]>([])
  const [formDate, setFormDate] = useState<string>('')
  const [formDates, setFormDates] = useState<(Date | null)[] | null>(null);

  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)

  const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Vehicle | null>(null)

  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<Vehicle | null>(null)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])

  // all update dialog func here
  const openUpdateDialog = (product: Vehicle) => {
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
      const formData = new FormData();

      formData.append('_id', updatedProduct._id);
      formData.append('slNo', updatedProduct.slNo);
      formData.append('vehicleName', updatedProduct.vehicleName);
      formData.append('registrationNumber', updatedProduct.registrationNumber);
      formData.append('vehicleClass', updatedProduct.vehicleClass);
      formData.append('status', updatedProduct.status);
      formData.append('fitnessDuration', updatedProduct.fitnessDuration);
      formData.append('taxAndTokenReport', updatedProduct.taxAndTokenReport);
      formData.append('roadTaxExpiry', updatedProduct.roadTaxExpiry.toISOString());
      formData.append('creator', updatedProduct.creator || '');
      formData.append('creationTimestamp', updatedProduct.creationTimestamp || '');
      formData.append('updater', updatedProduct.updater || '');
      formData.append('updatingTimestamp', updatedProduct.updatingTimestamp || '');


      newAttachments.forEach((file) => {
        formData.append('attachments', file)
      })

      removedAttachments.forEach((attachmentId) => {
        formData.append('removedAttachments', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/asset-manage/update/${updatedProduct._id}`,
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
  const itemTemplate = (option: any) => {
    return (
      <div className="flex items-center space-x-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
          <path d="M14 2.01953H6C5.46957 2.01953 4.96086 2.23024 4.58579 2.60532C4.21071 2.98039 4 3.4891 4 4.01953V20.0195C4 20.55 4.21071 21.0587 4.58579 21.4337C4.96086 21.8088 5.46957 22.0195 6 22.0195H18C18.5304 22.0195 19.0391 21.8088 19.4142 21.4337C19.7893 21.0587 20 20.55 20 20.0195V8.01953L14 2.01953Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14 2.01953V8.01953H20" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 13.0195H8" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 17.0195H8" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M10 9.01953H9H8" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{option.label}</span>

      </div>
    );
  };
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


  const openNew = () => {
    setProduct(emptyVehicle)
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
    try {
      setLoading2(true)
      const formData = new FormData()

      formData.append('itemName', itemName)
      formData.append('taxToken', taxToken)
      formData.append('fitnessDuration', formatDate(formDates))
      formData.append('registrationNumber', registrationNumber)
      formData.append('vehicleClass', vehicleClass)
      formData.append('vehicleName', vehicleName)
      formData.append('usingLocation', usingLocation)
      formData.append('status', status)
      formData.append('date', formatDate(formDate))
      filesInput.forEach((file) => {
        formData.append('attachments', file)
      })
   console.log(Array.from(formData.entries()));
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/asset-manage/upload`,
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

  const confirmDeleteProduct = (product: Vehicle) => {
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/asset-manage/delete/${product._id}`,
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
    setProduct(emptyVehicle)
  }

  const exportCSV = () => {
    if (selectedProducts && selectedProducts.length > 0) {
      dt.current?.exportCSV({ selectionOnly: true })
    } else {
      dt.current?.exportCSV()
    }
  }

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
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/asset-manage/delete/multiple/data`,
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

  // multi delete func ends

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
              className='bg-white text-gray-800 border-gray-600 border-t border-l border-r px-4 py-3 rounded-t-md font-bold'
              onClick={openNew}
            >
              Upload Document
            </button>
            <button
              className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
              onClick={exportCSV}
            >
              Download Files{' '}
              {selectedProducts?.length === 0
                ? '(All)'
                : `(${selectedProducts?.length})`}
            </button>
            <button
              onClick={confirmDeleteSelected}
              disabled={!selectedProducts || selectedProducts.length === 0}
              className={`py-3 px-4 text-base font-semibold text-white rounded-t-md ${selectedProducts && selectedProducts.length > 0
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

  const viewProduct = (product: Vehicle) => {
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

  const actionBodyTemplate = (rowData: Vehicle) => {
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

    searchAssetManagement(initialPayload).then((result) => {
      setProducts(result?.Assets)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      year: '',
      searchQuery: '',
      month: '',
    }

    setDate('')
    setDate2('')
    setSearchKey('')

    searchAssetManagement(initialPayload).then((result) => {
      setProducts(result?.Assets)
      setLoading(false)
    })
  }

  const filterSearchForm = (
    <form
      className='flex mx-auto w-fit gap-4 divide-x-2 border p-2 rounded-md bg-white'
      onSubmit={(e) => {
        e.preventDefault()
        handleSearch()
      }}
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
      <Dropdown
        value={dropdownStatus}
        options={options}
        onChange={(e) => setDropdownStatus(e.value)}
        placeholder="Select Status"
        className="w-60 border-none ml-2 focus:ring-0"
        itemTemplate={itemTemplate}
      />
      <IconField iconPosition='left' className='relative'>
        <InputIcon className='pi pi-search' />
        <InputText
          type='search'
          placeholder='Search'
          className='border-none ml-2 focus:ring-0'
          onChange={(e) => setSearchKey(e.target.value)}
          value={searchKey}
        />
      </IconField>

      <div>
        <button
          type='submit'
          className='ml-6 border bg-green-500 px-4 py-2.5 rounded-lg'
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
      </div>
    </form>
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

    searchAssetManagement(initialPayload).then((result) => {
      setProducts(result?.Assets)
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
          removableSort
        >
          <Column
            selectionMode='multiple'
            headerStyle={{ width: '3rem' }}
            exportable={false}
            headerClassName='bg-[#ffc2c2] '
          ></Column>

          <Column
            field='slNo'
            header='SL No.'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>
          <Column
            field="vehicleName"
            header="Vehicle Name"
            headerClassName="bg-[#ffc2c2] text-sm"
            bodyClassName="text-sm truncate max-w-xs"
          />

          <Column
            field="registrationNumber"  // <-- must match updatedProduct key
            header="Registration Number"
            headerClassName="bg-[#ffc2c2] text-sm"
            bodyClassName="text-sm truncate max-w-xs"
          />

          <Column
            field="vehicleClass"  // <-- must match updatedProduct key
            header="Vehicle Class"
            headerClassName="bg-[#ffc2c2] text-sm"
            bodyClassName="text-sm truncate max-w-xs"
          />
          <Column
            field='taxToken'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Tax and Token Report'
          ></Column>

          <Column
            field='status'
            header='Status'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          // sortable
          ></Column>
          <Column
            field='fitnessDuration'
            header='Fitness Duration'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          // sortable
          ></Column>



          <Column
            field='date'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            header='Road Tax Expiry Date'
          ></Column>

          {/* <Column
            field='quantity'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Quantity'
          ></Column> */}



          {/* <Column
            body={attachmentBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            // sortable
            header='Attachment'
          ></Column> */}



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
        header='Update Data'
        modal
        className='p-fluid'
        footer={updateProductDialogFooter}
        onHide={hideUpdateDialog}
      >
        {updatedProduct && (
          <div className='grid grid-cols-2 gap-4'>
            <div className='field'>
              <label htmlFor='assetId' className='font-bold'>
                SL No.
              </label>
              <InputText
                id='assetId'
                value={updatedProduct.slNo}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    slNo: e.target.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='vehicleClass' className='font-bold'>
                Vehicle Class
              </label>
              <InputText
                id='vehicleClass'
                value={updatedProduct.vehicleClass}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    vehicleClass: e.target.value,
                  })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='vehicleName' className='font-bold'>
                Vehicle Name
              </label>
              <InputText
                id='vehicleName'
                value={updatedProduct.vehicleName}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    vehicleName: e.target.value,
                  })
                }
              />
            </div>

            {/* <div className='field'>
              <label htmlFor='quantity' className='font-bold'>
                Quantity
              </label>
              <InputText
                id='quantity'
                value={updatedProduct.quantity}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    quantity: e.target.value,
                  })
                }
              />
            </div> */}

            <div className='field'>
              <label htmlFor='taxToken' className='font-bold'>
                Tax and Token Report
              </label>
              <InputText
                id='taxToken'
                value={updatedProduct.taxAndTokenReport}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    taxAndTokenReport: e.target.value,
                  })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='vehicleName' className='font-bold'>
                Vehicle Name
              </label>
              <InputText
                id='vahicleName'
                value={updatedProduct.vehicleName}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    vehicleName: e.target.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='chalanNo' className='font-bold'>
                Registration Number
              </label>
              <InputText
                id='chalanNo'
                value={updatedProduct.registrationNumber}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    registrationNumber: e.target.value,
                  })
                }
              />
            </div>

            <div className='field'>
              <label htmlFor='status' className='font-bold'>
                Status
              </label>
              <InputText
                id='status'
                value={updatedProduct.status}
                onChange={(e) =>
                  setStatus({
                    ...updatedProduct,
                    status: e.target.value,
                  })
                }
              />
            </div>
            <div className='field'>
              <label htmlFor='date' className='font-bold'>
                Road Tax Expiry Date
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
        visible={viewProductDialog}
        style={{ width: '50rem' }}
        header='Document Details'
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
                <h3 className='font-bold'>Vehicle Name</h3>
                <p>{selectedProduct.vehicleName}</p>
              </div>
              <div>
                <h3 className='font-bold'>Registration Number</h3>
                <p className='break-all'>{selectedProduct.registrationNumber}</p>
              </div>
              <div>
                <h3 className='font-bold'>Vehicle Class.</h3>
                <p className='break-all'>{selectedProduct.vehicleClass}</p>
              </div>
              <div>
                <h3 className='font-bold'>Status</h3>
                <p className='break-all'>{selectedProduct.status}</p>
              </div>
              <div>
                <h3 className='font-bold'>Fitness Duration</h3>
                <p className='break-all'>{selectedProduct.fitnessDuration}</p>
              </div>
              <div>
                <h3 className='font-bold'>Tax and Token Report</h3>
                <p className='break-all'>{selectedProduct.taxAndTokenReport}</p>
              </div>
              <div>
                <h3 className='font-bold'>Road Tax Expiry Date</h3>
                <p className='break-all'>{selectedProduct.roadTaxExpiry.toISOString()}</p>
              </div>

              {hasEditAccess && (
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
              )}
            </div>
          </>
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
              <label htmlFor='fitnessDuration' className='font-bold'>
                Fitness Duration
              </label>
              <div className='border rounded-md'>
                <Calendar
                  id='date'
                  // @ts-ignore
                  selectionMode='range'
                  value={formDates}
                  onChange={(e) => setFormDates(e.value ?? null)}
                  dateFormat='dd/mm/yy'
                  inputClassName='border-0 focus:ring-0 cursor-pointer'
                  className='focus:ring-0'
                  placeholder='Select Date'
                />
              </div>
              {submitted && !fitnessDuration && (
                <small className='p-error'>Fitness Duration is required.</small>
              )}
            </div>

            <div className='field'>
              <label htmlFor='vehicleClass' className='font-bold'>
                Vehicle Class
              </label>
              <InputText
                id='vehicleClass'
                onChange={(e) => setvehicleClass(e.target.value)}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !itemName,
                })}
              />
              {submitted && !itemName && (
                <small className='p-error'>Vehicle Class is required.</small>
              )}
            </div>
            <div className='field'>
              <label htmlFor='vehicleName' className='font-bold'>
                Vehicle Name
              </label>
              <InputText
                id='vehicleName'
                onChange={(e) => setVehicleName(e.target.value)}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !itemName,
                })}
              />
              {submitted && !itemName && (
                <small className='p-error'>Vehicle Name is required.</small>
              )}
            </div>
            <div className='field'>
              <label htmlFor='chalanNo' className='font-bold'>
                Registration Number
              </label>
              <InputText
                id='chalanNo'
                onChange={(e) => setRegistrationNumber(e.target.value)}
                required
              />
            </div>

            {/* <div className='field'>
              <label htmlFor='quantity' className='font-bold'>
                Quantity
              </label>
              <InputText
                id='quantity'
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div> */}

            <div className='field'>
              <label htmlFor='taxToken' className='font-bold'>
                Tax and Token Report
              </label>
              <InputText
                id='taxToken'
                onChange={(e) => setTaxToken(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor='date' className='font-bold'>
                Road Tax Expiry Date
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

            <div className='field'>
              <label htmlFor='status' className='font-bold'>
                Status
              </label>
              <InputText
                id='status'
                onChange={(e) => setStatus(e.target.value)}
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
