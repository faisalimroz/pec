import FileIcon from '@/components/icons/FileIcon'

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
      // {
      //   title: 'Salary Management',
      //   label: '',
      //   href: '/administrative/salary-management',
      //   icon: '',
      // },
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

  {
    title: 'RHD Bill Details',
    label: '',
    href: '/finance/rhd-bill-details',
    uName: 'rhd-bill-details',
    icon: <FileIcon />,
  },
  {
    title: 'Maintain IPC PDF',
    label: '',
    href: '/finance/maintain-ipc-pdf',
    uName: 'maintain-ipc-pdf',
    icon: <FileIcon />,
  },
  {
    title: 'Monthly IPC PS Data',
    label: '',
    href: '/finance/monthly-ipc-ps',
    uName: 'maintain-ipc-ps-data',
    icon: <FileIcon />,
  },
  {
    title: 'Monthly Invoice Record',
    label: '',
    href: '/finance/monthly-invoice-record',
    uName: 'monthly-invoice-record',
    icon: <FileIcon />,
  },
  {
    title: 'Monthly Salary Sheet',
    label: '',
    href: '/finance/monthly-salary-sheet',
    uName: 'monthly-salary-sheet',
    icon: <FileIcon />,
  },
  {
    title: 'Monthly PIT Sheet',
    label: '',
    href: '/finance/monthly-pit-sheet',
    uName: 'monthly-pit-sheet',
    icon: <FileIcon />,
  },
  {
    title: 'Toll Money',
    label: '',
    href: '',
    uName: 'toll-money',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Toll Money Management For Cash',
        label: '',
        href: '/finance/toll-money-management-for-cash',
        icon: '',
      },
      {
        title: 'Toll Money Management For RFID',
        label: '',
        href: '/finance/toll-money-management-for-rfid',
        icon: '',
      },
    ],
  },
  {
    title: 'Procurement',
    label: '',
    href: '/finance/procurement',
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
  {
    title: 'Procurement',
    label: '',
    href: '/road-and-traffic/procurement',
    uName: 'r&t-procurement',
    icon: <FileIcon />,
  },
  {
    title: 'Maint, Safety & Traffic',
    label: '',
    href: '',
    uName: 'maint-safety-traffic',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Daily Work Report',
        label: '',
        href: '/road-and-traffic/maintenance/daily-work-report',
        icon: '',
      },
      {
        title: 'Inspection Report',
        label: '',
        href: '/road-and-traffic/maintenance/inspection-report',
        icon: '',
      },
      {
        title: 'One Page Report',
        label: '',
        href: '/road-and-traffic/maintenance/one-page-report',
        icon: '',
      },
      {
        title: 'Work Completion Report',
        label: '',
        href: '/road-and-traffic/maintenance/work-completion-report',
        icon: '',
      },
      {
        title: 'Miscellaneous',
        label: '',
        href: '/road-and-traffic/maintenance/miscellaneous',
        icon: '',
      },
    ],
  },
  {
    title: 'Patrol & Security',
    label: '',
    href: '',
    uName: 'patrol-security',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Daily Work Report',
        label: '',
        href: '/road-and-traffic/road-safety/work-completion-report',
        icon: '',
      },
      {
        title: 'One Page Report',
        label: '',
        href: '/road-and-traffic/road-safety/inspection-report',
        icon: '',
      },
      {
        title: 'Accident Report',
        label: '',
        href: '/road-and-traffic/road-safety/accident-report',
        icon: '',
      },
      {
        title: 'Police Records',
        label: '',
        href: '/road-and-traffic/road-safety/police-record',
        icon: '',
      },
      {
        title: 'Accident Analysis',
        label: '',
        href: '/road-and-traffic/road-safety/analysis',
        icon: '',
      },
    ],
  },
  {
    title: 'Mech/Elec',
    label: '',
    href: '',
    uName: 'mech-elec',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Daily Report',
        label: '',
        href: '/road-and-traffic/mechanical-electrical/daily-work-report',
        icon: '',
      },
      {
        title: 'Daily Vehicle Inspection Report',
        label: '',
        href: '/road-and-traffic/mechanical-electrical/daily-vehicle-inspection-report',
        icon: '',
      },
      {
        title: 'Periodic Maintenance',
        label: '',
        href: '/road-and-traffic/mechanical-electrical/periodic-maintenance',
        icon: '',
      },
      {
        title: 'Inspection Report',
        label: '',
        href: '/road-and-traffic/mechanical-electrical/inspection-report',
        icon: '',
      },
      {
        title: 'Repair Work',
        label: '',
        href: '/road-and-traffic/mechanical-electrical/repairing-work',
        icon: '',
      },
      {
        title: 'Inventory Report',
        label: '',
        href: '/road-and-traffic/mechanical-electrical/inventory-report',
        icon: '',
      },
      {
        title: 'Fuel Consumption Report',
        label: '',
        href: '/road-and-traffic/mechanical-electrical/fuel-consumption-report',
        icon: '',
      },
      {
        title: 'Vehicle Insurance',
        label: '',
        href: '/road-and-traffic/mechanical-electrical/vehicle-insurance',
        icon: '',
      },
      {
        title: 'Vehicle Documents',
        label: '',
        href: '/road-and-traffic/mechanical-electrical/vehicle-documents',
        icon: '',
      },
    ],
  },
  {
    title: 'Building Maint',
    label: '',
    href: '/road-and-traffic/building-maintenance',
    uName: 'building-maint',
    icon: <FileIcon />,
  },
  {
    title: 'Monthly Report',
    label: '',
    href: '/road-and-traffic/monthly-report',
    uName: 'monthly-report',
    icon: <FileIcon />,
  },
  {
    title: 'Monthly Roster',
    label: '',
    href: '/road-and-traffic/monthly-roaster',
    uName: 'r&t-monthly-roster',
    icon: <FileIcon />,
  },
  {
    title: 'Drawing',
    label: '',
    href: '',
    uName: 'drawing',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Structural',
        label: '',
        href: '/road-and-traffic/drawing/structural',
        icon: '',
      },
      {
        title: 'Electrical',
        label: '',
        href: '/road-and-traffic/drawing/electrical',
        icon: '',
      },
    ],
  },
]

