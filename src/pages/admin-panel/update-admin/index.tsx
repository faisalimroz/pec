import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Tree, type TreeExpandedKeysType } from 'primereact/tree'
import { Checkbox } from 'primereact/checkbox'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { Menu } from 'primereact/menu'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import axios from 'axios'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
import AdminPanelLayout from '..'
import '../create-roles/PermissionManager.css'
import { useAuth } from '@/provider/authProvider'
import { Eye, EyeOff } from 'lucide-react'

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
  password?: string
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

// Add list of nodes that should have hidden children
const NODES_WITH_HIDDEN_CHILDREN = [
  // 'general-information',
  'edms',
  'notice',
  // 'ai-dashboard',
]

interface LabelMapping {
  id: string
  label: string
}

interface UserType {
  slNo: number
  _id: string
  name: string
  email: string
  password: string
  role: { title: string; _id: string }[]
  permissions: ParentPermission[]
  createdAt: string
  updatedAt: string
  creator?: string
  creationTimestamp?: string
  updater?: string
  updatingTimestamp?: string
}

const UpdateAdmin = () => {
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
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false)
  const [users, setUsers] = useState<UserType[]>([])
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view')
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // Custom label mappings for parent nodes
  const parentLabelMappings: LabelMapping[] = [
    { id: 'its-manager', label: 'ITS Dept.' },
    // { id: 'general-information', label: 'General Information' },
    { id: 'finance-manager', label: 'Finance Dept.' },
    { id: 'edms', label: 'EDMS' },
    { id: 'admin', label: 'Administration Dept.' },
    { id: 'notice', label: 'Notice' },
    // { id: 'clinic', label: 'Clinic' },
    { id: 'r&t-manager', label: 'Road & Traffic Dept.' },
    { id: 'rtw-manager', label: 'RTW Dept.' },
    { id: 'mb-pmis-manager', label: 'Main Bridge Dept.' },
    // { id: 'ai-dashboard', label: 'AI Dashboard' },
    { id: 'toll-manager', label: 'Toll Dept.' },
  ]

  const { user } = useAuth()
  console.log('Current user:', user)

  const showSuperAdmin = user?.id === '68241d8e54ae5fe52759b799'

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
          name: 'building-maintenance',
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
          name: 'r&t-kec-letter',
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
          name: 'mb-pmis-quality-safety',
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
          name: 'daily-toll-&-traffic-data',
          view_authority: false,
          edit_authority: false,
          g_children: [],
        },
        {
          name: 'shift-wise-toll-&-traffic-data',
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

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Fetch users from API
  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/get/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setUsers(response.data.admins)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoadingUsers(false)
    }
  }

  // Get custom label for parent node or format the name if no custom label exists
  const getParentLabel = (name: string): string => {
    const mapping = parentLabelMappings.find((item) => item.id === name)
    return mapping ? mapping.label : formatName(name)
  }

  // Format permission name for display
  const formatName = (name: string): string => {
    return name
      .split(/[-_]/)
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
  }, [permissionsData])

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

          // Check if any children have permissions after update
          const hasAnyPermissions = updatedChildren.some(
            (child) => child.view_authority || child.edit_authority
          )

          return {
            ...parent,
            // Set authority to false if no children have permissions
            authority: hasAnyPermissions,
            children: updatedChildren,
          }
        }
        return parent
      })

      updatePermissionsState(updatedPermissions)
      return updatedPermissions
    })
  }

  // Update the handleParentEditAuthorityChange function similarly
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

          // Check if any children have permissions after update
          const hasAnyPermissions = updatedChildren.some(
            (child) => child.view_authority || child.edit_authority
          )

          return {
            ...parent,
            // Set authority to false if no children have permissions
            authority: hasAnyPermissions,
            children: updatedChildren,
          }
        }
        return parent
      })

      updatePermissionsState(updatedPermissions)
      return updatedPermissions
    })
  }

  // Update the handleViewAuthorityChange function
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

          // Check if any children have permissions after update
          const hasAnyPermissions = updatedChildren.some(
            (child) => child.view_authority || child.edit_authority
          )

          return {
            ...parent,
            // Set authority to false if no children have permissions
            authority: hasAnyPermissions,
            children: updatedChildren,
          }
        }
        return parent
      })

      updatePermissionsState(updatedPermissions)
      return updatedPermissions
    })
  }

  // Update the handleEditAuthorityChange function
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

          // Check if any children have permissions after update
          const hasAnyPermissions = updatedChildren.some(
            (child) => child.view_authority || child.edit_authority
          )

          return {
            ...parent,
            // Set authority to false if no children have permissions
            authority: hasAnyPermissions,
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

    // Log for debugging
    // console.log('Updated roles:', roles)
    // console.log('Active permissions:', activePermissions)

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
                disabled={dialogMode === 'view'}
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
                disabled={dialogMode === 'view'}
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
                disabled={dialogMode === 'view'}
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
                disabled={dialogMode === 'view'}
              />
            </div>
          </div>
        </div>
      )
    }
  }

  // Reset permissions data
  const resetPermissions = () => {
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
  }

  // Open dialog for viewing a user
  const openViewDialog = (user: UserType) => {
    setSelectedUser(user)
    setDialogMode('view')
    loadUserPermissions(user)
    setShowDialog(true)
  }

  // Open dialog for editing a user
  const openEditDialog = (user: UserType) => {
    setSelectedUser(user)
    setDialogMode('edit')
    loadUserPermissions(user)
    setShowDialog(true)
  }

  // Load user permissions into the form
  const loadUserPermissions = (user: UserType) => {
    const isSuperAdminUser = user.role.some(
      (role) => role.title === 'superadmin'
    )
    setIsSuperAdmin(isSuperAdminUser)

    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role.map((r) => r.title),
      permissions: user.permissions,
    })

    // Reset permissions data first
    const resetPermissions = permissionsData.map((parent) => ({
      ...parent,
      authority: false,
      children: parent.children.map((child) => ({
        ...child,
        view_authority: false,
        edit_authority: false,
      })),
    }))

    // Create a mapping for easier lookup
    const permissionMap = new Map()

    // Process user permissions
    user.permissions.forEach((permission) => {
      permissionMap.set(permission.name, {
        authority: permission.authority,
        children: new Map(
          permission.children.map((child) => [
            child.name,
            {
              view_authority: child.view_authority,
              edit_authority: child.edit_authority,
            },
          ])
        ),
      })
    })

    // Now map the user permissions to our permissions data structure
    const updatedPermissionsData = resetPermissions.map((parent) => {
      // Check if this parent exists in the user permissions
      const userPermission = permissionMap.get(parent.name)

      if (!userPermission) {
        return parent // No permissions for this parent
      }

      // Update children based on user permissions
      const updatedChildren = parent.children.map((child) => {
        // Find if this child exists in user permissions
        const userChild = userPermission.children.get(child.name)

        if (userChild) {
          return {
            ...child,
            view_authority: userChild.view_authority,
            edit_authority: userChild.edit_authority,
          }
        }

        return child
      })

      // Check if any children have permissions
      const hasPermissions = updatedChildren.some(
        (child) => child.view_authority || child.edit_authority
      )

      return {
        ...parent,
        authority: hasPermissions,
        children: updatedChildren,
      }
    })

    setPermissionsData(updatedPermissionsData)

    // Log for debugging
    // console.log('User permissions:', user.permissions)
    // console.log('Permission map:', permissionMap)
    // console.log('Updated permissions data:', updatedPermissionsData)
  }
