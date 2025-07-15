import { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'
import axios from 'axios'
import { toast } from 'sonner'
import { useAuth } from '@/provider/authProvider'

interface Project {
  _id: string
  image: string
  description: string
  creator?: string
  creationTimestamp?: string
  updater?: string
  updatingTimestamp?: string
}

interface NewProject {
  image: File | null
  description: string
}

export default function ProjectLayout() {
  const { permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'general-information')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'general-status'
  )

  const isGeneral = checkPermission?.edit_authority || false

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [uploadDialog, setUploadDialog] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState<NewProject>({
    image: null,
    description: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/general/projectlayout/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setProjects(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const openEditDialog = (project: Project) => {
    setSelectedProject(project)
    setPreviewImage(project.image)
    setEditDialog(true)
  }

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project)
    setDeleteDialog(true)
  }

  const handleUpdate = async () => {
    if (!selectedProject) return

    try {
      const formData = new FormData()
      if (selectedFile) {
        formData.append('image', selectedFile)
      }
      formData.append('description', selectedProject.description)

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/general/projectlayout/update/${selectedProject._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      await fetchProjects()
      setEditDialog(false)
      setPreviewImage(null)
      setSelectedFile(null)
      toast.success('Project updated successfully!')
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data
        toast.error(message)
      } else {
        console.log(error)
      }
    }
  }

  const handleDelete = async () => {
    if (!selectedProject) return

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/general/projectlayout/delete/${selectedProject._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      await fetchProjects()
      setDeleteDialog(false)
      toast.success('Project deleted successfully!')
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data
        toast.error(message)
      } else {
        console.log(error)
      }
    }
  }

  const handleUpload = async () => {
    if (!newProject.image) return

    try {
      const formData = new FormData()
      formData.append('image', newProject.image)
      formData.append('description', newProject.description)

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/general/projectlayout/create/layout`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      await fetchProjects()
      setUploadDialog(false)
      setNewProject({ image: null, description: '' })
      setPreviewImage(null)
      toast.success('Project uploaded successfully!')
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data
        toast.error(message)
      } else {
        console.log(error)
      }
    }
  }

  return (
    <section className='relative h-full overflow-hidden bg-background'>
      <div className='max-w-full mx-6'>
        <div className='mb-6 flex justify-end items-center'>
          {/* <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Project Layout
          </h1> */}

          {isGeneral && (
            <button
              className='bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded'
              onClick={() => setUploadDialog(true)}
            >
              Upload Project
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className='space-y-8 mx-auto'>
            {projects.map((project) => (
              <div
                key={project._id}
                className='bg-white shadow-lg rounded-lg overflow-hidden'
              >
                <div className='relative'>
                  <img
                    src={project.image}
                    alt={project.description}
                    className='w-full object-contain'
                  />
                  <div className='mt-2 mx-2 text-center'>
                    <p className=' text-lg font-semibold'>
                      {project.description}
                    </p>
                  </div>
                </div>

                {isGeneral && (
                  <div className='p-4 flex justify-end space-x-3'>
                    <Button
                      label='Edit'
                      icon='pi pi-pencil'
                      className='!bg-blue-900 !text-white hover:!bg-blue-800'
                      onClick={() => openEditDialog(project)}
                    />
                    <Button
                      label='Delete'
                      icon='pi pi-trash'
                      className='!bg-red-600 !text-white hover:!bg-red-700'
                      onClick={() => openDeleteDialog(project)}
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
        header='Edit Project'
        visible={editDialog}
        style={{ width: '52rem' }}
        onHide={() => {
          setEditDialog(false)
          setPreviewImage(null)
          setSelectedFile(null)
        }}
        footer={
          <button
            className='bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded'
            onClick={handleUpdate}
          >
            Save
          </button>
        }
      >
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
                    {selectedProject?.creator || 'N/A'}
                  </p>
                  {selectedProject?.creationTimestamp && (
                    <p className='text-sm text-gray-600'>
                      <span>
                        Date: {selectedProject.creationTimestamp.split(' ')[0]}
                      </span>
                      <span className='mx-1'>•</span>
                      <span>
                        Time: {selectedProject.creationTimestamp.split(' ')[1]}
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
                    {selectedProject?.updater || 'N/A'}
                  </p>
                  {selectedProject?.updatingTimestamp && (
                    <p className='text-sm text-gray-600'>
                      <span>
                        Date: {selectedProject.updatingTimestamp.split(' ')[0]}
                      </span>
                      <span className='mx-1'>•</span>
                      <span>
                        Time: {selectedProject.updatingTimestamp.split(' ')[1]}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col space-y-4'>
          <label className='font-semibold'>Image:</label>
          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='border p-2 rounded'
          />
          {previewImage && (
            <img
              src={previewImage}
              alt='Preview'
              className='w-full h-full object-cover rounded'
            />
          )}
          <label className='font-semibold'>Description:</label>
          <InputTextarea
            value={selectedProject?.description || ''}
            onChange={(e) =>
              setSelectedProject((prev) =>
                prev ? { ...prev, description: e.target.value } : null
              )
            }
          />
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        header='Confirm Delete'
        visible={deleteDialog}
        style={{ width: '32rem' }}
        onHide={() => setDeleteDialog(false)}
        footer={
          <div className='flex justify-end space-x-2'>
            <button
              onClick={() => setDeleteDialog(false)}
              className='bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded'
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
        <p>Are you sure you want to delete this project?</p>
      </Dialog>

      {/* Upload Project Dialog */}
      <Dialog
        header='Upload Project'
        visible={uploadDialog}
        style={{ width: '50vw' }}
        onHide={() => {
          setUploadDialog(false)
          setPreviewImage(null)
          setNewProject({ image: null, description: '' })
        }}
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
          <label className='font-semibold'>Image:</label>
          <input
            type='file'
            accept='image/*'
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setNewProject((prev) => ({ ...prev, image: file }))
                const reader = new FileReader()
                reader.onloadend = () => {
                  setPreviewImage(reader.result as string)
                }
                reader.readAsDataURL(file)
              }
            }}
            className='border p-2 rounded'
          />
          {previewImage && (
            <img
              src={previewImage}
              alt='Preview'
              className='w-full h-48 object-cover rounded'
            />
          )}
          <label className='font-semibold'>Description:</label>
          <InputTextarea
            value={newProject.description}
            onChange={(e) =>
              setNewProject((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={4}
          />
        </div>
      </Dialog>
    </section>
  )
}
