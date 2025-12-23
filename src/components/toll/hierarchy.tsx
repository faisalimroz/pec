
import React, { useState, useEffect, useRef, MouseEvent } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import '@/styles/table-style.css'
import axios from 'axios'
import MultiFileInput from '@/components/MultiFileInput'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
import { useAuth } from '@/provider/authProvider'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import left from '@/assets/left.svg'
import right from '@/assets/right.svg'
import { useLocation } from 'react-router-dom'

interface Attachment {
    url: string
    _id?: string
}

interface HierarchyDoc {
    _id?: string
    images?: Attachment[]
    name?: string
    date?: string
    position?: string
    mobile?: string
    creator?: string
    creationTimestamp?: string
    updater?: string
    updatingTimestamp?: string
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


type ZoomImageProps = {
    src: string
    alt?: string
    className?: string        
    imgClassName?: string     
    zoom?: number             
}

function ZoomImage({
    src,
    alt = '',
    className = '',
    imgClassName = '',
    zoom = 2,
}: ZoomImageProps) {
    const [isHovering, setIsHovering] = useState(false)
    const [origin, setOrigin] = useState({ x: '50%', y: '50%' })
    const containerRef = useRef<HTMLDivElement | null>(null)

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        setOrigin({
            x: `${x}%`,
            y: `${y}%`,
        })
    }

    return (
        <div
            ref={containerRef}
            className={`relative cursor-crosshair overflow-hidden ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
        >
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-transform duration-300 ease-out ${imgClassName}`}
                style={{
                    transform: isHovering ? `scale(${zoom})` : 'scale(1)',
                    transformOrigin: `${origin.x} ${origin.y}`,
                }}
            />
        </div>
    )
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
    const { pathname } = useLocation()
    const showAll = pathname.startsWith('/edms')

    const tollManagerPermission = permissions.find((p) => p.name === 'toll-manager')
    const tollPermission = tollManagerPermission?.children?.find(
        (child) => child.name === 'toll-hierarchy'
    )
    const hasEditAccess = tollPermission?.edit_authority === true && showAll

    const [products, setProducts] = useState<any>([])
    const [productDialog, setProductDialog] = useState<boolean>(false)
    const [product, setProduct] = useState<any>(emptyProduct)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const dt = useRef<DataTable<Product[]>>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [loading2, setLoading2] = useState<boolean>(false)

    // form fields
    const [name, setName] = useState('')
    const [formDate, setFormDate] = useState<string>('')
    const [positon, setPositon] = useState('')
    const [mobile, setMobile] = useState('')
    const [filesInput, setFilesInput] = useState<File[]>([])

    // fetched hierarchy doc
    const [hierarchy, setHierarchy] = useState<HierarchyDoc | null>(null)

    function formatDate(dateTime?: any) {
        if (!dateTime) return ''
        const date = new Date(dateTime)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    }

    const openNew = () => {
        setProduct(emptyProduct)
        setSubmitted(false)
        setProductDialog(true)
    }

    const handleFileChange = (newFiles: File[]) => {
        // allow max 3
        const limited = newFiles.slice(0, 3)
        setFilesInput(limited)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setProductDialog(false)
    }

