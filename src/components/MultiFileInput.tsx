import React, { useState, useRef, ChangeEvent } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'

interface MultiFileInputProps {
  onFilesChange: (files: File[]) => void
}

const MAX_FILE_SIZE = 300 * 1024 * 1024 // 300MB in bytes
const MAX_FILES_ALLOWED = 10

export default function MultiFileInput({ onFilesChange }: MultiFileInputProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFiles = (newFiles: File[]): File[] => {
    const validFiles: File[] = []
    const invalidSizeFiles: string[] = []
    const remainingSlots = MAX_FILES_ALLOWED - selectedFiles.length

    if (remainingSlots <= 0) {
      toast.error(`Maximum ${MAX_FILES_ALLOWED} files allowed`)
      return []
    }

    // If adding new files would exceed the limit, show warning and trim the array
    if (newFiles.length > remainingSlots) {
      // toast.warning(
      //   `Only ${remainingSlots} more file${remainingSlots === 1 ? '' : 's'} can be added`
      // )
      toast.warning(`Only 10 files can be added at a time`)
      newFiles = newFiles.slice(0, remainingSlots)
    }

    newFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        invalidSizeFiles.push(file.name)
      } else {
        validFiles.push(file)
      }
    })

    if (invalidSizeFiles.length > 0) {
      toast.error(
        `Files exceeding 300MB limit: ${invalidSizeFiles.join(', ')}`,
        {
          duration: 4000,
        }
      )
    }

    return validFiles
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      const validNewFiles = validateFiles(newFiles)

      if (validNewFiles.length > 0) {
        const updatedFiles = [...selectedFiles, ...validNewFiles]
        setSelectedFiles(updatedFiles)
        onFilesChange(updatedFiles)
      }
    }
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files)
      const validNewFiles = validateFiles(newFiles)

      if (validNewFiles.length > 0) {
        const updatedFiles = [...selectedFiles, ...validNewFiles]
        setSelectedFiles(updatedFiles)
        onFilesChange(updatedFiles)
      }
    }
  }

  const formatFileSize = (size: number): string => {
    const units = ['B', 'KB', 'MB', 'GB']
    let formattedSize = size
    let unitIndex = 0

    while (formattedSize >= 1024 && unitIndex < units.length - 1) {
      formattedSize /= 1024
      unitIndex++
    }

    return `${formattedSize.toFixed(1)} ${units[unitIndex]}`
  }

  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'zip':
        return '📦'
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      case 'xls':
      case 'xlsx':
        return '📊'
      case 'mp3':
      case 'wav':
        return '🎵'
      case 'mp4':
      case 'mov':
        return '🎥'
      default:
        return '📎'
    }
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          selectedFiles.length >= MAX_FILES_ALLOWED
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400 cursor-pointer'
        }`}
        onClick={() =>
          selectedFiles.length < MAX_FILES_ALLOWED &&
          fileInputRef.current?.click()
        }
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className='hidden'
          accept='image/*,video/*,.doc,.docx,.xls,.xlsx,.pdf,.zip,.ppt,.pptx,.pptm,.potm,.ppsx'
          disabled={selectedFiles.length >= MAX_FILES_ALLOWED}
        />
        <p className='text-gray-600'>
          {selectedFiles.length >= MAX_FILES_ALLOWED
            ? 'Maximum file limit reached'
            : 'Click to select or drag and drop files here'}
        </p>
        <p className='text-sm text-gray-400 mt-2'>
          Supported files: Images, Videos, Word, Excel, PDF, ZIP, PPTX
        </p>
        <p className='text-sm text-gray-400 mt-1'>Maximum file size: 300MB</p>
        <p className='text-sm text-gray-400 mt-1'>
          Files: {selectedFiles.length}/{MAX_FILES_ALLOWED}
        </p>
      </div>
      {selectedFiles.length > 0 && (
        <div className='mt-4'>
          <h3 className='text-lg font-semibold mb-2'>Selected Files:</h3>
          <ul className='space-y-2'>
            {selectedFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className='flex items-center justify-between bg-gray-100 rounded-md p-2'
              >
                <div className='flex items-center flex-grow mr-2'>
                  <span className='mr-2'>{getFileIcon(file.name)}</span>
                  <div className='flex flex-col'>
                    <span className='text-sm'>{file.name}</span>
                    <span className='text-xs text-gray-500'>
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className='text-red-500 hover:text-red-700 transition-colors'
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
