import FileIcon from '@/components/icons/FileIcon'
import GuardIcon from '@/components/icons/GuardIcon'
import PatrolIcon from '@/components/icons/PatrolIcon'
import WorkshopIcon from '@/components/icons/WorkshopIcon'
import KecIcon from '@/components/icons/KecIcon'
import ReportIcon from '@/components/icons/ReportIcon'
import SignalIcon from '@/components/icons/SignalIcon'
import AboutIcon from '@/components/icons/AboutIcon'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element | ''
  uName?: string
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const administrationLinks: SideLink[] = [
  {
    title: 'Administrative',
    label: '',
    href: '',
    icon: '',
    uName: 'administrative',
  },
   {
    title: 'Letter Attachment',
    label: '',
    href: '',
    uName: 'admin-letter-attachment',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Incoming Attachment',
        label: '',
        href: '/administrative/letter-attachment/incoming-letters',
        icon: '',
      },
      {
        title: 'Outgoing Attachment',
        label: '',
        href: '/administrative/letter-attachment/outgoing-letters',
        icon: '',
      }
    ],
  },
      {
    title: 'Organogram',
    label: '',
    href: '/administrative/organogram',
    icon: <FileIcon />,
    uName: 'organogram',
  },
  {
    title: 'Employee Personal Profile',
    label: '',
    href: '/administrative/employee-personal-profile',
    uName: 'employee-personal-profile',
    icon: <FileIcon />,
  },
  {
    title: 'Vehicle Mgt. Record',
    label: '',
    href: '/administrative/vehicle-mgt-record',
    uName: 'vehicle-management',
    icon: <FileIcon />,
  },
  {
    title: 'Asset Management',
    label: '',
    href: '/administrative/asset-management',
    uName: 'asset-management',
    icon: <FileIcon />,
  },
  {
    title: 'Building Maintenance',
    label: '',
    href: '',
    uName: 'building-maintenance',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Monthly Maintenance Report',
        label: '',
        href: '/administrative/building-maintenance-report',
        icon: '',
      },
      {
        title: 'Tools',
        label: '',
        href: '/administrative/building-maintenance-tools',
        icon: '',
      }


    ],
  },
  {
    title: 'Health Center',
    label: '',
    href: '',
    uName: 'health-center',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Monthly Report',
        label: '',
        href: '/administrative/health-center-monthly-report',
        icon: '',
      },
      {
        title: 'Medicine In/Out Record',
        label: '',
        href: '/administrative/health-center-medicine-record',
        icon: '',
      },
      {
        title: 'Medical Equipment Record',
        label: '',
        href: '/administrative/health-center-monthly-equipment-record',
        icon: '',
      },


    ],
  },
  {
    title: 'Gardening Mgt.',
    label: '',
    href: '',
    uName: 'gardening-mgt',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Monthly Activity',
        label: '',
        href: '/administrative/gardening-monthly-activity',
        icon: '',
      },
      {
        title: 'Gardening Tools',
        label: '',
        href: '/administrative/gardening-tools',
        icon: '',
      },


    ],
  },
  {
    title: 'Fire Mgt.',
    label: '',
    href: '',
    uName: 'fire-mgt',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Monthly Activity',
        label: '',
        href: '/administrative/fire-mgt-monthly-report',
        icon: '',
      },
      {
        title: ' Tools',
        label: '',
        href: '/administrative/fire-mgt-tools',
        icon: '',
      },


    ],
  },

  {
    title: 'IT Electronics',
    label: '',
    href: '',
    uName: 'it-electronics',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Monthly Report',
        label: '',
        href: '/administrative/it-electronics-communication-report',
        icon: '',
      },
      {
        title: 'Tools',
        label: '',
        href: '/administrative/it-electronics-communication-tools',
        icon: '',
      }


    ],
  },

  {
    title: 'Security Mgt.',
    label: '',
    href: '',
    uName: 'security-mgt',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Monthly Report',
        label: '',
        href: '/administrative/security-mgt-monthly-report',
        icon: '',
      },
      {
        title: 'Tools',
        label: '',
        href: '/administrative/security-mgt-tools',
        icon: '',
      }


    ],
  },


  // start of finance links
  {
    title: 'Finance & Accounts',
    label: '',
    href: '',
    icon: '',
    uName: 'finance-&-accounts',
  },
  {
    title: 'Monthly IPC Updates',
    label: '',
    href: '/finance/ipc-monthly-updates',
    uName: 'monthly-ipc-updates',
    icon: <FileIcon />,
  },
  {
    title: 'IPC Records',
    label: '',
    href: '/finance/ipc-records',
    uName: 'ipc-records',
    icon: <FileIcon />,
  },
]
export const genInfoLinks: SideLink[] = [
  {
    title: 'General Status',
    label: '',
    href: '/general-information/general-status',
    uName: 'general-status',
    icon: <FileIcon />,
  },
  {
    title: 'Organization Chart',
    label: '',
    href: '/general-information/organization-chart',
    uName: 'organization-chart',
    icon: <FileIcon />,
  },
  {
    title: 'Location Chart',
    label: '',
    href: '/general-information/location-chart',
    uName: 'location-chart',
    icon: <FileIcon />,
  },
  {
    title: 'Aerial Photography',
    label: '',
    href: '/general-information/aerial-photography',
    uName: 'aerial-photography',
    icon: <FileIcon />,
  },
  {
    title: 'Staff Chart',
    label: '',
    href: '/general-information/staff-summary',
    uName: 'staff-chart',
    icon: <FileIcon />,
  },
  {
    title: 'Reference',
    label: '',
    href: '/general-information/reference',
    uName: 'reference',
    icon: <FileIcon />,
  },
]

