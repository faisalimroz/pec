import type React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { InputText } from 'primereact/inputtext'
import { Tree, type TreeExpandedKeysType } from 'primereact/tree'
import * as XLSX from 'xlsx';
import { Checkbox } from 'primereact/checkbox'
import axios from 'axios'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
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
  creator?: string
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
  // 'general-information',
  'edms',
  'notice',
  // 'ai-dashboard',
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

  const showSuperAdmin = user

  // Custom label mappings for parent nodes
  const parentLabelMappings: LabelMapping[] = [
    { id: 'admin', label: 'Administration Dept.' },
    { id: 'its-manager', label: 'ITS Dept.' },
    // { id: 'general-information', label: 'General Information' },
    { id: 'mb-pmis-manager', label: 'Main Bridge Dept.' },
    { id: 'rtw-manager', label: 'RTW Dept.' },
    { id: 'finance-manager', label: 'Finance Dept.' },
    { id: 'edms', label: 'EDMS' },
    { id: 'notice', label: 'Notice' },
    { id: 'r&t-manager', label: 'Road & Traffic Dept.' },
    // { id: 'ai-dashboard', label: 'AI Dashboard' },
    { id: 'toll-manager', label: 'Toll Dept.' },
  ]
  // turn everything ON (view+edit) in the tree for visual feedback
  const setAllPermissionsChecked = (checked: boolean) => {
    setPermissionsData(prev =>
      prev.map(parent => ({
        ...parent,
        authority: checked,
        children: parent.children.map(c => ({
          ...c,
          view_authority: checked,
          edit_authority: checked
        }))
      }))
    )

    // also sync formData (roles + permissions) to reflect the visual change
    const updated = permissionsData.map(parent => ({
      ...parent,
      authority: checked,
      children: parent.children.map(c => ({
        ...c,
        view_authority: checked,
        edit_authority: checked
      }))
    }))
    updatePermissionsState(updated)
  }

  // when Super Admin toggles, mirror it in the UI (for clarity)
  const handleSuperAdminToggle = (next: boolean) => {
    setIsSuperAdmin(next)
    if (next) {
      setAllPermissionsChecked(true)
    } else {
      // uncheck everything visually (optional; or keep user selections)
      setAllPermissionsChecked(false)
    }
  }

  // This would be fetched from an API in a real application
  const [permissionsData, setPermissionsData] = useState<ParentPermission[]>([
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
      name: 'admin',
      authority: false,
      children: [
        {
          name: 'employee-personal-profile',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
           {
          name: 'organization/organogram',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
           {
          name: 'letter-attachment',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'building-maintenance',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
         {
          name: 'admin-letter-attachment',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'vehicle-management',
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
          name: 'admin-building-maintenance',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'health-center',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'gardening-mgt',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'fire-mgt',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'it-electronics',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'security-mgt',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
      ],
    },
    {
      name: 'r&t-manager',
      authority: false,
      children: [
        {
          name: 'r&t-organization',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'r&t-organization/organogram',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'r&t-letter-attachment',
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
          name: 'r&t-monthly-report',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
    
        {
          name: 'r&t-road-maintenance',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'r&t-road-safety-patrol',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'r&t-workshop-maintenance',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },

      ],
    },
    {
      name: 'mb-pmis-manager',
      authority: false,
      children: [
        {
          name: 'mb-pmis-project-overview',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
          {
          name: 'mb-pmis-letter-attachment',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
          {
          name: 'mb-pmis-organization/organogram',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'mb-pmis-technical-documentation',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'mb-pmis-monitoring-reporting',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'mb-pmis-quality,-safety',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'mb-pmis-communication-correspondence',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'mb-pmis-financial-documentation',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'mb-pmis-visual-records',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'mb-pmis-additional-notes',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },

      ],
    },

    {
      name: 'rtw-manager',
      authority: false,
      children: [
        {
          name: 'rtw-project-overview',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
               {
          name: 'rtw-organization/organogram',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
               {
          name: 'rtw-letter-attachment',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'rtw-technical-documentation',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'rtw-monitoring-reporting',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'rtw-quality-safety',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'rtw-communication-correspondence',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'rtw-financial-documentation',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'rtw-visual-records',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'rtw-additional-notes',
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
          name: 'its-organization/organogram',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
          {
          name: 'its-letter-attachment',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'its-organization',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'its-work-plan',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'its-notice',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'its-system-configure',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'its-operation-manual',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'its-monthly-report',
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
          name: 'daily-toll-traffic-data',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
      
         {
          name: 'toll-letter-attachment',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'shift-wise-toll-traffic-data',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'toll-wim-data',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'toll-daily-report',
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
          name: 'toll-employee-report',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'toll-hierarchy',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        }
      ],
    },
    {
      name: 'finance-manager',
      authority: false,
      children: [
        {
          name: 'monthly-ipc-updates',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'ipc-records',
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


    // {
    //   name: 'ai-dashboard',
    //   authority: false,
    //   children: [
    //     {
    //       name: 'ai-dashboard',
    //       view_authority: false,
    //       edit_authority: false,
    //       g_children: [],
    //     },
    //   ],
    // },
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
            // Special handling for EDMS - check write when read is checked
            if (parentName === 'edms' && checked) {
              return {
                ...child,
                view_authority: true,
                edit_authority: true,
              };
            }

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

  const nodeTemplate = (node: TreeNode) => {
    // Define a small text size class
    const textSizeClass = 'text-sm';

    // Parent node logic
    if (node.children || NODES_WITH_HIDDEN_CHILDREN.includes(node.data)) {

      const parentName = node.data
      const parent = permissionsData.find((p) => p.name === parentName)
      // console.log(permissionsData, 'permissionsData' )
      // console.log(parent, 'parent')
      if (!parent) return <span className={textSizeClass}>{node.label}</span> // Applied text-xs

      const allViewChecked = allChildrenHaveViewAuthority(parentName)
      const allEditChecked = allChildrenHaveEditAuthority(parentName)

      return (
        <div className='flex items-center justify-between w-full p-2'>
          {/* Applied text-xs to the parent node label */}
          <span className={`font-bold text-black ${textSizeClass}`}>{node.label}</span>
          <div className='flex items-center gap-4'>
            <div className='flex items-center'>
              {/* Applied text-xs to the Read label */}
              <label htmlFor={`parent-view-${parentName}`} className={`mr-2 ${textSizeClass}`}>
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
              {/* Applied text-xs to the Write label */}
              <label htmlFor={`parent-edit-${parentName}`} className={`mr-2 ${textSizeClass}`}>
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
      // Child node logic
      const childName = node.data
      const parentName = node.parent || ''
      const parent = permissionsData.find((p) => p.name === parentName)
      // console.log(parent, 'parent in child')  
      const child = parent?.children.find((c) => c.name === childName)

      if (!child) return <span className={textSizeClass}>{node.label}</span> // Applied text-xs

      return (
        <div className='flex items-center justify-between w-full p-2'>
          {/* Applied text-xs to the child node label */}
          <span className={`uppercase ${textSizeClass}`}>{node.label}</span>
          <div className='flex items-center gap-4'>
            <div className='flex items-center'>
              {/* Applied text-xs to the Read label */}
              <label htmlFor={`view-${childName}`} className={`mr-2 ${textSizeClass}`}>
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
              {/* Applied text-xs to the Write label */}
              <label htmlFor={`edit-${childName}`} className={`mr-2 ${textSizeClass}`}>
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
  const withCreator = (payload: any) => ({
    ...payload,
    creator: user?.email,  // logged-in user's email
  });
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
      const creatorEmail = user?.email || ''

      // Create the request body based on whether superadmin is checked
      const requestBody = isSuperAdmin
        ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: ['superadmin'],
          creator: creatorEmail,
        }
        : withCreator(formData)

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
      console.log(permissionsData, 'before reset')
      console.log(formData, 'formdata before reset')
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

      console.log("Submitting Permissions:", JSON.stringify(formData.permissions, null, 2));
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
      <div className='flex justify-between px-3 py-2 font-bold text-black text-md underline underline-offset-2'>
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
                  <h3 className='text-lg font-semibold mb-4 '>Permissions</h3>

                  {showSuperAdmin && (
                    <div className='flex items-center space-x-2 mb-4'>
                      <Checkbox
                        id='superadmin'
                        checked={isSuperAdmin}
                        onChange={(e) => handleSuperAdminToggle(!!e.checked)}
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
