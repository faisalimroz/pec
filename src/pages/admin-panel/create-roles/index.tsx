import type React from 'react'

import { useState, useEffect, useCallback } from 'react'
import { InputText } from 'primereact/inputtext'
import { Tree, type TreeExpandedKeysType } from 'primereact/tree'
import { Checkbox } from 'primereact/checkbox'
import axios from 'axios'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import './PermissionManager.css'
import AdminPanelLayout from '..'
import { useAuth } from '@/provider/authProvider'
import { Button } from '@/components/custom/button'

// Define types for our data structures
interface ChildPermission {
  name: string
  view_authority: boolean
  edit_authority: boolean
  g_children: any[]
  _id?: string
}

interface ParentPermission {
  name: string
  authority: boolean
  children: ChildPermission[]
  _id?: string
}

interface FormDataType {
  name: string
  email: string
  password: string
  role: string[]
  permissions: ParentPermission[]
}

interface TreeNode {
  key: string
  label: string
  data: string
  parent?: string
  children?: TreeNode[]
}

interface LabelMapping {
  id: string
  label: string
}

// Add list of nodes that should have hidden children
const NODES_WITH_HIDDEN_CHILDREN = [
  'general-information',
  'edms',
  'notice',
  'ai-dashboard',
]

const PermissionManager = () => {
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    email: '',
    password: '',
    role: [],
    permissions: [],
  })
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<TreeExpandedKeysType>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false)

  const { user } = useAuth()

  const showSuperAdmin = user?.id === '68241d8e54ae5fe52759b799'

  // Custom label mappings for parent nodes
  const parentLabelMappings: LabelMapping[] = [
    { id: 'its-manager', label: 'ITS Dept.' },
    { id: 'general-information', label: 'General Information' },
    { id: 'finance-manager', label: 'Finance Dept.' },
    { id: 'edms', label: 'EDMS' },
    { id: 'admin', label: 'Administration Dept.' },
    { id: 'notice', label: 'Notice' },
    { id: 'clinic', label: 'Clinic' },
    { id: 'r&t-manager', label: 'Road & Traffic Dept.' },
    { id: 'ai-dashboard', label: 'AI Dashboard' },
    { id: 'toll-manager', label: 'Toll Dept.' },
  ]

  // This would be fetched from an API in a real application
  const [permissionsData, setPermissionsData] = useState<ParentPermission[]>([
    {
      name: 'r&t-manager',
      authority: false,
      children: [
        {
          name: 'r&t-procurement',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'maint-safety-traffic',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'patrol-security',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'mech-elec',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'building-maint',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'monthly-report',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'r&t-monthly-roster',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'drawing',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
      ],
    },
    {
      name: 'its-manager',
      authority: false,
      children: [
        {
          name: 'about-its',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'report',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'internal-letter-announce',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'o&m-activities',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'inventory-management',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'its-procurement',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'training',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'information-diagram',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'warranty',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
      ],
    },
    {
      name: 'toll-manager',
      authority: false,
      children: [
        {
          name: 'toll-collect-traffic',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'special-audit',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'monthly-toll-revenue',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'vehicle-detect-toll',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'toll-monthly-roster',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'comparison',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'kec-manual-data',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'kec-manual-data-graph',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'toll-traffic-ver',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
      ],
    },

    {
      name: 'admin',
      authority: false,
      children: [
        {
          name: 'hr',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'admin-monthly-roster',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'asset-management',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'admin-notice',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
      ],
    },
    {
      name: 'finance-manager',
      authority: false,
      children: [
        {
          name: 'rhd-bill-details',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'maintain-ipc-pdf',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'maintain-ipc-ps-data',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'monthly-invoice-record',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'monthly-salary-sheet',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'monthly-pit-sheet',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'toll-money',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'finance-procurement',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
      ],
    },
    {
      name: 'clinic',
      authority: false,
      children: [
        {
          name: 'medicine-record',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'treatment-record',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
      ],
    },
    {
      name: 'general-information',
      authority: false,
      children: [
        {
          name: 'general-status',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'organization-chart',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'location-chart',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'aerial-photography',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'staff-chart',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'reference',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
      ],
    },
    {
      name: 'edms',
      authority: false,
      children: [
        {
          name: 'dispatched',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'received',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'others',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
      ],
    },
    {
      name: 'ai-dashboard',
      authority: false,
      children: [
        {
          name: 'ai-dashboard',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
      ],
    },
    {
      name: 'notice',
      authority: false,
      children: [
        {
          name: 'notice',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
      ],
    },
  ])

  // Get custom label for parent node or format the name if no custom label exists
  const getParentLabel = useCallback((name: string): string => {
    const mapping = parentLabelMappings.find((item) => item.id === name)
    return mapping ? mapping.label : formatName(name)
  }, []) // Empty dependency array since parentLabelMappings is constant

  // Format permission name for display
  const formatName = (name: string): string => {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Initialize tree nodes from permissions data
  useEffect(() => {
    const initialExpandedKeys: TreeExpandedKeysType = {}
    const nodes: TreeNode[] = permissionsData.map((parent, parentIndex) => {
      const parentKey = `${parentIndex}`
      if (!NODES_WITH_HIDDEN_CHILDREN.includes(parent.name)) {
        initialExpandedKeys[parentKey] = true
      }

      return {
        key: parentKey,
        label: getParentLabel(parent.name),
        data: parent.name,
        children: NODES_WITH_HIDDEN_CHILDREN.includes(parent.name)
          ? []
          : parent.children.map((child, childIndex) => {
              const childKey = `${parentIndex}-${childIndex}`
              return {
                key: childKey,
                label: formatName(child.name),
                data: child.name,
                parent: parent.name,
              }
            }),
      }
    })

    setTreeNodes(nodes)
    setExpandedKeys(initialExpandedKeys)
  }, [permissionsData, getParentLabel])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Check if all children have view authority
  const allChildrenHaveViewAuthority = (parentName: string): boolean => {
    const parent = permissionsData.find((p) => p.name === parentName)
    if (!parent) return false
    return parent.children.every((child) => child.view_authority)
  }

  // Check if all children have edit authority
  const allChildrenHaveEditAuthority = (parentName: string): boolean => {
    const parent = permissionsData.find((p) => p.name === parentName)
    if (!parent) return false
    return parent.children.every((child) => child.edit_authority)
  }

  // Handle parent view authority change
  const handleParentViewAuthorityChange = (
    parentName: string,
    checked: boolean
  ) => {
    setPermissionsData((prevData) => {
      const updatedPermissions = [...prevData].map((parent) => {
        if (parent.name === parentName) {
          const updatedChildren = parent.children.map((child) => {
            return {
              ...child,
              view_authority: checked,
              // If view is unchecked, edit should also be unchecked
              edit_authority: checked ? child.edit_authority : false,
            }
          })

          return {
            ...parent,
            authority:
              checked || updatedChildren.some((child) => child.edit_authority),
            children: updatedChildren,
          }
        }
        return parent
      })

      updatePermissionsState(updatedPermissions)
      return updatedPermissions
    })
  }

  // Handle parent edit authority change
  const handleParentEditAuthorityChange = (
    parentName: string,
    checked: boolean
  ) => {
    setPermissionsData((prevData) => {
      const updatedPermissions = [...prevData].map((parent) => {
        if (parent.name === parentName) {
          const updatedChildren = parent.children.map((child) => {
            return {
              ...child,
              // If edit is checked, view must also be checked
              view_authority: checked,
              edit_authority: checked,
            }
          })

          return {
            ...parent,
            authority:
              checked || updatedChildren.some((child) => child.view_authority),
            children: updatedChildren,
          }
        }
        return parent
      })

      updatePermissionsState(updatedPermissions)
      return updatedPermissions
    })
  }

  // view authority change for child nodes
  const handleViewAuthorityChange = (
    parentName: string,
    childName: string,
    checked: boolean
  ) => {
    setPermissionsData((prevData) => {
      const updatedPermissions = [...prevData].map((parent) => {
        if (parent.name === parentName) {
          const updatedChildren = parent.children.map((child) => {
            if (child.name === childName) {
              return {
                ...child,
                view_authority: checked,
                // If view is unchecked, edit should also be unchecked
                edit_authority: checked ? child.edit_authority : false,
              }
            }
            return child
          })

          return {
            ...parent,
            authority: updatedChildren.some(
              (child) => child.view_authority || child.edit_authority
            ),
            children: updatedChildren,
          }
        }
        return parent
      })

      updatePermissionsState(updatedPermissions)
      return updatedPermissions
    })
  }

  // edit authority change for child nodes
  const handleEditAuthorityChange = (
    parentName: string,
    childName: string,
    checked: boolean
  ) => {
    setPermissionsData((prevData) => {
      const updatedPermissions = [...prevData].map((parent) => {
        if (parent.name === parentName) {
          const updatedChildren = parent.children.map((child) => {
            if (child.name === childName) {
              return {
                ...child,
                // If edit is checked, view must also be checked
                view_authority: checked,
                edit_authority: checked,
              }
            }
            return child
          })

          return {
            ...parent,
            authority: updatedChildren.some(
              (child) => child.view_authority || child.edit_authority
            ),
            children: updatedChildren,
          }
        }
        return parent
      })

      updatePermissionsState(updatedPermissions)
      return updatedPermissions
    })
  }

  // Update permissions state and extract roles
  const updatePermissionsState = (updatedPermissions: ParentPermission[]) => {
    // Extract roles from permissions where authority is true
    const roles = updatedPermissions
      .filter((parent) => parent.authority)
      .map((parent) => parent.name)

    // Filter permissions to only include those with authority true
    const activePermissions = updatedPermissions
      .filter((parent) => parent.authority)
      .map((parent) => ({
        name: parent.name,
        authority: parent.authority,
        children: parent.children
          .filter((child) => child.view_authority || child.edit_authority)
          .map((child) => ({
            name: child.name,
            view_authority: child.view_authority,
            edit_authority: child.edit_authority,
            g_children: child.g_children,
          })),
      }))

    setFormData((prev) => ({
      ...prev,
      role: roles,
      permissions: activePermissions,
    }))
  }

  // Custom node template for the tree
  const nodeTemplate = (node: TreeNode) => {
    if (node.children || NODES_WITH_HIDDEN_CHILDREN.includes(node.data)) {
      // Parent node
      const parentName = node.data
      const parent = permissionsData.find((p) => p.name === parentName)
      if (!parent) return <span>{node.label}</span>

      const allViewChecked = allChildrenHaveViewAuthority(parentName)
      const allEditChecked = allChildrenHaveEditAuthority(parentName)

      return (
        <div className='flex items-center justify-between w-full p-2'>
          <span className='font-bold text-black'>{node.label}</span>
          <div className='flex items-center gap-4'>
            <div className='flex items-center'>
              <label htmlFor={`parent-view-${parentName}`} className='mr-2'>
                Read (All)
              </label>
              <Checkbox
                id={`parent-view-${parentName}`}
                checked={allViewChecked}
                onChange={(e) =>
                  handleParentViewAuthorityChange(
                    parentName,
                    e.checked || false
                  )
                }
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor={`parent-edit-${parentName}`} className='mr-2'>
                Write (All)
              </label>
              <Checkbox
                id={`parent-edit-${parentName}`}
                checked={allEditChecked}
                onChange={(e) =>
                  handleParentEditAuthorityChange(
                    parentName,
                    e.checked || false
                  )
                }
              />
            </div>
          </div>
        </div>
      )
    } else {
      // Child node
      const childName = node.data
      const parentName = node.parent || ''
      const parent = permissionsData.find((p) => p.name === parentName)
      const child = parent?.children.find((c) => c.name === childName)

      if (!child) return <span>{node.label}</span>

      return (
        <div className='flex items-center justify-between w-full p-2'>
          <span className='uppercase'>{node.label}</span>
          <div className='flex items-center gap-4'>
            <div className='flex items-center'>
              <label htmlFor={`view-${childName}`} className='mr-2'>
                Read
              </label>
              <Checkbox
                id={`view-${childName}`}
                checked={child.view_authority}
                onChange={(e) =>
                  handleViewAuthorityChange(
                    parentName,
                    childName,
                    e.checked || false
                  )
                }
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor={`edit-${childName}`} className='mr-2'>
                Write
              </label>
              <Checkbox
                id={`edit-${childName}`}
                checked={child.edit_authority}
                onChange={(e) =>
                  handleEditAuthorityChange(
                    parentName,
                    childName,
                    e.checked || false
                  )
                }
              />
            </div>
          </div>
        </div>
      )
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      (!isSuperAdmin && formData.permissions.length === 0)
    ) {
      toast.error(
        'Please fill in all required fields and select at least one permission'
      )
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      // Create the request body based on whether superadmin is checked
      const requestBody = isSuperAdmin
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: ['superadmin'],
          }
        : formData

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/create`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('API Response:', response.data)
      toast.success('User created successfully')

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: [],
        permissions: [],
      })
      setIsSuperAdmin(false)

      // Reset permissions data
      setPermissionsData((prevData) =>
        prevData.map((parent) => ({
          ...parent,
          authority: false,
          children: parent.children.map((child) => ({
            ...child,
            view_authority: false,
            edit_authority: false,
          })),
        }))
      )
    } catch (error: any) {
      console.error('Error submitting data:', error)
      const errorMsg = error.response?.data?.message || 'An error occurred'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const headerTemplate = () => {
    return (
      <div className='flex justify-between px-3 py-2 font-bold text-black text-lg underline underline-offset-2'>
        <span>Menu Name</span>
        <span className='mr-4'>Authority</span>
      </div>
    )
  }

  return (
    <>
      <AdminPanelLayout>
        <div className='p-4 max-w-4xl mx-auto border rounded-lg shadow-md mt-16'>
          <div>
            <div className='space-y-6 max-w-3xl mx-auto'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label htmlFor='name' className='block font-medium'>
                    Name
                  </label>
                  <InputText
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='Enter name'
                    className='w-full'
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='email' className='block font-medium'>
                    Email
                  </label>
                  <InputText
                    id='email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='Enter email'
                    className='w-full'
                    autoComplete='off'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor='password' className='block font-medium'>
                  Password
                </label>
                <div className='relative'>
                  <InputText
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder='Enter password (min. 6 characters)'
                    className={`w-full pr-10 ${formData.password && formData.password.length < 6 ? 'p-invalid' : ''}`}
                    autoComplete='off'
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 transform -translate-y-1/2'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className='space-y-6 mt-8'>
                

                <div className='permissions-container'>
                  <h3 className='text-xl font-semibold mb-4 '>Permissions</h3>

                  {showSuperAdmin && (
                  <div className='flex items-center space-x-2 mb-4'>
                    <Checkbox
                      id='superadmin'
                      checked={isSuperAdmin}
                      onChange={(e) => setIsSuperAdmin(e.checked || false)}
                    />
                    <label htmlFor='superadmin' className='font-medium'>
                      Super Admin
                    </label>
                  </div>
                )}

                  <div
                    className={`${isSuperAdmin ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {/* <div className='tree-header flex justify-between px-4 py-2 bg-gray-100 font-medium'>
                      <span>Menu Name</span>
                      <span className='mr-4'>Authority</span>
                    </div> */}

                    <Tree
                      header={headerTemplate}
                      value={treeNodes}
                      expandedKeys={expandedKeys}
                      onToggle={(e) => setExpandedKeys(e.value)}
                      // @ts-ignore
                      nodeTemplate={nodeTemplate}
                      className='custom-permission-tree'
                      disabled={isSuperAdmin}
                    />
                  </div>
                </div>
              </div>

              <div className='mt-8 flex justify-end gap-4'>
                <Button
                  className='!bg-black text-center !text-white w-[111px] h-[44px] hover:bg-gray-800 border-none'
                  onClick={handleSubmit}
                  disabled={loading}
                  loading={loading}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AdminPanelLayout>
    </>
  )
}

export default PermissionManager