export const rntLinks: SideLink[] = [
  {
    title: 'Road & Traffic',
    label: '',
    href: '',
    icon: '',
    uName: '',
  },
  {
    title: 'Letter Attachment',
    label: '',
    href: '',
    uName: 'r&t-letter-attachment',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Incoming Attachment',
        label: '',
        href: '/road-and-traffic/letter-attachment/incoming-letters',
        icon: '',
      },
      {
        title: 'Outgoing Attachment',
        label: '',
        href: '/road-and-traffic/letter-attachment/outgoing-letters',
        icon: '',
      }
    ],
  },
 {
    title: 'Organization/ Organogram',
    label: '',
    href: '/road-and-traffic/organization-organogram',
    uName: 'r&t-organization',
    icon: <FileIcon />,
  },
  {
    title: 'Monthly Roster (Final)',
    label: '',
    href: '/road-and-traffic/monthly-roaster',
    uName: 'r&t-monthly-roster',
    icon: <GuardIcon />,
  },
  {
    title: 'Monthly Report',
    label: '',
    href: '/road-and-traffic/monthly-report',
    uName: 'r&t-monthly-report',
    icon: <ReportIcon />,
  },
    {
    title: 'KEC Letter',
    label: '',
    href: '/road-and-traffic/kec-letter',
    uName: 'r&t-kec-letter',
    icon: <KecIcon />,
  },
 
  {
    title: 'Road Maintenance Part',
    label: '',
    href: '',
    uName: 'r&t-road-maintenance',
    icon: <SignalIcon />,
    sub: [
      {
        title: 'Accident / Incident Report',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/accident-incident-report',
        icon: '',
      },
      {
        title: 'Completion Form',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/completion-form',
        icon: '',
      },
      {
        title: 'Drawing',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/drawing',
        icon: '',
      },
      {
        title: 'Inspection Report',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/inspection-report',
        icon: '',
      },
      {
        title: 'Letter Attachment',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/letter-attachment',
        icon: '',
      },
      {
        title: 'Miscellaneous',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/miscellaneous',
        icon: '',
      },
      {
        title: 'Reciving Materials From',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/reciving-materials-form',
        icon: '',
      },
      {
        title: 'Requisition Form',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/requisition-form',
        icon: '',
      },
    ],
  },
  {
    title: 'Road Safety & Patrol Part',
    label: '',
    href: '',
    uName: 'r&t-road-safety-patrol',
    icon: <PatrolIcon />,
    sub: [
      {
        title: 'Accident / Incident Report',
        label: '',
        href: '/road-and-traffic/road-and-patrol/accident-incident-report',
        icon: '',
      },
      {
        title: 'Completion Form',
        label: '',
        href: '/road-and-traffic/road-and-patrol/completion-form',
        icon: '',
      },
      {
        title: 'Controller’s Report',
        label: '',
        href: '/road-and-traffic/road-and-patrol/controllers-report',
        icon: '',
      },
      {
        title: 'Drawing',
        label: '',
        href: '/road-and-traffic/road-and-patrol/drawing',
        icon: '',
      },
      {
        title: 'Inspection Report',
        label: '',
        href: '/road-and-traffic/road-and-patrol/inspection-report',
        icon: '',
      },
      {
        title: 'Letter Attachment',
        label: '',
        href: '/road-and-traffic/road-and-patrol/letter-attachment',
        icon: '',
      },
      {
        title: 'Miscellaneous',
        label: '',
        href: '/road-and-traffic/road-and-patrol/miscellaneous',
        icon: '',
      },
      {
        title: 'Reciving Materials From',
        label: '',
        href: '/road-and-traffic/road-and-patrol/reciving-materials-form',
        icon: '',
      },
      {
        title: 'Requisition Form',
        label: '',
        href: '/road-and-traffic/road-and-patrol/requisition-form',
        icon: '',
      },
    ],
  },
  {
    title: 'Workshop Maintenance Part',
    label: '',
    href: '',
    uName: 'r&t-workshop-maintenance',
    icon: <WorkshopIcon />,
    sub: [
      {
        title: 'Accident / Incident Report',
        label: '',
        href: '/road-and-traffic/workshop/accident-incident-report',
        icon: '',
      },
      {
        title: 'Completion Form',
        label: '',
        href: '/road-and-traffic/workshop/completion-form',
        icon: '',
      },
      {
        title: 'Drawing',
        label: '',
        href: '/road-and-traffic/workshop/drawing',
        icon: '',
      },
      {
        title: 'Inspection Report',
        label: '',
        href: '/road-and-traffic/workshop/inspection-report',
        icon: '',
      },
      {
        title: 'Letter Attachment',
        label: '',
        href: '/road-and-traffic/workshop/letter-attachment',
        icon: '',
      },
      {
        title: 'Miscellaneous',
        label: '',
        href: '/road-and-traffic/workshop/miscellaneous',
        icon: '',
      },
      {
        title: 'Reciving Materials From',
        label: '',
        href: '/road-and-traffic/workshop/reciving-materials-form',
        icon: '',
      },
      {
        title: 'Requisition Form',
        label: '',
        href: '/road-and-traffic/workshop/requisition-form',
        icon: '',
      },
    ],
  },
]

