import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
import { useAuth } from '@/provider/authProvider'
import { Checkbox } from 'primereact/checkbox';
import { useLocation } from 'react-router-dom';

interface ProjectLayout {
  _id: string
  image: string
  createdAt: string
  updatedAt: string
  __v: number
  creator?: string
  creationTimestamp?: string
  updater?: string
  updatingTimestamp?: string
}
interface ApiResponse {
  data: ProjectLayout
}

const OrgChart: React.FC = () => {
  const { permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'r&t-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'r&t-organization'
  )
  console.log('checkPermission', checkPermission)
 const { pathname } = useLocation();
     const showAll = pathname.startsWith('/edms');
   
  const isGeneral = checkPermission?.edit_authority === true && showAll;
console.log('isGeneral', isGeneral)
  const [layout, setLayout] = useState<ProjectLayout | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)

  const fetchLayout = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/organization/organization-chart`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setLayout(response.data.data)
      setError(null)
    } catch (err) {
      setError('Failed to load project layout')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLayout()
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png']
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG and PNG files are allowed.')
      return false
    }
    return true
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file)
        // Create preview URL
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        setError(null)
      } else {
        event.target.value = ''
        setSelectedFile(null)
        setPreviewUrl(null)
      }
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const file = event.dataTransfer.files?.[0]
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        setError(null)
      }
    }
  }

  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/organization/organization-chart`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      await fetchLayout()
      setIsDialogOpen(false)
      clearSelection()
      setError(null)
      toast.success('Image updated successfully!')
    } catch (err) {
      setError('Failed to upload image')
      console.error('Error:', err)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  // console.log(layout.image)

  return (
    <div className='w-full bg-white'>
      {/* Header with Upload Button */}
      <div className='flex justify-end px-8'>
        {isGeneral && (
          <Button
            onClick={() => setIsDialogOpen(true)}
            style={{ backgroundColor: '#0b1f8f' }}
            className='hover:bg-opacity-90'
          >
            <Upload className='mr-2 h-4 w-4' />
            Picture Upload
          </Button>
        )}
      </div>

      {/* Main Image Display */}
      <div className='w-full flex items-center justify-center p-2'>
        {isLoading ? (
          <div className='w-full max-w-4xl aspect-[16/9] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-[#0b1f8f]' />
          </div>
        ) : layout ? (
          <>
            <div className=' w-full'>
              <div className='relative w-full'>
                {imageLoading && (
                  <div className='absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse rounded-lg'>
                    <Loader2 className='h-8 w-8 animate-spin text-[#0b1f8f]' />
                  </div>
                )}
                <img
                  src={layout.image}
                  alt='Project Layout'
                  className={`w-full h-full object-contain rounded-lg shadow-lg transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  loading='lazy'
                  onLoad={() => setImageLoading(false)}
                />
              </div>

              <div className='border border-gray-200 rounded-lg mt-12'>
                <div className='bg-gray-50 px-4 py-2 border-b border-gray-200'>
                  <h3 className='text-gray-700 font-semibold'>
                    Document History
                  </h3>
                </div>
                <div className='p-4 space-y-4'>
                  {isLoading ? (
                    <div className='space-y-4 animate-pulse'>
                      <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                      <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                    </div>
                  ) : (
                    <div className='flex justify-between items-start'>
                      <div>
                        <h4 className='text-sm font-medium text-gray-500'>
                          Created By
                        </h4>
                        <div className='mt-1'>
                          <p className='text-sm text-gray-900'>
                            {layout?.creator || 'N/A'}
                          </p>
                          {layout?.creationTimestamp && (
                            <p className='text-sm text-gray-600'>
                              <span>
                                Date: {layout?.creationTimestamp.split(' ')[0]}
                              </span>
                              <span className='mx-1'>•</span>
                              <span>
                                Time: {layout?.creationTimestamp.split(' ')[1]}
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
                            {layout?.updater || 'N/A'}
                          </p>
                          {layout?.updatingTimestamp && (
                            <p className='text-sm text-gray-600'>
                              <span>
                                Date: {layout.updatingTimestamp.split(' ')[0]}
                              </span>
                              <span className='mx-1'>•</span>
                              <span>
                                Time: {layout?.updatingTimestamp.split(' ')[1]}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='w-full max-w-4xl aspect-[16/9] bg-gray-50 rounded-lg flex items-center justify-center text-gray-500'>
            No image available
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) clearSelection()
          setIsDialogOpen(open)
        }}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Upload Project Layout</DialogTitle>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div
              className='grid gap-2'
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className='relative'>
                  <img
                    src={previewUrl}
                    alt='Preview'
                    className='max-h-[200px] w-full object-contain rounded-lg'
                  />
                  <button
                    onClick={clearSelection}
                    className='absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor='image-upload'
                  className='cursor-pointer p-8 border-2 border-dashed rounded-lg text-center hover:border-[#0b1f8f] transition-colors'
                >
                  <div className='flex flex-col items-center gap-2'>
                    <Upload className='h-8 w-8 text-gray-400' />
                    <p className='text-sm text-gray-600 font-medium'>
                      Click to select or drag and drop
                    </p>
                    <p className='text-xs text-gray-500'>
                      Supported formats: JPEG, PNG
                    </p>
                  </div>
                  <input
                    id='image-upload'
                    type='file'
                    className='hidden'
                    onChange={handleFileSelect}
                    accept='image/jpeg,image/png'
                  />
                </label>
              )}
            </div>
          </div>

          {error && <p className='text-sm text-red-500 text-center'>{error}</p>}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                clearSelection()
                setIsDialogOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              style={{ backgroundColor: '#0b1f8f' }}
              className='hover:bg-opacity-90'
            >
              {isUploading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrgChart
