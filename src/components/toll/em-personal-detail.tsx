import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import MultiFileInput from '@/components/MultiFileInput'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import { useAuth } from '@/provider/authProvider'
import { useLocation } from 'react-router-dom'
import jsPDF from 'jspdf'

interface EmployeeData {
  _id: string
  employeeName: string
  employeeId: string
  dept: string
  position: string

  salary: string
  boqNo: string
  location: string
  branch: string
  mobile: string
  address: string
  email: string
  dateOfMobilization: string
  dateOfDemobilization: string
  remarks: string
  cvCertificates: { url: string; _id: string }[]
  agreement: { url: string; _id: string }[]
  showcaseLetter: { url: string; _id: string }[]
  warningLetter: { url: string; _id: string }[]
  termination: { url: string; _id: string }[]
  insuranceClaiming: { url: string; _id: string }[]
  profileImg: string
}

interface EmPersonalDetailProps {
  id: string
  isDialog?: boolean
}

export default function EmPersonalDetail({
  id,
  isDialog = false,
}: EmPersonalDetailProps) {
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [updateEmployeeDialog, setUpdateEmployeeDialog] =
    useState<boolean>(false)
  const [updatedEmployee, setUpdatedEmployee] = useState<EmployeeData | null>(
    null
  )
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null)
  const [newProfileImagePreview, setNewProfileImagePreview] = useState<
    string | null
  >(null)

  const [removedCertificates, setRemovedCertificates] = useState<string[]>([])
  const [removedAgreements, setRemovedAgreements] = useState<string[]>([])
  const [removedShowcase, setRemovedShowcase] = useState<string[]>([])
  const [removedWarning, setRemovedWarning] = useState<string[]>([])
  const [removedTermination, setRemovedTermination] = useState<string[]>([])
  const [removedInsuranceClaiming, setRemovedInsuranceClaiming] = useState<
    string[]
  >([])

  const [newCertificates, setNewCertificates] = useState<File[]>([])
  const [newAgreements, setNewAgreements] = useState<File[]>([])
  const [newShowcaseLetters, setNewShowcaseLetters] = useState<File[]>([])
  const [newWarningLetters, setNewWarningLetters] = useState<File[]>([])
  const [newTerminations, setNewTerminations] = useState<File[]>([])
  const [newInsuranceClaimings, setNewInsuranceClaimings] = useState<File[]>([])
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const pageParam = searchParams.get('page')

  // all update dialog func here
  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'admin')
  const checkPermission = checkRole?.children.find((c) => c.name === 'hr')

  const hasEditAccess = checkPermission?.edit_authority || false

  const isAdmin = roles.some((role) =>
    ['superadmin', 'admin'].includes(role.title)
  )

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setNewProfileImage(file)

      // Create a preview URL
      const previewURL = URL.createObjectURL(file)
      setNewProfileImagePreview(previewURL)
    } else {
      setNewProfileImage(null)
      setNewProfileImagePreview(null)
    }
  }

  const handleRemoveProfileImage = () => {
    setNewProfileImage(null)
    setNewProfileImagePreview(null)
    setDeleteProductDialog(false)

    setUpdatedEmployee((prev) =>
      prev
        ? {
          ...prev,
          profileImg: '',
        }
        : null
    )
    // Reset the file input
    const fileInput = document.getElementById(
      'profileImage'
    ) as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const openUpdateDialog = (employee: EmployeeData) => {
    setUpdatedEmployee({ ...employee })
    setUpdateEmployeeDialog(true)
  }

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false)
  }

  const deleteProductDialogFooter = (
    <div className='flex justify-end gap-2'>
      <button
        type='button'
        className='text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-semibold py-2 px-4 rounded border'
        onClick={hideDeleteProductDialog}
      >
        No
      </button>
      <button
        type='button'
        className='bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded'
        onClick={handleRemoveProfileImage}
      >
        Yes
      </button>
    </div>
  )

  const confirmDeleteProduct = () => {
    setDeleteProductDialog(true)
  }
  const hideUpdateDialog = () => {
    setUpdateEmployeeDialog(false)
    setUpdatedEmployee(null)
    setRemovedCertificates([])
  }

  function formatDate(dateTime?: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  const removeCertificates = (attachmentId: string) => {
    setRemovedCertificates((prev) => [...prev, attachmentId])
    setUpdatedEmployee((prev) => {
      if (!prev) return null
      return {
        ...prev,
        cvCertificates: prev.cvCertificates.filter(
          (a) => a._id !== attachmentId
        ),
      }
    })
  }

  const removeAgreement = (attachmentId: string) => {
    setRemovedAgreements((prev) => [...prev, attachmentId])
    setUpdatedEmployee((prev) => {
      if (!prev) return null
      return {
        ...prev,
        agreement: prev.agreement.filter((a) => a._id !== attachmentId),
      }
    })
  }

  const removeShowcaseLetter = (attachmentId: string) => {
    setRemovedShowcase((prev) => [...prev, attachmentId])
    setUpdatedEmployee((prev) => {
      if (!prev) return null
      return {
        ...prev,
        showcaseLetter: prev.showcaseLetter.filter(
          (a) => a._id !== attachmentId
        ),
      }
    })
  }

  const removeWarningLetter = (attachmentId: string) => {
    setRemovedWarning((prev) => [...prev, attachmentId])
    setUpdatedEmployee((prev) => {
      if (!prev) return null
      return {
        ...prev,
        warningLetter: prev.warningLetter.filter((a) => a._id !== attachmentId),
      }
    })
  }

  const removeTermination = (attachmentId: string) => {
    setRemovedTermination((prev) => [...prev, attachmentId])
    setUpdatedEmployee((prev) => {
      if (!prev) return null
      return {
        ...prev,
        termination: prev.termination.filter((a) => a._id !== attachmentId),
      }
    })
  }

  const removeInsuranceClaiming = (attachmentId: string) => {
    setRemovedInsuranceClaiming((prev) => [...prev, attachmentId])
    setUpdatedEmployee((prev) => {
      if (!prev) return null
      return {
        ...prev,
        insuranceClaiming: prev.insuranceClaiming.filter(
          (a) => a._id !== attachmentId
        ),
      }
    })
  }

  const handleUpdateEmployee = async () => {
    if (!updatedEmployee) return

    try {
      setLoading2(true)

      if (updatedEmployee.profileImg === '') {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/v1/toll/employee-personal-profile/delete/profile-img/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
      }

      const formData = new FormData()

      // Update employee data
      formData.append('employeeName', updatedEmployee.employeeName || '')
      formData.append('employeeId', updatedEmployee.employeeId || '')
      formData.append('dept', updatedEmployee.dept || '')
      formData.append('position', updatedEmployee.position || '')
      formData.append(
        'dateOfMobilization',
        updatedEmployee.dateOfMobilization || ''
      )
      formData.append(
        'dateOfDemobilization',
        updatedEmployee.dateOfDemobilization || ''
      )
      formData.append('remarks', updatedEmployee.remarks || '')
      formData.append('salary', updatedEmployee.salary || '')
      formData.append('boqNo', updatedEmployee.boqNo || '')
      formData.append('location', updatedEmployee.location || '')

      formData.append('branch', updatedEmployee.branch || '')
      formData.append('mobile', updatedEmployee.mobile || '')
      formData.append('address', updatedEmployee.address || '')
      formData.append('salary', updatedEmployee.salary || '')
      formData.append('email', updatedEmployee.email || '')
      if (!newProfileImage) {
        formData.append('profileImg', '')
      } else {
        formData.append('profileImg', newProfileImage)
      }

      // Append new attachments for each category
      newCertificates.forEach((file) => formData.append('cvCertificates', file))
      newShowcaseLetters.forEach((file) =>
        formData.append('showcaseLetter', file)
      )
      newWarningLetters.forEach((file) =>
        formData.append('warningLetter', file)
      )
      newTerminations.forEach((file) => formData.append('termination', file))
      newAgreements.forEach((file) => formData.append('agreement', file))
      newInsuranceClaimings.forEach((file) =>
        formData.append('insuranceClaiming', file)
      )

      // removedIds
      removedCertificates.forEach((attachmentId) => {
        formData.append('removeCertificates', attachmentId)
      })

      removedAgreements.forEach((attachmentId) => {
        formData.append('removeAgreement', attachmentId)
      })

      removedShowcase.forEach((attachmentId) => {
        formData.append('removeShowcaseLetter', attachmentId)
      })

      removedWarning.forEach((attachmentId) => {
        formData.append('removeWarningLetter', attachmentId)
      })

      removedTermination.forEach((attachmentId) => {
        formData.append('removeTermination', attachmentId)
      })

      removedInsuranceClaiming.forEach((attachmentId) => {
        formData.append('removeInsuranceClaiming', attachmentId)
      })

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/employee-personal-profile/update/${id}`,
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

  const getImageDataUrl = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Error converting image to data URL:', error)
      throw error
    }
  }

  const downloadEmployeePDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageHeight = pdf.internal.pageSize.getHeight()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 20
      let yPos = 20

      // --- Helper function to draw a section with a title and key-value pairs ---
      const drawSection = (
        title: string,
        data: { label: string; value: any }[],
        startY: number
      ) => {
        let y = startY
        // Section Title
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text(title, margin, y)
        y += 3

        // Underline
        pdf.setDrawColor(200, 200, 200) // light grey
        pdf.line(margin, y, pageWidth - margin, y)
        y += 10

        // Section Content
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')

        const labelX = margin + 5
        const valueX = margin + 60 // X position for values

        data.forEach((item) => {
          if (item.value) {
            // Check for page overflow
            if (y > pageHeight - margin) {
              pdf.addPage()
              y = margin
            }
            pdf.setFont('helvetica', 'bold')
            pdf.text(`${item.label}:`, labelX, y)
            pdf.setFont('helvetica', 'normal')
            pdf.text(String(item.value), valueX, y)
            y += 8
          }
        })
        return y + 5 // Return new y position with some padding
      }

      // --- PDF Content ---

      if (!employeeData) return

      // --- Header with Profile Image ---
      yPos = 30
      const imageUrl =
        employeeData.profileImg ||
        `https://avatar.iran.liara.run/username?username=${employeeData.employeeName.replace(
          /\s+/g,
          '+'
        )}`

      try {
        const imageDataUrl = await getImageDataUrl(imageUrl)
        pdf.addImage(imageDataUrl, 'JPEG', margin, yPos, 35, 35)
      } catch (imageError) {
        console.error('Error adding profile image:', imageError)
        // Continue without image
      }

      // Employee Name and Title next to image
      pdf.setFontSize(22)
      pdf.setFont('helvetica', 'bold')
      pdf.text(employeeData.employeeName, margin + 45, yPos + 15)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 100, 100) // Grey color for subtitle
      pdf.text(employeeData.position || 'Employee', margin + 45, yPos + 25)

      yPos += 50 // Move down past the header section

      // Reset text color
      pdf.setTextColor(0, 0, 0)

      // --- Sections ---
      yPos = drawSection('Personal Information', personalInfo, yPos)
      yPos = drawSection('Contact Information', contactInfo, yPos)

      // --- Documents Section ---
      if (documents.some((doc) => doc.files && doc.files.length > 0)) {
        // Check for page overflow before adding new section
        if (yPos > pageHeight - 40) {
          // 40 is an arbitrary value for section space
          pdf.addPage()
          yPos = margin
        }

        // Section Title
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Documents', margin, yPos)
        yPos += 3

        // Underline
        pdf.setDrawColor(200, 200, 200)
        pdf.line(margin, yPos, pageWidth - margin, yPos)
        yPos += 10

        documents.forEach((doc) => {
          if (doc.files && doc.files.length > 0) {
            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'bold')
            pdf.text(`${doc.label}:`, margin + 5, yPos)
            yPos += 8

            doc.files.forEach((file) => {
              if (yPos > pageHeight - margin) {
                pdf.addPage()
                yPos = margin
              }
              const fileName =
                file.url
                  ?.split('/')
                  .pop()
                  ?.replace(/_.*(?=\.[^.]*$)/, '')
                  ?.replace(/__.*(?=\.[^.]*$)/, '') || 'link'
              pdf.setFont('helvetica', 'normal')
              pdf.setTextColor(0, 0, 255) // Blue for links
              pdf.textWithLink(fileName, margin + 10, yPos, {
                url: file.url || '#',
              })
              yPos += 8
            })
            pdf.setTextColor(0, 0, 0) // Reset color
            yPos += 4 // Extra space between document types
          }
        })
      }

      // --- Footer ---
      // @ts-ignore
      const pageCount = pdf.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.setFontSize(9)
        pdf.setTextColor(150, 150, 150)
        const footerText = `Page ${i} of ${pageCount} | Generated on: ${new Date().toLocaleDateString()}`
        pdf.text(footerText, pageWidth / 2, pageHeight - 10, {
          align: 'center',
        })
      }

      // --- Save PDF ---
      pdf.save(`Employee-${employeeData?.employeeName || id}.pdf`)
      toast.success('PDF generated successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
    }
  }

  const updateEmployeeDialogFooter = (
    <>
      <Button
        label='Cancel'
        icon='pi pi-times'
        outlined
        className='border-main text-main'
        onClick={hideUpdateDialog}
      />
      <Button
        label='Update'
        icon='pi pi-check'
        className='bg-main text-white'
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
          `${import.meta.env.VITE_BASE_URL}/api/v1/toll/employee-personal-profile/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        setEmployeeData(response.data)
        setLoading(false)
      } catch (err) {
        setError('Error fetching employee data')
        setLoading(false)
      }
    }

    fetchEmployeeData()
  }, [id])

  if (loading) return <div className='text-center mt-8'>Loading...</div>
  if (error) return <div className='text-center mt-8 text-red-500'>{error}</div>
  if (!employeeData)
    return <div className='text-center mt-8'>No employee data found</div>

  const personalInfo = [
    { label: 'Employee Name', value: employeeData.employeeName },
    { label: 'Employee ID', value: employeeData.employeeId },
    { label: 'Department Name', value: employeeData.dept },
    { label: 'Position', value: employeeData.position },
    { label: 'Salary', value: employeeData.salary },


    { label: 'BOQ NO.', value: employeeData.boqNo },
    // { label: 'Branch', value: employeeData.branch },

    { label: 'Date of Mobilization', value: employeeData.dateOfMobilization },
    {
      label: 'Date of Demobilization',
      value: employeeData.dateOfDemobilization,
    },

  ]

  const contactInfo = [
    { label: 'Mobile', value: employeeData.mobile },

  ]

  const documents = [
    { label: 'Upload CV', files: employeeData.cvCertificates },
    // { label: 'Employment Agreement', files: employeeData.agreement },
    // { label: 'Showcase Letter', files: employeeData.showcaseLetter },
    // { label: 'Warning Letter', files: employeeData.warningLetter },
    // { label: 'Resignation or Termination', files: employeeData.termination },
    // { label: 'Insurance Claiming', files: employeeData.insuranceClaiming },
  ]

  // console.log(employeeData)

  return (
    <>
      {!isDialog && (
        <div className='flex justify-between items-center'>
          <Link
            to={`/administrative/employee-personal-profile${pageParam ? `?page=${pageParam}` : ''
              }`}
            className='text-lg font-semibold py-2 px-4 border border-gray-300 rounded-md text-gray-800 hover:border-gray-400 hover:bg-gray-400 hover:text-white ml-3'
          >
            <i className='pi pi-arrow-left' /> Go Back
          </Link>
        </div>
      )}

      <div className='flex justify-between ml-3 pt-3'>
        <h1 className='text-3xl text-main font-bold'>
          Employee Personal Profile Details
        </h1>
        {hasEditAccess && (
          <div>
            <button
              type='button'
              className='text-lg font-semibold py-2 px-4 border border-gray-300 rounded-md text-gray-800 hover:border-gray-400 hover:bg-gray-400  m-3'
              onClick={() => openUpdateDialog(employeeData)}
            >
              Edit Profile Details
            </button>

            <button
              onClick={downloadEmployeePDF}
              className='text-lg font-semibold py-2 px-4 border border-gray-300 rounded-md text-gray-800 hover:border-gray-400 hover:bg-gray-400  m-3'
            >
              <i className='pi pi-download' /> Download PDF
            </button>
          </div>
        )}
      </div>

      <div className='p-4'>
        <Card className='mb-4'>
          <div className='flex flex-col md:flex-row items-start gap-6 p-6 bg-white  rounded-lg'>

            <div className='flex-shrink-0'>
              <img
                src={
                  employeeData?.profileImg ||
                  `https://avatar.iran.liara.run/username?username=${employeeData?.employeeName?.replace(/\s+/g, '+') || 'unknown'}}`
                }
                alt='Employee Profile'
                className='w-[250px] h-auto object-cover rounded'
              />
            </div>


            <div className='flex-grow'>
              <h2 className='text-xl font-bold mb-4 bg-red-200 p-2 rounded'>
                Employee Personal Profile
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                {personalInfo.map((item, index) => (
                  <div key={index} className='flex items-start'>
                    <span className='font-semibold mr-2'>{item.label}:</span>
                    <span className='text-gray-900'>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-3'>
            <div>
              <h2 className='text-xl font-bold mb-4 bg-red-200 p-2 rounded'>
                Contact Information
              </h2>
              {contactInfo.map((item, index) => (
                <div key={index} className='mb-2'>
                  <span className='font-semibold mr-2'>{item.label}:</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
            <div>
              <h2 className='text-xl font-bold mb-4 bg-red-200 p-2 rounded'>
                Employee Personal Documents and Attachment
              </h2>
              {documents.map((doc, index) => (
                <div key={index} className='mb-2'>
                  <span className='font-semibold'>{doc.label}</span>
                  {doc.files &&
                    doc.files.map((file, fileIndex) => (
                      <div key={fileIndex} className='mt-1'>
                        <a
                          href={file?.url}
                          target='_blank'
                          rel='noreferrer'
                          className='text-blue-600'
                        >
                          {file.url
                            ?.split('/')
                            .pop()
                            ?.replace(/_.*(?=\.[^.]*$)/, '')
                            ?.replace(/__.*(?=\.[^.]*$)/, '')}
                        </a>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* update data dialog  */}
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
              <label htmlFor='profileImage' className='block font-bold mb-2'>
                Profile Image
              </label>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2 relative w-fit'>
                  <img
                    src={
                      newProfileImagePreview ||
                      updatedEmployee?.profileImg ||
                      `https://avatar.iran.liara.run/username?username=${updatedEmployee.employeeName.replace(/\s+/g, '+')}`
                    }
                    alt='No File Selected'
                    className='w-24 h-24 object-cover rounded-full'
                  />
                  <input
                    type='file'
                    id='profileImage'
                    accept='image/*'
                    onChange={handleProfileImageChange}
                    className='border p-2 rounded'
                  />
                  <button
                    onClick={confirmDeleteProduct}
                    className='absolute -top-1 -left-2  px-2 py-0 bg-red-500 text-white rounded-full'
                  >
                    X
                  </button>
                </div>
              </div>
            </div>

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
              <label htmlFor='dept' className='block font-bold mb-2'>
                Department
              </label>
              <InputText
                id='dept'
                value={updatedEmployee.dept}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    dept: e.target.value,
                  })
                }
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='position' className='block font-bold mb-2'>
                Position
              </label>
              <InputText
                id='position'
                value={updatedEmployee.position}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    position: e.target.value,
                  })
                }
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='salary' className='block font-bold mb-2'>
                Salary
              </label>
              <InputNumber
                id='salary'
                value={
                  updatedEmployee.salary
                    ? parseFloat(updatedEmployee.salary)
                    : undefined
                }
                onValueChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    salary: e.value?.toString() || '',
                  })
                }
                mode='currency'
                currency='BDT'
              />
            </div>
            {/* <div className='field mb-3'>
              <label htmlFor='remarks' className='block font-bold mb-2'>
                Remarks
              </label>
              <InputText
                id='remarks'
                value={updatedEmployee.remarks}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    remarks: e.target.value,
                  })
                }
              />
            </div> */}

            {/* <div className='field mb-3'>
              <label htmlFor='salary' className='block font-bold mb-2'>
                Salary
              </label>
              <InputNumber
                id='salary'
                value={
                  updatedEmployee.salary
                    ? parseFloat(updatedEmployee.salary)
                    : undefined
                }
                onValueChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    salary: e.value?.toString() || '',
                  })
                }
                mode='currency'
                currency='BDT'
              />
            </div> */}

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

            {/* <div className='field mb-3'>
              <label htmlFor='location' className='block font-bold mb-2'>
                Location
              </label>
              <InputText
                id='location'
                value={updatedEmployee.location}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    location: e.target.value,
                  })
                }
              />
            </div> */}
            {/* 
            <div className='field mb-3'>
              <label htmlFor='firmName' className='block font-bold mb-2'>
                Firm Name
              </label>
              <InputText
                id='firmName'
                value={updatedEmployee.firmName}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    firmName: e.target.value,
                  })
                }
              />
            </div> */}

            {/* <div className='field mb-3'>
              <label htmlFor='branch' className='block font-bold mb-2'>
                Branch
              </label>
              <InputText
                id='branch'
                value={updatedEmployee.branch}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    branch: e.target.value,
                  })
                }
              />
            </div> */}

            <div className='field mb-3'>
              <label htmlFor='mobile' className='block font-bold mb-2'>
                Mobile
              </label>
              <InputText
                id='mobile'
                value={updatedEmployee.mobile}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    mobile: e.target.value,
                  })
                }
              />
            </div>

            {/* <div className='field mb-3'>
              <label htmlFor='address' className='block font-bold mb-2'>
                Address
              </label>
              <InputText
                id='address'
                value={updatedEmployee.address}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div className='field mb-3'>
              <label htmlFor='email' className='block font-bold mb-2'>
                Email
              </label>
              <InputText
                id='email'
                value={updatedEmployee.email}
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    email: e.target.value,
                  })
                }
              />
            </div> */}

            {/* Add more fields for other employee properties */}
            <div className='field'>
              <label htmlFor='date' className='font-bold'>
                Date Of Mobilization
              </label>
              <Calendar
                id='date'
                value={
                  updatedEmployee?.dateOfMobilization
                    ? new Date(
                      updatedEmployee.dateOfMobilization
                        .split('-')
                        .reverse()
                        .join('-')
                    )
                    : null
                }
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    dateOfMobilization: e.value ? formatDate(e.value) : '',
                  })
                }
              // dateFormat='dd/mm/yy'
              />
            </div>

            <div className='field'>
              <label htmlFor='date2' className='font-bold'>
                Date Of Demobilization
              </label>
              <Calendar
                id='date2'
                value={
                  updatedEmployee?.dateOfDemobilization
                    ? new Date(
                      updatedEmployee.dateOfDemobilization
                        .split('-')
                        .reverse()
                        .join('-')
                    )
                    : null
                }
                onChange={(e) =>
                  setUpdatedEmployee({
                    ...updatedEmployee,
                    dateOfDemobilization: e.value ? formatDate(e.value) : '',
                  })
                }
              // dateFormat='dd/mm/yy'
              />
            </div>
            <div className='field mb-3'>
              <label htmlFor='newCertificates' className='block font-bold mb-2'>
                Add CV
              </label>
              <MultiFileInput
                onFilesChange={(files) => setNewCertificates(files)}
              />
            </div>
            <div className='field mb-3'>
              <label className='block font-bold mb-2'>
                Existing CV
              </label>
              {updatedEmployee.cvCertificates.map((attachment) => (
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
                    type="button"
                    onClick={() => removeCertificates(attachment._id)}
                  />
                </div>
              ))}
            </div>
            <div className='field mb-2'>
              <label
                htmlFor='newInsuranceClaimings'
                className='block font-bold mb-2'
              >
                New Insurance Documents
              </label>
              <MultiFileInput
                onFilesChange={(files) => setNewInsuranceClaimings(files)}
              />
            </div>
            <div className='field'>
              <label className='block font-bold mb-2'>
                Existing Insurance Documents
              </label>
              {updatedEmployee.insuranceClaiming.map((attachment) => (
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
                    onClick={() => removeInsuranceClaiming(attachment._id)}
                  />
                </div>
              ))}
            </div>

            <div className='field mb-3'>
              <label
                htmlFor='newShowcaseLetters'
                className='block font-bold mb-2'
              >
                New Other Documents
              </label>
              <MultiFileInput
                onFilesChange={(files) => setNewShowcaseLetters(files)}
              />
            </div><div className='field'>
              <label className='block font-bold mb-2'>
                Existing Others Documents
              </label>
              {updatedEmployee.showcaseLetter.map((attachment) => (
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
                    onClick={() => removeShowcaseLetter(attachment._id)}
                  />
                </div>
              ))}
            </div>
            {/* <div className='field mb-3'>
              <label htmlFor='newCertificates' className='block font-bold mb-2'>
                New Certificates
              </label>
              <MultiFileInput
                onFilesChange={(files) => setNewCertificates(files)}
              />
            </div>
            <div className='field mb-3'>
              <label className='block font-bold mb-2'>
                Existing Certificates
              </label>
              {updatedEmployee.cvCertificates.map((attachment) => (
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
                    onClick={() => removeCertificates(attachment._id)}
                  />
                </div>
              ))}
            </div>

            <div className='mb-3'>
              <label htmlFor='newAgreements' className='block font-bold mb-2'>
                New Agreements
              </label>
              <MultiFileInput
                onFilesChange={(files) => setNewAgreements(files)}
              />
            </div>

            <div className='field mb-3'>
              <label className='block font-bold mb-2'>
                Existing Agreements
              </label>
              {updatedEmployee.agreement.map((attachment) => (
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
                    onClick={() => removeAgreement(attachment._id)}
                  />
                </div>
              ))}
            </div> */}

            {/* <div className='field mb-3'>
              <label
                htmlFor='newShowcaseLetters'
                className='block font-bold mb-2'
              >
                New Showcase Letters
              </label>
              <MultiFileInput
                onFilesChange={(files) => setNewShowcaseLetters(files)}
              />
            </div> */}
            {/* <div className='field'>
              <label className='block font-bold mb-2'>
                Existing Showcase Letters
              </label>
              {updatedEmployee.showcaseLetter.map((attachment) => (
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
                    onClick={() => removeShowcaseLetter(attachment._id)}
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
            </div> */}
            {/* <div className='field mb-2'>
              <label className='block font-bold mb-2'>
                Existing Warning Letters
              </label>
              {updatedEmployee.warningLetter.map((attachment) => (
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
            </div> */}

            {/* <div className='field mb-2'>
              <label htmlFor='newTerminations' className='block font-bold mb-2'>
                New Resignation or Termination
              </label>
              <MultiFileInput
                onFilesChange={(files) => setNewTerminations(files)}
              />
            </div>
            <div className='field'>
              <label className='block font-bold mb-2'>
                Existing Resignation or Termination
              </label>
              {updatedEmployee.termination.map((attachment) => (
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
                    onClick={() => removeTermination(attachment._id)}
                  />
                </div>
              ))}
            </div> */}

            {/* <div className='field mb-2'>
              <label
                htmlFor='newInsuranceClaimings'
                className='block font-bold mb-2'
              >
                New Insurance Claimings
              </label>
              <MultiFileInput
                onFilesChange={(files) => setNewInsuranceClaimings(files)}
              />
            </div>
            <div className='field'>
              <label className='block font-bold mb-2'>
                Existing Insurance Claimings
              </label>
              {updatedEmployee.insuranceClaiming.map((attachment) => (
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
                    onClick={() => removeInsuranceClaiming(attachment._id)}
                  />
                </div>
              ))}
            </div> */}
          </>
        )}
      </Dialog>

      {/* delete data dialog  */}
      <Dialog
        visible={deleteProductDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className='flex flex-col mx-auto text-center space-y-2'>
          <i
            className='pi pi-exclamation-triangle mr-3 text-red-600'
            style={{ fontSize: '2rem' }}
          />
          <span className='text-red-500'>
            Are you sure you want to delete this image?
          </span>
        </div>
      </Dialog>
    </>
  )
}