export const itsLinks: SideLink[] = [
  {
    title: 'ITS',
    label: '',
    href: '',
    icon: '',
    uName: '',
  },
{
    title: 'Letter Attachment',
    label: '',
    href: '',
    uName: 'its-letter-attachment',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Incoming Attachment',
        label: '',
        href: '/its/letter-attachment/incoming-letters',
        icon: '',
      },
      {
        title: 'Outgoing Attachment',
        label: '',
        href: '/its/letter-attachment/outgoing-letters',
        icon: '',
      }
    ],
  },
  {
    title: 'Organization/ Organogram',
    label: '',
    href: '/its/organization',
    uName: 'its-organization',
    icon: <FileIcon />,
  },
  {
    title: 'About ITS',
    label: '',
    href: '/its/about-its',
    icon: <AboutIcon />,
  },
  {
    title: 'Organization',
    label: '',
    href: '/its/organization',
    icon: <FileIcon />,
  },
  
   {
    title: 'Work Plan',
    label: '',
    href: '/its/work-plan',
    icon: <FileIcon />,
  },

 
  {
    title: 'Notice',
    label: '',
    href: '/its/notice',
    icon: <FileIcon />,
  },
  


  {
    title: 'System configure',
    label: '',
    href: '/its/system-configure',
    icon: <FileIcon />,
  },



  {
    title: 'Operation Manual',
    label: '',
    href: '/its/operation-manual',
    icon: <FileIcon />,
  },
  {
    title: 'Monthly Report',
    label: '',
    href: '/its/monthly-report',
    icon: <FileIcon />,
  },
  {
    title: 'Organization/Organom',
    label: '',
    href: '/its/its-organom',
    icon: <FileIcon />,
  },


]

