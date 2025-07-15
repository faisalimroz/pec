import { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'
import { useAuth } from '@/provider/authProvider'

export default function AerialVideo() {
  interface Video {
    videoUrl: string
    description: string
    creator?: string
    creationTimestamp?: string
    updater?: string
    updatingTimestamp?: string
  }

  const { permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'general-information')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'aerial-photography'
  )

  const isGeneral = checkPermission?.edit_authority || false

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [uploadDialog, setUploadDialog] = useState(false)

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [newVideo, setNewVideo] = useState<Video>({
    videoUrl: '',
    description: '',
  })

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/general/aerial/all`)
      .then((response) => response.json())
      .then((data) => {
        setVideos(data.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching videos:', error)
        setLoading(false)
      })
  }, [])

  const openEditDialog = (video: any) => {
    setSelectedVideo(video)
    setEditDialog(true)
  }

  const openDeleteDialog = (video: any) => {
    setSelectedVideo(video)
    setDeleteDialog(true)
  }

  const handleUpdate = () => {
    //@ts-ignore
    fetch(
      //@ts-ignore
      `${import.meta.env.VITE_BASE_URL}/api/v1/general/aerial/update/${selectedVideo._id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedVideo),
      }
    )
      .then((response) => response.json())
      .then(() => {
        //@ts-ignore
        setVideos(
          //@ts-ignore
          videos.map((v) => (v._id === selectedVideo._id ? selectedVideo : v))
        )
        setEditDialog(false)
      })
      .catch((error) => console.error('Error updating video:', error))
  }

  const handleDelete = () => {
    //@ts-ignore
    fetch(
      //@ts-ignore
      `${import.meta.env.VITE_BASE_URL}/api/v1/general/aerial/delete/${selectedVideo._id}`,
      {
        method: 'DELETE',
      }
    )
      .then(() => {
        //@ts-ignore
        setVideos(videos.filter((v) => v._id !== selectedVideo._id))
        setDeleteDialog(false)
      })
      .catch((error) => console.error('Error deleting video:', error))
  }

  const handleUpload = () => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/general/aerial/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newVideo),
    })
      .then((response) => response.json())
      .then((data: any) => {
        //@ts-ignore
        setVideos([...videos, data.data])
        setUploadDialog(false)
        setNewVideo({ videoUrl: '', description: '' })
      })
      .catch((error) => console.error('Error uploading video:', error))
  }

  return (
    <section className='relative h-full overflow-hidden bg-background'>
      <div className='space-y-2 px-4'>
        <div className='flex justify-end'>
          {isGeneral && (
            <button
              className='bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded'
              onClick={() => setUploadDialog(true)}
            >
              Upload Video
            </button>
          )}
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className='grid grid-cols-2 gap-4'>
            {videos.map((video: any) => (
              //@ts-ignore
              <div
                key={video._id}
                className='p-4 bg-white shadow rounded-md relative'
              >
                <iframe
                  width='100%'
                  height='250'
                  src={`https://www.youtube.com/embed/${video.videoUrl}`}
                  title='YouTube video player'
                  frameBorder='0'
                  allowFullScreen
                  className='rounded-md'
                ></iframe>
                <p className='mt-2 text-lg font-semibold'>
                  {video.description}
                </p>

                {isGeneral && (
                  <div className='flex space-x-2 mt-2'>
                    <Button
                      label='Edit'
                      icon='pi pi-pencil'
                      className='!bg-blue-900 !text-white hover:!bg-blue-800'
                      onClick={() => openEditDialog(video)}
                    />
                    <Button
                      label='Delete'
                      icon='pi pi-trash'
                      className='!bg-red-600 !text-white hover:!bg-red-700'
                      onClick={() => openDeleteDialog(video)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}

      <Dialog
        header='Edit Video'
        visible={editDialog}
        style={{ width: '42rem' }}
        onHide={() => setEditDialog(false)}
        footer={
          <button
            className='bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded'
            onClick={handleUpdate}
          >
            Save
          </button>
        }
      >
        <>
          <div className='mb-6 border border-gray-200 rounded-lg'>
            <div className='bg-gray-50 px-4 py-2 border-b border-gray-200'>
              <h3 className='text-gray-700 font-semibold'>Document History</h3>
            </div>
            <div className='p-4 space-y-4'>
              <div className='flex justify-between items-start'>
                <div>
                  <h4 className='text-sm font-medium text-gray-500'>
                    Created By
                  </h4>
                  <div className='mt-1'>
                    <p className='text-sm text-gray-900'>
                      {selectedVideo?.creator || 'N/A'}
                    </p>
                    {selectedVideo?.creationTimestamp && (
                      <p className='text-sm text-gray-600'>
                        <span>
                          Date: {selectedVideo.creationTimestamp.split(' ')[0]}
                        </span>
                        <span className='mx-1'>•</span>
                        <span>
                          Time: {selectedVideo.creationTimestamp.split(' ')[1]}
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
                      {selectedVideo?.updater || 'N/A'}
                    </p>
                    {selectedVideo?.updatingTimestamp && (
                      <p className='text-sm text-gray-600'>
                        <span>
                          Date: {selectedVideo.updatingTimestamp.split(' ')[0]}
                        </span>
                        <span className='mx-1'>•</span>
                        <span>
                          Time: {selectedVideo.updatingTimestamp.split(' ')[1]}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col space-y-4'>
            <label className='font-semibold'>Video URL:</label>

            <InputText
              value={selectedVideo?.videoUrl || ''}
              onChange={(e) =>
                setSelectedVideo(
                  //@ts-ignore
                  { ...selectedVideo, videoUrl: e.target.value }
                )
              }
            />

            <label className='font-semibold'>Description:</label>
            <InputTextarea
              value={selectedVideo?.description || ''}
              onChange={(e) =>
                setSelectedVideo(
                  //@ts-ignore
                  { ...selectedVideo, description: e.target.value }
                )
              }
            />
          </div>
        </>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        header='Confirm Delete'
        style={{ width: '32rem' }}
        visible={deleteDialog}
        onHide={() => setDeleteDialog(false)}
        footer={
          <div className='flex justify-end space-x-2'>
            <button
              onClick={() => setDeleteDialog(false)}
              className='bg-red-600 hover:bg-red-800 text-white font-semibold px-4 rounded'
            >
              No
            </button>
            <button
              onClick={handleDelete}
              className='bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded'
            >
              Yes
            </button>
          </div>
        }
      >
        <p>Are you sure you want to delete this item?</p>
      </Dialog>

      {/* Upload Video Dialog */}
      <Dialog
        header='Upload Video'
        visible={uploadDialog}
        onHide={() => setUploadDialog(false)}
        style={{ width: '50vw' }}
        footer={
          <button
            onClick={handleUpload}
            className='bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded'
          >
            Upload
          </button>
        }
      >
        <div className='flex flex-col space-y-4'>
          <label className='font-semibold'>Video URL:</label>
          <InputText
            value={newVideo.videoUrl}
            onChange={(e) =>
              setNewVideo({ ...newVideo, videoUrl: e.target.value })
            }
          />
          <label className='font-semibold'>Description:</label>
          <InputTextarea
            value={newVideo.description}
            onChange={(e) =>
              setNewVideo({ ...newVideo, description: e.target.value })
            }
            rows={4}
          />
        </div>
      </Dialog>
    </section>
  )
}