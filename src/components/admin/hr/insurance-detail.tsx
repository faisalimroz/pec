import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { Download } from 'lucide-react'
import MultiFileInput from '@/components/MultiFileInput'
import { useAuth } from '@/provider/authProvider'
import { useLocation } from 'react-router-dom'

interface Attachment {
  url: string
  attachmentDate: string
  _id: string
}

interface InsuranceData {
  _id: string
  name: string
  employeeId: string
  mobilizationDate: string
  effectiveDate: string
  position: string
  dept: string
  placeOfWork: string
  type: string
  dateOfInsurance: string
  yearOfInsurance: string
  calmingDate: string
  receivedCompensation: string
  derivedCompensation: string
  numberOfEmployee: string
  BOQ: string
  slNo: string
  remarks: string
  attachments: Attachment[]
}

export default function InsuranceDetail({ id }: any) {
  // const { id } = useParams<{ id: string }>()
  const [insuranceData, setInsuranceData] = useState<InsuranceData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [updateInsuranceDialog, setUpdateInsuranceDialog] =
    useState<boolean>(false)
  const [updatedInsurance, setUpdatedInsurance] =
    useState<InsuranceData | null>(null)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const pageParam = searchParams.get('page')

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'admin')
  const checkPermission = checkRole?.children.find((c) => c.name === 'hr')

  const hasEditAccess = checkPermission?.edit_authority || false

  const isAdmin = roles.some((role) =>
    ['superadmin', 'admin'].includes(role.title)
  )

  useEffect(() => {
    const fetchInsuranceData = async () => {
      try {
        const response = await axios.get<InsuranceData>(
          `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/insurance/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        setInsuranceData(response.data)
        setLoading(false)
      } catch (err) {
        setError('Error fetching insurance data')
        setLoading(false)
      }
    }

    fetchInsuranceData()
  }, [id])

  const openUpdateDialog = (insurance: InsuranceData) => {
    setUpdatedInsurance({ ...insurance })
    setUpdateInsuranceDialog(true)
  }

  const hideUpdateDialog = () => {
    setUpdateInsuranceDialog(false)
    setUpdatedInsurance(null)
    setNewAttachments([])
    setRemovedAttachments([])
  }

  const handleNewAttachments = (files: File[]) => {
    setNewAttachments(files)
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    setRemovedAttachments((prev) => [...prev, attachmentId])
    setUpdatedInsurance((prev) => {
      if (!prev) return null
      return {
        ...prev,
        attachments: prev.attachments.filter((a) => a._id !== attachmentId),
      }
    })
  }

  const handleUpdateInsurance = async () => {
    if (!updatedInsurance) return

    try {
      setLoading2(true)
      const formData = new FormData()
      formData.append('name', updatedInsurance.name)
      formData.append('employeeId', updatedInsurance.employeeId)
      formData.append('mobilizationDate', updatedInsurance.mobilizationDate)
      formData.append('effectiveDate', updatedInsurance.effectiveDate)
      formData.append('position', updatedInsurance.position)
      formData.append('dept', updatedInsurance.dept)
      formData.append('placeOfWork', updatedInsurance.placeOfWork)
      formData.append('type', updatedInsurance.type)
      formData.append('dateOfInsurance', updatedInsurance.dateOfInsurance)
      formData.append('yearOfInsurance', updatedInsurance.yearOfInsurance)
      formData.append('calmingDate', updatedInsurance.calmingDate)
      formData.append(
        'receivedCompensation',
        updatedInsurance.receivedCompensation
      )
      formData.append(
        'derivedCompensation',
        updatedInsurance.derivedCompensation
      )
      formData.append('numberOfEmployee', updatedInsurance.numberOfEmployee)
      formData.append('remarks', updatedInsurance.remarks)

      newAttachments.forEach((file) => {
        formData.append('attachments', file)
      })

      removedAttachments.forEach((attachmentId) => {
        formData.append('removedAttachments', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/insurance/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      setInsuranceData(res.data)
      hideUpdateDialog()
      toast.success('Insurance updated successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update insurance')
    } finally {
      setLoading2(false)
    }
  }

  function formatDate(dateTime?: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  const updateInsuranceDialogFooter = (
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
        onClick={handleUpdateInsurance}
        loading={loading2}
      />
    </>
  )

  if (loading) return <div className='text-center mt-8'>Loading...</div>
  if (error) return <div className='text-center mt-8 text-red-500'>{error}</div>
  if (!insuranceData)
    return <div className='text-center mt-8'>No insurance data found</div>

  // console.log(insuranceData)

  return (
    <>
      <Link
        to={`/administrative/insurance-management${
          pageParam ? `?page=${pageParam}` : ''
        }`}
        className='text-lg font-semibold py-2 px-4 border border-gray-300 rounded-md text-gray-800 hover:border-gray-400 hover:bg-gray-400 hover:text-white ml-3'
      >
        <i className='pi pi-arrow-left' /> Go Back
      </Link>
      <div className='flex justify-between ml-3 pt-3'>
        <h1 className='text-3xl text-primary font-bold'>Insurance Details</h1>
        {hasEditAccess && (
          <button
            type='button'
            className='text-lg font-semibold border border-gray-300 rounded-md px-4 py-2 hover:border-gray-400 hover:bg-gray-200 outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            onClick={() => openUpdateDialog(insuranceData)}
          >
            Edit Insurance Details
          </button>
        )}
      </div>

      <div className='p-4'>
        <Card className='mb-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-6'>
            {/* Left Section */}
            <div>
              <h2 className='text-xl font-bold mb-6 bg-red-100 p-3 rounded'>
                Insurance Information
              </h2>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>Employee Name</span>
                  <span>{insuranceData?.name || 'N/A'}</span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>Employee ID</span>
                  <span>{insuranceData?.employeeId || 'N/A'}</span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>BOQ NO.</span>
                  <span>{insuranceData?.BOQ || 'N/A'}</span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>Position</span>
                  <span>{insuranceData?.position || 'N/A'}</span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>Department Name</span>
                  <span>{insuranceData?.dept || 'N/A'}</span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>
                    Insurance Claiming Information
                  </span>
                  <div className='space-y-2'>
                    {insuranceData?.attachments?.map((attachment, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-2 underline'
                      >
                        <span>{attachment.url?.split('/').pop()}</span>
                        <span>{attachment.attachmentDate}</span>
                        <Download className='h-4 w-4 cursor-pointer text-blue-600' />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div>
              <h2 className='text-xl font-bold mb-6 bg-red-100 p-3 rounded'>
                Dates and Compensation
              </h2>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>Place of work</span>
                  <span>{insuranceData?.placeOfWork || 'N/A'}</span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>Inclusion/Exclusion</span>
                  <span>{insuranceData?.type || 'N/A'}</span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>
                    Year of insurance coverage
                  </span>
                  <span>{insuranceData?.yearOfInsurance || 'N/A'}</span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>Effective Date</span>
                  <span>{insuranceData?.effectiveDate || 'N/A'}</span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>Received Compensation</span>
                  <span>{insuranceData?.receivedCompensation || 'N/A'}</span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>Derived Compensation</span>
                  <span>{insuranceData?.derivedCompensation || 'N/A'}</span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <span className='font-semibold'>Remarks</span>
                  <span>{insuranceData?.remarks || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Dialog
        visible={updateInsuranceDialog}
        style={{ width: '50rem' }}
        header='Update Insurance'
        modal
        className='p-fluid'
        footer={updateInsuranceDialogFooter}
        onHide={hideUpdateDialog}
      >
        {updatedInsurance && (
          <>
            <div className='field mb-3'>
              <label htmlFor='name' className='block font-bold mb-2'>
                Name
              </label>
              <InputText
                id='name'
                value={updatedInsurance.name}
                onChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    name: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='employeeId' className='block font-bold mb-2'>
                Employee ID
              </label>
              <InputText
                id='employeeId'
                value={updatedInsurance.employeeId}
                onChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    employeeId: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='position' className='block font-bold mb-2'>
                Position
              </label>
              <InputText
                id='position'
                value={updatedInsurance.position}
                onChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    position: e.target.value,
                  })
                }
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='dept' className='block font-bold mb-2'>
                Department
              </label>
              <InputText
                id='dept'
                value={updatedInsurance.dept}
                onChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    dept: e.target.value,
                  })
                }
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='placeOfWork' className='block font-bold mb-2'>
                Place of Work
              </label>
              <InputText
                id='placeOfWork'
                value={updatedInsurance.placeOfWork}
                onChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    placeOfWork: e.target.value,
                  })
                }
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='type' className='block font-bold mb-2'>
                Type
              </label>
              <Dropdown
                id='type'
                value={updatedInsurance.type}
                options={['Inclusion', 'Exclusion']}
                onChange={(e) =>
                  setUpdatedInsurance({ ...updatedInsurance, type: e.value })
                }
                placeholder='Select Type'
              />
            </div>
            <div className='field mb-3'>
              <label
                htmlFor='mobilizationDate'
                className='block font-bold mb-2'
              >
                Mobilization Date
              </label>
              <Calendar
                id='mobilizationDate'
                value={
                  new Date(
                    updatedInsurance?.mobilizationDate
                      .split('-')
                      .reverse()
                      .join('-')
                  )
                }
                onChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    mobilizationDate: e.value ? formatDate(e.value) : '',
                  })
                }
                dateFormat='dd-mm-yy'
              />
            </div>

            <div className='field mb-3'>
              <label htmlFor='effectiveDate' className='block font-bold mb-2'>
                Effective Date
              </label>
              <Calendar
                id='effectiveDate'
                value={
                  new Date(
                    updatedInsurance?.effectiveDate
                      .split('-')
                      .reverse()
                      .join('-')
                  )
                }
                onChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    effectiveDate: e.value ? formatDate(e.value) : '',
                  })
                }
                dateFormat='dd-mm-yy'
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='dateOfInsurance' className='block font-bold mb-2'>
                Date of Insurance
              </label>
              <Calendar
                id='dateOfInsurance'
                value={
                  new Date(
                    updatedInsurance?.dateOfInsurance
                      .split('-')
                      .reverse()
                      .join('-')
                  )
                }
                onChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    dateOfInsurance: e.value ? formatDate(e.value) : '',
                  })
                }
                dateFormat='dd-mm-yy'
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='yearOfInsurance' className='block font-bold mb-2'>
                Year of Insurance
              </label>
              <InputText
                id='yearOfInsurance'
                value={updatedInsurance.yearOfInsurance}
                onChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    yearOfInsurance: e.target.value,
                  })
                }
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='calmingDate' className='block font-bold mb-2'>
                Calming Date
              </label>
              <Calendar
                id='calmingDate'
                value={
                  new Date(
                    updatedInsurance?.calmingDate.split('-').reverse().join('-')
                  )
                }
                onChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    calmingDate: e.value ? formatDate(e.value) : '',
                  })
                }
                dateFormat='dd-mm-yy'
              />
            </div>
            <div className='field mb-3'>
              <label
                htmlFor='receivedCompensation'
                className='block font-bold mb-2'
              >
                Received Compensation
              </label>
              <InputNumber
                id='receivedCompensation'
                value={parseFloat(updatedInsurance.receivedCompensation)}
                onValueChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    receivedCompensation: e.value?.toString() || '',
                  })
                }
                mode='currency'
                currency='BDT'
              />
            </div>
            <div className='field mb-3'>
              <label
                htmlFor='derivedCompensation'
                className='block font-bold mb-2'
              >
                Derived Compensation
              </label>
              <InputNumber
                id='derivedCompensation'
                value={parseFloat(updatedInsurance.derivedCompensation)}
                onValueChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    derivedCompensation: e.value?.toString() || '',
                  })
                }
                mode='currency'
                currency='BDT'
              />
            </div>
            <div className='field mb-3'>
              <label
                htmlFor='numberOfEmployee'
                className='block font-bold mb-2'
              >
                Number of Employees
              </label>
              <InputNumber
                id='numberOfEmployee'
                value={parseFloat(updatedInsurance.numberOfEmployee)}
                onValueChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    numberOfEmployee: e.value?.toString() || '',
                  })
                }
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='remarks' className='block font-bold mb-2'>
                Remarks
              </label>
              <InputText
                id='remarks'
                value={updatedInsurance.remarks}
                onChange={(e) =>
                  setUpdatedInsurance({
                    ...updatedInsurance,
                    remarks: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className='col-span-2'>
              <h3 className='font-bold mb-2'>Existing Attachments</h3>
              <div className='flex flex-wrap gap-3'>
                {updatedInsurance.attachments.map((attachment) => (
                  <div
                    key={attachment._id}
                    className='flex items-center gap-2 bg-gray-100 p-1 rounded-md'
                  >
                    <a
                      href={attachment.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      {attachment.url?.split('/').pop()}
                    </a>
                    <Button
                      icon='pi pi-times text-red-500'
                      className='p-button-rounded text-sm text-red-500 ml-2'
                      onClick={() => handleRemoveAttachment(attachment._id)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className='col-span-2'>
              <h3 className='font-bold mb-2'>Add New Attachments</h3>
              <MultiFileInput onFilesChange={handleNewAttachments} />
            </div>
          </>
        )}
      </Dialog>
    </>
  )
}
