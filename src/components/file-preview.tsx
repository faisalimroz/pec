import React, { useState } from 'react'
import { File, FileText, FolderArchive } from 'lucide-react'

interface FilePreviewProps {
  url: string
}

type FileType = 'image' | 'video' | 'pdf' | 'doc' | 'excel' | 'zip' | 'pptx' | 'other'

const getFileType = (extension: string): FileType => {
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension))
    return 'image'
  if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video'
  if (['pdf'].includes(extension)) return 'pdf'
  if (['doc', 'docx'].includes(extension)) return 'doc'
  if (['xls', 'xlsx'].includes(extension)) return 'excel'
  if (['zip'].includes(extension)) return 'zip'
  if (['ppt', 'pptx'].includes(extension)) return 'pptx'
  return 'other'
}

const getFileSize = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    const size = response.headers.get('content-length')
    if (!size) return 'Size unknown'

    const bytes = parseInt(size, 10)
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  } catch {
    return 'Size unknown'
  }
}

export const FilePreview: React.FC<FilePreviewProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [fileSize, setFileSize] = useState<string>('')
  const extension = url?.split('.').pop()?.toLowerCase() || ''

  React.useEffect(() => {
    getFileSize(url).then(setFileSize)
  }, [url])

  const renderPreview = () => {
    const fileType = getFileType(extension)

    switch (fileType) {
      case 'image':
        return (
          <div className='relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden'>
            <img
              src={url}
              alt='Preview'
              className='w-full h-full object-contain'
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = '/api/placeholder/150/150'
              }}
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
              </div>
            )}
          </div>
        )

      case 'video':
        return (
          <div className='relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden'>
            <video
              className='w-full h-full object-contain'
              controls
              preload='metadata'
            >
              <source src={url} type={`video/${extension}`} />
              Your browser does not support the video tag.
            </video>
          </div>
        )

      case 'pdf':
        return (
          <div className='w-full h-32 bg-gray-100 rounded-lg overflow-hidden'>
            <iframe
              src={`${url}#view=FitH`}
              title='PDF Preview'
              className='w-full h-full'
            >
              This browser does not support PDF preview.
            </iframe>
          </div>
        )

      case 'doc':
        return (
          <div className='w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center'>
            <FileText className='w-12 h-12 text-blue-700 mb-2' />
            <span className='text-sm text-gray-600'>Word Document</span>
          </div>
        )

      case 'excel':
        return (
          <div className='w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center'>
            <FileText className='w-12 h-12 text-green-700 mb-2' />
            <span className='text-sm text-gray-600'>Excel Spreadsheet</span>
          </div>
        )

      case 'zip':
        return (
          <div className='w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center'>
            <FolderArchive className='w-12 h-12 text-amber-600 mb-2' />
            <span className='text-sm text-gray-600'>ZIP Archive</span>
            {fileSize && (
              <span className='text-xs text-gray-500 mt-1'>{fileSize}</span>
            )}
          </div>
        )
      case 'pptx':
        return (
          <div className='w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center'>
            <FileText className='w-12 h-12 text-orange-600 mb-2' />
            <span className='text-sm text-gray-600'>PowerPoint Presentation</span>
            {fileSize && (
              <span className='text-xs text-gray-500 mt-1'>{fileSize}</span>
            )}
          </div>
        )

      default:
        return (
          <div className='w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center'>
            <File className='w-12 h-12 text-gray-500 mb-2' />
            <span className='text-sm text-gray-600'>
              File Preview Not Available
            </span>
          </div>
        )
    }
  }

  return <div className='rounded-lg overflow-hidden'>{renderPreview()}</div>
}