export const itsLinks: SideLink[] = [
  {
    title: 'About ITS',
    label: '',
    href: '/its',
    uName: 'about-its',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Overview',
        label: '',
        href: '/its/overview',
        icon: '',
      },
      {
        title: 'Staff Summary',
        label: '',
        href: '/its/staff-summary',
        icon: '',
      },
      {
        title: 'Duty Roster',
        label: '',
        href: '/its/duty-roster',
        icon: '',
      },
    ],
  },
  {
    title: 'Report',
    label: '',
    href: '/its',
    uName: 'report',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Reports',
        label: '',
        href: '/its/report/to-rhd',
        icon: '',
      },
      {
        title: 'Monitoring',
        label: '',
        href: '/its/report/monitoring',
        icon: '',
      },
    ],
  },
  {
    title: 'Inernal Letter & Announce',
    label: '',
    href: '/its/internal-letter/announce',
    uName: 'internal-letter-announce',
    icon: <FileIcon />,
  },
  {
    title: 'O&M Activities',
    label: '',
    href: '/its',
    uName: 'o&m-activities',
    icon: <FileIcon />,
    sub: [
      {
        title: 'ITS',
        label: '',
        href: '/its/om-activities/its',
        icon: '',
      },
      {
        title: 'Electricity',
        label: '',
        href: '/its/om-activities/electricity',
        icon: '',
      },
    ],
  },
  {
    title: 'Inventory Management',
    label: '',
    href: '/its',
    uName: 'inventory-management',
    icon: <FileIcon />,
    sub: [
      {
        title: 'ITS',
        label: '',
        href: '/its/inventory/its',
        icon: '',
      },
      {
        title: 'Electricity',
        label: '',
        href: '/its/inventory/electricity',
        icon: '',
      },
    ],
  },
  {
    title: 'Procurement',
    label: '',
    href: '/its',
    uName: 'its-procurement',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Requisition',
        label: '',
        href: '/its/procurement/requisition',
        icon: '',
      },
      {
        title: 'Quotation',
        label: '',
        href: '/its/procurement/quotation',
        icon: '',
      },
      {
        title: 'Working Order',
        label: '',
        href: '/its/procurement/working-order',
        icon: '',
      },
      {
        title: 'Paid Service',
        label: '',
        href: '/its/procurement/paid-service',
        icon: '',
      },
    ],
  },

  {
    title: 'Training',
    label: '',
    href: '/its/training/manual',
    uName: 'training',
    icon: <FileIcon />,
  },

  {
    title: 'Information & Diagram',
    label: '',
    href: '/its',
    uName: 'information-diagram',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Information & Diagram- ITS',
        label: '',
        href: '/its/diagram/its',
        icon: '',
      },
      {
        title: 'Information & Diagram- Electricity',
        label: '',
        href: '/its/diagram/electricity',
        icon: '',
      },
    ],
  },

  {
    title: 'Warranty',
    label: '',
    href: '/its',
    uName: 'warranty',
    icon: <FileIcon />,
    sub: [
      {
        title: 'Product List',
        label: '',
        href: '/its/warranty/product-list',
        icon: '',
      },
      {
        title: 'Claim Report',
        label: '',
        href: '/its/warranty/claim-report',
        icon: '',
      },
    ],
  },
]

export const tollLinks: SideLink[] = [
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
    title: 'Monthly Roster',
    label: '',
    href: '/toll/monthly-roster',
    uName: 'toll-monthly-roster',
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
