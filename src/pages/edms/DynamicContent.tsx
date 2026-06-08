import React, { useState, Suspense } from "react"
import {
  Search,
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react"

type TreeNode = {
  id: string
  title: string
  type: "folder" | "file"
  count?: number | string
  component?: string
  children?: TreeNode[]
}

const componentModules = import.meta.glob("/src/pages/**/*.tsx")

const navJson: TreeNode[] = [
  {
    id: "project-data",
    title: "Project Data",
    type: "folder",
    children: [
      {
        id: "letters",
        title: "Letters",
        type: "folder",
        children: [
          {
            id: "incoming-letters",
            title: "Incoming Letters",
            type: "folder",
            children: [
              {
                id: "inc-admin",
                title: "Administration",
                type: "file",
                count: 340,
                component: "admin- edms/asset-management/index",
              },
              {
                id: "inc-road-traffic",
                title: "Road & Traffic",
                type: "file",
                count: 791,
                component: "edms/incoming/road-traffic",
              },
              {
                id: "inc-main-bridge",
                title: "Main Bridge",
                type: "file",
                count: 205,
                component: "edms/incoming/main-bridge",
              },
              {
                id: "inc-rtw",
                title: "RTW",
                type: "file",
                count: 392,
                component: "edms/incoming/rtw",
              },
              {
                id: "inc-toll-operation",
                title: "Toll Operation",
                type: "file",
                count: 503,
                component: "edms/incoming/toll-operation",
              },
              {
                id: "inc-its",
                title: "ITS",
                type: "file",
                count: 356,
                component: "edms/incoming/its",
              },
            ],
          },
          {
            id: "outgoing-letters",
            title: "Outgoing Letters",
            type: "folder",
            children: [],
          },
        ],
      },
    ],
  },

  {
    id: "admin-edms",
    title: "Administration",
    type: "folder",
    children: [
      {
        id: "asset-management",
        title: "Asset Management",
        type: "folder",
        children: [
          {
            id: "asset-management-index",
            title: "Index",
            type: "file",
            component: "admin- edms/asset-management/index",
          },
        ],
      },

      {
        id: "building-maintenance",
        title: "Building Maintenance",
        type: "folder",
        children: [
          {
            id: "building-maintenance-monthly-report",
            title: "Monthly Report",
            type: "folder",
            children: [
              {
                id: "building-maintenance-monthly-report-index",
                title: "Index",
                type: "file",
                component: "admin- edms/building-maintenance/monthly-report/index",
              },
            ],
          },
          {
            id: "building-maintenance-tools",
            title: "Tools",
            type: "folder",
            children: [
              {
                id: "building-maintenance-tools-index",
                title: "Index",
                type: "file",
                component: "admin- edms/building-maintenance/tools/index",
              },
            ],
          },
        ],
      },

      {
        id: "employee-personal-profile",
        title: "Employee Personal Profile",
        type: "folder",
        children: [
          {
            id: "employee-personal-profile-index",
            title: "Index",
            type: "file",
            component: "admin- edms/employee-personal-profile/index",
          },
        ],
      },

      {
        id: "fire-mgt",
        title: "Fire Management",
        type: "folder",
        children: [
          {
            id: "fire-mgt-monthly-report",
            title: "Fire Monthly Report",
            type: "folder",
            children: [
              {
                id: "fire-mgt-monthly-report-index",
                title: "Index",
                type: "file",
                component: "admin- edms/fire-mgt/fire-monthly-report/index",
              },
            ],
          },
          {
            id: "fire-mgt-tools",
            title: "Fire Tools",
            type: "folder",
            children: [
              {
                id: "fire-mgt-tools-index",
                title: "Index",
                type: "file",
                component: "admin- edms/fire-mgt/fire-tools/index",
              },
            ],
          },
        ],
      },

      {
        id: "gardening",
        title: "Gardening",
        type: "folder",
        children: [
          {
            id: "gardening-monthly-activity",
            title: "Gardening Monthly Activity",
            type: "folder",
            children: [
              {
                id: "gardening-monthly-activity-index",
                title: "Index",
                type: "file",
                component: "admin- edms/gardening/gardening-monthly-activity/index",
              },
            ],
          },
          {
            id: "gardening-tools",
            title: "Gardening Tools",
            type: "folder",
            children: [
              {
                id: "gardening-tools-index",
                title: "Index",
                type: "file",
                component: "admin- edms/gardening/gardening-tools/index",
              },
            ],
          },
        ],
      },

      {
        id: "health-center",
        title: "Health Center",
        type: "folder",
        children: [
          {
            id: "health-center-medical-equipment",
            title: "Medical Equipment Record",
            type: "file",
            component: "admin- edms/health-center/medical-equipment-record",
          },
          {
            id: "health-center-medicine-in-out",
            title: "Medicine In-Out Record",
            type: "file",
            component: "admin- edms/health-center/medicine-in-out-record",
          },
          {
            id: "health-center-monthly-report",
            title: "Monthly Report",
            type: "file",
            component: "admin- edms/health-center/monthly-report",
          },
        ],
      },

    //   {
    //     id: "hr",
    //     title: "HR",
    //     type: "folder",
    //     children: [
    //       {
    //         id: "hr-em-personal-detail",
    //         title: "Employee Personal Detail",
    //         type: "folder",
    //         children: [
    //           {
    //             id: "hr-em-personal-detail-index",
    //             title: "Index",
    //             type: "file",
    //             component: "admin- edms/hr/em-personal-detail/index",
    //           },
    //         ],
    //       },
    //     ],
    //   },

      {
        id: "ipc",
        title: "IPC",
        type: "folder",
        children: [
          {
            id: "ipc-monthly-updates",
            title: "IPC Monthly Updates",
            type: "folder",
            children: [
              {
                id: "ipc-monthly-updates-index",
                title: "Index",
                type: "file",
                component: "admin- edms/ipc/ipc-monthly-updates/index",
              },
            ],
          },
          {
            id: "ipc-records",
            title: "IPC Records",
            type: "folder",
            children: [
              {
                id: "ipc-records-index",
                title: "Index",
                type: "file",
                component: "admin- edms/ipc/ipc-records/index",
              },
            ],
          },
        ],
      },

      {
        id: "it-electronics-communication",
        title: "IT Electronics Communication",
        type: "folder",
        children: [
          {
            id: "it-electronics-monthly-report",
            title: "IT Electronics Monthly Report",
            type: "folder",
            children: [
              {
                id: "it-electronics-monthly-report-index",
                title: "Index",
                type: "file",
                component:
                  "admin- edms/it-electronics-communication/it-electronics-monthly-report/index",
              },
            ],
          },
          {
            id: "it-electronics-tools",
            title: "IT Electronics Tools",
            type: "folder",
            children: [
              {
                id: "it-electronics-tools-index",
                title: "Index",
                type: "file",
                component:
                  "admin- edms/it-electronics-communication/it-electronics-tools/index",
              },
            ],
          },
        ],
      },

      {
        id: "letter-attachment",
        title: "Letter Attachment",
        type: "folder",
        children: [
          {
            id: "letter-attachment-incoming",
            title: "Incoming",
            type: "folder",
            children: [
              {
                id: "letter-attachment-incoming-index",
                title: "Index",
                type: "file",
                component: "admin- edms/letter-attachment/incoming/index",
              },
            ],
          },
          {
            id: "letter-attachment-outgoing",
            title: "Outgoing",
            type: "folder",
            children: [
              {
                id: "letter-attachment-outgoing-index",
                title: "Index",
                type: "file",
                component: "admin- edms/letter-attachment/outgoing/index",
              },
            ],
          },
        ],
      },

      {
        id: "organogram",
        title: "Organogram",
        type: "folder",
        children: [
          {
            id: "organogram-index",
            title: "Index",
            type: "file",
            component: "admin- edms/organogram/index",
          },
        ],
      },

      {
        id: "security-mgt",
        title: "Security Management",
        type: "folder",
        children: [
          {
            id: "security-mgt-monthly-report",
            title: "Security Monthly Report",
            type: "folder",
            children: [
              {
                id: "security-mgt-monthly-report-index",
                title: "Index",
                type: "file",
                component: "admin- edms/security-mgt/security-monthly-report/index",
              },
            ],
          },
          {
            id: "security-mgt-tools",
            title: "Security Tools",
            type: "folder",
            children: [
              {
                id: "security-mgt-tools-index",
                title: "Index",
                type: "file",
                component: "admin- edms/security-mgt/security-tools/index",
              },
            ],
          },
        ],
      },

      {
        id: "vehicle-mgt-record",
        title: "Vehicle Management Record",
        type: "folder",
        children: [
          {
            id: "vehicle-mgt-record-index",
            title: "Index",
            type: "file",
            component: "admin- edms/vehicle-mgt-record/index",
          },
        ],
      },

      {
        id: "root-index",
        title: "Index",
        type: "file",
        component: "admin- edms/index",
      },
    ],
  },

{
  id: "road-and-traffic-edms",
  title: "Road & Traffic",
  type: "folder",
  children: [
    
    
   
    {
      id: "road-traffic-letter-attachment",
      title: "Letter Attachment",
      type: "folder",
      children: [
        {
          id: "road-traffic-letter-attachment-incoming",
          title: "Incoming",
          type: "folder",
          children: [
            {
              id: "road-traffic-letter-attachment-incoming-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/letter-attachment/incoming/index",
            },
          ],
        },
        {
          id: "road-traffic-letter-attachment-outgoing",
          title: "Outgoing",
          type: "folder",
          children: [
            {
              id: "road-traffic-letter-attachment-outgoing-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/letter-attachment/outgoing/index",
            },
          ],
        },
      ],
    },
    {
      id: "road-traffic-monthly-report",
      title: "Monthly Report",
      type: "folder",
      children: [
        {
          id: "road-traffic-monthly-report-index",
          title: "Index",
          type: "file",
          component: "road-and-traffic-edms/monthly-report/index",
        },
      ],
    },
    {
      id: "road-traffic-monthly-roaster",
      title: "Monthly Roaster",
      type: "folder",
      children: [
        {
          id: "road-traffic-monthly-roaster-index",
          title: "Index",
          type: "file",
          component: "road-and-traffic-edms/monthly-roaster/index",
        },
      ],
    },
    {
      id: "road-traffic-orgaorganization-organogram",
      title: "Orgaorganization Organogram",
      type: "folder",
      children: [
        {
          id: "road-traffic-orgaorganization-organogram-index",
          title: "Index",
          type: "file",
          component: "road-and-traffic-edms/orgaorganization-organogram/index",
        },
      ],
    },


    {
      id: "road-and-maintenance",
      title: "Road And Maintenance",
      type: "folder",
      children: [
        {
          id: "road-and-maintenance-accident",
          title: "Accident",
          type: "folder",
          children: [
            {
              id: "road-and-maintenance-accident-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-maintenance/accident/index",
            },
          ],
        },
        {
          id: "road-and-maintenance-completion-form",
          title: "Completion Form",
          type: "folder",
          children: [
            {
              id: "road-and-maintenance-completion-form-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-maintenance/completion-form/index",
            },
          ],
        },
        {
          id: "road-and-maintenance-drawing",
          title: "Drawing",
          type: "folder",
          children: [
            {
              id: "road-and-maintenance-drawing-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-maintenance/drawing/index",
            },
          ],
        },
        {
          id: "road-and-maintenance-inspection-report",
          title: "Inspection Report",
          type: "folder",
          children: [
            {
              id: "road-and-maintenance-inspection-report-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-maintenance/inspection-report/index",
            },
          ],
        },
        {
          id: "road-and-maintenance-letter-attachment",
          title: "Letter Attachment",
          type: "folder",
          children: [
            {
              id: "road-and-maintenance-letter-attachment-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-maintenance/letter-attachment/index",
            },
          ],
        },
        {
          id: "road-and-maintenance-miscellaneous",
          title: "Miscellaneous",
          type: "folder",
          children: [
            {
              id: "road-and-maintenance-miscellaneous-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-maintenance/miscellaneous/index",
            },
          ],
        },
        {
          id: "road-and-maintenance-reciving-materials-form",
          title: "Reciving Materials Form",
          type: "folder",
          children: [
            {
              id: "road-and-maintenance-reciving-materials-form-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-maintenance/reciving-materials-form/index",
            },
          ],
        },
        {
          id: "road-and-maintenance-requisition-form",
          title: "Requisition Form",
          type: "folder",
          children: [
            {
              id: "road-and-maintenance-requisition-form-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-maintenance/requisition-form/index",
            },
          ],
        },
      ],
    },
    {
      id: "road-and-patrol",
      title: "Road And Patrol",
      type: "folder",
      children: [
        {
          id: "road-and-patrol-accident",
          title: "Accident",
          type: "folder",
          children: [
            {
              id: "road-and-patrol-accident-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-patrol/accident/index",
            },
          ],
        },
        {
          id: "road-and-patrol-completion-form",
          title: "Completion Form",
          type: "folder",
          children: [
            {
              id: "road-and-patrol-completion-form-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-patrol/completion-form/index",
            },
          ],
        },
        {
          id: "road-and-patrol-controllers-report",
          title: "Controllers Report",
          type: "folder",
          children: [
            {
              id: "road-and-patrol-controllers-report-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-patrol/controllers-report/index",
            },
          ],
        },
        {
          id: "road-and-patrol-drawing",
          title: "Drawing",
          type: "folder",
          children: [
            {
              id: "road-and-patrol-drawing-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-patrol/drawing/index",
            },
          ],
        },
        {
          id: "road-and-patrol-inspection-report",
          title: "Inspection Report",
          type: "folder",
          children: [
            {
              id: "road-and-patrol-inspection-report-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-patrol/inspection-report/index",
            },
          ],
        },
        {
          id: "road-and-patrol-letter-attachment",
          title: "Letter Attachment",
          type: "folder",
          children: [
            {
              id: "road-and-patrol-letter-attachment-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-patrol/letter-attachment/index",
            },
          ],
        },
        {
          id: "road-and-patrol-miscellaneous",
          title: "Miscellaneous",
          type: "folder",
          children: [
            {
              id: "road-and-patrol-miscellaneous-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-patrol/miscellaneous/index",
            },
          ],
        },
        {
          id: "road-and-patrol-reciving-materials-form",
          title: "Reciving Materials Form",
          type: "folder",
          children: [
            {
              id: "road-and-patrol-reciving-materials-form-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-patrol/reciving-materials-form/index",
            },
          ],
        },
        {
          id: "road-and-patrol-requisition-form",
          title: "Requisition Form",
          type: "folder",
          children: [
            {
              id: "road-and-patrol-requisition-form-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/road-and-patrol/requisition-form/index",
            },
          ],
        },
       
       
      ],
    },
    {
      id: "workshop",
      title: "Workshop",
      type: "folder",
      children: [
        {
          id: "workshop-accident",
          title: "Accident",
          type: "folder",
          children: [
            {
              id: "workshop-accident-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/workshop/accident/index",
            },
          ],
        },
        {
          id: "workshop-completion-form",
          title: "Completion Form",
          type: "folder",
          children: [
            {
              id: "workshop-completion-form-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/workshop/completion-form/index",
            },
          ],
        },
        {
          id: "workshop-drawing",
          title: "Drawing",
          type: "folder",
          children: [
            {
              id: "workshop-drawing-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/workshop/drawing/index",
            },
          ],
        },
        {
          id: "workshop-inspection-report",
          title: "Inspection Report",
          type: "folder",
          children: [
            {
              id: "workshop-inspection-report-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/workshop/inspection-report/index",
            },
          ],
        },
        {
          id: "workshop-letter-attachment",
          title: "Letter Attachment",
          type: "folder",
          children: [
            {
              id: "workshop-letter-attachment-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/workshop/letter-attachment/index",
            },
          ],
        },
        {
          id: "workshop-miscellaneous",
          title: "Miscellaneous",
          type: "folder",
          children: [
            {
              id: "workshop-miscellaneous-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/workshop/miscellaneous/index",
            },
          ],
        },
        {
          id: "workshop-reciving-materials-form",
          title: "Reciving Materials Form",
          type: "folder",
          children: [
            {
              id: "workshop-reciving-materials-form-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/workshop/reciving-materials-form/index",
            },
          ],
        },
        {
          id: "workshop-requisition-form",
          title: "Requisition Form",
          type: "folder",
          children: [
            {
              id: "workshop-requisition-form-index",
              title: "Index",
              type: "file",
              component: "road-and-traffic-edms/workshop/requisition-form/index",
            },
          ],
        },
      ],
    },
  ],
},
{
  id: "its-edms",
  title: "ITS EDMS",
  type: "folder",
  children: [
    {
      id: "its-about-us",
      title: "About Us",
      type: "folder",
      children: [
        {
          id: "its-about-us-index",
          title: "Index",
          type: "file",
          component: "its-edms/AboutUs/index",
        },
      ],
    },
    {
      id: "its-letter-attachment",
      title: "Letter Attachment",
      type: "folder",
      children: [
        {
          id: "its-letter-attachment-incoming",
          title: "Incoming",
          type: "folder",
          children: [
            {
              id: "its-letter-attachment-incoming-index",
              title: "Index",
              type: "file",
              component: "its-edms/letter-attachment/incoming/index",
            },
          ],
        },
        {
          id: "its-letter-attachment-outgoing",
          title: "Outgoing",
          type: "folder",
          children: [
            {
              id: "its-letter-attachment-outgoing-index",
              title: "Index",
              type: "file",
              component: "its-edms/letter-attachment/outgoing/index",
            },
          ],
        },
      ],
    },
    {
      id: "its-monthly-report",
      title: "Monthly Report",
      type: "folder",
      children: [
        {
          id: "its-monthly-report-index",
          title: "Index",
          type: "file",
          component: "its-edms/MonthlyReport/index",
        },
      ],
    },
    {
      id: "its-notice",
      title: "Notice",
      type: "folder",
      children: [
        {
          id: "its-notice-index",
          title: "Index",
          type: "file",
          component: "its-edms/Notice/index",
        },
      ],
    },
    {
      id: "its-operation-manual",
      title: "Operation Manual",
      type: "folder",
      children: [
        {
          id: "its-operation-manual-index",
          title: "Index",
          type: "file",
          component: "its-edms/OperationManual/index",
        },
      ],
    },
    {
      id: "its-organization",
      title: "Organization",
      type: "folder",
      children: [
        {
          id: "its-organization-index",
          title: "Index",
          type: "file",
          component: "its-edms/Organization/index",
        },
      ],
    },
    {
      id: "its-organogram",
      title: "Organogram",
      type: "folder",
      children: [
        {
          id: "its-organogram-index",
          title: "Index",
          type: "file",
          component: "its-edms/Organom/index",
        },
      ],
    },
    {
      id: "its-system-configure",
      title: "System Configure",
      type: "folder",
      children: [
        {
          id: "its-system-configure-index",
          title: "Index",
          type: "file",
          component: "its-edms/SystemConfigure/index",
        },
      ],
    },
    {
      id: "its-work-plan",
      title: "Work Plan",
      type: "folder",
      children: [
        {
          id: "its-work-plan-index",
          title: "Index",
          type: "file",
          component: "its-edms/WorkPlan/index",
        },
      ],
    },
  ],
},
]

export default function EdmsFileExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set([
      "project-data",
      "letters",
      "incoming-letters",
      "admin-edms",
      "building-maintenance",
      "building-maintenance-monthly-report",
    ])
  )

  const [selected, setSelected] = useState<string | null>(null)
  const [ActiveComponent, setActiveComponent] =
    useState<null | React.ComponentType>(null)
  const [loadingComp, setLoadingComp] = useState(false)

  async function handleChildClick(node: TreeNode) {
    if (node.type === "folder") {
      setExpanded((prev) => {
        const next = new Set(prev)
        next.has(node.id) ? next.delete(node.id) : next.add(node.id)
        return next
      })
      return
    }

    if (!node.component) return

    setSelected(node.id)
    setLoadingComp(true)

    try {
      const componentPath = `/src/pages/${node.component}.tsx`
      const importer = componentModules[componentPath]

      if (!importer) {
        throw new Error(`Component not found: ${componentPath}`)
      }

      const mod: any = await importer()
      setActiveComponent(() => mod.default)
    } catch (err) {
      console.error("Failed to load component", err)

      setActiveComponent(() => () => (
        <div className="m-6 h-full rounded-xl border border-red-100 bg-red-50/50 p-8 text-red-500">
          <FileText size={48} className="mb-4 text-red-300" />
          <h2 className="text-xl font-bold">Component Not Found</h2>
          <p className="mt-2 text-sm text-red-400">
            Make sure this file exists:
          </p>
          <code className="mt-2 block rounded border bg-white px-2 py-1 text-gray-700">
            /src/pages/{node.component}.tsx
          </code>
        </div>
      ))
    } finally {
      setLoadingComp(false)
    }
  }

  const toggleExpandOnly = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const renderTree = (nodes: TreeNode[], level = 0): React.ReactNode => {
    return nodes.map((node) => {
      const isExpanded = expanded.has(node.id)
      const isSelected = selected === node.id
      const hasChildren = !!node.children?.length

      const matchesSearch = node.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

      const hasMatchingChild = node.children?.some((child) =>
        child.title.toLowerCase().includes(searchQuery.toLowerCase())
      )

      if (searchQuery && !matchesSearch && !hasMatchingChild) return null

      return (
        <div key={node.id} className="flex flex-col">
          <div
            onClick={() => handleChildClick(node)}
            className={`relative flex w-full cursor-pointer select-none items-center px-3 py-1.5 ${
              isSelected
                ? "bg-blue-50/70 text-[#2b5296]"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
          >
            {isSelected && (
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#3b66b5]" />
            )}

            <div className="mr-1 flex w-5 items-center justify-center">
              {node.type === "folder" && (
                <button
                  onClick={(e) => toggleExpandOnly(node.id, e)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {isExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              )}
            </div>

            <div className="mr-2 text-gray-400">
              {node.type === "folder" ? (
                isExpanded ? (
                  <FolderOpen size={16} strokeWidth={2.5} />
                ) : (
                  <Folder size={16} strokeWidth={2.5} />
                )
              ) : (
                <FileText size={16} strokeWidth={2.5} />
              )}
            </div>

            <span
              className={`flex-1 truncate text-sm ${
                isSelected ? "font-semibold" : "font-medium"
              }`}
            >
              {node.title}
            </span>

            {node.count !== undefined && (
              <span className="ml-2 font-mono text-[11px] tracking-wider text-gray-400">
                {node.count}
              </span>
            )}
          </div>

          {isExpanded && hasChildren && (
            <div className="flex flex-col">
              {renderTree(node.children!, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-white">
      <div className="h-full w-80 shrink-0 border-r border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-4 pb-2">
          <div className="flex h-9 items-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
            <Search size={16} className="ml-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search folders & files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-full bg-transparent px-2 text-sm outline-none"
            />
          </div>
        </div>

        <div className="h-full overflow-y-auto py-2">{renderTree(navJson)}</div>
      </div>

      <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-[#f8f9fa]">
        {loadingComp && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-[#0055aa]" />
          </div>
        )}

        {!ActiveComponent && !loadingComp && (
          <div className="m-6 flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white">
            <FolderOpen size={64} className="mb-4 text-gray-200" />
            <h1 className="mb-2 text-3xl font-bold text-gray-300">
              No File Selected
            </h1>
            <p className="text-sm text-gray-400">
              Select a document from the left sidebar to view its contents.
            </p>
          </div>
        )}

        {ActiveComponent && (
          <div className="h-full overflow-hidden border border-gray-200 bg-white shadow-sm">
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-gray-400">
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Rendering Component...
                </div>
              }
            >
              <ActiveComponent />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}