    // ---- API calls for hierarchy ----
    const fetchHierarchy = async () => {
        try {
            setLoading(true)
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/toll/hierarchy/get`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            )
            // expecting { data: doc }
            setHierarchy(res?.data?.data || null)
        } catch (e) {
            // silent fail OK
        } finally {
            setLoading(false)
        }
    }

    const saveProduct = async () => {
        try {
            setLoading2(true)
            const formData = new FormData()
            formData.append('name', name)
            formData.append('position', positon)
            formData.append('mobile', mobile)
            formData.append('date', formatDate(formDate))

            filesInput.slice(0, 3).forEach((file) => {
                formData.append('images', file)
            })

            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/toll/hierarchy/upload`,
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
            await fetchHierarchy() // refresh display
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

    const refetch = () => {
        setLoading(true)
        setProducts([])
        setLoading(false)
    }

    useEffect(() => {
        refetch()
        fetchHierarchy()
    }, [])

    const img0 = hierarchy?.images?.[0]?.url || ''
    const img1 = hierarchy?.images?.[1]?.url || ''
    const img2 = hierarchy?.images?.[2]?.url || ''

    const leftToolbarTemplate = () => {
        return (
            <div>
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
                        className='flex items-center gap-2 bg-[#0B1F8F] text-white border border-[#E2E8F0] px-2 py-2 rounded-md font-bold'
                        onClick={openNew}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 24 24'
                            fill='none'
                        >
                            <path
                                d='M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15'
                                stroke='white'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                            <path
                                d='M7 10L12 15L17 10'
                                stroke='white'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                            <path
                                d='M12 15V3'
                                stroke='white'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
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

    return (
        <div className='ml-4'>
            <div className='card'>
                <Toolbar
                    className='rounded-none border-none p-0 bg-background'
                    left={leftToolbarTemplate}
                    right={rightToolbarTemplate}
                />

                <div>
                    <div className='flex flex-col items-center gap-6 mt-5'>
                        {/* TOP ROW */}
                        <div className='flex items-start justify-center gap-4'>
                            {/* LEFT BOX — zoomable image 0 */}
                            <div className='w-[300px] h-[150px] bg-gray-300 rounded-md shadow py-4 px-3 overflow-hidden flex items-center justify-center'>
                                {img0 && (
                                    <ZoomImage
                                        src={img0}
                                        alt='Hierarchy image 0'
                                        className='w-full h-full rounded-md'
                                        imgClassName='rounded-md'
                                        zoom={2.2}
                                    />
                                )}
                            </div>

                            {/* RIGHT BOX — text details */}
                            <div className='w-[300px] h-[150px] bg-gray-300 rounded-md shadow py-4 px-3 relative overflow-hidden'>
                                <h1 className='font-semibold text-gray-800'>
                                    {hierarchy?.position || 'Sr. Manager'}
                                </h1>
                                <p className='font-medium'>
                                    {hierarchy?.name || 'Mr. Kim Hongsuk'}
                                </p>
                                <p className='text-sm text-gray-700 mt-2'>
                                    Joining Date: {hierarchy?.date || '18-05-2022'}
                                </p>
                                <p className='text-sm text-gray-700'>
                                    Mobile: {hierarchy?.mobile || '01752940010'}
                                </p>
                            </div>
                        </div>

                        {/* CONNECTOR ROW */}
                        <div className='relative flex justify-center w-full max-w-[700px] h-[100px]'>
                            <img src={left} alt='left' />
                            <img src={right} alt='right' />

                            <div className='absolute top-0 left-0 text-sm font-semibold text-gray-800'>
                                Mawa Toll Plaza
                            </div>
                            <div className='absolute top-0 right-0 text-sm font-semibold text-gray-800'>
                                Janjira Toll Plaza
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM ROW: two zoomable images */}
                    <div className='flex justify-around gap-3 mt-4'>
                        {img1 && (
                            <ZoomImage
                                src={img1}
                                alt='Hierarchy bottom image 1'
                                className='w-[500px] h-[320px] rounded-md bg-gray-200'
                                imgClassName='rounded-md'
                                zoom={2.3}
                            />
                        )}

                        {img2 && (
                            <ZoomImage
                                src={img2}
                                alt='Hierarchy bottom image 2'
                                className='w-[500px] h-[320px] rounded-md bg-gray-200'
                                imgClassName='rounded-md'
                                zoom={2.3}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Dialog */}
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
                                <small className='p-error'>
                                    File Name/ Subject is required.
                                </small>
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
                            Upload Image (Max 3)
                            <span className='text-red-500 ml-1'>*</span>
                        </label>
                        <div>
                            <MultiFileInput onFilesChange={handleFileChange} />
                            <p className='text-xs text-gray-500 mt-1'>
                                You can select up to 3 images.
                            </p>
                        </div>
                    </div>
                </>
            </Dialog>
        </div>
    )
}
