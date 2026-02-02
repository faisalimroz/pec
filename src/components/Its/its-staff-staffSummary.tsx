"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { classNames } from "primereact/utils"
import type { DataTable } from "primereact/datatable"
import { Button } from "primereact/button"
import { Toolbar } from "primereact/toolbar"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { Calendar } from "primereact/calendar"
import { ChevronDown, ChevronRight, Users, Server, Truck, BarChart3, Edit, Trash2, Plus } from "lucide-react"
import "../../styles/table-style.css"
import { searchItsStaffSummary, useSearchItsStaffSummary } from "@/api/itsAPIs"
import axios from "axios"
import "./its.css"
import { toast } from "sonner"
import RefreshButton from "../refresh-button"
import { InputNumber } from "primereact/inputnumber"
import { useAuth } from "@/provider/authProvider"

interface Product {
  _id: string | null
  code: string
  name: string
  description: string
  image: string | null
  price: number
  category: string | null
  quantity: number
  inventoryStatus: string
  rating: number
  orderNo: number
}

interface StaffMember {
  _id: string
  name: string
  position: string
  employeeId: string
  address: string
  contactNo: string
  email: string
  bloodGroup: string
  date: string
  department: string
  creator: string
  image?: string
  orderNo: number
}

interface Department {
  name: string
  icon: React.ReactNode
  color: string
  employees: StaffMember[]
  isExpanded: boolean
}

