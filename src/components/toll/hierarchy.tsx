import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import '@/styles/table-style.css'
import { searchAssetManagement } from '@/api/adminAPIs'
import axios from 'axios'
import MultiFileInput from '@/components/MultiFileInput'
import { toast } from 'sonner'

import { useAuth } from '@/provider/authProvider'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import left from '@/assets/left.svg'
import right from '@/assets/right.svg'
interface Attachment {
    url: string
    _id: string
}
interface Product {
    _id: string | null
    slNo: string
    name: string
    date: string
    positon: string
    mobile: string
    attachments: Attachment[]
    creator?: string
    creationTimestamp?: string
    updater?: string
    updatingTimestamp?: string
}

export default function AssetManagementTable() {
    let emptyProduct: Product = {
        _id: '',
        slNo: '',
        name: '',
        date: '',
        positon: '',
        mobile: '',
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
    const [product, setProduct] = useState<any>(emptyProduct)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const dt = useRef<DataTable<Product[]>>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [loading2, setLoading2] = useState<boolean>(false)
    const [name, setName] = useState('')
    const [formDate, setFormDate] = useState<string>('')
    const [positon, setPositon] = useState('')
    const [mobile, setMobile] = useState('')
    const [filesInput, setFilesInput] = useState<File[]>([])
    function formatDate(dateTime?: any) {
        if (!dateTime) return ''
        const date = new Date(dateTime)

        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()

        return `${day}-${month}-${year}`
    }
    console.log('data', products)
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
    const saveProduct = async () => {
        try {
            setLoading2(true)
            const formData = new FormData()
            formData.append('name', name)


            formData.append('positon', positon)
            formData.append('mobile', mobile)
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

    const leftToolbarTemplate = () => {
        return (
            <div className=''>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl pl-4'>
                    Hierarchy
                </h1>


            </div>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <>
                {hasEditAccess && (
                    <button
                        className="flex items-center gap-2 bg-[#0B1F8F] text-white border border-[#E2E8F0]  px-2 py-2 rounded-md font-bold"
                        onClick={openNew}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7 10L12 15L17 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12 15V3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        Picture Upload
                    </button>
                )}

            </>
        )
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
        }

        searchAssetManagement(initialPayload).then((result) => {
            setProducts(result?.Assets)
            setLoading(false)
        })
    }
    useEffect(() => {
        refetch()
    }, [])
    return (
        <div className='ml-4'>
            <div className='card'>
                <Toolbar
                    className='rounded-none border-none p-0 bg-background'
                    left={leftToolbarTemplate}
                    right={rightToolbarTemplate}
                ></Toolbar>
                <div>
                    <div className="flex flex-col items-center gap-6 mt-5">
                    
                        <div className="flex items-start justify-center gap-4">
                         
                            <div className="w-[300px] h-[150px] bg-gray-300 rounded-md shadow py-4 px-3" />

                            <div className="w-[300px] h-[150px] bg-gray-300 rounded-md shadow py-4 px-3">
                                <h1 className="font-semibold text-gray-800">Sr. Manager</h1>
                                <p className="font-medium">Mr. Kim Hongsuk</p>
                                <p className="text-sm text-gray-700 mt-2">Joining Date: 18-05-2022</p>
                                <p className="text-sm text-gray-700">Mobile: 01752940010</p>
                            </div>
                        </div>

                      
                        <div className="relative flex justify-center w-full max-w-[700px] h-[100px]">
                          
                            

                            <img src={left} alt="left" />
                            <img src={right} alt="right" />

                           
                            <div className="absolute top-0 left-0 text-sm font-semibold text-gray-800">
                                Mawa Toll Plaza
                            </div>
                            <div className="absolute top-0 right-0 text-sm font-semibold text-gray-800">
                                Janjira Toll Plaza
                            </div>
                        </div>
                    </div>

                    <div>
                        {/* <img src={products[0]?.attachments[0].url} alt="none" />
                <img src={products[0]?.attachments[0].url} alt="none" /> */}
                    </div>
                </div>



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
                            <label htmlFor='name' className='font-bold'>
                                Name
                            </label>
                            <InputText
                                id='name'
                                onChange={(e) => setName(e.target.value)}
                                required

                            />
                            {submitted && !name && (
                                <small className='p-error'>File Name/ Subject is required.</small>
                            )}
                        </div>
                        <div className='field'>
                            <label htmlFor='positon' className='font-bold'>
                                Positon
                            </label>
                            <InputText
                                id='positon'
                                onChange={(e) => setPositon(e.target.value)}
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
                                    onChange={(e) => setFormDate(e.value)}
                                    dateFormat='dd/mm/yy'
                                    inputClassName='border-0 focus:ring-0 cursor-pointer'
                                    className='focus:ring-0'
                                    placeholder='Select Date'
                                />
                            </div>
                        </div>

                        <div className='field'>
                            <label htmlFor='mobile' className='font-bold'>
                                Mobile
                            </label>
                            <InputText
                                id='mobile'
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className='gap-3 mt-5'>
                        <label className='block mb-1 font-semibold'>
                            Upload Image
                            <span className='text-red-500 ml-1'>*</span>
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