export const tollLinks: SideLink[] = [
  {
    title: 'TOLL Operation',
    label: '',
    href: '',
    icon: '',
    uName: '',
  },
  {
    title: 'Letter Attachment',
    label: '',
    href: '',
    uName: 'toll-letter-attachment',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Incoming Attachment',
        label: '',
        href: '/toll/letter-attachment/incoming-letters',
        icon: '',
      },
      {
        title: 'Outgoing Attachment',
        label: '',
        href: '/toll/letter-attachment/outgoing-letters',
        icon: '',
      }
    ],
  },
  {
    title: 'Daily Toll & Traffic Data',
    label: '',
    href: '',
    uName: 'daily-toll-traffic-data',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Daily Toll & Traffic Data',
        label: '',
        href: '/toll/daily-toll-traffic-data',
        icon: '',
      },
      {
        title: 'Daily Toll & Traffic Data Comparisons',
        label: '',
        href: '/toll/daily-data-comparisons',
        icon: '',
      },

    ],
  },
  {
    title: 'Shift Wise Toll & Traffic Data',
    label: '',
    href: '',
    uName: 'shift-wise-toll-traffic-data',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Shift Wise Toll & Traffic Data',
        label: '',
        href: '/toll/shift/shift-wise-toll-traffic-data',
        icon: '',
      },
      {
        title: 'Shift Wise Toll & Traffic Comparison',
        label: '',
        href: '/toll/shift/shift-wise-toll-traffic-comparison',
        icon: '',
      },


    ],
  },

  {
    title: 'WIM Data',
    label: '',
    href: '',
    uName: 'toll-wim-data',
    icon: <FileIcon />,
    sub: [

      {
        title: 'Represent WIM data',
        label: '',
        href: '/toll/wim-data/represent-wim-data',
        icon: '',
      },
      {
        title: 'WIM data Comparisons',
        label: '',
        href: '/toll/wim-data/wim-data-comparisons',
        icon: '',
      },

    ],
  },
    {
    title: 'Daily Report',
    label: '',
    href: '/toll/daily-report',
    uName: 'toll-daily-report',
    icon: <FileIcon />,
  },
 {
    title: 'Monthly Roster',
    label: '',
    href: '',
    uName: 'toll-monthly-roster',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Main Bridge Bills',
        label: '',
        href: '/toll/monthly-roster/main-bridge-bills',
        icon: <FileIcon />,
      }

    ],
  },

 {
    title: 'Employee Personal Report',
    label: '',
    href: '/toll/employee-personal-report',
    uName: 'toll-monthly-roster',
    icon: <FileIcon />,
  },
  {
    title: 'Hierarchy',
    label: '',
    href: '/toll/hierarchy',
    uName: 'toll-hierarchy',
    icon: <FileIcon />,
  },


]

export const edmsLinks: SideLink[] = [

]

export const rtwLinks: SideLink[] = [
  {
    title: 'RTW',
    label: '',
    href: '',
    icon: '',
    uName: '',
  },
  {
    title: 'Letter Attachment',
    label: '',
    href: '',
    uName: 'rtw-letter-attachment',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Incoming Attachment',
        label: '',
        href: '/rtw/letter-attachment/incoming-letters',
        icon: '',
      },
      {
        title: 'Outgoing Attachment',
        label: '',
        href: '/rtw/letter-attachment/outgoing-letters',
        icon: '',
      }
    ],
  },
  {
    title: 'Organization/ Organogram',
    label: '',
    href: '/rtw/organization-organogram',
    uName: 'rtw-organization',
    icon: <FileIcon />,
  },
  {
    title: 'Project Overview',
    label: '',
    href: '/rtw/project-overview',
    uName: 'rtw-project-overview',
    icon: <FileIcon />,
  },
   {
    title: 'Technical Documentation',
    label: '',
    href: '',
    uName: 'rtw-technical-documentation',
    icon: <FileIcon />,
    sub: [
      {
        title: 'RTW Drawings',
        label: '',
        href: '/rtw/rtw-drawings',
        icon: '',
      },
      {
        title: 'Materials & Equipment List',
        label: '',
        href: '/rtw/material-and-equipment',
        icon: '',
      },
      {
        title: 'Survey Reports',
        label: '',
        href: '/rtw/survey-reports',
        icon: '',
      },
      {
        title: 'RTW Maintenance Manual',
        label: '',
        href: '/rtw/rtw-maintenance-manual',
        icon: '',
      },
    ],
  },
   {
    title: 'Monitoring & Reporting',
    label: '',
    href: '',
    uName: 'rtw-monitoring-reporting',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Daily Water Level Records',
        label: '',
        href: '/rtw/monitoring-and-reporting/daily-water-level-records',
        icon: '',
      },
      {
        title: 'RTW Monthly Reports',
        label: '',
        href: '/rtw/monitoring-and-reporting/monthly-reports',
        icon: '',
      }
    ],
  },
  {
    title: 'Quality, Safety',
    label: '',
    href: '',
    uName: 'rtw-quality-safety',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Material Test Report',
        label: '',
        href: '/rtw/material-test-report',
        icon: '',
      },
      {
        title: 'Safety',
        label: '',
        href: '/rtw/safety',
        icon: '',
      },
    ],
  },

  {
    title: 'Communication & Correspondence',
    label: '',
    href: '',
    uName: 'rtw-communication-correspondence',
    icon: <FileIcon />,
    sub: [
      {
        title: 'All RTW-related Letters & Official Correspondence',
        label: '',
        href: '/rtw/letter-and-official-correspondence',
        icon: '',
      },
      {
        title: 'Meeting Minutes',
        label: '',
        href: '/rtw/meeting-minutes',
        icon: '',
      }
    ],
  },
  {
    title: 'Financial Documentation',
    label: '',
    href: '',
    uName: 'rtw-financial-documentation',
    icon: <FileIcon />,
    sub: [
      {
        title: 'RTW Bills',
        label: '',
        href: '/rtw/rtw-bills',
        icon: '',
      }
    ],
  },
  {
    title: 'Visual Records',
    label: '',
    href: '',
    uName: 'rtw-visual-records',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Pictures and Videos',
        label: '',
        href: '/rtw/picture-and-videos',
        icon: '',
      }
    ],
  },

]





