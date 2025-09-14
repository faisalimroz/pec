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
import ButtonGroupWithIcons from '@/components/ui/commonbuttons'
import Wim from './limited-wim-data'

interface Attachment {
    url: string
    _id: string
}
interface Product {
    _id: string | null
    slNo: string
    fileName: string
    date: string
    description: string
    remarks: string
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
        fileName: '',
        date: '',
        description: '',
        remarks: '',
        attachments: [],
    }
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
    const [product, setProduct] = useState<any>(emptyProduct)
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [submitted, setSubmitted] = useState<boolean>(false)
    const dt = useRef<DataTable<Product[]>>(null)
    const [date, setDate] = useState<string>('')
    const [date2, setDate2] = useState<string>('')
    const [searchKey, setSearchKey] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loading2, setLoading2] = useState<boolean>(false)
    const [fileName, setfileName] = useState('')

    const [description, setDescription] = useState('')
    const [remarks, setRemarks] = useState('')
    const [filesInput, setFilesInput] = useState<File[]>([])
    const [formDate, setFormDate] = useState<string>('')
    const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)

    const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
    const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null)
    const [newAttachments, setNewAttachments] = useState<File[]>([])
    const [removedAttachments, setRemovedAttachments] = useState<string[]>([])

    // Fetch data based on active tab
    const fetchData = async () => {
        setLoading(true);
        if (activeTab === 'all') {
            const initialPayload = {
                month: '',
                year: '',
                searchQuery: '',
            };
            try {
                const result = await searchAssetManagement(initialPayload);
                setProducts(result?.Assets || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setProducts([]);
            }
        } else if (activeTab === 'wim') {
            // For WIM Data - set empty for now
            setProducts([]);
        }
        setLoading(false);
    };

    // Initial data load
    useEffect(() => {
        fetchData();
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
            formData.append('fileName', updatedProduct.fileName)
            formData.append('description', updatedProduct.description)
            formData.append('remarks', updatedProduct.remarks)
            formData.append('date', updatedProduct.date)

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

            fetchData()
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

            formData.append('fileName', fileName)
            formData.append('description', description)
            formData.append('remarks', remarks)
            formData.append('date', formatDate(formDate))
            filesInput.forEach((file) => {
                formData.append('attachments', file)
            })
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

            hideDialog()
            toast.success('Data Saved Successfully')
            fetchData()
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
                `${import.meta.env.VITE_BASE_URL}/api/v1/admin/asset-manage/delete/${product._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )

            fetchData()
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
            fetchData()
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
            <div className='flex items-center gap-4 '>

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
                            ? 'bg-[#0B1F8F] text-white'
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
                    <ButtonGroupWithIcons
                        selectedProducts={selectedProducts}
                        openNew={openNew}
                        exportCSV={exportCSV}
                        confirmDeleteSelected={confirmDeleteSelected}
                        handleReset={handleReset}
                    />
                )}
                {activeTab === 'wim' && (
                    <button
                        className="flex items-center gap-2  border border-[#E2E8F0]  bg-white text-[#0B1F8F] px-4 py-3 rounded-md font-bold"
                        onClick={handleReset}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2V6" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12 18V22" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4.92969 4.92969L7.75969 7.75969" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16.2383 16.2402L19.0683 19.0702" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M2 12H6" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M18 12H22" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4.92969 19.0702L7.75969 16.2402" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16.2383 7.75969L19.0683 4.92969" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        Refresh
                    </button>
                )}
            </>
        )
    }

    //   const ServiceAreaButtons = () => {
    //     const [activeButton, setActiveButton] = useState('All')

    //     const buttons = [
    //       { label: 'All', value: 'All' },
    //       { label: 'Service Area 1', value: 'Service Area 1' },
    //       { label: 'Service Area 2', value: 'Service Area 2' },
    //       { label: 'Service Area 3', value: 'Service Area 3' },
    //       { label: 'Mawa', value: 'Mawa' },
    //       { label: 'Janjira', value: 'Janjira' },
    //     ]

    //     const handleButtonClick = (buttonValue: string) => {
    //       setActiveButton(buttonValue)
    //       console.log(`Button clicked: ${buttonValue}`)
    //     }

    //     return (
    //       <div className='flex items-center space-x-2 py-2 rounded-lg'>
    //         {buttons.map((button) => (
    //           <button
    //             key={button.value}
    //             onClick={() => handleButtonClick(button.value)}
    //             className={`
    //               px-6 py-3 font-semibold rounded-lg transition-colors duration-200 ease-in-out
    //               ${activeButton === button.value
    //                 ? 'bg-[#6F90AE] text-base font-semibold text-white'
    //                 : 'bg-main text-base font-semibold text-white'
    //               }
    //             `}
    //           >
    //             {button.label}
    //           </button>
    //         ))}
    //       </div>
    //     )
    //   }

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

    function getMonthName(dateString: string) {
        const date = new Date(dateString)
        return date.toLocaleString('en-US', { month: 'long' })
    }

    function getYear(dateString: string) {
        const date = new Date(dateString)
        return date.getFullYear()
    }

    const handleSearch = () => {
        if (activeTab !== 'all') return;

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
        if (activeTab !== 'all') return;

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

    const attachmentBodyTemplate = (rowData: any) => {
        return <div>{rowData?.attachments?.length}</div>
    }

    return (
        <div>

            {activeTab === 'wim' && (
                <div className='mt-2 ml-4'>
                    <div>

                        <Toolbar
                            className='rounded-none border-none p-0 '
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
                                    field='fileName'
                                    headerClassName='bg-[#ffc2c2] text-sm'
                                    bodyClassName='text-sm truncate max-w-xs'
                                    sortable
                                    header='File Name/Subject'
                                ></Column>

                                <Column
                                    field='date'
                                    headerClassName='bg-[#ffc2c2] text-sm'
                                    bodyClassName='text-sm truncate max-w-xs'
                                    header='Date'
                                ></Column>

                                <Column
                                    field='description'
                                    headerClassName='bg-[#ffc2c2] text-sm'
                                    bodyClassName='text-sm truncate max-w-xs'
                                    header='Description'
                                ></Column>

                                <Column
                                    body={attachmentBodyTemplate}
                                    headerClassName='bg-[#ffc2c2] text-sm'
                                    bodyClassName='text-sm truncate max-w-xs'
                                    header='Attachment'
                                ></Column>

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
                                            <h3 className='font-bold'>File Name/Subject</h3>
                                            <p className='break-all'>{selectedProduct.fileName}</p>
                                        </div>
                                        <div>
                                            <h3 className='font-bold'>Description</h3>
                                            <p className='break-all'>{selectedProduct.description}</p>
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
                                    <div className='field'>
                                        <label htmlFor='fileName' className='font-bold'>
                                            File Name/Subject
                                        </label>
                                        <InputText
                                            id='fileName'
                                            onChange={(e) => setfileName(e.target.value)}
                                            required
                                            autoFocus
                                            className={classNames({
                                                'p-invalid': submitted && !fileName,
                                            })}
                                        />
                                        {submitted && !fileName && (
                                            <small className='p-error'>File Name/ Subject is required.</small>
                                        )}
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

                                    <div>
                                        <label htmlFor='date' className='font-bold'>
                                            Date
                                        </label>
                                        <div className='border rounded-md'>
                                            <Calendar
                                                id='date'
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
                </div>
            )}

        </div>

    )
}