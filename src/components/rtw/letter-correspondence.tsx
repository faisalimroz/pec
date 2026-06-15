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
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
import { TabView, TabPanel } from 'primereact/tabview'
import { Dropdown } from 'primereact/dropdown'
import MultiFileInput from '@/components/MultiFileInput'
import { Menu } from 'primereact/menu'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import FileIcon from '@/components/icons/FileIcon'
import ButtonGroupWithIcon from '../ui/common-all-buttons'
import { searchOfficialLetters } from '@/api/rtwAPIs'
import { Checkbox } from 'primereact/checkbox';
import { useLocation } from 'react-router-dom'
interface Attachment {
    url: string
    _id: string
}
interface Product {
    _id: string | null
    slNo: string
    fileName: string
    refNo: string
    sender: string
    description: string
    statusType: string
    date: string
    remarks: string
    attachments: Attachment[]
    creator?: string
    creationTimestamp?: string
    updater?: string
    approved: boolean;
    updatingTimestamp?: string
}

export default function MedicineInOutRecord() {
    let emptyProduct: Product = {
        _id: '',
        slNo: '',
        fileName: '',
        refNo: '',
        description: '',
        sender: '',
        statusType: '',
        date: '',
        remarks: '',
        approved: false,
        attachments: [],
    }

    const { pathname } = useLocation();
    const showAll = pathname.startsWith('/edms');

    const { roles, permissions } = useAuth()
    const rtwManagerPermission = permissions.find((p) => p.name === 'rtw-manager');
    const rtwPermission = rtwManagerPermission?.children?.find((child) => child.name === 'rtw-additional-notes');
    const hasEditAccess = rtwPermission?.edit_authority === true;
    const [activeIndex, setActiveIndex] = useState(0)
    const [products, setProducts] = useState<any>([])
    const [productDialog, setProductDialog] = useState<boolean>(false)
    const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)
    const [deleteProductsDialog, setDeleteProductsDialog] = useState<boolean>(false)
    const [product, setProduct] = useState<any>(emptyProduct)
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [submitted, setSubmitted] = useState<boolean>(false)
    const dt = useRef<DataTable<Product[]>>(null)
    const [selectedCode, setSelectedCode] = useState<{ name: string; code: string } | null>(null)
    const [date, setDate] = useState<Date | null>(null)
    const [date2, setDate2] = useState<Date | null>(null)
    const [searchKey, setSearchKey] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loading2, setLoading2] = useState<boolean>(false)
    const [fileName, setFileName] = useState('')
    const [refNo, setRefNo] = useState('')
    const [description, setDescription] = useState('')
    const [approved, setApproved] = useState<boolean>(false);
    const [sender, setSender] = useState('')

    const [remarks, setRemarks] = useState('')
    const [statusType, setInOutType] = useState<string>('')
    const [formDate, setFormDate] = useState<string>('')
    const [filesInput, setFilesInput] = useState<File[]>([])

    const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)

    const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
    const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null)
    const [newAttachments, setNewAttachments] = useState<File[]>([])
    const [removedAttachments, setRemovedAttachments] = useState<string[]>([])
    const [bulkDialog, setBulkDialog] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
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
            formData.append('statusType', updatedProduct.statusType)
            formData.append('fileName', updatedProduct.fileName)
            formData.append('refNo', updatedProduct.refNo)
            formData.append('description', updatedProduct.description)
            formData.append('approved', updatedProduct.approved ? 'true' : 'false')
            formData.append('sender', updatedProduct.sender)
            formData.append('remarks', updatedProduct.remarks)
            formData.append('date', updatedProduct.date)

            newAttachments.forEach((file) => {
                formData.append('attachments', file)
            })

            removedAttachments.forEach((attachmentId) => {
                formData.append('removedAttachments', attachmentId)
            })

            const res = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/api/v1/rtw/letter-and-official-correspondence/update/by/${updatedProduct._id}`,
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
    const itemTemplate = (option: { name: string; code: string }) => {
        return (
            <div className="flex items-center gap-2">
                <FileIcon />
                <span>{option.name}</span>
            </div>
        );
    };

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
                `${import.meta.env.VITE_BASE_URL}/api/v1/rtw/letter-and-official-correspondence/bulk-upload`,
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

    // ending all update dialog funcs

    const codes = [
        { name: 'Approved', code: 'Approved' },
        { name: 'Decline', code: 'Decline' },
        { name: 'Not Applicable', code: 'Not Applicable' },
    ]

    const handleFileChange = (newFiles: File[]) => {
        setFilesInput(newFiles)
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
        // --- 1. VALIDATION SHORTCUT ---
        const requiredFields = [
            { value: fileName, name: 'File Name' },
            { value: refNo, name: 'Reference No' },
            { value: description, name: 'Description' },
            { value: sender, name: 'Sender' },
            { value: remarks, name: 'Remarks' },
            { value: statusType, name: 'Status Type' },
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

            formData.append('fileName', fileName)
            formData.append('refNo', refNo)
            formData.append('description', description)
            formData.append('sender', sender)
            formData.append('remarks', remarks)
            formData.append('statusType', statusType)
            formData.append('approved', approved ? 'true' : 'false');
            formData.append('date', formatDate(formDate))

            // Append files only if they exist
            if (filesInput && filesInput.length > 0) {
                filesInput.forEach((file) => {
                    formData.append('attachments', file)
                })
            }

            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/rtw/letter-and-official-correspondence/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            // --- 2. RESET ALL FIELDS HERE ---
            setFileName('')
            setRefNo('')
            setDescription('')
            setSender('')
            setRemarks('')
            setInOutType('')
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

    const editProduct = (product: Product) => {
        setProduct({ ...product })
        setProductDialog(true)
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
                `${import.meta.env.VITE_BASE_URL}/api/v1/rtw/letter-and-official-correspondence/delete/by/${product._id}`,
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
        if (selectedProducts && selectedProducts.length > 0) {
            dt.current?.exportCSV({ selectionOnly: true })
        } else {
            dt.current?.exportCSV()
        }
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
                `${import.meta.env.VITE_BASE_URL}/api/v1/rtw/letter-and-official-correspondence/delete-multiple`,
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

    const leftToolbarTemplate = () => {
        return (
            <div className='flex items-center gap-3'>
                <div className='px-2 py-2 bg-main text-sm font-semibold text-white rounded-lg'>
                    Document List
                </div>

            </div>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <>
                {hasEditAccess && (
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



    const handleSearch = () => {
        setLoading(true)
        const payload = {
            statusType: selectedCode?.code || '',
            date_range: date && date2 ? `${formatDate(date)} to ${formatDate(date2)}` : '',
            searchQuery: searchKey,

        }
        console.log(payload, 'hello')
        searchOfficialLetters(payload).then((result) => {
            const rows = Array.isArray(result?.data) ? result.data : [];
            setProducts(rows)
            setLoading(false)
        })
    }

    const handleReset = () => {
        setLoading(true)
        const payload = {
            statusType: '',
            date_range: '',
            searchQuery: '',
        }

        setDate(null)
        setDate2(null)
        setSearchKey('')
        setSelectedCode(null)

        searchOfficialLetters(payload).then((result) => {
            const rows = Array.isArray(result?.data) ? result.data : [];
            setProducts(rows)
            setLoading(false)
        })
    }

    const refetch = () => {
        setLoading(true)

        const payload = {
            statusType: '',
            date_range: '',
            searchQuery: '',
        }

        searchOfficialLetters(payload).then((result) => {
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
        <div className='flex items-center justify-center'>
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
                    value={date}
                    // @ts-ignore
                    onChange={(e) => setDate(e.value)}

                    dateFormat="dd/mm/yy"
                    inputClassName="text-xs border-0 focus:ring-0 py-1.5 px-3 w-32"
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
                    inputClassName="text-xs border-0 focus:ring-0 py-1.5 px-3 w-32"
                    placeholder='End Date'
                    showIcon
                    icon={() => <i className='pi pi-angle-down' />}
                />
                <div>
                    <Dropdown
                        value={selectedCode}
                        onChange={(e) => setSelectedCode(e.value)}
                        options={codes}
                        optionLabel='name'
                        placeholder='Status'
                        className='border-none rounded-none ml-4 cursor-pointer ring-0'
                        itemTemplate={itemTemplate}

                    />
                </div>
                <IconField iconPosition='left' className='relative'>
                    <InputIcon className="pi pi-search text-sm" />
                    <InputText
                        type='search'
                        placeholder='Search'
                        className="text-xs border-0 focus:ring-0 py-3.5 pl-8 pr-4 w-48"
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

    // console.log(products)

    return (
        <div className=''>
            <div className='ml-4'>
                <Toolbar
                    className='rounded-none border-none p-0 bg-background'
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
                            loading={loading}
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
                             <Column
                                field='refNo'
                                header='Ref No.'
                                headerClassName='bg-[#ffc2c2] text-sm'
                                bodyClassName='text-sm truncate max-w-xs'
                                className='min-w-[10rem]'
                                sortable
                            ></Column>

                            <Column
                                field='date'
                                header='Date'
                                sortable
                                sortFunction={(e) => {

                                    return e.data.sort((a, b) => {

                                        const formatForMath = (dateString: string) => {
                                            if (!dateString) return 0; // Fallback for empty cells
                                            const [day, month, year] = dateString.split('-');
                                            return parseInt(`${year}${month}${day}`, 10);
                                        };

                                        return (formatForMath(a.date) - formatForMath(b.date)) * (e.order || 1);
                                    });
                                }}
                                headerClassName='bg-[#ffc2c2] text-sm'
                                bodyClassName='text-sm truncate max-w-xs'
                                className='min-w-[12rem]'
                            ></Column>

                            <Column
                                field='fileName'
                                headerClassName='bg-[#ffc2c2] text-sm'
                                bodyClassName='text-sm truncate max-w-xs'

                                className='min-w-[8rem]'
                                header='File Name/Subject'
                            ></Column>
                            <Column
                                field='description'
                                headerClassName='bg-[#ffc2c2] text-sm'
                                bodyClassName='text-sm truncate max-w-xs'

                                className='min-w-[8rem]'
                                header='Description'
                            ></Column>
                            <Column
                                field='sender'
                                headerClassName='bg-[#ffc2c2] text-sm'
                                bodyClassName='text-sm truncate max-w-xs'

                                className='min-w-[8rem]'
                                header='Sender'
                            ></Column>



                            <Column
                                field='statusType'
                                headerClassName='bg-[#ffc2c2] text-sm'
                                bodyClassName='text-sm truncate max-w-xs'

                                className='min-w-[8rem]'
                                header='Status'
                            ></Column>



                            <Column
                                body={attachmentBodyTemplate}
                                headerClassName='bg-[#ffc2c2] text-sm'
                                bodyClassName='text-sm truncate max-w-xs'

                                className='min-w-[12rem]'
                                header='Attachment'
                            ></Column>

                            <Column
                                field='remarks'
                                headerClassName='bg-[#ffc2c2] text-sm'
                                bodyClassName='text-sm truncate max-w-xs'

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
                    </TabPanel>
                </TabView>
            </div>
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
            {/* update data dialog  */}
            <Dialog
                visible={updateProductDialog}
                style={{ width: '60rem' }}
                header='Update Document'
                modal
                className='p-fluid'
                footer={updateProductDialogFooter}
                onHide={hideUpdateDialog}
            >
                {updatedProduct && (
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='field'>
                            <label htmlFor='statusType' className='font-bold'>
                                Status
                            </label>
                            <Dropdown
                                id='statusType'
                                value={updatedProduct.statusType}
                                options={codes}
                                onChange={(e) =>
                                    setUpdatedProduct({
                                        ...updatedProduct,
                                        statusType: e.target.value,
                                    })
                                }
                                optionLabel="name"
                                optionValue='name'
                                itemTemplate={itemTemplate}
                                placeholder='Select status'
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor='refNo' className='font-bold'>
                                Ref No
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
                            <label htmlFor='fileName' className='font-bold'>
                                File Name/Subject
                            </label>
                            <InputText
                                id='fileName'
                                value={updatedProduct.fileName}
                                onChange={(e) =>
                                    setUpdatedProduct({
                                        ...updatedProduct,
                                        fileName: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor='description' className='font-bold'>
                                Description
                            </label>
                            <InputText
                                id='description'
                                value={updatedProduct.description}
                                onChange={(e) =>
                                    setUpdatedProduct({
                                        ...updatedProduct,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor='sender' className='font-bold'>
                                Sender
                            </label>
                            <InputText
                                id='sender'
                                value={updatedProduct.sender}
                                onChange={(e) =>
                                    setUpdatedProduct({
                                        ...updatedProduct,
                                        sender: e.target.value,
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
                                <h3 className='font-bold'>SL No.</h3>
                                <p className='break-all'>{selectedProduct.slNo}</p>
                            </div>
                            <div>
                                <h3 className='font-bold'>Date</h3>
                                <p>{selectedProduct.date}</p>
                            </div>
                            <div>
                                <h3 className='font-bold'>File Name/Subject</h3>
                                <p className='break-all'>{selectedProduct.fileName}</p>
                            </div>
                            <div>
                                <h3 className='font-bold'>status</h3>
                                <p className='break-all'>{selectedProduct.statusType}</p>
                            </div>
                            <div>
                                <h3 className='font-bold'>Ref No.</h3>
                                <p className='break-all'>{selectedProduct.refNo}</p>
                            </div>
                            <div>
                                <h3 className='font-bold'>Description</h3>
                                <p className='break-all'>{selectedProduct.description}</p>
                            </div>
                            <div>
                                <h3 className='font-bold'>Sender</h3>
                                <p className='break-all'>{selectedProduct.sender}</p>
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
                          onClick={() =>
                            window.open(attachment.url, '_blank')
                          }
                          className='p-button-text p-button-rounded flex-shrink-0'
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                            <label htmlFor='statusType' className='font-bold'>
                                Status
                            </label>
                            <Dropdown
                                id='statusType'
                                value={statusType}
                                options={codes}
                                onChange={(e) => setInOutType(e.value)}
                                placeholder='Status'
                                itemTemplate={itemTemplate}
                                optionLabel='name'
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor='refNo' className='font-bold'>
                                Ref No
                            </label>
                            <InputText
                                id='refNo'
                                onChange={(e) => setRefNo(e.target.value)}
                                required
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor='description' className='font-bold'>
                                Description
                            </label>
                            <InputText
                                id='description'
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor='sender' className='font-bold'>
                                Sender
                            </label>
                            <InputText
                                id='sender'
                                onChange={(e) => setSender(e.target.value)}
                                required
                            />
                        </div>

                        <div className='field'>
                            <label htmlFor='fileName' className='font-bold'>
                                File Name/Subject
                            </label>
                            <InputText
                                id='fileName'
                                onChange={(e) => setFileName(e.target.value)}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !fileName,
                                })}
                            />
                            {submitted && !fileName && (
                                <small className='p-error'>File Name/Subject is required.</small>
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
                    </div>

                    <div className='gap-3 mt-5'>
                        <label className='block mb-1 font-semibold'>
                            Upload Document
                            
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
