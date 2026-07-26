import React, { useState, useEffect, useRef } from 'react'
import { File, FileText, FolderArchive, Loader2, Download } from 'lucide-react'
import { renderAsync } from 'docx-preview'
interface FilePreviewProps {
  url: string
}
type WordPreviewProps = {
  url: string
  fileSize?: string
}

function WordPreview({
  url,
  fileSize,
}: WordPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    const loadDocument = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(url, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(
            `Failed to load document: ${response.status}`
          )
        }

        const fileBlob = await response.blob()

        if (
          cancelled ||
          !previewRef.current
        ) {
          return
        }

        // Clear the previous document.
        previewRef.current.innerHTML = ''

        await renderAsync(
          fileBlob,
          previewRef.current,
          previewRef.current,
          {
            className: 'docx-preview',
            inWrapper: true,
            breakPages: true,
            ignoreWidth: false,
            ignoreHeight: false,
            ignoreFonts: false,
            useBase64URL: true,
            renderHeaders: true,
            renderFooters: true,
            renderFootnotes: true,
          }
        )
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'Word preview error:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Could not preview this Word document.'
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadDocument()

    return () => {
      cancelled = true
      controller.abort()

      if (previewRef.current) {
        previewRef.current.innerHTML = ''
      }
    }
  }, [url])

  if (error) {
    return (
      <div className="flex min-h-32 w-full flex-col items-center justify-center rounded-lg bg-gray-100 p-4">
        <FileText className="mb-2 h-12 w-12 text-blue-700" />

        <span className="text-center text-sm text-red-600">
          {error}
        </span>

        <a
          href={url}
          download
          className="mt-3 inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-xs text-white hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Download Word document
        </a>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-gray-100">
      {loading && (
        <div className="absolute inset-0 z-10 flex min-h-32 items-center justify-center bg-white/80">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-blue-600" />

          <span className="text-sm text-gray-600">
            Loading Word document...
          </span>
        </div>
      )}

      <div
        ref={previewRef}
        className="max-h-[600px] min-h-32 w-full overflow-auto bg-gray-200 p-4"
      />

      {fileSize && (
        <div className="border-t bg-white px-3 py-2 text-xs text-gray-500">
          File size: {fileSize}
        </div>
      )}
    </div>
  )
}
type FileType = 'image' | 'video' | 'pdf' | 'doc' | 'excel' | 'zip' | 'pptx' | 'other'

const getFileType = (extension: string): FileType => {
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension))
    return 'image'
  if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video'
  if (['Attachments/Download'].includes(extension)) return 'pdf'
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
      // case 'doc': {
      //   const normalizedExtension = extension
      //     .toLowerCase()
      //     .replace('.', '')

      //   const isLegacyDoc = normalizedExtension === 'doc'

      //   const openDocument = () => {
      //     window.open(url, '_blank', 'noopener,noreferrer')
      //   }

      //   return (
      //     <button
      //       type="button"
      //       onClick={openDocument}
      //       className="
      //   flex h-32 w-full cursor-pointer
      //   flex-col items-center justify-center
      //   rounded-lg bg-gray-100
      //   transition-colors hover:bg-gray-200
      // "
      //       title="Open document in a new tab"
      //     >
      //       <FileText className="mb-2 h-12 w-12 text-blue-700" />

      //       <span className="text-sm font-medium text-gray-700">
      //         {isLegacyDoc ? 'Word Document (.doc)' : 'Word Document (.docx)'}
      //       </span>

      //       <span className="mt-1 text-xs text-blue-600">
      //         Click to open
      //       </span>

      //       {fileSize && (
      //         <span className="mt-1 text-xs text-gray-500">
      //           {fileSize}
      //         </span>
      //       )}
      //     </button>
      //   )
      // }
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
