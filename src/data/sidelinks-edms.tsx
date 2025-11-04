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
    href: '/edms/administrative/employee-personal-profile',
    uName: 'hr',
    icon: <FileIcon />,
  },
  {
    title: 'Vehicle Mgt. Record',
    label: '',
    href: '/edms/administrative/vehicle-mgt-record',
    uName: 'hr',
    icon: <FileIcon />,
  },
  {
    title: 'Asset Management',
    label: '',
    href: '/edms/administrative/asset-management',
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
        href: '/edms/administrative/building-maintenance-report',
        icon: '',
      },
      {
        title: 'Tools',
        label: '',
        href: '/edms/administrative/building-maintenance-tools',
        icon: '',
      }


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
        href: '/edms/administrative/health-center-monthly-report',
        icon: '',
      },
      {
        title: 'Medicine In/Out Record',
        label: '',
        href: '/edms/administrative/health-center-medicine-record',
        icon: '',
      },
      {
        title: 'Medicine Equipment Record',
        label: '',
        href: '/edms/administrative/health-center-monthly-equipment-record',
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
        href: '/edms/administrative/gardening-monthly-activity',
        icon: '',
      },
      {
        title: 'Gardening Tools',
        label: '',
        href: '/edms/administrative/gardening-tools',
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
        href: '/edms/administrative/fire-mgt-monthly-report',
        icon: '',
      },
      {
        title: ' Tools',
        label: '',
        href: '/edms/administrative/fire-mgt-tools',
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
        href: '/edms/administrative/it-electronics-communication-report',
        icon: '',
      },
      {
        title: 'Tools',
        label: '',
        href: '/edms/administrative/it-electronics-communication-tools',
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
        href: '/edms/administrative/security-mgt-monthly-report',
        icon: '',
      },
      {
        title: 'Tools',
        label: '',
        href: '/edms/administrative/security-mgt-tools',
        icon: '',
      }


    ],
  },


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
    href: '/edms/administrative/ipc-monthly-updates',
    uName: 'finance-procurement',
    icon: <FileIcon />,
  },
  {
    title: 'IPC Records',
    label: '',
    href: '/edms/administrative/ipc-records',
    uName: 'finance-procurement',
    icon: <FileIcon />,
  },
]

