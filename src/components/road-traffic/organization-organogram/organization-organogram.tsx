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
import { searchTreatmentRecord } from '@/api/adminAPIs'
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

interface Attachment {
    url: string
    _id: string
}
interface Product {
    _id: string | null
    slNo: string
    subjectName: string
    description: string

    problem: string
    patientType: string
    date: string
    remarks: string
    attachments: Attachment[]
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
        problem: '',

        patientType: '',
        date: '',
        remarks: '',
        attachments: [],
    }

    const { roles, permissions } = useAuth()
    const clinicPermission = permissions.find((p) => p.name === 'clinic')
    const treatmentRecordPermission = clinicPermission?.children.find(
        (c) => c.name === 'treatment-record'
    )

    const hasEditAccess = treatmentRecordPermission?.edit_authority || false

    const isClinic = roles.some((role) =>
        ['superadmin', 'clinic'].includes(role.title)
    )
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
    const [date, setDate] = useState<string>('')
    const [date2, setDate2] = useState<string>('')
    const [searchKey, setSearchKey] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loading2, setLoading2] = useState<boolean>(false)
    const [subjectName, setSubjectName] = useState('')
    const [description, setDescription] = useState('')
    const [problem, setproblem] = useState('')
    const [remarks, setRemarks] = useState('')
    const [department, setDepartment] = useState<string>('')
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
            formData.append('patientType', updatedProduct.patientType)
            formData.append('subjectName', updatedProduct.subjectName)
            formData.append('description', updatedProduct.description)
            formData.append('problem', updatedProduct.problem)
            formData.append('remarks', updatedProduct.remarks)
            formData.append('date', updatedProduct.date)

            newAttachments.forEach((file) => {
                formData.append('attachments', file)
            })

            removedAttachments.forEach((attachmentId) => {
                formData.append('removedAttachments', attachmentId)
            })

            const res = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/api/v1/admin/clinic/treatment-record/update/${updatedProduct._id}`,
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

            formData.append('subjectName', subjectName)
            formData.append('description', description)
            formData.append('problem', problem)
            formData.append('remarks', remarks)
            formData.append('patientType', department)
            formData.append('date', formatDate(formDate))
            filesInput.forEach((file) => {
                formData.append('attachments', file)
            })
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/admin/clinic/treatment-record/upload`,
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

   

   
  
 

    const hideDeleteMultipleDialog = () => {
        setDeleteMultipleDialog(false)
    }

    const deleteSelectedProducts = async () => {
        try {
            setLoading2(true)
            const selectedIds = selectedProducts.map((product) => product._id)

            const response = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/api/v1/admin/clinic/treatment-record/delete/multiple/data`,
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
                    <div>
                        <button
                            className="flex items-center gap-2 bg-[#0B1F8F] text-white border border-[#E2E8F0]  px-4 py-3 rounded-md font-bold"
                            onClick={openNew}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M7 10L12 15L17 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12 15V3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            Upload Document
                        </button>

                    </div>
                )}

              
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
            // @ts-ignore
            patientType: selectedCode?.code || '',
        }

        searchTreatmentRecord(initialPayload).then((result) => {
            setProducts(result?.Treatments)
            setLoading(false)
        })
    }

    const handleReset = () => {
        const initialPayload = {
            year: '',
            searchQuery: '',
            month: '',
            patientType: '',
        }

        setDate('')
        setDate2('')
        setSearchKey('')
        setSelectedCode(null)

        searchTreatmentRecord(initialPayload).then((result) => {
            setProducts(result?.Treatments)
            setLoading(false)
        })
    }

    
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
  
  

    const refetch = () => {
        setLoading(true)
        const initialPayload = {
            month: '',
            year: '',
            searchQuery: '',
            patientType: '',
        }

        searchTreatmentRecord(initialPayload).then((result) => {
            setProducts(result?.Treatments)
            console.log(result, "ress")
            setLoading(false)
        })
    }

    // initial data load - Internal
    useEffect(() => {
        refetch()
    }, [])


    // console.log(products)

    return (
        <div className=''>
            <div className='ml-4'>
                <Toolbar
                    className='rounded-none border-none p-0 bg-white'
                    left={leftToolbarTemplate}
                    right={rightToolbarTemplate}
                ></Toolbar>

                
            </div>
            <img src="https://acotegroup.com/acote-logo.png" alt="img" className='' />
  

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
                   
                    <div className='gap-3 mt-5'>
                        <label className='block mb-1 font-semibold'>
                            Upload Document
                            <span className='text-red-500'>*</span>
                        </label>

                        <div>
                            <MultiFileInput onFilesChange={handleFileChange} />
                        </div>
                    </div>
                </>
            </Dialog>

           

            

            
        </div>
    )
}