const withCreator = (payload: any) => ({
  ...payload,
  creator: user?.email,  // logged-in user's email
});
  // Handle form submission for update
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      (!isSuperAdmin && formData.permissions.length === 0)
    ) {
      toast.error(
        'Please fill in all required fields and select at least one permission'
      )
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      const creatorEmail = user?.email || ''
  
      // request body based on whether superadmin is checked
      const requestBody = isSuperAdmin
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: ['superadmin'],
            creator: creatorEmail,
          }
        : withCreator(formData)

      console.log('Submitting request body:', requestBody)

      if (selectedUser) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/v1/auth/update/${selectedUser._id}`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        toast.success('User permissions updated successfully')
      }

      fetchUsers()

      setShowDialog(false)
      resetPermissions()
    } catch (error: any) {
      console.error('Error submitting data:', error)
      const errorMessage = error.response?.data?.message || 'An error occurred'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/delete/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  // Confirm delete dialog
  const confirmDelete = (userId: string) => {
    confirmDialog({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDeleteUser(userId),
    })
  }

  // Create a separate component for the action menu
  const ActionMenu = ({ rowData }: { rowData: UserType }) => {
    const menuRef = useRef<Menu>(null)

    const items = [
      {
        label: 'View',
        icon: 'pi pi-eye',
        command: () => openViewDialog(rowData),
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => openEditDialog(rowData),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => confirmDelete(rowData._id),
      },
    ]

    return (
      <div className='flex justify-center'>
        <Menu model={items} popup ref={menuRef} />
        <Button
          icon='pi pi-ellipsis-v'
          onClick={(e) => menuRef.current?.toggle(e)}
          aria-controls={`popup_menu_${rowData._id}`}
          aria-haspopup
          className='p-button-rounded p-button-text'
        />
      </div>
    )
  }

  // Action button template for the data table
  const actionBodyTemplate = (rowData: UserType) => {
    return <ActionMenu rowData={rowData} />
  }

  // Role template for the data table
  const roleBodyTemplate = (rowData: UserType) => {
    return (
      <div>
        {rowData.role.map((role, index) => {
          const mapping = parentLabelMappings.find(
            (item) => item.id === role.title
          )
          const displayName = mapping ? mapping.label : formatName(role.title)
          return (
            <span key={role._id} className='mr-1'>
              {displayName}
              {index < rowData.role.length - 1 ? ' |' : ''}
            </span>
          )
        })}
      </div>
    )
  }

  // Dialog header based on mode
  const getDialogHeader = () => {
    return dialogMode === 'view'
      ? 'View User Permissions'
      : 'Edit User Permissions'
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
        <div className='p-4 w-full mx-auto mt-8'>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-2xl font-bold'>User Permission Management</h1>
          </div>

          <DataTable
            value={users}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            loading={loadingUsers}
            emptyMessage='No users found'
            showGridlines
          >
            <Column
              field='slNo'
              header='SL No'
              sortable
              headerClassName='bg-[#ffc2c2]'
            />
            <Column
              field='name'
              header='Name'
              sortable
              headerClassName='bg-[#ffc2c2]'
            />
            <Column
              field='email'
              header='Email'
              sortable
              headerClassName='bg-[#ffc2c2]'
            />
            <Column
              header='Roles'
              body={roleBodyTemplate}
              headerClassName='bg-[#ffc2c2]'
            />
            <Column
              body={actionBodyTemplate}
              style={{ width: '5rem', textAlign: 'center' }}
              header='Actions'
              headerClassName='bg-[#ffc2c2]'
            />
          </DataTable>
        </div>

        <Dialog
          visible={showDialog}
          style={{ width: '90%', maxWidth: '900px' }}
          header={getDialogHeader()}
          modal
          className='p-fluid'
          onHide={() => setShowDialog(false)}
          footer={
            dialogMode !== 'view' ? (
              <div>
                <Button
                  label='Cancel'
                  icon='pi pi-times'
                  className='p-button-text'
                  onClick={() => setShowDialog(false)}
                />
                <Button
                  label='Save'
                  className='!bg-black text-center !text-white hover:bg-gray-800 border-none'
                  onClick={handleSubmit}
                  loading={loading}
                />
              </div>
            ) : (
              <Button
                label='Close'
                className='p-button-text'
                onClick={() => setShowDialog(false)}
              />
            )
          }
        >
          <div className='p-4 w-full mx-auto border rounded-lg shadow-md'>
            <div className='mb-6 border border-gray-200 rounded-lg'>
              <div className='bg-gray-50 px-4 py-2 border-b border-gray-200'>
                <h3 className='text-gray-700 font-semibold'>
                  Document History
                </h3>
              </div>
              <div className='p-4 space-y-4'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h4 className='text-sm font-medium text-gray-500'>
                      Created By
                    </h4>
                    <div className='mt-1'>
                      <p className='text-sm text-gray-900'>
                        {selectedUser?.creator || 'N/A'}
                      </p>
                      {selectedUser?.creationTimestamp && (
                        <p className='text-sm text-gray-600'>
                          <span>
                            Date: {selectedUser.creationTimestamp.split(' ')[0]}
                          </span>
                          <span className='mx-1'>•</span>
                          <span>
                            Time: {selectedUser.creationTimestamp.split(' ')[1]}
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
                        {selectedUser?.creator || 'N/A'}
                      </p>
                      {selectedUser?.updatingTimestamp && (
                        <p className='text-sm text-gray-600'>
                          <span>
                            Date: {selectedUser.updatingTimestamp.split(' ')[0]}
                          </span>
                          <span className='mx-1'>•</span>
                          <span>
                            Time: {selectedUser.updatingTimestamp.split(' ')[1]}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className='space-y-6 w-full mx-auto'>
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
                      disabled={dialogMode === 'view'}
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
                      disabled={dialogMode === 'view'}
                    />
                  </div>

                  <div className='space-y-2'>
                    <label htmlFor='password' className='block font-medium'>
                      Change Password (Optional)
                    </label>
                    <div className='relative'>
                      <InputText
                        id='password'
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder='Enter password'
                        className='w-full'
                        autoComplete='off'
                        disabled={dialogMode === 'view'}
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 transform -translate-y-1/2'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className='space-y-6 mt-8'>
                  <div className='permissions-container'>
                    <h3 className='text-lg font-medium mb-4'>Permissions</h3>

                    {showSuperAdmin && (
                      <div className='flex items-center space-x-2 mb-4'>
                        <Checkbox
                          id='superadmin'
                          checked={isSuperAdmin}
                          onChange={(e) => setIsSuperAdmin(e.checked || false)}
                          disabled={dialogMode === 'view'}
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
                        <span className='mr-16'>Authority</span>
                      </div> */}

                      <Tree
                        header={headerTemplate}
                        value={treeNodes}
                        expandedKeys={expandedKeys}
                        onToggle={(e) => setExpandedKeys(e.value)}
                        // @ts-ignore
                        nodeTemplate={nodeTemplate}
                        className='custom-permission-tree'
                        disabled={isSuperAdmin || dialogMode === 'view'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
        <ConfirmDialog />
      </AdminPanelLayout>
    </>
  )
}

export default UpdateAdmin