export const rntLinks: SideLink[] = [

  {
    title: 'Organization/ Organogram',
    label: '',
    href: '/edms/road-and-traffic/organization-organogram',
    uName: 'r&t-monthly-roster',
    icon: <FileIcon />,
  },
  {
    title: 'Monthly Roster (Final)',
    label: '',
    href: '/edms/road-and-traffic/monthly-roaster',
    uName: 'r&t-monthly-roster',
    icon: <GuardIcon />,
  },
  {
    title: 'Monthly Report',
    label: '',
    href: '/edms/road-and-traffic/monthly-report',
    uName: 'monthly-report',
    icon: <ReportIcon />,
  },
  {
    title: 'KEC Letter',
    label: '',
    href: '/edms/road-and-traffic/kec-letter',
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
        href: '/edms/road-and-traffic/road-and-maintanance/accident-incident-report',
        icon: '',
      },
      {
        title: 'Requisition Form',
        label: '',
        href: '/edms/road-and-traffic/road-and-maintanance/requisition-form',
        icon: '',
      },
      {
        title: 'Completion Form',
        label: '',
        href: '/edms/road-and-traffic/road-and-maintanance/completion-form',
        icon: '',
      },
      {
        title: 'Reciving Materials From',
        label: '',
        href: '/edms/road-and-traffic/road-and-maintanance/reciving-materials-form',
        icon: '',
      },
      {
        title: 'Inspection Report',
        label: '',
        href: '/edms/road-and-traffic/road-and-maintanance/inspection-report',
        icon: '',
      },
      {
        title: 'Letter Attachment',
        label: '',
        href: '/edms/road-and-traffic/road-and-maintanance/letter-attachment',
        icon: '',
      },
      {
        title: 'Drawing',
        label: '',
        href: '/edms/road-and-traffic/road-and-maintanance/drawing',
        icon: '',
      },
      {
        title: 'Miscellaneous',
        label: '',
        href: '/edms/road-and-traffic/road-and-maintanance/miscellaneous',
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
        href: '/edms/road-and-traffic/road-and-patrol/accident-incident-report',
        icon: '',
      },
      {
        title: 'Requisition Form',
        label: '',
        href: '/edms/road-and-traffic/road-and-patrol/requisition-form',
        icon: '',
      },
      {
        title: 'Completion Form',
        label: '',
        href: '/edms/road-and-traffic/road-and-patrol/completion-form',
        icon: '',
      },
      {
        title: 'Reciving Materials From',
        label: '',
        href: '/edms/road-and-traffic/road-and-patrol/reciving-materials-form',
        icon: '',
      },
      {
        title: 'Inspection Report',
        label: '',
        href: '/edms/road-and-traffic/road-and-patrol/inspection-report',
        icon: '',
      },
      {
        title: 'Controller’s Report',
        label: '',
        href: '/edms/road-and-traffic/road-and-patrol/controllers-report',
        icon: '',
      },
      {
        title: 'Letter Attachment',
        label: '',
        href: '/edms/road-and-traffic/road-and-patrol/letter-attachment',
        icon: '',
      },
      {
        title: 'Drawing',
        label: '',
        href: '/edms/road-and-traffic/road-and-patrol/drawing',
        icon: '',
      },
      {
        title: 'Miscellaneous',
        label: '',
        href: '/edms/road-and-traffic/road-and-patrol/miscellaneous',
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
        href: '/edms/road-and-traffic/workshop/accident-incident-report',
        icon: '',
      },
      {
        title: 'Requisition Form',
        label: '',
        href: '/edms/road-and-traffic/workshop/requisition-form',
        icon: '',
      },
      {
        title: 'Completion Form',
        label: '',
        href: '/edms/road-and-traffic/workshop/completion-form',
        icon: '',
      },
      {
        title: 'Reciving Materials From',
        label: '',
        href: '/edms/road-and-traffic/workshop/reciving-materials-form',
        icon: '',
      },
      {
        title: 'Inspection Report',
        label: '',
        href: '/edms/road-and-traffic/workshop/inspection-report',
        icon: '',
      },
      {
        title: 'Letter Attachment',
        label: '',
        href: '/edms/road-and-traffic/workshop/letter-attachment',
        icon: '',
      },
      {
        title: 'Drawing',
        label: '',
        href: '/edms/road-and-traffic/workshop/drawing',
        icon: '',
      },
      {
        title: 'Miscellaneous',
        label: '',
        href: '/edms/road-and-traffic/workshop/miscellaneous',
        icon: '',
      },
    ],
  },
]

export const itsLinks: SideLink[] = [

  {
    title: 'About ITS',
    label: '',
    href: '/edms/its/about-its',
    icon: <AboutIcon />,
  },
  {
    title: 'Organization',
    label: '',
    href: '/edms/its/organization',
    icon: <FileIcon />,
  },
  {
    title: 'Work Plan',
    label: '',
    href: '/edms/its/workplan',
    icon: <FileIcon />,
  },

  {
    title: 'Notice',
    label: '',
    href: '/edms/its/notice',
    icon: <FileIcon />,
  },
  {
    title: 'System configure',
    label: '',
    href: '/edms/its/system-configure',
    icon: <FileIcon />,
  },
  {
    title: 'Operation Manual',
    label: '',
    href: '/edms/its/operation-manual',
    icon: <FileIcon />,
  },

  {
    title: 'Monthly Report',
    label: '',
    href: '/edms/its/monthly-report',
    icon: <FileIcon />,
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
        href: '/edms/toll/daily-toll-traffic-data',
        icon: '',
      },
      {
        title: 'Daily Toll & Traffic Data Comparisons',
        label: '',
        href: '/edms/toll/daily-data-comparisons',
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
        href: '/edms/toll/shift/shift-wise-toll-traffic-data',
        icon: '',
      },
      {
        title: 'Shift Wise Toll & Traffic',
        label: '',
        href: '/edms/toll/shift/shift-wise-toll-traffic-comparison',
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
        href: '/edms/toll/wim-data/represent-wim-data',
        icon: '',
      },
      {
        title: 'WIM data Comparisons',
        label: '',
        href: '/edms/toll/wim-data/wim-data-comparisons',
        icon: '',
      },

    ],
  },
  {
    title: 'Daily Report',
    label: '',
    href: '/edms/toll/daily-report',
    uName: 'special-audit',
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
        href: '/edms/toll/monthly-roster/main-bridge-bills',
        uName: 'toll-monthly-roster',
        icon: <FileIcon />,
      }

    ],
  },

  {
    title: 'Employee Personal Report',
    label: '',
    href: '/edms/toll/employee-personal-report',
    uName: 'toll-monthly-roster',
    icon: <FileIcon />,
  },
  {
    title: 'Hierarchy',
    label: '',
    href: '/edms/toll/hierarchy',
    uName: 'toll-monthly-roster',
    icon: <FileIcon />,
  },
]


