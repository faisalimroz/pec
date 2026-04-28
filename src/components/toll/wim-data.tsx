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
import axios from 'axios'
import MultiFileInput from '@/components/MultiFileInput'
import { Menu } from 'primereact/menu'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { Dropdown } from 'primereact/dropdown';
import ButtonGroupWithIcons from '@/components/ui/commonbuttons'
import Wim from './limited-wim-data'
import { searchAllWimData } from '@/api/tollApi'
import { Checkbox } from 'primereact/checkbox'
import { useLocation } from 'react-router-dom'
import ButtonGroupWithIcon from '../ui/common-all-buttons'

interface Attachment {
    url: string
    _id: string
}
interface Product {
    _id: string | null
    slNo: string
    location: string
    pass: string
    violation: string
    total: string
    date: string
    shiftName: string
    remarks: string
    approved: boolean;
    attachments: Attachment[]
    creator?: string
    creationTimestamp?: string
    updater?: string
    updatingTimestamp?: string
}

export default function AssetManagementTable() {
    const [activeTab, setActiveTab] = useState<'all' | 'wim'>('all');
    let emptyProduct: Product = {
        _id: '',
        slNo: '',
        location: '',
        date: '',
        shiftName: '',
        pass: '',
        violation: '',
        total: '',
         approved: false,
        remarks: '',
        attachments: [],
    }
    const { roles, permissions } = useAuth()
        const { pathname } = useLocation();
     const showAll = pathname.startsWith('/edms');

    const tollManagerPermission = permissions.find((p) => p.name === 'toll-manager');
    const tollPermission = tollManagerPermission?.children?.find((child) => child.name === 'toll-wim-data');
    const hasEditAccess = tollPermission?.edit_authority === true && !showAll;
    const locations = [

        { label: 'Mawa', value: 'Mawa' },
        { label: 'Janjira', value: 'Janjira' },
    ]
    const shifts = [
        { label: 'Shift: 3rd-2', value: 'Shift: 3rd-2' },
        { label: 'Shift: 1st', value: 'Shift: 1st' },
        { label: 'Shift: 2nd', value: 'Shift: 2nd' },
        { label: 'Shift: 3rd-1', value: 'Shift: 3rd-1' },
    ]
    const itemTemplate = (option: { label: string; value: string }) => {
        return (
            <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M10.5 2.16406H4.5C4.10218 2.16406 3.72064 2.3221 3.43934 2.6034C3.15804 2.88471 3 3.26624 3 3.66406V15.6641C3 16.0619 3.15804 16.4434 3.43934 16.7247C3.72064 17.006 4.10218 17.1641 4.5 17.1641H13.5C13.8978 17.1641 14.2794 17.006 14.5607 16.7247C14.842 16.4434 15 16.0619 15 15.6641V6.66406L10.5 2.16406Z" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10.5 2.16406V6.66406H15" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 10.4141H6" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 13.4141H6" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7.5 7.41406H6.75H6" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>{option.label}</span>
            </div>
        );
    };
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
    const [location, setlocation] = useState('')
   const [uploading, setUploading] = useState(false)
     const [file, setFile] = useState<File | null>(null)
    const [uploadStatus, setUploadStatus] = useState("")
     const [bulkDialog, setBulkDialog] = useState(false)
    const [shiftName, setShiftName] = useState('')
    const [pass, setPass] = useState('')
    const [violation, setViolation] = useState('')
    // const [total, setTotal] = useState('')
    const [remarks, setRemarks] = useState('')
    const [filesInput, setFilesInput] = useState<File[]>([])
    const [formDate, setFormDate] = useState<string>('')
    const [approved, setApproved] = useState<boolean>(false);
    const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<{ label: string; value: string } | null>(null)
    const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [selectedShift, setSelectedShift] = useState<{ label: string; value: string } | null>(null)
    const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
    const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null)
    const [newAttachments, setNewAttachments] = useState<File[]>([])
    const [removedAttachments, setRemovedAttachments] = useState<string[]>([])


    useEffect(() => {
        refetch();
    }, [activeTab]);

    // Update dialog functions
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
            const total = String(Number(updatedProduct.pass || 0) + Number(updatedProduct.violation || 0))
            formData.append('location', updatedProduct.location)
            formData.append('pass', updatedProduct.pass)
            formData.append('violation', updatedProduct.violation)
            formData.append('total', total)
            formData.append('shiftName', updatedProduct.shiftName)
            formData.append('remarks', updatedProduct.remarks)
            formData.append('date', updatedProduct.date)
    formData.append('approved', updatedProduct.approved ? 'true' : 'false')
            newAttachments.forEach((file) => {
                formData.append('attachments', file)
            })

            removedAttachments.forEach((attachmentId) => {
                formData.append('removedAttachments', attachmentId)
            })

            const res = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/api/v1/toll/all-wim-data/update/by/${updatedProduct._id}`,
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/all-wim-data/bulk-upload`,
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
      refetch()
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

    function formatDate(dateTime?: any) {
        if (!dateTime) return ''
        const date = new Date(dateTime)

        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()

        return `${day}-${month}-${year}`
    }

 const saveProduct = async () => {
        // --- 1. VALIDATION SHORTCUT ---
        const requiredFields = [
            { value: location, name: 'Location' },
            { value: shiftName, name: 'Shift Name' },
            { value: pass, name: 'Pass' },
            { value: violation, name: 'Violation' },
            { value: remarks, name: 'Remarks' },
            { value: formDate, name: 'Date' }
        ];

        for (const field of requiredFields) {
            if (!field.value) {
                toast.warning(`${field.name} is required!`);
                return;
            }
        }

        try {
            setLoading2(true)
            const formData = new FormData()

        
            const total = String(Number(pass || 0) + Number(violation || 0))

            formData.append('location', location)
            formData.append('shiftName', shiftName)
            formData.append('pass', pass)
            formData.append('violation', violation)
            formData.append('total', total)
            formData.append('remarks', remarks)
            formData.append('approved', approved ? 'true' : 'false');
            formData.append('date', formatDate(formDate))

            if (filesInput && filesInput.length > 0) {
                filesInput.forEach((file) => {
                    formData.append('attachments', file)
                })
            }

            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/toll/all-wim-data/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            // --- 2. RESET ALL FIELDS HERE ---
            setlocation('')
            setShiftName('')
            setPass('')
            setViolation('')
            setRemarks('')
            setApproved(false)
            setFormDate('')
            setFilesInput([])

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
                `${import.meta.env.VITE_BASE_URL}/api/v1/toll/all-wim-data/delete/by/${product._id}`,
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

        setDeleteProductDialog(false)
        setProduct(emptyProduct)
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
                `${import.meta.env.VITE_BASE_URL}/api/v1/toll/all-wim-data/delete-multiple`,
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

    const leftToolbarTemplate = () => {
        return (
            <div className='flex items-center gap-4  '>

                <div className='flex gap-2'>
                    <button
                        className={`py-3 px-4 rounded-md font-semibold ${activeTab === 'all'
                            ? 'bg-[#0B1F8F] text-white'
                            : 'bg-white text-black'
                            }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                    <button
                        className={`py-3 px-4 rounded-md font-semibold ${activeTab === 'wim'
                            ? 'bg-[#0B1F8F] text-white border border-gray-200'
                            : 'bg-white text-black'
                            }`}
                        onClick={() => setActiveTab('wim')}
                    >
                        WIM Data
                    </button>
                </div>
            </div>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <>
                {hasEditAccess && activeTab === 'all' && (
                    <ButtonGroupWithIcon
            selectedProducts={selectedProducts}
            openNew={openNew}
            openNew2={openNew2}
            exportCSV={exportCSV}
            confirmDeleteSelected={confirmDeleteSelected}
          />

                )}

                <RefreshButton handleReset={handleReset} />


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

    const viewProductDialogFooter = (
        <>
            <Button
                label='Close'
                icon='pi pi-times'
                outlined
                onClick={hideViewDialog}
            />
        </>
    )



    const handleSearch = () => {
        if (activeTab !== 'all') return;

        setLoading(true)
        const payload = {
            shiftName: selectedShift || '',
            location: selectedLocation || '',
            date_range: date && date2 ? `${formatDate(date)} to ${formatDate(date2)}` : '',
            searchQuery: searchKey,

        }
        console.log(payload, 'hello')
        searchAllWimData(payload).then((result) => {
           const rows = Array.isArray(result?.data) ? result.data : [];
            setProducts(rows)
            setLoading(false)
        })
    }

    const handleReset = () => {
        if (activeTab !== 'all') return;

        const payload = {
            shiftName: selectedShift?.label || '',
            location: selectedLocation?.label || '',
            date_range: '',
            searchQuery: '',
        }
        setDate('')
        setDate2('')
        setSearchKey('')
        setlocation('')
        setShiftName('')
        searchAllWimData(payload).then((result) => {
           const rows = Array.isArray(result?.data) ? result.data : [];
            setProducts(rows)
            setLoading(false)
        })
    }
    const refetch = () => {
        setLoading(true)

        const payload = {
            shiftName: '',
            location: '',
            date_range: '',
            searchQuery: '',
        }

        searchAllWimData(payload).then((result) => {
              const rows = Array.isArray(result?.data) ? result.data : [];
            setProducts(rows)
            setLoading(false)
        })
    }
    // initial data load - Internal
    useEffect(() => {
        refetch()
    }, [])
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

                dateFormat="dd/mm/yy"
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

                dateFormat="dd/mm/yy"
                inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
                placeholder='End Date'
                showIcon
                icon={() => <i className='pi pi-angle-down' />}
            />

            <Dropdown
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.value)}
                options={shifts}
                optionLabel="label"
                placeholder="Shift"
                itemTemplate={itemTemplate}

                className='border-none rounded-none ml-4 cursor-pointer ring-0'
            />

            <Dropdown
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.value)}
                options={locations}
                optionLabel="label"
                placeholder="Location"
                itemTemplate={itemTemplate}
                className='border-none rounded-none ml-4 cursor-pointer ring-0'
            />


            <IconField iconPosition='left' className='relative '>
                <InputIcon className='pi pi-search' />
                <InputText
                    type='search'
                    placeholder='Search'
                    className='border-none ml-2 focus:ring-0 w-36'
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

    const attachmentBodyTemplate = (rowData: any) => {
        return <div>{rowData?.attachments?.length}</div>
    }

    return (
        <div className='bg-[#F6F8F9]'>

            {activeTab === 'wim' && (
                <div className='mt-2 ml-4 bg-[#F6F8F9]'>
                    <div>

                        <Toolbar
                            className='rounded-none border-none p-0 bg-[#F6F8F9]'
                            left={leftToolbarTemplate}
                            right={rightToolbarTemplate}
                        ></Toolbar>
                        <Wim />

                    </div>
                </div>
            )}

            {activeTab === 'all' && (
                <div className='mt-2'>
                    <div className='ml-4'>
                        <div className='card'>

                            <Toolbar
                                className='rounded-none border-none p-0 '
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
                                header={activeTab === 'all' ? filterSearchForm : null}
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
                                    field='date'
                                    headerClassName='bg-[#ffc2c2] text-sm'
                                    bodyClassName='text-sm truncate max-w-xs'
                                    header='Date'
                                ></Column>




                                <Column
                                    field='shiftName'
                                    headerClassName='bg-[#ffc2c2] text-sm'
                                    bodyClassName='text-sm truncate max-w-xs'
                                    header='Shift Name'
                                ></Column>
                                <Column
                                    field='location'
                                    headerClassName='bg-[#ffc2c2] text-sm'
                                    bodyClassName='text-sm truncate max-w-xs'

                                    header='Location'
                                ></Column>
                                <Column
                                    field='pass'
                                    headerClassName='bg-[#ffc2c2] text-sm'
                                    bodyClassName='text-sm truncate max-w-xs'

                                    header='Pass'
                                ></Column>
                                <Column
                                    field='violation'
                                    headerClassName='bg-[#ffc2c2] text-sm'
                                    bodyClassName='text-sm truncate max-w-xs'

                                    header='Violation'
                                ></Column>
                                <Column
                                    field='total'
                                    headerClassName='bg-[#ffc2c2] text-sm'
                                    bodyClassName='text-sm truncate max-w-xs'
                                  
                                    header='Total'
                                ></Column>
                                {/* <Column
                                    body={attachmentBodyTemplate}
                                    headerClassName='bg-[#ffc2c2] text-sm'
                                    bodyClassName='text-sm truncate max-w-xs'
                                    header='Attachment'
                                ></Column> */}

                                <Column
                                    field='remarks'
                                    header='Remarks'
                                    headerClassName='bg-[#ffc2c2] text-sm'
                                    bodyClassName='text-sm truncate max-w-xs'
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

                        {/* Update data dialog */}
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
                                    <div className="field">
                                        <label htmlFor="location" className="font-bold">
                                            Location
                                        </label>

                                        <Dropdown
                                            id="location"
                                            value={updatedProduct.location}
                                            onChange={(e) =>
                                                setUpdatedProduct({
                                                    ...updatedProduct,
                                                    location: e.value,
                                                })
                                            }
                                            options={locations}
                                            optionLabel="label"
                                            placeholder="Select a Location"
                                            className="w-full"
                                            itemTemplate={itemTemplate}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="shiftName" className="font-bold">
                                            Shift Name
                                        </label>

                                        <Dropdown
                                            id="shiftName"
                                            value={updatedProduct.shiftName}
                                            onChange={(e) =>
                                                setUpdatedProduct({
                                                    ...updatedProduct,
                                                    shiftName: e.value,
                                                })
                                            }
                                            options={shifts}
                                            optionLabel="label"
                                            placeholder="Select a Shift"
                                            className="w-full"
                                            itemTemplate={itemTemplate}
                                        />
                                    </div>

                                    <div className='field'>
                                        <label htmlFor='pass' className='font-bold'>
                                            Pass
                                        </label>
                                        <InputText
                                            id='pass'
                                            value={updatedProduct.pass}
                                            onChange={(e) =>
                                                setUpdatedProduct({
                                                    ...updatedProduct,
                                                    pass: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className='field'>
                                        <label htmlFor='violation' className='font-bold'>
                                            Violation
                                        </label>
                                        <InputText
                                            id='violation'
                                            value={updatedProduct.violation}
                                            onChange={(e) =>
                                                setUpdatedProduct({
                                                    ...updatedProduct,
                                                    violation: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className='field'>
                                        <label htmlFor='total' className='font-bold'>
                                            Total
                                        </label>
                                        <InputText
                                            id='total'
                                            value={String(Number(updatedProduct.pass || 0) + Number(updatedProduct.violation || 0))}
                                            readOnly
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
                                    <div className="col-span-2 mt-2">
                            <label className="font-bold mb-2 block">Approval</label>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    inputId="update-approve"                                
                                    checked={updatedProduct.approved}
                                    onChange={(e) =>
                                        setUpdatedProduct({
                                            ...updatedProduct,
                                            approved: !!e.checked,
                                        })
                                    }
                                />
                                <label htmlFor="update-approve" className="text-sm">
                                    Add this document for all (Approve)
                                </label>
                            </div>
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
                                                        </                      p>
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
                                            <h3 className='font-bold'>Date</h3>
                                            <p>{selectedProduct.date}</p>
                                        </div>

                                        <div>
                                            <h3 className='font-bold'>Location</h3>
                                            <p className='break-all'>{selectedProduct.location}</p>
                                        </div>
                                        <div>
                                            <h3 className='font-bold'>Violation</h3>
                                            <p className='break-all'>{selectedProduct.violation}</p>
                                        </div>
                                        <div>
                                            <h3 className='font-bold'>Pass</h3>
                                            <p className='break-all'>{selectedProduct.pass}</p>
                                        </div>
                                        <div>
                                            <h3 className='font-bold'>Total</h3>
                                            <p className='break-all'>{selectedProduct.total}</p>
                                        </div>
                                        <div>
                                            <h3 className='font-bold'>Shift Name</h3>
                                            <p className='break-all'>{selectedProduct.shiftName}</p>
                                        </div>

                                        <div>
                                            <h3 className='font-bold'>Remarks</h3>
                                            <p className='break-all'>{selectedProduct.remarks}</p>
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
                                    <div className="field">
                                        <label htmlFor="location" className="font-bold">
                                            Location
                                        </label>

                                        <Dropdown
                                            id="location"
                                            value={location}
                                            onChange={(e) => setlocation(e.value)}
                                            options={locations}
                                            optionLabel="label"
                                            placeholder="Select a Location"
                                            className={classNames({
                                                'p-invalid': submitted && !location,
                                            })}
                                            itemTemplate={itemTemplate}
                                        />

                                        {submitted && !location && (
                                            <small className="p-error">Location is required.</small>
                                        )}
                                    </div>

                                    <div className="field">
                                        <label htmlFor="shiftName" className="font-bold">
                                            Shift Name
                                        </label>

                                        <Dropdown
                                            id="shiftName"
                                            value={shiftName}
                                            onChange={(e) => setShiftName(e.value)}
                                            options={shifts}
                                            optionLabel="label"
                                            placeholder="Select a Shift"
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !shiftName,
                                            })}
                                            itemTemplate={itemTemplate}
                                        />

                                        {submitted && !shiftName && (
                                            <small className="p-error">Shift name is required.</small>
                                        )}
                                    </div>

                                    <div className='field hidden'>
                                        <label htmlFor='total' className='font-bold'>
                                            Total (Auto)
                                        </label>
                                        <InputText
                                            id='total'
                                            value={String(Number(pass || 0) + Number(violation || 0))}
                                            readOnly
                                        />
                                    </div>
                                    <div className='field'>
                                        <label htmlFor='pass' className='font-bold'>
                                            Pass
                                        </label>
                                        <InputText
                                            id='pass'
                                            onChange={(e) => setPass(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className='field'>
                                        <label htmlFor='violtaion' className='font-bold'>
                                            Violation
                                        </label>
                                        <InputText
                                            id='violtaion'
                                            onChange={(e) => setViolation(e.target.value)}
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
                                                onChange={(e) => setFormDate(e.value as string)}
                                                dateFormat='dd/mm/yy'
                                                inputClassName='border-0 focus:ring-0 cursor-pointer'
                                                className='focus:ring-0'
                                                placeholder='Select Date'
                                            />
                                        </div>
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
                                        <MultiFileInput onFilesChange={handleFileChange} />
                                    </div>
                                </div>
                                 <div className="col-span-2 mt-2">
                        <label className="font-bold mb-2 block">Approval</label>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                inputId="approve"
                                checked={approved}
                                onChange={(e) => setApproved(!!e.checked)}
                            />
                            <label htmlFor="approve" className="text-sm">
                                Add this document for all
                            </label>
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
                </div>
            )}

        </div>

    )
}