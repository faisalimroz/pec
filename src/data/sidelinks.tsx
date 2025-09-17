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
    title: 'HR',
    label: '',
    href: '',
    uName: 'hr',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Status Of Personnel',
        label: '',
        href: '/administrative/status-of-personnel',
        icon: '',
      },
      {
        title: 'Employee Personal Profile',
        label: '',
        href: '/administrative/employee-personal-profile',
        icon: '',
      },
      {
        title: 'Attendance Management',
        label: '',
        href: '/administrative/attendance-management',
        icon: '',
      },
      {
        title: 'Insurance Management',
        label: '',
        href: '/administrative/insurance-management',
        icon: '',
      },
      {
        title: 'Insurance Claiming',
        label: '',
        href: '/administrative/insurance-claiming',
        icon: '',
      },
      {
        title: 'Leave Management',
        label: '',
        href: '/administrative/leave-management',
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
        title: 'Medicine Equipment Record',
        label: '',
        href: '/administrative/health-center-monthly-equipment-record',
        icon: '',
      },
     
      
    ],
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
    title: 'Monthly Roster',
    label: '',
    href: '/administrative/monthly-roster',
    uName: 'admin-monthly-roster',
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
    title: 'Notice',
    label: '',
    href: '/administrative/notice',
    uName: 'admin-notice',
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
    title: 'Monthly Report',
    label: '',
    href: '/administrative/gardening-monthly-activity',
    uName: 'hr',
    icon: <FileIcon />,
  },

  // start of finance links
  {
    title: 'Finance & Accounts',
    label: '',
    href: '',
    icon: '',
    uName: 'finance-&-accounts',
  },

  // {
  //   title: 'RHD Bill Details',
  //   label: '',
  //   href: '/finance/rhd-bill-details',
  //   uName: 'rhd-bill-details',
  //   icon: <FileIcon />,
  // },
  // {
  //   title: 'Maintain IPC PDF',
  //   label: '',
  //   href: '/finance/maintain-ipc-pdf',
  //   uName: 'maintain-ipc-pdf',
  //   icon: <FileIcon />,
  // },
  // {
  //   title: 'Monthly IPC PS Data',
  //   label: '',
  //   href: '/finance/monthly-ipc-ps',
  //   uName: 'maintain-ipc-ps-data',
  //   icon: <FileIcon />,
  // },
  // {
  //   title: 'Monthly Invoice Record',
  //   label: '',
  //   href: '/finance/monthly-invoice-record',
  //   uName: 'monthly-invoice-record',
  //   icon: <FileIcon />,
  // },
  // {
  //   title: 'Monthly Salary Sheet',
  //   label: '',
  //   href: '/finance/monthly-salary-sheet',
  //   uName: 'monthly-salary-sheet',
  //   icon: <FileIcon />,
  // },
  // {
  //   title: 'Monthly PIT Sheet',
  //   label: '',
  //   href: '/finance/monthly-pit-sheet',
  //   uName: 'monthly-pit-sheet',
  //   icon: <FileIcon />,
  // },
  // {
  //   title: 'Toll Money',
  //   label: '',
  //   href: '',
  //   uName: 'toll-money',
  //   icon: <FileIcon />,
  //   sub: [
  //     {
  //       title: 'Toll Money Management For Cash',
  //       label: '',
  //       href: '/finance/toll-money-management-for-cash',
  //       icon: '',
  //     },
  //     {
  //       title: 'Toll Money Management For RFID',
  //       label: '',
  //       href: '/finance/toll-money-management-for-rfid',
  //       icon: '',
  //     },
  //   ],
  // },
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

  // start of clinic center links
  {
    title: 'Clinic Center',
    label: '',
    href: '',
    icon: '',
    uName: 'clinic-center',
  },

  {
    title: 'Medicine Record',
    label: '',
    href: '/clinic-center/medicine-record',
    uName: 'medicine-record',
    icon: <FileIcon />,
  },
  {
    title: 'Treatment Record',
    label: '',
    href: '/clinic-center/treatment-record',
    uName: 'treatment-record',
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
  // {
  //   title: 'Procurement',
  //   label: '',
  //   href: '/road-and-traffic/procurement',
  //   uName: 'r&t-procurement',
  //   icon: <FileIcon />,
  // },
  // {
  //   title: 'Maint, Safety & Traffic',
  //   label: '',
  //   href: '',
  //   uName: 'maint-safety-traffic',
  //   icon: <FileIcon />,
  //   sub: [
  //     {
  //       title: 'Daily Work Report',
  //       label: '',
  //       href: '/road-and-traffic/maintenance/daily-work-report',
  //       icon: '',
  //     },
  //     {
  //       title: 'Inspection Report',
  //       label: '',
  //       href: '/road-and-traffic/maintenance/inspection-report',
  //       icon: '',
  //     },
  //     {
  //       title: 'One Page Report',
  //       label: '',
  //       href: '/road-and-traffic/maintenance/one-page-report',
  //       icon: '',
  //     },
  //     {
  //       title: 'Work Completion Report',
  //       label: '',
  //       href: '/road-and-traffic/maintenance/work-completion-report',
  //       icon: '',
  //     },
  //     {
  //       title: 'Miscellaneous',
  //       label: '',
  //       href: '/road-and-traffic/maintenance/miscellaneous',
  //       icon: '',
  //     },
  //   ],
  // },
  // {
  //   title: 'Patrol & Security',
  //   label: '',
  //   href: '',
  //   uName: 'patrol-security',
  //   icon: <FileIcon />,
  //   sub: [
  //     {
  //       title: 'Daily Work Report',
  //       label: '',
  //       href: '/road-and-traffic/road-safety/work-completion-report',
  //       icon: '',
  //     },
  //     {
  //       title: 'One Page Report',
  //       label: '',
  //       href: '/road-and-traffic/road-safety/inspection-report',
  //       icon: '',
  //     },
  //     {
  //       title: 'Accident Report',
  //       label: '',
  //       href: '/road-and-traffic/road-safety/accident-report',
  //       icon: '',
  //     },
  //     {
  //       title: 'Police Records',
  //       label: '',
  //       href: '/road-and-traffic/road-safety/police-record',
  //       icon: '',
  //     },
  //     {
  //       title: 'Accident Analysis',
  //       label: '',
  //       href: '/road-and-traffic/road-safety/analysis',
  //       icon: '',
  //     },
  //   ],
  // },
  // {
  //   title: 'Mech/Elec',
  //   label: '',
  //   href: '',
  //   uName: 'mech-elec',
  //   icon: <FileIcon />,
  //   sub: [
  //     {
  //       title: 'Daily Report',
  //       label: '',
  //       href: '/road-and-traffic/mechanical-electrical/daily-work-report',
  //       icon: '',
  //     },
  //     {
  //       title: 'Daily Vehicle Inspection Report',
  //       label: '',
  //       href: '/road-and-traffic/mechanical-electrical/daily-vehicle-inspection-report',
  //       icon: '',
  //     },
  //     {
  //       title: 'Periodic Maintenance',
  //       label: '',
  //       href: '/road-and-traffic/mechanical-electrical/periodic-maintenance',
  //       icon: '',
  //     },
  //     {
  //       title: 'Inspection Report',
  //       label: '',
  //       href: '/road-and-traffic/mechanical-electrical/inspection-report',
  //       icon: '',
  //     },
  //     {
  //       title: 'Repair Work',
  //       label: '',
  //       href: '/road-and-traffic/mechanical-electrical/repairing-work',
  //       icon: '',
  //     },
  //     {
  //       title: 'Inventory Report',
  //       label: '',
  //       href: '/road-and-traffic/mechanical-electrical/inventory-report',
  //       icon: '',
  //     },
  //     {
  //       title: 'Fuel Consumption Report',
  //       label: '',
  //       href: '/road-and-traffic/mechanical-electrical/fuel-consumption-report',
  //       icon: '',
  //     },
  //     {
  //       title: 'Vehicle Insurance',
  //       label: '',
  //       href: '/road-and-traffic/mechanical-electrical/vehicle-insurance',
  //       icon: '',
  //     },
  //     {
  //       title: 'Vehicle Documents',
  //       label: '',
  //       href: '/road-and-traffic/mechanical-electrical/vehicle-documents',
  //       icon: '',
  //     },
  //   ],
  // },
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
    title: 'Road Main ',
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
    title: 'Road and ',
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
    title: 'Workshop ',
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
        title: 'System configure',
        label: '',
        href: '/its/system-configure',
        icon: <FileIcon/>,
      },
       {
        title: 'Notice',
        label: '',
        href: '/its/notice',
        icon: <FileIcon/>,
      },
       {
        title: 'Organization',
        label: '',
        href: '/its/organization',
        icon: <FileIcon/>,
      },
        {
        title: 'Monthly Report',
        label: '',
        href: '/its/monthly-report',
        icon: <FileIcon/>,
      },
       {
        title: 'Operation Manual',
        label: '',
        href: '/its/operation-manual',
        icon: <FileIcon/>,
      },
       {
        title: 'Work Plan',
        label: '',
        href: '/its/work-plan',
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
        title: 'Daily Toll & Traffic Data Comparisons',
        label: '',
        href: '/toll/shift/shift-wise-data-comparisons',
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
    title: 'WIM Data',
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
   {
    title: 'Toll Collect & Traffic',
    label: '',
    href: '',
    uName: 'toll-collect-traffic',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Toll Collect & Traffic',
        label: '',
        href: '/toll/toll-collect-traffic',
        icon: '',
      },
      {
        title: 'Graph (Toll/Cash)',
        label: '',
        href: '/toll/graph',
        icon: '',
      },
      {
        title: 'ETC/Card',
        label: '',
        href: '/toll/etc',
        icon: '',
      },
      {
        title: 'Monthly Traffic Report',
        label: '',
        href: '/toll/monthly-traffic-report',
        icon: '',
      },
      {
        title: 'Manual Monthly Traffic Report',
        label: '',
        href: '/toll/manual-monthly-traffic-report',
        icon: '',
      },
    ],
  },
  {
    title: 'Special Audit',
    label: '',
    href: '',
    uName: 'special-audit',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Exemption Report',
        label: '',
        href: '/toll/exemption-report',
        icon: '',
      },
      {
        title: 'Exemption Rank',
        label: '',
        href: '/toll/top-ten-report',
        icon: '',
      },
      {
        title: 'Others',
        label: '',
        href: '/toll/others',
        icon: '',
      },
    ],
  },
  {
    title: 'Monthly Toll Revenue',
    label: '',
    href: '/toll/monthly-toll-revenue',
    uName: 'monthly-toll-revenue',
    icon: <FileIcon />,
  },
  {
    title: 'Vehicle Detect & Toll',
    label: '',
    href: '/toll/vehicle-detect-and-toll',
    uName: 'vehicle-detect-toll',
    icon: <FileIcon />,
  },
 
  {
    title: 'Comparison',
    label: '',
    href: '/toll/comparison',
    uName: 'comparison',
    icon: <FileIcon />,
  },
  {
    title: 'KEC Manual Data',
    label: '',
    href: '/toll/kec-manual-data',
    uName: 'kec-manual-data',
    icon: <FileIcon />,
  },
  {
    title: 'KEC Manual Data Graph',
    label: '',
    href: '/toll/kec-manual-graph',
    uName: 'kec-manual-data-graph',
    icon: <FileIcon />,
  },
  {
    title: 'Toll & Traffic (Ver)',
    label: '',
    href: '/toll/toll-traffic-ver',
    uName: 'toll-traffic-ver',
    icon: <FileIcon />,
  },
   {
    title: 'Hierarchy',
    label: '',
    href: '/toll/hierarchy',
    uName: 'toll-traffic-ver',
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
        href: '/rtw/daily-water-level-records',
        icon: '',
      },  
       {
        title: 'RTW Monthly Reports',
        label: '',
        href: '/rtw/monthly-reports',
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