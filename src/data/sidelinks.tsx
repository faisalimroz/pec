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
        title: 'Employee Personal Profile',
        label: '',
        href: '/administrative/employee-personal-profile',
         uName: 'hr',
          icon: <FileIcon />,
      },
  {
    title: 'Vehicle Mgt. Record',
    label: '',
    href: '/administrative/vehicle-mgt-record',
    uName: 'hr',
    icon: <FileIcon />,
  },
  {
    title: 'Asset Management',
    label: '',
    href: '/administrative/asset-management',
    uName: 'hr',
    icon: <FileIcon />,
  },
    {
    title: 'Building Maintenance',
    label: '',
    href: '',
    uName: 'hr',
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
  
  // {
  //   title: 'HR',
  //   label: '',
  //   href: '',
  //   uName: 'hr',
  //   icon: <FileIcon />,
  //   sub: [
  //     {
  //       title: 'Status Of Personnel',
  //       label: '',
  //       href: '/administrative/status-of-personnel',
  //       icon: '',
  //     },
  //     {
  //       title: 'Employee Personal Profile',
  //       label: '',
  //       href: '/administrative/employee-personal-profile',
  //       icon: '',
  //     },
  //     {
  //       title: 'Attendance Management',
  //       label: '',
  //       href: '/administrative/attendance-management',
  //       icon: '',
  //     },
  //     {
  //       title: 'Insurance Management',
  //       label: '',
  //       href: '/administrative/insurance-management',
  //       icon: '',
  //     },
  //     {
  //       title: 'Insurance Claiming',
  //       label: '',
  //       href: '/administrative/insurance-claiming',
  //       icon: '',
  //     },
  //     {
  //       title: 'Leave Management',
  //       label: '',
  //       href: '/administrative/leave-management',
  //       icon: '',
  //     },
  //   ],
  // },
    {
    title: 'Health Center',
    label: '',
    href: '',
    uName: 'hr',
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
    uName: 'hr',
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
    uName: 'hr',
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
    uName: 'hr',
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
    uName: 'hr',
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
    uName: 'finance-procurement',
    icon: <FileIcon />,
  },
   {
    title: 'IPC Records',
    label: '',
    href: '/finance/ipc-records',
    uName: 'finance-procurement',
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
    title: 'Organization/ Organogram',
    label: '',
    href: '/road-and-traffic/organization-organogram',
    uName: 'r&t-monthly-roster',
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
    uName: 'monthly-report',
    icon: <ReportIcon />,
  },
  {
    title: 'KEC Letter',
    label: '',
    href: '/road-and-traffic/kec-letter',
    uName: 'building-maint',
    icon: <KecIcon />,
  },
   {
    title: 'Road Maintenance Part',
    label: '',
    href: '',
    uName: 'drawing',
    icon: <SignalIcon />,
    sub: [
      {
        title: 'Accident / Incident Report',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/accident-incident-report',
        icon: '',
      },
      {
        title: 'Requisition Form',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/requisition-form',
        icon: '',
      },
      {
        title: 'Completion Form',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/completion-form',
        icon: '',
      },
      {
        title: 'Reciving Materials From',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/reciving-materials-form',
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
        title: 'Drawing',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/drawing',
        icon: '',
      },
      {
        title: 'Miscellaneous',
        label: '',
        href: '/road-and-traffic/road-and-maintanance/miscellaneous',
        icon: '',
      },
    ],
  },
   {
    title: 'Road Safety & Patrol Part',
    label: '',
    href: '',
    uName: 'drawing',
    icon: <PatrolIcon />,
    sub: [
      {
        title: 'Accident / Incident Report',
        label: '',
        href: '/road-and-traffic/road-and-patrol/accident-incident-report',
        icon: '',
      },
      {
        title: 'Requisition Form',
        label: '',
        href: '/road-and-traffic/road-and-patrol/requisition-form',
        icon: '',
      },
      {
        title: 'Completion Form',
        label: '',
        href: '/road-and-traffic/road-and-patrol/completion-form',
        icon: '',
      },
      {
        title: 'Reciving Materials From',
        label: '',
        href: '/road-and-traffic/road-and-patrol/reciving-materials-form',
        icon: '',
      },
      {
        title: 'Inspection Report',
        label: '',
        href: '/road-and-traffic/road-and-patrol/inspection-report',
        icon: '',
      },
       {
        title: 'Controller’s Report',
        label: '',
        href: '/road-and-traffic/road-and-patrol/controllers-report',
        icon: '',
      },
      {
        title: 'Letter Attachment',
        label: '',
        href: '/road-and-traffic/road-and-patrol/letter-attachment',
        icon: '',
      },
      {
        title: 'Drawing',
        label: '',
        href: '/road-and-traffic/road-and-patrol/drawing',
        icon: '',
      },
      {
        title: 'Miscellaneous',
        label: '',
        href: '/road-and-traffic/road-and-patrol/miscellaneous',
        icon: '',
      },
    ],
  },
  
  {
    title: 'Workshop Maintenance Part',
    label: '',
    href: '',
    uName: 'drawing',
    icon: <WorkshopIcon />,
    sub: [
      {
        title: 'Accident / Incident Report',
        label: '',
        href: '/road-and-traffic/workshop/accident-incident-report',
        icon: '',
      },
      {
        title: 'Requisition Form',
        label: '',
        href: '/road-and-traffic/workshop/requisition-form',
        icon: '',
      },
      {
        title: 'Completion Form',
        label: '',
        href: '/road-and-traffic/workshop/completion-form',
        icon: '',
      },
      {
        title: 'Reciving Materials From',
        label: '',
        href: '/road-and-traffic/workshop/reciving-materials-form',
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
        title: 'Drawing',
        label: '',
        href: '/road-and-traffic/workshop/drawing',
        icon: '',
      },
      {
        title: 'Miscellaneous',
        label: '',
        href: '/road-and-traffic/workshop/miscellaneous',
        icon: '',
      },
    ],
  },
]

