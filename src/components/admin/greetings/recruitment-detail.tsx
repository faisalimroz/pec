import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Chip } from 'primereact/chip'
import MultiFileInput from '@/components/MultiFileInput'
import { toast } from 'sonner'

interface FileInfo {
  url: string
  _id: string
}

interface EmployeeData {
  _id: string
  employeeId: string
  date: string
  employeeName: string
  designation: string
  workingPlace: string
  joiningDate: string
  boqNo: string
  personalRecord: FileInfo[]
  cause: FileInfo[]
  warning: FileInfo[]
  dismiss: FileInfo[]
  resingLetter: FileInfo[]
  evalution: FileInfo[]
  slNo: string
}

interface EmployeeDetailProps {
  id: string
}

export default function RecruitmentDetail({ id }: EmployeeDetailProps) {
  const navigate = useNavigate()
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const [updateEmployeeDialog, setUpdateEmployeeDialog] =
    useState<boolean>(false)
  const [updatedEmployee, setUpdatedEmployee] = useState<EmployeeData | null>(
    null
  )

  const [removedPersonalRecord, setRemovedPersonalRecord] = useState<string[]>(
    []
  )
  const [removedCause, setRemovedCause] = useState<string[]>([])
  const [removedDismiss, setRemovedDismiss] = useState<string[]>([])
  const [removedResingLetter, setRemovedResingLetter] = useState<string[]>([])
  const [removedWarning, setRemovedWarning] = useState<string[]>([])
  const [removedEvaluation, setRemovedEvaluation] = useState<string[]>([])

  const [newPersonalRecord, setNewPersonalRecord] = useState<File[]>([])
  const [newCause, setNewCause] = useState<File[]>([])
  const [newDismiss, setNewDismiss] = useState<File[]>([])
  const [newResingLetterLetters, setNewResingLetterLetters] = useState<File[]>(
    []
  )
  const [newWarningLetters, setNewWarningLetters] = useState<File[]>([])
  const [newEvaluation, setNewEvaluation] = useState<File[]>([])

  // all update dialog func here

  const openUpdateDialog = (employee: EmployeeData) => {
    setUpdatedEmployee({ ...employee })
    setUpdateEmployeeDialog(true)
  }

  const hideUpdateDialog = () => {
    setUpdateEmployeeDialog(false)
    setUpdatedEmployee(null)
    setRemovedCause([])
  }

  function formatDate(dateTime?: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  const removePersonalRecord = (attachmentId: string) => {
    setRemovedPersonalRecord((prev) => [...prev, attachmentId])
    setUpdatedEmployee((prev) => {
      if (!prev) return null
      return {
        ...prev,
        personalRecord: prev.personalRecord.filter(
          (a) => a._id !== attachmentId
        ),
      }
    })
  }

  const removeCause = (attachmentId: string) => {
    setRemovedCause((prev) => [...prev, attachmentId])
    setUpdatedEmployee((prev) => {
      if (!prev) return null
      return {
        ...prev,
        cause: prev.cause.filter((a) => a._id !== attachmentId),
      }
    })
  }

  const removeDismiss = (attachmentId: string) => {
    setRemovedDismiss((prev) => [...prev, attachmentId])
    setUpdatedEmployee((prev) => {
      if (!prev) return null
      return {
        ...prev,
        dismiss: prev.dismiss.filter((a) => a._id !== attachmentId),
      }
    })
  }

  const removeResingLetter = (attachmentId: string) => {
    setRemovedResingLetter((prev) => [...prev, attachmentId])
    setUpdatedEmployee((prev) => {
      if (!prev) return null
      return {
        ...prev,
        resingLetter: prev.resingLetter.filter((a) => a._id !== attachmentId),
      }
    })
  }

  const removeWarningLetter = (attachmentId: string) => {
    setRemovedWarning((prev) => [...prev, attachmentId])
    setUpdatedEmployee((prev) => {
      if (!prev) return null
      return {
        ...prev,
        warning: prev.warning.filter((a) => a._id !== attachmentId),
      }
    })
  }

  const removeEvaluation = (attachmentId: string) => {
    setRemovedEvaluation((prev) => [...prev, attachmentId])
    setUpdatedEmployee((prev) => {
      if (!prev) return null
      return {
        ...prev,
        evaluation: prev.evalution.filter((a) => a._id !== attachmentId),
      }
    })
  }

  const handleUpdateEmployee = async () => {
    if (!updatedEmployee) return

    try {
      setLoading2(true)
      const formData = new FormData()

      // Update employee data
      formData.append('employeeId', updatedEmployee.employeeId)
      formData.append('date', updatedEmployee.date)
      formData.append('employeeName', updatedEmployee.employeeName)
      formData.append('designation', updatedEmployee.designation)
      formData.append('workingPlace', updatedEmployee.workingPlace)
      formData.append('joiningDate', updatedEmployee.joiningDate)
      formData.append('boqNo', updatedEmployee.boqNo)

      // Append new attachments for each category
      newPersonalRecord.forEach((file) =>
        formData.append('personalRecord', file)
      )
      newCause.forEach((file) => formData.append('cvCause', file))
      newResingLetterLetters.forEach((file) =>
        formData.append('resingLetterLetter', file)
      )
      newWarningLetters.forEach((file) =>
        formData.append('warningLetter', file)
      )
      newEvaluation.forEach((file) => formData.append('termination', file))
      newDismiss.forEach((file) => formData.append('agreement', file))

      // removedIds
      removedPersonalRecord.forEach((attachmentId) => {
        formData.append('removePersonalRecord', attachmentId)
      })
      removedCause.forEach((attachmentId) => {
        formData.append('removeCause', attachmentId)
      })

      removedDismiss.forEach((attachmentId) => {
        formData.append('removeAgreement', attachmentId)
      })

      removedResingLetter.forEach((attachmentId) => {
        formData.append('removeResingLetterLetter', attachmentId)
      })

      removedWarning.forEach((attachmentId) => {
        formData.append('removeWarningLetter', attachmentId)
      })

      removedEvaluation.forEach((attachmentId) => {
        formData.append('removeTermination', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/employee-personal/update/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      console.log(res)
      const updatedEmployeeData = res.data
      setEmployeeData(updatedEmployeeData)
      hideUpdateDialog()
      toast.success('Employee updated successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update employee')
    } finally {
      setLoading2(false)
    }
  }

  const updateEmployeeDialogFooter = (
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
        onClick={handleUpdateEmployee}
        loading={loading2}
      />
    </>
  )

  // ending all update dialog funcs

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get<EmployeeData>(
          `${import.meta.env.VITE_BASE_URL}/api/v1/admin/greetings/recruitment/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        setEmployeeData(response.data)
        setLoading(false)
      } catch (err) {
        console.log(err)
        setError('Error fetching employee data')
        setLoading(false)
      }
    }

    fetchEmployeeData()
  }, [id])

  if (loading)
    return (
      <ProgressSpinner
        style={{ width: '50px', height: '50px' }}
        strokeWidth='8'
        fill='var(--surface-ground)'
        animationDuration='.5s'
      />
    )
  if (error) return <div className='text-center mt-8 text-red-500'>{error}</div>
  if (!employeeData)
    return <div className='text-center mt-8'>No employee data found</div>

  console.log(employeeData)

  return (
    <div className='p-4'>
      <button
        type='button'
        className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-3'
        onClick={() => navigate('/administrative/recruitment')}
      >
        <i className='pi pi-arrow-left mr-2'></i>
        Go Back
      </button>
      <div className='flex justify-between align-items-center mb-4'>
        <h1 className='text-3xl font-bold m-0'>
          Employee Personal Profile Details
        </h1>
        <button
          type='button'
          className='inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm font-semibold rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          onClick={() => openUpdateDialog(employeeData)}
        >
          Edit Profile
        </button>
      </div>

      <Card>
        <div className='grid'>
          <div className='col-12 md:col-6'>
            <h2 className='text-xl font-bold mb-4'>Employee Information</h2>
            {/* {Object.entries(employeeData).map(([key, value]) => {
                if (
                  typeof value === 'string' &&
                  ![
                    '_id',
                    'personalRecord',
                    'cause',
                    'warning',
                    'dismiss',
                    'resingLetter',
                    'evalution',
                  ].includes(key)
                ) {
                  return (
                    <div key={key} className='col-12 md:col-6 mb-3'>
                      <span className='font-medium'>
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .trim()
                          .toUpperCase()}
                        :
                      </span>
                      <span className='ml-2'>{value}</span>
                    </div>
                  )
                }
                return null
              })} */}

            {employeeData && (
              <div className='grid grid-cols-12 items-center space-y-2'>
                <div className='col-span-6 space-y-3 text-lg'>
                  <div>
                    <span className='font-medium'>Employee Name:</span>

                    <span className='ml-2'>{employeeData?.employeeName}</span>
                  </div>

                  <div>
                    <span className='font-medium'>Joining Date:</span>

                    <span className='ml-2'>{employeeData?.joiningDate}</span>
                  </div>

                  <div>
                    <span className='font-medium'>BOQ No:</span>

                    <span className='ml-2'>{employeeData?.boqNo}</span>
                  </div>
                </div>

                <div className='col-span-6 space-y-3 text-lg'>
                  <div>
                    <span className='font-medium'>Employee ID:</span>

                    <span className='ml-2'>{employeeData?.employeeId}</span>
                  </div>

                  <div>
                    <span className='font-medium'>Designation:</span>

                    <span className='ml-2'>{employeeData?.designation}</span>
                  </div>

                  <div>
                    <span className='font-medium'>Working Place:</span>

                    <span className='ml-2'>{employeeData?.workingPlace}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='col-12 md:col-6 mt-12'>
            <h2 className='text-xl font-bold mb-4'>Employee Documents</h2>
            <div className='grid grid-cols-2'>
              {/* {[
                'personalRecord',
                'cause',
                'warning',
                'dismiss',
                'resingLetter',
                'evalution',
              ].map((category) => (
                <div key={category} className='mb-4'>
                  <h3 className='text-lg font-semibold mb-2 capitalize'>
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  {employeeData[category as keyof EmployeeData] &&
                    (
                      employeeData[category as keyof EmployeeData] as FileInfo[]
                    ).map((file: FileInfo) => (
                      <Chip
                        key={file._id}
                        label={file.url?.split('/').pop()}
                        className='mr-2 mb-2'
                      />
                    ))}
                </div>
              ))} */}

              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2 capitalize'>
                  Personal Record
                </h3>
                {employeeData.personalRecord.map((file: FileInfo) => (
                  <Chip
                    key={file._id}
                    label={file.url?.split('/').pop()}
                    className='mr-2 mb-2'
                  />
                ))}
              </div>

              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2 capitalize'>
                  Evaluation
                </h3>
                {employeeData.evalution.map((file: FileInfo) => (
                  <Chip
                    key={file._id}
                    label={file.url?.split('/').pop()}
                    className='mr-2 mb-2'
                  />
                ))}
              </div>

              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2 capitalize'>Cause</h3>
                {employeeData.cause.map((file: FileInfo) => (
                  <Chip
                    key={file._id}
                    label={file.url?.split('/').pop()}
                    className='mr-2 mb-2'
                  />
                ))}
              </div>

              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2 capitalize'>
                  Dismiss
                </h3>
                {employeeData.dismiss.map((file: FileInfo) => (
                  <Chip
                    key={file._id}
                    label={file.url?.split('/').pop()}
                    className='mr-2 mb-2'
                  />
                ))}
              </div>

              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2 capitalize'>
                  Resign Letter
                </h3>
                {employeeData.resingLetter.map((file: FileInfo) => (
                  <Chip
                    key={file._id}
                    label={file.url?.split('/').pop()}
                    className='mr-2 mb-2'
                  />
                ))}
              </div>

              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2 capitalize'>
                  Warning
                </h3>
                {employeeData.warning.map((file: FileInfo) => (
                  <Chip
                    key={file._id}
                    label={file.url?.split('/').pop()}
                    className='mr-2 mb-2'
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* update dialog  */}
      <Dialog
        visible={updateEmployeeDialog}
        style={{ width: '50rem' }}
        header='Update Employee'
        modal
        className='p-fluid'
        footer={updateEmployeeDialogFooter}
        onHide={hideUpdateDialog}
      >
        {updatedEmployee && (
          <>
            <div className='field mb-3'>
              <label htmlFor='employeeName' className='block font-bold mb-2'>
                Employee Name
              </label>
              <InputText
                id='employeeName'
                value={updatedEmployee.employeeName}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    employeeName: e.target.value,
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
                value={updatedEmployee.employeeId}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    employeeId: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='boqNo' className='block font-bold mb-2'>
                BoqNo
              </label>
              <InputText
                id='boqNo'
                value={updatedEmployee.boqNo}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    boqNo: e.target.value,
                  })
                }
              />
            </div>

            <div className='field mb-3'>
              <label htmlFor='joiningDate' className='block font-bold mb-2'>
                Joining Date
              </label>
              <InputText
                id='joiningDate'
                value={updatedEmployee.joiningDate}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    joiningDate: e.target.value,
                  })
                }
              />
            </div>

            <div className='field mb-3'>
              <label htmlFor='workingPlace' className='block font-bold mb-2'>
                Working Place
              </label>
              <InputText
                id='workingPlace'
                value={updatedEmployee.workingPlace}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    workingPlace: e.target.value,
                  })
                }
              />
            </div>

            <div className='field mb-3'>
              <label htmlFor='designation' className='block font-bold mb-2'>
                Designation
              </label>
              <InputText
                id='designation'
                value={updatedEmployee.designation}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    designation: e.target.value,
                  })
                }
              />
            </div>

            {/* Add more fields for other employee properties */}

            <div className='field mb-3'>
              <label
                htmlFor='newPersonalRecord'
                className='block font-bold mb-2'
              >
                New Personal Record
              </label>
              <MultiFileInput
                onFilesChange={(files) => setNewPersonalRecord(files)}
              />
            </div>
            <div className='field'>
              <label className='block font-bold mb-2'>
                Existing Personal Record
              </label>
              {updatedEmployee.personalRecord.map((attachment) => (
                <div key={attachment._id} className='flex items-center'>
                  <a
                    href={attachment.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {attachment.url?.split('/').pop()}
                  </a>
                  <Button
                    icon='pi pi-times text-red-500'
                    onClick={() => removePersonalRecord(attachment._id)}
                  />
                </div>
              ))}
            </div>

            <div className='field mb-3'>
              <label htmlFor='newCause' className='block font-bold mb-2'>
                New Cause
              </label>
              <MultiFileInput onFilesChange={(files) => setNewCause(files)} />
            </div>
            <div className='field'>
              <label className='block font-bold mb-2'>Existing Cause</label>
              {updatedEmployee.cause.map((attachment) => (
                <div key={attachment._id} className='flex items-center'>
                  <a
                    href={attachment.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {attachment.url?.split('/').pop()}
                  </a>
                  <Button
                    icon='pi pi-times text-red-500'
                    onClick={() => removeCause(attachment._id)}
                  />
                </div>
              ))}
            </div>

            <div className='mb-3'>
              <label htmlFor='newDismiss' className='block font-bold mb-2'>
                New Dismiss
              </label>
              <MultiFileInput onFilesChange={(files) => setNewDismiss(files)} />
            </div>

            <div className='field'>
              <label className='block font-bold mb-2'>Existing Dismiss</label>
              {updatedEmployee.dismiss.map((attachment) => (
                <div key={attachment._id} className='flex items-center'>
                  <a
                    href={attachment.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {attachment.url?.split('/').pop()}
                  </a>
                  <Button
                    icon='pi pi-times text-red-500'
                    onClick={() => removeDismiss(attachment._id)}
                  />
                </div>
              ))}
            </div>

            <div className='field mb-3'>
              <label
                htmlFor='newResingLetterLetters'
                className='block font-bold mb-2'
              >
                New Resign Letter
              </label>
              <MultiFileInput
                onFilesChange={(files) => setNewResingLetterLetters(files)}
              />
            </div>
            <div className='field'>
              <label className='block font-bold mb-2'>
                Existing Resign Letter
              </label>
              {updatedEmployee.resingLetter.map((attachment) => (
                <div key={attachment._id} className='flex items-center'>
                  <a
                    href={attachment.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {attachment.url?.split('/').pop()}
                  </a>
                  <Button
                    icon='pi pi-times text-red-500'
                    onClick={() => removeResingLetter(attachment._id)}
                  />
                </div>
              ))}
            </div>

            <div className='field mb-3'>
              <label
                htmlFor='newWarningLetters'
                className='block font-bold mb-2'
              >
                New Warning Letters
              </label>
              <MultiFileInput
                onFilesChange={(files) => setNewWarningLetters(files)}
              />
            </div>
            <div className='field'>
              <label className='block font-bold mb-2'>
                Existing Warning Letters
              </label>
              {updatedEmployee.warning.map((attachment) => (
                <div key={attachment._id} className='flex items-center'>
                  <a
                    href={attachment.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {attachment.url?.split('/').pop()}
                  </a>
                  <Button
                    icon='pi pi-times text-red-500'
                    onClick={() => removeWarningLetter(attachment._id)}
                  />
                </div>
              ))}
            </div>

            <div className='field mb-2'>
              <label htmlFor='newEvaluation' className='block font-bold mb-2'>
                New Evaluation
              </label>
              <MultiFileInput
                onFilesChange={(files) => setNewEvaluation(files)}
              />
            </div>
            <div className='field'>
              <label className='block font-bold mb-2'>
                Existing Evaluation
              </label>
              {updatedEmployee.evalution.map((attachment) => (
                <div key={attachment._id} className='flex items-center'>
                  <a
                    href={attachment.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {attachment.url?.split('/').pop()}
                  </a>
                  <Button
                    icon='pi pi-times text-red-500'
                    onClick={() => removeEvaluation(attachment._id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </Dialog>
    </div>
  )
}
