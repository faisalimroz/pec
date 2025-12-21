import { useState, useRef } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import axios from 'axios'
import { toast } from 'sonner'

interface BulkUploadDialogProps {
    visible: boolean
    setVisible: (visible: boolean) => void
    apiEndpoint: string
    onSuccess: () => void
    title?: string
}

export default function BulkUploadDialog({ 
    visible, 
    setVisible, 
    apiEndpoint, 
    onSuccess, 
    title = 'Upload Bulk Data' 
}: BulkUploadDialogProps) {
    
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleClose = () => {
        setFile(null)
        setUploadStatus('')
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
        setVisible(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
            setFile(selectedFile)
            setUploadStatus('')
        } else {
            setFile(null)
            setUploadStatus('Please select a valid .xlsx file.')
        }
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
            const fullUrl = `${import.meta.env.VITE_BASE_URL}${apiEndpoint}`
            
            await axios.post(fullUrl, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            })

            toast.success('File uploaded successfully!')
            onSuccess()
            handleClose()
        } catch (error: any) {
            console.error('Error uploading file:', error)
            const msg = error.response?.data?.message || 'An error occurred while uploading.'
            toast.error(msg)
            setUploadStatus(msg)
        } finally {
            setUploading(false)
        }
    }

    const footer = (
        <>
            <Button
                label='Cancel'
                icon='pi pi-times'
                className='p-button-text'
                onClick={handleClose}
            />
            <Button
                label='Save' // Kept as "Save" to match your original design
                icon='pi pi-upload'
                className='p-button-text'
                onClick={uploadFile}
                disabled={!file || uploading}
                loading={uploading} // Added loading spinner support
            />
        </>
    )

    return (
        <Dialog
            visible={visible}
            style={{ width: '42rem' }} // Match original width
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header={title}
            modal
            className='p-fluid'
            footer={footer}
            onHide={handleClose}
        >
            <div className='grid grid-cols-2 items-center gap-6'>
                <div className='field col-span-2'>
                    <label htmlFor='bulkUpload' className='font-bold'>
                        Select File (.xlsx Only):
                    </label>
                    <br />
                    <input
                        ref={fileInputRef}
                        type='file'
                        id='bulkUpload'
                        accept='.xlsx'
                        onChange={handleFileChange}
                        disabled={uploading}
                        className='mt-3' // Original simple class
                    />
                    
                    {uploadStatus && (
                        <p className={uploadStatus.includes('success') ? 'text-green-500' : 'text-red-500'}>
                            {uploadStatus}
                        </p>
                    )}
                </div>
            </div>
        </Dialog>
    )
}