export default function ItsStaffSummary() {
  const emptyProduct: Product = {
    _id: null,
    code: "",
    name: "",
    image: null,
    description: "",
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    orderNo: 0,
    inventoryStatus: "INSTOCK",
  }

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === "its-manager")
  const checkPermission = checkRole?.children.find((c) => c.name === "about-its")
  const hasEditAccess = checkPermission?.edit_authority || false
  const isITS = roles.some((role) => ["superadmin", "its-manager"].includes(role.title))

  const [products, setProducts] = useState<StaffMember[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [generalManager, setGeneralManager] = useState<StaffMember | null>(null)
  const [productDialog, setProductDialog] = useState<boolean>(false)
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)
  const [product, setProduct] = useState<any>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>("")
  const [searchKey, setSearchKey] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const cameraRef = useRef<HTMLInputElement | null>(null)
  const [showImages, setShowImages] = useState([])
  const [submitImageList, setSubmitImageList] = useState<File[]>([])
  const [name, setName] = useState("")
  const [position, setPosition] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [address, setAddress] = useState("")
  const [contactNo, setContactNo] = useState("")
  const [email, setEmail] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const [department, setDepartment] = useState("")
  const [orderNo, setOrderNo] = useState("")
  const [formDate, setFormDate] = useState<string>("")
  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<any | null>(null)
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null)
  const [newProfileImagePreview, setNewProfileImagePreview] = useState<string | null>(null)

  const [payload, setPayload] = useState<any>({
    month: "",
    year: "",
    searchQuery: "",
  })

  const { data: invoiceData, isLoading: invoiceLoading, error: invoiceError } = useSearchItsStaffSummary(payload)

  // Department icons mapping
  const getDepartmentIcon = (deptName: string) => {
    const dept = deptName.toLowerCase()
    if (dept.includes("toll") || dept.includes("tcs")) {
      return <Users className="w-5 h-5" />
    } else if (dept.includes("weigh") || dept.includes("motion")) {
      return <BarChart3 className="w-5 h-5" />
    } else if (dept.includes("intelligent") || dept.includes("its")) {
      return <Truck className="w-5 h-5" />
    } else if (dept.includes("server") || dept.includes("network")) {
      return <Server className="w-5 h-5" />
    }
    return <Users className="w-5 h-5" />
  }

  const getDepartmentColor = (deptName: string) => {
    const dept = deptName.toLowerCase()
    if (dept.includes("toll") || dept.includes("tcs")) {
      return "bg-blue-100 text-blue-800"
    } else if (dept.includes("weigh") || dept.includes("motion")) {
      return "bg-green-100 text-green-800"
    } else if (dept.includes("intelligent") || dept.includes("its")) {
      return "bg-purple-100 text-purple-800"
    } else if (dept.includes("server") || dept.includes("network")) {
      return "bg-orange-100 text-orange-800"
    }
    return "bg-gray-100 text-gray-800"
  }

  const getStatusBadge = (employee: StaffMember) => {
    // Simple logic to determine status - you can modify this based on your business logic
    const isActive = employee.date && employee.contactNo && employee.email
    const isCritical = !employee.date || !employee.contactNo

    if (isCritical) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">CRITICAL</span>
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">ACTIVE</span>
  }

  useEffect(() => {
    if (invoiceData) {
      const staffData = invoiceData?.itsStaffData || []
      setProducts(staffData)

      // Find general manager
      const gm = staffData.find(
        (staff: StaffMember) =>
          staff.creator === "generalmanager@kec.com" &&
          (staff.position.toLowerCase().includes("manager") || staff.position.toLowerCase().includes("sr.")),
      )
      setGeneralManager(gm || null)

      // Group by departments
      const departmentMap = new Map<string, StaffMember[]>()

      staffData.forEach((staff: StaffMember) => {
        if (staff._id !== gm?._id) {
          // Exclude general manager from departments
          const deptName = staff.department || "Other"
          if (!departmentMap.has(deptName)) {
            departmentMap.set(deptName, [])
          }
          departmentMap.get(deptName)?.push(staff)
        }
      })

      const deptArray: Department[] = Array.from(departmentMap.entries()).map(([name, employees]) => ({
        name,
        icon: getDepartmentIcon(name),
        color: getDepartmentColor(name),
        employees,
        isExpanded: name.toLowerCase().includes("toll") || name.toLowerCase().includes("tcs"),
      }))

      setDepartments(deptArray)
    }
  }, [invoiceData])

  const toggleDepartment = (index: number) => {
    setDepartments((prev) => prev.map((dept, i) => (i === index ? { ...dept, isExpanded: !dept.isExpanded } : dept)))
  }

  // All existing functions remain the same
  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setNewProfileImage(file)
      const previewURL = URL.createObjectURL(file)
      setNewProfileImagePreview(previewURL)
    } else {
      setNewProfileImage(null)
      setNewProfileImagePreview(null)
    }
  }

  const openUpdateDialog = (product: Product | StaffMember) => {
    setUpdatedProduct({ ...product })
    setUpdateProductDialog(true)
  }

  const hideUpdateDialog = () => {
    setUpdateProductDialog(false)
    setUpdatedProduct(null)
  }

  const handleUpdateProduct = async () => {
    if (!updatedProduct) return
    try {
      setLoading2(true)
      const formData = new FormData()
      formData.append("name", updatedProduct.name)
      formData.append("position", updatedProduct.position)
      formData.append("employeeId", updatedProduct.employeeId)
      formData.append("address", updatedProduct.address)
      formData.append("contactNo", updatedProduct.contactNo)
      formData.append("email", updatedProduct.email)
      formData.append("bloodGroup", updatedProduct.bloodGroup)
      formData.append("department", updatedProduct.department)
      formData.append("orderNo", updatedProduct.orderNo)
      formData.append("date", updatedProduct.date)
      if (newProfileImage) {
        formData.append("image", newProfileImage)
      }
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/v1/its/staff/${updatedProduct._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      hideUpdateDialog()
      toast.success("Data updated successfully")
      window.location.reload()
    } catch (error) {
      console.error(error)
      toast.error("Failed To Update Data")
    } finally {
      setLoading2(false)
    }
  }

  const updateProductDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideUpdateDialog} />
      <Button label="Update" icon="pi pi-check" onClick={handleUpdateProduct} loading={loading2} />
    </>
  )

  const openNew = () => {
    setProduct(emptyProduct)
    setSubmitted(false)
    setProductDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setProductDialog(false)
  }

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false)
  }

  function formatDate(dateTime?: any) {
    if (!dateTime) return ""
    const date = new Date(dateTime)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const saveProduct = async () => {
    try {
      setLoading2(true)
      const formData = new FormData()
      formData.append("name", name)
      formData.append("position", position)
      formData.append("employeeId", employeeId)
      formData.append("address", address)
      formData.append("contactNo", contactNo)
      formData.append("email", email)
      formData.append("bloodGroup", bloodGroup)
      formData.append("department", department)
      formData.append("orderNo", orderNo)
      formData.append("date", formatDate(formDate))
      for (let i = 0; i < submitImageList.length; i++) {
        formData.append("image", submitImageList[i])
      }
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/its/staff/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      const response = res
      hideDialog()
      window.location.reload()
      console.log(response)
    } catch (error: any) {
      console.error(error)
      const msg = error.response.data.message
      toast.error(msg)
    } finally {
      setLoading2(false)
    }
  }

  const confirmDeleteProduct = (product: Product | StaffMember) => {
    setProduct(product)
    setDeleteProductDialog(true)
  }

  const deleteProduct = async () => {
    const _products = products.filter((val: { _id: any }) => val._id !== product._id)
    try {
      setLoading2(true)
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/its/staff/delete/${product._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // If deleting general manager, clear the state
      if (generalManager && generalManager._id === product._id) {
        setGeneralManager(null)
      }

      toast.success("Data Deleted Successfully")
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data
        toast.error(message)
      } else {
        console.log(error)
      }
    } finally {
      setLoading2(false)
    }
    setProducts(_products)
    setDeleteProductDialog(false)
    setProduct(emptyProduct)
  }

  const exportCSV = () => {
    dt.current?.exportCSV()
  }

  const leftToolbarTemplate = () => {
    return (
      <div className="">
        <div className="p-3 bg-main text-base font-semibold text-white rounded-t">Staff Organization</div>
      </div>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <>
        {hasEditAccess && (
          <div className="space-x-2">
            <button
              className="bg-white text-gray-800 border-gray-600 border-t text-sm border-l border-r px-4 py-3 rounded-t-md font-bold"
              onClick={openNew}
            >
              Add Staff Member
            </button>
            <button
              className="bg-gray-600 text-white border-gray-600 border-t text-sm border-l border-r font-bold px-4 py-3 rounded-t-md"
              onClick={exportCSV}
            >
              Export Data
            </button>
          </div>
        )}
        <RefreshButton className="ml-2" onClick={handleReset} />
      </>
    )
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      date: date ? formatDate(date) : "",
      searchQuery: searchKey,
    }
    searchItsStaffSummary(initialPayload).then((result) => {
      setProducts(result?.itsStaffData)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      date: "",
      searchQuery: "",
    }
    setDate("")
    setSearchKey("")
    searchItsStaffSummary(initialPayload).then((result) => {
      setProducts(result?.itsStaffData)
      setLoading(false)
    })
  }

  const filterSearchForm = (
    <>
      <div
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            handleSearch()
          }
        }}
        className="flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white"
        aria-label="Search and filter form"
      >
        <Calendar
          // @ts-ignore
          value={date}
          // @ts-ignore
          onChange={(e) => setDate(e.value)}
          dateFormat="dd/mm/yy"
          inputClassName="border-none rounded-none cursor-pointer focus:ring-0"
          placeholder="Select Joining Date"
          showIcon
          icon={() => <i className="pi pi-angle-down" />}
        />
        <IconField iconPosition="left" className="relative">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            placeholder="Search..."
            className="border-none ml-4 focus:ring-0"
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
          />
          <button
            onClick={handleSearch}
            type="submit"
            className="absolute top-0.5 right-1 border bg-green-500 px-4 py-2.5 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors"
            aria-label="Submit search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-6"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </IconField>
      </div>
    </>
  )

  const productDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" loading={loading2} icon="pi pi-check" onClick={saveProduct} />
    </>
  )

  const deleteProductDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
    </>
  )

  const onUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    const imageList = e.target.files
    const imageUrlList: any = [...showImages]
    const maxSize = 5 * 1024 * 1024
    for (let i = 0; i < imageList.length; i++) {
      if (imageList[0].size > maxSize) {
        alert("Limit Crossed. Max file size is 5MB.")
        return
      }
      imageUrlList.push(imageList[i].name)
    }
    if (imageUrlList.length > 10) {
      alert("Limit Crossed. Max file limit is 10.")
      return
    }
    const finalImageList = Array.from(imageList).concat(submitImageList)
    setSubmitImageList(finalImageList)
    setShowImages(imageUrlList)
    console.log(finalImageList)
    console.log(finalImageList[0])
  }

  const onDeleteImage = (id: any) => {
    setShowImages(showImages.filter((_, index) => index !== id))
    setSubmitImageList(submitImageList.filter((_, index) => index !== id))
  }

  const onUploadImageButtonClicked = useCallback(() => {
    if (!cameraRef.current) {
      return
    }
    cameraRef.current.click()
  }, [])

  return (
    <div className="ml-4">
      <div className="card">
        <Toolbar
          className="rounded-none border-none p-0 bg-white"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <div className="bg-white border border-gray-200 rounded-b-lg">
          {/* Search Header */}
          <div className="p-4 border-b border-gray-200">{filterSearchForm}</div>

          {/* Organization Tree */}
          <div className="p-6 space-y-4">
            {/* General Manager */}
            {generalManager && (
              <div className="flex items-center justify-between p-2 bg-[#0B1F8F] rounded-lg border">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 border-2 border-primary">
                    <img
                      src={
                        generalManager.image ||
                        `https://avatar.iran.liara.run/username?username=${generalManager.name.replace(/\s+/g, "+") || "/placeholder.svg"}`
                      }
                      alt={generalManager.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white ">{generalManager.name}</h3>
                    <p className="text-sm text-white ">{generalManager.position}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">Manager</span>
                  {hasEditAccess && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openUpdateDialog(generalManager)}
                        className="p-1 text-white hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDeleteProduct(generalManager)}
                        className="p-1 text-white hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Departments */}
            {departments.map((dept, index) => (
              <div key={dept.name} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Department Header */}
                <div
                  className="flex items-center justify-between p-4 bg-blue-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleDepartment(index)}
                >
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-500 hover:text-gray-700">
                      {dept.isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    <div className={`p-2 rounded-lg ${dept.color}`}>{dept.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-500">{dept.employees.length} employees</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-500 text-white text-sm font-medium px-2 py-1 rounded-full">
                      {dept.employees.length}
                    </span>
                    {hasEditAccess && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openNew()
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Department Employees */}
                {dept.isExpanded && (
                  <div className="divide-y divide-gray-100">
                    {dept.employees.map((employee) => (
                      <div key={employee._id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200">
                            <img
                              src={
                                employee.image ||
                                `https://avatar.iran.liara.run/username?username=${employee.name.replace(/\s+/g, "+") || "/placeholder.svg"}`
                              }
                              alt={employee.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{employee.name}</h4>
                            <p className="text-sm text-gray-500">{employee.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(employee)}
                          {hasEditAccess && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => openUpdateDialog(employee)}
                                className="p-1 text-gray-400 hover:text-blue-600"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => confirmDeleteProduct(employee)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {invoiceLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {!invoiceLoading && departments.length === 0 && (
              <div className="text-center py-8 text-gray-500">No staff data found!</div>
            )}
          </div>
        </div>
      </div>

      {/* Add Staff Dialog */}
      <Dialog
        visible={productDialog}
        style={{ width: "42rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Add Staff Member"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <>
          <div className="grid grid-cols-2 items-center gap-6">
            <div className="field">
              <label htmlFor="orderNo" className="font-bold">
                Order No
              </label>
              <InputNumber id="orderNo" onValueChange={(e: any) => setOrderNo(e.value)} required />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">
                Name
              </label>
              <InputText
                id="name"
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !name,
                })}
              />
              {submitted && !name && <small className="p-error">Name is required.</small>}
            </div>
            <div className="field">
              <label htmlFor="position" className="font-bold">
                Position
              </label>
              <InputText id="position" onChange={(e) => setPosition(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="employeeId" className="font-bold">
                Staff ID
              </label>
              <InputText id="employeeId" onChange={(e) => setEmployeeId(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="address" className="font-bold">
                Address
              </label>
              <InputText id="address" onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="contactNo" className="font-bold">
                Contact No.
              </label>
              <InputText id="contactNo" onChange={(e) => setContactNo(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="email" className="font-bold">
                Email
              </label>
              <InputText id="email" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="bloodGroup" className="font-bold">
                Blood Group
              </label>
              <InputText id="bloodGroup" onChange={(e) => setBloodGroup(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="department" className="font-bold">
                Department
              </label>
              <InputText id="department" onChange={(e) => setDepartment(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="date" className="font-bold">
                Joining Date
              </label>
              <div className="border rounded-md">
                <Calendar
                  id="date"
                  // @ts-ignore
                  value={formDate}
                                    onChange={(e) => setFormDate(e.value)}
                  dateFormat="dd/mm/yy"
                  inputClassName="border-0 focus:ring-0 cursor-pointer"
                  className="focus:ring-0"
                  placeholder="Select Date"
                />
              </div>
            </div>
            <div className="gap-3">
              <label className="block mb-1 font-semibold">
                Upload Image
                <span className="text-red-500">*</span>
              </label>
              <div>
                <button
                  type="button"
                  onClick={onUploadImageButtonClicked}
                  className="bg-gray-500 text-white px-2 py-3 rounded-lg top-3.5 right-2"
                >
                  Click to Upload
                </button>
                <input
                  type="file"
                  ref={cameraRef}
                  onChange={onUploadImage}
                  multiple
                  accept=".pdf, image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>
          <div className=" px-3 py-10 rounded-xl mt-5">
            {showImages.map((imageUrl, id) => (
              <div key={id} className="flex flex-row-reverse items-center justify-end mb-1 gap-3">
                <span>{imageUrl}</span>
                <button type="button" onClick={() => onDeleteImage(id)} className="text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        visible={deleteProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      {/* Update Staff Dialog */}
      <Dialog
        visible={updateProductDialog}
        style={{ width: "50rem" }}
        header="Update Staff Member"
        modal
        className="p-fluid"
        footer={updateProductDialogFooter}
        onHide={hideUpdateDialog}
      >
        {updatedProduct && (
          <>

            <div className="grid grid-cols-2 gap-4">
              <div className="field">
                <label htmlFor="profileImage" className="block font-bold">
                  Profile Image
                </label>
                <div className="flex items-center">
                  <div className="flex gap-2">

                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="border p-2 rounded"
                    />
                  </div>
                </div>
              </div>
              <div className="field">
                <label htmlFor="annualLeave" className="font-bold">
                  Annual Leave (Days)
                </label>
                <InputNumber
                  id="annualLeave"
                  value={updatedProduct.orderNo}
                  onValueChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      orderNo: e.value,
                    })
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="orderNo" className="font-bold">
                  Order No
                </label>
                <InputNumber
                  id="orderNo"
                  value={updatedProduct.orderNo}
                  onValueChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      orderNo: e.value,
                    })
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="name" className="font-bold">
                  Name
                </label>
                <InputText
                  id="name"
                  value={updatedProduct.name}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="position" className="font-bold">
                  Position
                </label>
                <InputText
                  id="position"
                  value={updatedProduct.position}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      position: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="employeeId" className="font-bold">
                  Staff ID
                </label>
                <InputText
                  id="employeeId"
                  value={updatedProduct.employeeId}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      employeeId: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="address" className="font-bold">
                  Address
                </label>
                <InputText
                  id="address"
                  value={updatedProduct.address}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      address: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="contactNo" className="font-bold">
                  Contact No.
                </label>
                <InputText
                  id="contactNo"
                  value={updatedProduct.contactNo}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      contactNo: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="email" className="font-bold">
                  Email
                </label>
                <InputText
                  id="email"
                  value={updatedProduct.email}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="bloodGroup" className="font-bold">
                  Blood Group
                </label>
                <InputText
                  id="bloodGroup"
                  value={updatedProduct.bloodGroup}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      bloodGroup: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="department" className="font-bold">
                  Department
                </label>
                <InputText
                  id="department"
                  value={updatedProduct.department}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      department: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="date" className="font-bold">
                  Date
                </label>
                <Calendar
                  id="date"
                  value={new Date(updatedProduct.date.split("-").reverse().join("-"))}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      date: e.value ? formatDate(e.value) : "",
                    })
                  }
                  dateFormat="dd/mm/yy"
                />
              </div>
            </div>
          </>
        )}
      </Dialog>
    </div>
  )
}
