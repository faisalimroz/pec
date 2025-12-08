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
import { searchRTKec } from '@/api/adminAPIs'
import axios from 'axios'
import { toast } from 'sonner'
import { TabView, TabPanel } from 'primereact/tabview'
import { Dropdown } from 'primereact/dropdown'
import MultiFileInput from '@/components/MultiFileInput'
import { Menu } from 'primereact/menu'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import ButtonGroupWithIcons from '@/components/ui/commonbuttons'
import { Checkbox } from 'primereact/checkbox'
import { useLocation } from 'react-router-dom';
interface Attachment {
    url: string
    _id: string
}
interface Product {
    _id: string | null
    slNo: string
    subjectName: string
    description: string
    date: string
    remarks: string
    attachments: Attachment[]
    approved: boolean
    creator?: string
    creationTimestamp?: string
    updater?: string
    updatingTimestamp?: string
}

export default function KecLetter() {
    let emptyProduct: Product = {
        _id: '',
        slNo: '',
        subjectName: '',
        description: '',
        approved: false,
        date: '',
        remarks: '',
        attachments: [],
    }
const { pathname } = useLocation();
     const showAll = pathname.startsWith('/edms');

    const { roles, permissions } = useAuth()
    const rtManagerPermission = permissions.find((p) => p.name === 'r&t-manager');
    const roadSafetyPermission = rtManagerPermission?.children?.find((child) => child.name === 'r&t-kec-letter');
    const hasEditAccess = roadSafetyPermission?.edit_authority === true && showAll;
    const [approved, setApproved] = useState<boolean>(false);
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
     const [date, setDate] = useState<Date | null>(null)
  const [date2, setDate2] = useState<Date | null>(null)
    const [searchKey, setSearchKey] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loading2, setLoading2] = useState<boolean>(false)
    const [subjectName, setSubjectName] = useState('')
    const [description, setDescription] = useState('')
    
    const [remarks, setRemarks] = useState('')
    
    const [formDate, setFormDate] = useState<string>('')
    const [filesInput, setFilesInput] = useState<File[]>([])
    const [selectedCode, setSelectedCode] = useState(null)
    const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false)
    

    const [viewProductDialog, setViewProductDialog] = useState<boolean>(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
    const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null)
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
      
            formData.append('subjectName', updatedProduct.subjectName)
            formData.append('description', updatedProduct.description)
           formData.append('approved', updatedProduct.approved ? 'true' : 'false')
            formData.append('remarks', updatedProduct.remarks)
            formData.append('date', updatedProduct.date)
           
            newAttachments.forEach((file) => {
                formData.append('attachments', file)
            })

            removedAttachments.forEach((attachmentId) => {
                formData.append('removedAttachments', attachmentId)
            })

            const res = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/kecletters/update/by/${updatedProduct._id}`,
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

    // ending all update dialog funcs

    const codes = [
        { name: 'Internal Patient', code: 'Internal' },
        { name: 'Outside Patient', code: 'Outside' },
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
        try {
            setLoading2(true)
            const formData = new FormData()

          
            formData.append('description', description)
            formData.append('approved', approved ? 'true' : 'false');
            formData.append('remarks', remarks)
          formData.append('subjectName', subjectName)
            formData.append('date', formatDate(formDate))
            filesInput.forEach((file) => {
                formData.append('attachments', file)
            })
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/kecletters/create`,
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
                `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/kecletters/delete/by/${product._id}`,
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
                `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/kecletters/delete-multiple`,
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
                    <ButtonGroupWithIcons
                        selectedProducts={selectedProducts}
                        openNew={openNew}
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
                const subjectName = attachment.url.split('/').pop()
                //@ts-ignore
                folder.file(subjectName, blob)
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
       
        date_range: date && date2 ? `${formatDate(date)} to ${formatDate(date2)}` : '',
        searchQuery: searchKey,
      }
         console.log(payload)
      searchRTKec(payload).then((result) => {
        const rows = Array.isArray(result?.data) ? result.data : [];
            setProducts(showAll ? rows : rows.filter((r: any) => r.approved === true));
        setLoading(false)
      })
    }
  
    const handleReset = () => {
      setLoading(true)
      const payload = {
      
        date_range: '',
        searchQuery: '',
      }
  
      setDate(null)
      setDate2(null)
      setSearchKey('')
      setSelectedCode(null)
  
      searchRTKec(payload).then((result) => {
       const rows = Array.isArray(result?.data) ? result.data : [];
            setProducts(showAll ? rows : rows.filter((r: any) => r.approved === true));
        setLoading(false)
      })
    }
  
const refetch = () => {
    setLoading(true)
    const payload = {
      date_range: '',
      searchQuery: '',
    }

    searchRTKec(payload).then((result) => {
     const rows = Array.isArray(result?.data) ? result.data : [];
            setProducts(showAll ? rows : rows.filter((r: any) => r.approved === true));
      setLoading(false)
    })
  }
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
                {/* <div>
          <Dropdown
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.value)}
            options={codes}
            optionLabel='name'
            placeholder='Patient Type'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
          />
        </div> */}
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

    // initial data load - Internal
    useEffect(() => {
        refetch()
    }, [])

    const attachmentBodyTemplate = (rowData: any) => {
        return <div>{rowData?.attachments?.length}</div>
    }



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

                            ></Column>


                            <Column
                                field='date'
                                headerClassName='bg-[#ffc2c2] text-sm'
                                bodyClassName='text-sm truncate max-w-xs'

                                className='min-w-[12rem]'
                                header='Date'
                            ></Column>

                            <Column
                                field='subjectName'
                                headerClassName='bg-[#ffc2c2] text-sm'
                                bodyClassName='text-sm truncate max-w-xs'

                                className='min-w-[8rem]'
                                header='File Name'
                            ></Column>
                           
                            <Column
                                field='description'
                                headerClassName='bg-[#ffc2c2] text-sm'
                                bodyClassName='text-sm truncate max-w-xs'

                                className='min-w-[8rem]'
                                header='Description'
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
                    </TabPanel>
                </TabView>
            </div>

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
                            <label htmlFor='subjectName' className='font-bold'>
                                File Name/ Subject
                            </label>
                            <InputText
                                id='subjectName'
                                value={updatedProduct.subjectName}
                                onChange={(e) =>
                                    setUpdatedProduct({
                                        ...updatedProduct,
                                        subjectName: e.target.value,
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
                                <h3 className='font-bold'>File Name</h3>
                                <p className='break-all'>{selectedProduct.subjectName}</p>
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
                            <label htmlFor='subjectName' className='font-bold'>
                                File Name
                            </label>
                            <InputText
                                id='subjectName'
                                onChange={(e) => setSubjectName(e.target.value)}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !subjectName,
                                })}
                            />
                            {submitted && !subjectName && (
                                <small className='p-error'>File Name is required.</small>
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
                            <span className='text-red-500'>*</span>
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