export const itsLinks: SideLink[] = [
 
   {
        title: 'About ITS',
        label: '',
        href: '/its/overview',
        icon: <AboutIcon/>,
      },
       {
        title: 'Organization',
        label: '',
        href: '/its/organization',
        icon: <FileIcon/>,
      },
        {
        title: 'Work Plan',
        label: '',
        href: '/its/work-plan',
        icon: <FileIcon/>,
      },
     
       {
        title: 'Notice',
        label: '',
        href: '/its/notice',
        icon: <FileIcon/>,
      },
        {
        title: 'System configure',
        label: '',
        href: '/its/system-configure',
        icon: <FileIcon/>,
      },
       {
        title: 'Operation Manual',
        label: '',
        href: '/its/operation-manual',
        icon: <FileIcon/>,
      },
      
        {
        title: 'Monthly Report',
        label: '',
        href: '/its/monthly-report',
        icon: <FileIcon/>,
      },
      
      
 
]

export const tollLinks: SideLink[] = [
 
   {
    title: 'Daily Toll & Traffic Data',
    label: '',
    href: '',
    uName: 'special-audit',
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
    uName: 'special-audit',
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
    uName: 'special-audit',
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
    uName:  'special-audit',
    icon: <FileIcon />,
  },

  {
    title: 'Monthly Roster',
    label: '',
    href: '',
    uName: 'special-audit',
    icon: <FileIcon />,
    sub: [
     {
    title: 'Main Bridge Bills',
    label: '',
    href: '/toll/monthly-roster/main-bridge-bills',
    uName: 'toll-monthly-roster',
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
    uName: 'toll-monthly-roster',
    icon: <FileIcon />,
  },
]

export const edmsLinks: SideLink[] = [
  {
    title: 'Dispatched',
    label: '',
    href: '/edms/dispatched',
    uName: 'dispatched',
    icon: <FileIcon />,
  },
  {
    title: 'Received',
    label: '',
    href: '/edms/received',
    uName: 'received',
    icon: <FileIcon />,
  },
  {
    title: 'Others',
    label: '',
    href: '/edms/others',
    uName: 'others',
    icon: <FileIcon />,
  },
]
export const rtwLinks: SideLink[] = [
 {
    title: 'Project Overview',
    label: '',
    href: '/rtw/project-overview',
    uName: 'dispatched',
    icon: <FileIcon />,
  },
   {
    title: 'Technical Documentation',
    label: '',
    href: '',
    uName: 'special-audit',
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
    uName: 'special-audit',
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
    uName: 'special-audit',
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
    uName: 'special-audit',
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
    uName: 'special-audit',
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
    uName: 'special-audit',
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
   {
    title: 'Additional Notes',
    label: '',
    href: '',
    uName: 'special-audit',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Backup Frequency',
        label: '',
        href: '/rtw/additional-notes/backup-frequency',
        icon: '',
      },  
       {
        title: 'Document Control Manager',
        label: '',
        href: '/rtw/additional-notes/document-control-manager',
        icon: '',
      },
       {
        title: 'Document Revision Log',
        label: '',
        href: '/rtw/additional-notes/document-revision-log',
        icon: '',
      },
    ],
  },
]





export const pmisLinks: SideLink[] = [
 {
    title: 'Project Overview',
    label: '',
    href: '/mb-pmis/project-overview',
    uName: 'dispatched',
    icon: <FileIcon />,
  },
   {
    title: 'Technical Documentation',
    label: '',
    href: '',
    uName: 'special-audit',
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
    uName: 'dispatched',
    icon: <FileIcon />,
  },
 
    {
    title: 'Quality, Safety',
    label: '',
    href: '',
    uName: 'special-audit',
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
    title: 'Communication & Correspondence',
    label: '',
    href: '',
    uName: 'special-audit',
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
    uName: 'special-audit',
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
    uName: 'special-audit',
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
     {
    title: 'Additional Notes',
    label: '',
    href: '',
    uName: 'special-audit',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Backup Frequency',
        label: '',
        href: '/mb-pmis/additional-notes/backup-frequency',
        icon: '',
      },  
       {
        title: 'Document Control Manager',
        label: '',
        href: '/mb-pmis/additional-notes/document-control-manager',
        icon: '',
      },
       {
        title: 'Document Revision Log',
        label: '',
        href: '/mb-pmis/additional-notes/document-revision-log',
        icon: '',
      },
    ],
  },
]