export const rtwLinks: SideLink[] = [
  {
    title: 'Project Overview',
    label: '',
    href: '/edms/rtw/project-overview',
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
        href: '/edms/rtw/rtw-drawings',
        icon: '',
      },
      {
        title: 'Materials & Equipment List',
        label: '',
        href: '/edms/rtw/material-and-equipment',
        icon: '',
      },
      {
        title: 'Survey Reports',
        label: '',
        href: '/edms/rtw/survey-reports',
        icon: '',
      },
      {
        title: 'RTW Maintenance Manual',
        label: '',
        href: '/edms/rtw/rtw-maintenance-manual',
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
        href: '/edms/rtw/monitoring-and-reporting/daily-water-level-records',
        icon: '',
      },
      {
        title: 'RTW Monthly Reports',
        label: '',
        href: '/edms/rtw/monitoring-and-reporting/monthly-reports',
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
        href: '/edms/rtw/material-test-report',
        icon: '',
      },
      {
        title: 'Safety',
        label: '',
        href: '/edms/rtw/safety',
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
        href: '/edms/rtw/letter-and-official-correspondence',
        icon: '',
      },
      {
        title: 'Meeting Minutes',
        label: '',
        href: '/edms/rtw/meeting-minutes',
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
        href: '/edms/rtw/rtw-bills',
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
        href: '/edms/rtw/picture-and-videos',
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
        href: '/edms/rtw/additional-notes/backup-frequency',
        icon: '',
      },
      {
        title: 'Document Control Manager',
        label: '',
        href: '/edms/rtw/additional-notes/document-control-manager',
        icon: '',
      },
      {
        title: 'Document Revision Log',
        label: '',
        href: '/edms/rtw/additional-notes/document-revision-log',
        icon: '',
      },
    ],
  },
]





export const pmisLinks: SideLink[] = [
  {
    title: 'Project Overview',
    label: '',
    href: '/edms/mb-pmis/project-overview',
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
        href: '/edms/mb-pmis/technical-documentation/main-bridge-drawings',
        icon: '',
      },
      {
        title: 'Materials & Equipment List ',
        label: '',
        href: '/edms/mb-pmis/technical-documentation/materials-and-equipment',
        icon: '',
      },

      {
        title: 'Survey Reports',
        label: '',
        href: '/edms/mb-pmis/technical-documentation/survey-reports',
        icon: '',
      },
      {
        title: 'Main Bridge Maintenance Manual',
        label: '',
        href: '/edms/mb-pmis/technical-documentation/maintenance-manual',
        icon: '',
      },
      {
        title: 'Other',
        label: '',
        href: '/edms/mb-pmis/technical-documentation/other',
        icon: '',
      },
    ],
  },
  {
    title: 'Monitoring & Reporting',
    label: '',
    href: '/edms/mb-pmis/monitoring-and-reporting',
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
        href: '/edms/mb-pmis/quality-and-safety/material-test-report',
        icon: '',
      },
      {
        title: 'Safety',
        label: '',
        href: '/edms/mb-pmis/quality-and-safety/safety',
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
        href: '/edms/mb-pmis/letter-and-official-correspondence',
        icon: '',
      },
      {
        title: 'Meeting Minutes',
        label: '',
        href: '/edms/mb-pmis/meeting-minutes',
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
        href: '/edms/mb-pmis/main-bridge-bills',
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
        href: '/edms/mb-pmis/picture-and-videos',
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
        href: '/edms/mb-pmis/additional-notes/backup-frequency',
        icon: '',
      },
      {
        title: 'Document Control Manager',
        label: '',
        href: '/edms/mb-pmis/additional-notes/document-control-manager',
        icon: '',
      },
      {
        title: 'Document Revision Log',
        label: '',
        href: '/edms/mb-pmis/additional-notes/document-revision-log',
        icon: '',
      },
    ],
  },
]