export const pmisLinks: SideLink[] = [
  {
    title: 'MAIN BRIDGE',
    label: '',
    href: '',
    icon: '',
    uName: '',
  },
  {
    title: 'Project Overview',
    label: '',
    href: '/mb-pmis/project-overview',
    uName: 'mb-pmis-project-overview',
    icon: <FileIcon />,
  },
   {
    title: 'Technical Documentation',
    label: '',
    href: '',
    uName: 'mb-pmis-technical-documentation',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Main Bridge Drawings',
        label: '',
        href: '/mb-pmis/technical-documentation/main-bridge-drawings',
        icon: '',
      },
      {
        title: 'Materials & Equipment List ',
        label: '',
        href: '/mb-pmis/technical-documentation/materials-and-equipment',
        icon: '',
      },

      {
        title: 'Survey Reports',
        label: '',
        href: '/mb-pmis/technical-documentation/survey-reports',
        icon: '',
      },
      {
        title: 'Main Bridge Maintenance Manual',
        label: '',
        href: '/mb-pmis/technical-documentation/maintenance-manual',
        icon: '',
      },
      {
        title: 'Other',
        label: '',
        href: '/mb-pmis/technical-documentation/other',
        icon: '',
      },
    ],
  },
  {
    title: 'Monitoring & Reporting',
    label: '',
    href: '/mb-pmis/monitoring-and-reporting',
    uName: 'mb-pmis-monitoring-reporting',
    icon: <FileIcon />,
  },
  {
    title: 'Quality, Safety',
    label: '',
    href: '',
    uName: 'mb-pmis-quality-safety',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Material Test Report',
        label: '',
        href: '/mb-pmis/quality-and-safety/material-test-report',
        icon: '',
      },
      {
        title: 'Safety',
        label: '',
        href: '/mb-pmis/quality-and-safety/safety',
        icon: '',
      },
    ],
  },
  {
    title: 'Organization/Organom',
    label: '',
    href: '/mb-pmis/organization-organogram',
    uName: 'mb-pmis-organization-organogram',
    icon: <FileIcon />,
  },
  {
    title: 'Letter Attachment',
    label: '',
    href: '',
    uName: 'mb-pmis-letter-attachment',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Incoming Letter',
        label: '',
        href: '/mb-pmis/quality-and-safety/material-test-report',
        icon: '',
      },
      {
        title: 'Outgoin letter',
        label: '',
        href: '/mb-pmis/quality-and-safety/safety',
        icon: '',
      },
    ],
  },
 {
    title: 'Communication & Correspondence',
    label: '',
    href: '',
    uName: 'mb-pmis-communication-correspondence',
    icon: <FileIcon />,
    sub: [
      {
        title: 'All RTW-related Letters & Official Correspondence',
        label: '',
        href: '/mb-pmis/letter-and-official-correspondence',
        icon: '',
      },
      {
        title: 'Meeting Minutes',
        label: '',
        href: '/mb-pmis/meeting-minutes',
        icon: '',
      }
    ],
  },
  {
    title: 'Financial Documentation',
    label: '',
    href: '',
    uName: 'mb-pmis-financial-documentation',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Main Bridge Bills',
        label: '',
        href: '/mb-pmis/main-bridge-bills',
        icon: '',
      }
    ],
  },
  {
    title: 'Visual Records',
    label: '',
    href: '',
    uName: 'mb-pmis-visual-records',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Pictures and Videos',
        label: '',
        href: '/mb-pmis/picture-and-videos',
        icon: '',
      }
    ],
  },

]