import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'

const router = createBrowserRouter([
  // Auth routes
  {
    path: '/sign-in-2',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },
  {
    path: '/',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in-2')).default,
    }),
  },
  {
    path: '/sign-up',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-up')).default,
    }),
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },
  {
    path: '/otp',
    lazy: async () => ({
      Component: (await import('./pages/auth/otp')).default,
    }),
  },
  {
    path: '/ai-dashboard',
    lazy: async () => ({
      Component: (await import('./pages/ai-dashboard')).default,
    }),
  },
  {
    path: '/ai-dashboard/view-first-six-frames',
    lazy: async () => ({
      Component: (await import('./pages/ai-dashboard/view-all-cam')).default,
    }),
  },
  {
    path: '/ai-dashboard/view-last-six-frames',
    lazy: async () => ({
      Component: (await import('./pages/ai-dashboard/view-last-six-cam'))
        .default,
    }),
  },

  // Main routes
  {
    path: '/',
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        lazy: async () => ({
          Component: (await import('@/pages/protected')).default,
        }),
        errorElement: <GeneralError />,
        children: [
          {
            path: 'dashboard',
            lazy: async () => ({
              Component: (await import('@/pages/dashboard')).default,
            }),
          },
          {
            path: 'edms',
            lazy: async () => ({
              Component: (await import('@/pages/edms')).default,
            }),
          },
          {
            path: 'edms/dispatched',
            lazy: async () => ({
              Component: (await import('@/pages/edms/dispatched')).default,
            }),
          },
          {
            path: 'edms/received',
            lazy: async () => ({
              Component: (await import('@/pages/edms/received')).default,
            }),
          },
          {
            path: 'edms/others',
            lazy: async () => ({
              Component: (await import('@/pages/edms/others')).default,
            }),
          },
          {
            path: 'edms/official-letter',
            lazy: async () => ({
              Component: (await import('@/pages/edms/official-letter')).default,
            }),
          },

          {
            path: 'admin-panel/create-roles',
            lazy: async () => ({
              Component: (await import('@/pages/admin-panel/create-roles'))
                .default,
            }),
          },
          {
            path: 'admin-panel/toll-amount',
            lazy: async () => ({
              Component: (await import('@/pages/admin-panel/toll-amount'))
                .default,
            }),
          },
          {
            path: 'admin-panel/update-user',
            lazy: async () => ({
              Component: (await import('@/pages/admin-panel/update-admin'))
                .default,
            }),
          },
          {
            path: 'admin-panel/notice-board',
            lazy: async () => ({
              Component: (await import('@/pages/admin-panel/notice-board'))
                .default,
            }),
          },
          {
            path: 'admin-panel/toll-collector-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/admin-panel/toll-collect-report')
              ).default,
            }),
          },
          {
            path: 'admin-panel/toll-collector-log',
            lazy: async () => ({
              Component: (
                await import('@/pages/admin-panel/toll-collector-log')
              ).default,
            }),
          },
          {
            path: 'admin-panel/password-reset',
            lazy: async () => ({
              Component: (await import('@/pages/admin-panel/reset-password'))
                .default,
            }),
          },
          {
            path: 'admin-panel/user-log',
            lazy: async () => ({
              Component: (await import('@/pages/admin-panel/user-log')).default,
            }),
          },

          {
            path: 'general-information/general-status',
            lazy: async () => ({
              Component: (await import('@/pages/general-info/general-status'))
                .default,
            }),
          },
          {
            path: 'general-information/organization-chart',
            lazy: async () => ({
              Component: (await import('@/pages/general-info/org-chart'))
                .default,
            }),
          },
          {
            path: 'general-information/location-chart',
            lazy: async () => ({
              Component: (await import('@/pages/general-info/location-chart'))
                .default,
            }),
          },
          {
            path: 'general-information/aerial-photography',
            lazy: async () => ({
              Component: (await import('@/pages/general-info/aerial-photo'))
                .default,
            }),
          },
          {
            path: 'general-information/staff-summary',
            lazy: async () => ({
              Component: (await import('@/pages/general-info/staff-summary'))
                .default,
            }),
          },
          {
            path: 'general-information/reference',
            lazy: async () => ({
              Component: (await import('@/pages/general-info/reference'))
                .default,
            }),
          },

          {
            path: 'administrative',
            lazy: async () => ({
              Component: (await import('@/pages/admin')).default,
            }),
          },




          {
            path: 'administrative/vehicle-mgt-record',
            lazy: async () => ({
              Component: (await import('@/pages/admin/vehicle-mgt-record'))
                .default,
            }),
          },
          {
            path: 'administrative/gardening-monthly-activity',
            lazy: async () => ({
              Component: (await import('@/pages/admin/gardening/gardening-monthly-activity'))
                .default,
            }),
          },
          {
            path: 'administrative/gardening-tools',
            lazy: async () => ({
              Component: (await import('@/pages/admin/gardening/gardening-tools'))
                .default,
            }),
          },

          {
            path: 'administrative/mobilization',
            lazy: async () => ({
              Component: (await import('@/pages/admin/hr/mobilization'))
                .default,
            }),
          },
          {
            path: 'administrative/status-of-personnel',
            lazy: async () => ({
              Component: (await import('@/pages/admin/hr/status-personnel'))
                .default,
            }),
          },
          {
            path: 'administrative/employee-personal-profile',
            lazy: async () => ({
              Component: (
                await import('@/pages/admin/employee-personal-profile')
              ).default,
            }),
          },
          // {
          //   path: 'administrative/employee-personal-profile/:id',
          //   lazy: async () => ({
          //     Component: (await import('@/pages/admin/em-personal-detail'))
          //       .default,
          //   }),
          // },
          {
            path: 'administrative/attendance-management',
            lazy: async () => ({
              Component: (
                await import('@/pages/admin/hr/attendance-management')
              ).default,
            }),
          },
          {
            path: 'administrative/insurance-management',
            lazy: async () => ({
              Component: (await import('@/pages/admin/hr/insurance-management'))
                .default,
            }),
          },
          {
            path: 'administrative/insurance-management/:id',
            lazy: async () => ({
              Component: (await import('@/pages/admin/hr/insurance-detail'))
                .default,
            }),
          },
          {
            path: 'administrative/insurance-claiming',
            lazy: async () => ({
              Component: (await import('@/pages/admin/hr/insurance-claiming'))
                .default,
            }),
          },
          {
            path: 'administrative/salary-management',
            lazy: async () => ({
              Component: (await import('@/pages/admin/hr/salary')).default,
            }),
          },
          {
            path: 'administrative/leave-management',
            lazy: async () => ({
              Component: (await import('@/pages/admin/hr/leave-management'))
                .default,
            }),
          },
          {
            path: 'administrative/welfare-management',
            lazy: async () => ({
              Component: (await import('@/pages/admin/hr/welfare-management'))
                .default,
            }),
          },


          {
            path: 'administrative/asset-management',
            lazy: async () => ({
              Component: (await import('@/pages/admin/asset-management'))
                .default,
            }),
          },

          {
            path: 'administrative/it-electronics-communication-report',
            lazy: async () => ({
              Component: (await import('@/pages/admin/it-electronics-communication/it-electronics-monthly-report')).default,
            }),
          },
          {
            path: 'administrative/it-electronics-communication-tools',
            lazy: async () => ({
              Component: (await import('@/pages/admin/it-electronics-communication/it-electronics-tools')).default,
            }),
          },
          {
            path: 'administrative/security-mgt-monthly-report',
            lazy: async () => ({
              Component: (await import('@/pages/admin/security-mgt/security-monthly-report')).default,
            }),
          },
          {
            path: 'administrative/security-mgt-tools',
            lazy: async () => ({
              Component: (await import('@/pages/admin/security-mgt/security-tools')).default,
            }),
          },
          {
            path: 'administrative/fire-mgt-monthly-report',
            lazy: async () => ({
              Component: (await import('@/pages/admin/fire-mgt/fire-monthly-report')).default,
            }),
          },
          {
            path: 'administrative/fire-mgt-tools',
            lazy: async () => ({
              Component: (await import('@/pages/admin/fire-mgt/fire-tools')).default,
            }),
          },
          {
            path: '/finance/ipc-monthly-updates',
            lazy: async () => ({
              Component: (await import('@/pages/admin/ipc/ipc-monthly-updates')).default,
            }),
          },
          {
            path: '/finance/ipc-records',
            lazy: async () => ({
              Component: (await import('@/pages/admin/ipc/ipc-records')).default,
            }),
          },
          {
            path: 'administrative/building-maintenance-report',
            lazy: async () => ({
              Component: (await import('@/pages/admin/building-maintenance/monthly-report')).default,
            }),
          },
          {
            path: 'administrative/building-maintenance-tools',
            lazy: async () => ({
              Component: (await import('@/pages/admin/building-maintenance/tools')).default,
            }),
          },
          {
            path: 'administrative/health-center-monthly-report',
            lazy: async () => ({
              Component: (await import('@/pages/admin/health-center/monthly-report')).default,
            }),
          },
          {
            path: 'administrative/health-center-medicine-record',
            lazy: async () => ({
              Component: (await import('@/pages/admin/health-center/medicine-in-out-record')).default,
            }),
          },
          {
            path: 'administrative/health-center-monthly-equipment-record',
            lazy: async () => ({
              Component: (await import('@/pages/admin/health-center/medical-equipment-record')).default,
            }),
          },

          //extra admin (edms)
          {
            path: '/edms/administrative',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/index')).default,
            }),
          },
           
          {
            path: '/edms/administrative/vehicle-mgt-record',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/vehicle-mgt-record'))
                .default,
            }),
          },
          {
            path: '/edms/administrative/employee-personal-profile',
            lazy: async () => ({
              Component: (
                await import('@/pages/admin- edms/employee-personal-profile')
              ).default,
            }),
          },
          {
            path: '/edms/administrative/gardening-monthly-activity',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/gardening/gardening-monthly-activity'))
                .default,
            }),
          },
          {
            path: '/edms/administrative/gardening-tools',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/gardening/gardening-tools'))
                .default,
            }),
          },
          {
            path: '/edms/administrative/asset-management',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/asset-management'))
                .default,
            }),
          },

          {
            path: '/edms/administrative/it-electronics-communication-report',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/it-electronics-communication/it-electronics-monthly-report')).default,
            }),
          },
          {
            path: '/edms/administrative/it-electronics-communication-tools',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/it-electronics-communication/it-electronics-tools')).default,
            }),
          },
          {
            path: '/edms/administrative/security-mgt-monthly-report',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/security-mgt/security-monthly-report')).default,
            }),
          },
          {
            path: '/edms/administrative/security-mgt-tools',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/security-mgt/security-tools')).default,
            }),
          },
          {
            path: '/edms/administrative/fire-mgt-monthly-report',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/fire-mgt/fire-monthly-report')).default,
            }),
          },
          {
            path: '/edms/administrative/fire-mgt-tools',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/fire-mgt/fire-tools')).default,
            }),
          },
          {
            path: '/edms/administrative/ipc-monthly-updates',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/ipc/ipc-monthly-updates')).default,
            }),
          },
          {
            path: '/edms/administrative/ipc-records',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/ipc/ipc-records')).default,
            }),
          },
          {
            path: '/edms/administrative/building-maintenance-report',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/building-maintenance/monthly-report')).default,
            }),
          },
          {
            path: '/edms/administrative/building-maintenance-tools',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/building-maintenance/tools')).default,
            }),
          },
          {
            path: '/edms/administrative/health-center-monthly-report',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/health-center/monthly-report')).default,
            }),
          },
          {
            path: '/edms/administrative/health-center-medicine-record',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/health-center/medicine-in-out-record')).default,
            }),
          },
          {
            path: '/edms/administrative/health-center-monthly-equipment-record',
            lazy: async () => ({
              Component: (await import('@/pages/admin- edms/health-center/medical-equipment-record')).default,
            }),
          },


          {
            path: 'clinic-center/medicine-record',
            lazy: async () => ({
              Component: (await import('@/pages/clinic-center/medicine-record'))
                .default,
            }),
          },
          {
            path: 'clinic-center/treatment-record',
            lazy: async () => ({
              Component: (
                await import('@/pages/clinic-center/treatment-record')
              ).default,
            }),
          },

          {
            path: 'finance',
            lazy: async () => ({
              Component: (await import('@/pages/finance')).default,
            }),
          },
          {
            path: 'finance/monthly-invoice-record',
            lazy: async () => ({
              Component: (
                await import('@/pages/finance/monthly-invoice-record')
              ).default,
            }),
          },
          {
            path: 'finance/toll-money-management-for-cash',
            lazy: async () => ({
              Component: (await import('@/pages/finance/toll-money-for-cash'))
                .default,
            }),
          },
          {
            path: 'finance/toll-money-management-for-rfid',
            lazy: async () => ({
              Component: (await import('@/pages/finance/toll-money-for-rfid'))
                .default,
            }),
          },
          {
            path: 'finance/monthly-salary-sheet',
            lazy: async () => ({
              Component: (await import('@/pages/finance/monthly-salary-sheet'))
                .default,
            }),
          },
          {
            path: 'finance/monthly-pit-sheet',
            lazy: async () => ({
              Component: (await import('@/pages/finance/monthly-pit-sheet'))
                .default,
            }),
          },
          {
            path: 'finance/rhd-bill-details',
            lazy: async () => ({
              Component: (await import('@/pages/finance/rhd-bill-details'))
                .default,
            }),
          },
          {
            path: 'finance/maintain-ipc-pdf',
            lazy: async () => ({
              Component: (await import('@/pages/finance/maintain-ipc-pdf'))
                .default,
            }),
          },
          {
            path: 'finance/monthly-ipc-ps',
            lazy: async () => ({
              Component: (await import('@/pages/finance/monthly-ipc-ps'))
                .default,
            }),
          },
          {
            path: 'finance/procurement',
            lazy: async () => ({
              Component: (await import('@/pages/finance/procurement')).default,
            }),
          },
          {
            path: 'finance/letter',
            lazy: async () => ({
              Component: (await import('@/pages/finance/letter')).default,
            }),
          },

          {
            path: 'road-&-traffic',
            lazy: async () => ({
              Component: (await import('@/pages/road-and-traffic')).default,
            }),
          },
          {
            path: 'road-and-traffic/rhd-letter',
            lazy: async () => ({
              Component: (await import('@/pages/road-and-traffic/rhd-letter'))
                .default,
            }),
          },
          {
            path: 'road-and-traffic/procurement',
            lazy: async () => ({
              Component: (await import('@/pages/road-and-traffic/procurement'))
                .default,
            }),
          },
          {
            path: 'road-and-traffic/monthly-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/monthly-report')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/drawing/structural',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/drawing/structural')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/drawing/electrical',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/drawing/electrical')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/maintenance/daily-work-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/maintenance/daily-work-report'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/maintenance/inspection-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/maintenance/inspection-report'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/maintenance/one-page-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/maintenance/one-page-report'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/maintenance/work-completion-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/maintenance/work-completion'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/maintenance/miscellaneous',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/maintenance/miscellaneous'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-safety/inspection-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/roadSafetyTraffic/inspection-report'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-safety/one-page-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/roadSafetyTraffic/one-page-report'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-safety/accident-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/safety-patrol/accident-report'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-safety/police-record',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/safety-patrol/police-record'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-safety/work-completion-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/roadSafetyTraffic/work-completion-report'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-safety/miscellaneous',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/roadSafetyTraffic/miscellaneous'
                )
              ).default,
            }),
          },
          {
            path: '/road-and-traffic/road-safety/analysis',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/safety-patrol/analysis')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/accident-record',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/roadSafetyTraffic/accident-record'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/accident-record/:id',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/accident-record-view')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/safety-and-patrol/patrol-team',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/safety-patrol/patrol-team'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/safety-and-patrol/security-team',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/safety-patrol/security-team'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/safety-and-patrol/miscellaneous',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/safety-patrol/miscellaneous'
                )
              ).default,
            }),
          },

          {
            path: 'road-and-traffic/mechanical-electrical/daily-work-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/mechanical-electrical/daily-work-report'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/mechanical-electrical/daily-vehicle-inspection-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/mechanical-electrical/daily-vehicle-inspection'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/mechanical-electrical/periodic-maintenance',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/mechanical-electrical/periodic-maintain'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/mechanical-electrical/inspection-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/mechanical-electrical/inspection-report'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/mechanical-electrical/repairing-work',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/mechanical-electrical/repairing-work'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/mechanical-electrical/inventory-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/mechanical-electrical/inventory-report'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/mechanical-electrical/fuel-consumption-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/mechanical-electrical/fuel-consumption'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/mechanical-electrical/vehicle-insurance',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/mechanical-electrical/vehicle-insurance'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/mechanical-electrical/vehicle-documents',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/road-and-traffic/mechanical-electrical/vehicle-documents'
                )
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/kec-letter',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/kec-letter')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/organization-organogram',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/orgaorganization-organogram')
              ).default,
            }),
          },
          {
            path: '/road-and-traffic/monthly-roaster',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/monthly-roaster')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-patrol/accident-incident-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-patrol/accident')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-patrol/requisition-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-patrol/requisition-form')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-patrol/completion-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-patrol/completion-form')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-patrol/reciving-materials-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-patrol/reciving-materials-form')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-patrol/inspection-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-patrol/inspection-report')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-patrol/letter-attachment',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-patrol/letter-attachment')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-patrol/drawing',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-patrol/drawing')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-patrol/controllers-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-patrol/controllers-report')
              ).default,
            }),
          },


          {
            path: 'road-and-traffic/road-and-patrol/miscellaneous',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-patrol/miscellaneous')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/workshop/accident-incident-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/workshop/accident')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/workshop/requisition-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/workshop/requisition-form')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/workshop/completion-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/workshop/completion-form')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/workshop/reciving-materials-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/workshop/reciving-materials-form')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/workshop/inspection-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/workshop/inspection-report')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/workshop/letter-attachment',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/workshop/letter-attachment')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/workshop/drawing',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/workshop/drawing')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/workshop/miscellaneous',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/workshop/miscellaneous')
              ).default,
            }),
          },

          {
            path: 'road-and-traffic/road-and-maintanance/accident-incident-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-maintenance/accident')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-maintanance/requisition-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-maintenance/requisition-form')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-maintanance/completion-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-maintenance/completion-form')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-maintanance/reciving-materials-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-maintenance/reciving-materials-form')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-maintanance/inspection-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-maintenance/inspection-report')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-maintanance/letter-attachment',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-maintenance/letter-attachment')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-maintanance/drawing',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-maintenance/drawing')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/road-and-maintanance/miscellaneous',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/road-and-maintenance/miscellaneous')
              ).default,
            }),
          },
 {
            path: 'road-and-traffic',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/index')
              ).default,
            }),
          },
// extra rat (edms)
{
            path: '/edms/road-and-traffic',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/index')
              ).default,
            }),
          },
{
            path: '/edms/road-and-traffic/organization-organogram',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/orgaorganization-organogram')
              ).default,
            }),
          },
           {
            path: '/edms/road-and-traffic/kec-letter',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/kec-letter')
              ).default,
            }),
          },
            {
            path: '/edms/road-and-traffic/monthly-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/monthly-report')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/monthly-roaster',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/monthly-roaster')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-patrol/accident-incident-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-patrol/accident')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-patrol/requisition-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-patrol/requisition-form')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-patrol/completion-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-patrol/completion-form')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-patrol/reciving-materials-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-patrol/reciving-materials-form')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-patrol/inspection-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-patrol/inspection-report')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-patrol/letter-attachment',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-patrol/letter-attachment')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-patrol/drawing',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-patrol/drawing')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-patrol/controllers-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-patrol/controllers-report')
              ).default,
            }),
          },


          {
            path: '/edms/road-and-traffic/road-and-patrol/miscellaneous',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-patrol/miscellaneous')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/workshop/accident-incident-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/workshop/accident')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/workshop/requisition-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/workshop/requisition-form')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/workshop/completion-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/workshop/completion-form')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/workshop/reciving-materials-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/workshop/reciving-materials-form')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/workshop/inspection-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/workshop/inspection-report')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/workshop/letter-attachment',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/workshop/letter-attachment')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/workshop/drawing',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/workshop/drawing')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/workshop/miscellaneous',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/workshop/miscellaneous')
              ).default,
            }),
          },

          {
            path: '/edms/road-and-traffic/road-and-maintanance/accident-incident-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-maintenance/accident')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-maintanance/requisition-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-maintenance/requisition-form')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-maintanance/completion-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-maintenance/completion-form')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-maintanance/reciving-materials-form',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-maintenance/reciving-materials-form')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-maintanance/inspection-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-maintenance/inspection-report')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-maintanance/letter-attachment',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-maintenance/letter-attachment')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-maintanance/drawing',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-maintenance/drawing')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/road-and-maintanance/miscellaneous',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/road-and-maintenance/miscellaneous')
              ).default,
            }),
          },
          {
            path: '/edms/road-and-traffic/about',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic-edms/index')
              ).default,
            }),
          },
          {
            path: 'its',
            lazy: async () => ({
              Component: (await import('@/pages/its')).default,
            }),
          },

          {
            path: 'its/about-its',
            lazy: async () => ({
              Component: (await import('@/pages/its/AboutUs')).default,
            }),
          },
          {
            path: 'its/system-configure',
            lazy: async () => ({
              Component: (await import('@/pages/its/SystemConfigure')).default,
            }),
          },
          {
            path: 'its/notice',
            lazy: async () => ({
              Component: (await import('@/pages/its/Notice')).default,
            }),
          },
          {
            path: 'its/operation-manual',
            lazy: async () => ({
              Component: (await import('@/pages/its/OperationManual')).default,
            }),
          },
          {
            path: 'its/work-plan',
            lazy: async () => ({
              Component: (await import('@/pages/its/WorkPlan')).default,
            }),
          },
          {
            path: 'its/monthly-report',
            lazy: async () => ({
              Component: (await import('@/pages/its/MonthlyReport')).default,
            }),
          },

          {
            path: 'its/organization',
            lazy: async () => ({
              Component: (await import('@/pages/its/Organization')).default,
            }),
          },

        
          //extra toll 
            {
            path: '/edms/toll/hierarchy',
            lazy: async () => ({
              Component: (await import('@/pages/toll-edms/hierarchy')).default,
            }),
          },
          {
            path: '/edms/toll/wim-data/wim-data-comparisons',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll-edms/wim-data'
                )
              ).default,
            }),
          },
          {
            path: '/edms/toll/wim-data/represent-wim-data',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll-edms/wim-data-comparison'
                )
              ).default,
            }),
          },
          {
            path: '/edms/toll/shift/shift-wise-toll-traffic-data',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll-edms/shift-wise/shift-wise-toll-traffic-data'
                )
              ).default,
            }),
          },
          {
            path: '/edms/toll/shift/shift-wise-toll-traffic-comparison',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll-edms/shift-wise/shift-wise-toll-comparison'
                )
              ).default,
            }),
          },
          {
            path: '/edms/toll/daily-toll-traffic-data',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll-edms/daily-report'
                )
              ).default,
            }),
          },
          {
            path: '/edms/toll/daily-data-comparisons',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll-edms/daily-toll-trafic-comparison'
                )
              ).default,
            }),
          },
          {
            path: '/edms/toll/daily-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll-edms/report'
                )
              ).default,
            }),
          },
          {
            path: '/edms/toll/monthly-roster/main-bridge-bills',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll-edms/main-bridge/index'
                )
              ).default,
            }),
          },
          {
            path: '/edms/toll/employee-personal-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll-edms/employee-personal-report'
                )
              ).default,
            }),
          },
            {
            path: '/edms/toll',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll-edms/index'
                )
              ).default,
            }),
          },
          // {
          //   path: 'toll/hierarchy',
          //   lazy: async () => ({
          //     Component: (
          //       await import(
          //         '@/pages/toll/toll-collect-traffic/toll-collect-trafic'
          //       )
          //     ).default,
          //   }),
          // },
          //toll
            {
            path: 'toll',
            lazy: async () => ({
              Component: (await import('@/pages/toll/index')).default,
            }),
          },
          {
            path: '/toll/hierarchy',
            lazy: async () => ({
              Component: (await import('@/pages/toll/hierarchy')).default,
            }),
          },
          {
            path: 'toll/wim-data/wim-data-comparisons',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/wim-data'
                )
              ).default,
            }),
          },
          {
            path: 'toll/wim-data/represent-wim-data',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/wim-data-comparison'
                )
              ).default,
            }),
          },
          {
            path: 'toll/shift/shift-wise-toll-traffic-data',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/shift-wise/shift-wise-toll-traffic-data'
                )
              ).default,
            }),
          },
          {
            path: 'toll/shift/shift-wise-toll-traffic-comparison',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/shift-wise/shift-wise-toll-comparison'
                )
              ).default,
            }),
          },
          {
            path: 'toll/daily-toll-traffic-data',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/daily-report'
                )
              ).default,
            }),
          },
          {
            path: 'toll/daily-data-comparisons',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/daily-toll-trafic-comparison'
                )
              ).default,
            }),
          },
          {
            path: 'toll/daily-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/report'
                )
              ).default,
            }),
          },
          {
            path: 'toll/monthly-roster/main-bridge-bills',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/main-bridge/index'
                )
              ).default,
            }),
          },
          {
            path: 'toll/employee-personal-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/employee-personal-report'
                )
              ).default,
            }),
          },
          {
            path: 'toll/hierarchy',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/toll-collect-traffic/toll-collect-trafic'
                )
              ).default,
            }),
          },
          {
            path: 'toll/toll-collect-traffic',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/toll-collect-traffic/toll-collect-trafic'
                )
              ).default,
            }),
          },
          {
            path: 'toll/graph',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/toll-collect-traffic/graph-toll-cash'
                )
              ).default,
            }),
          },
          {
            path: 'toll/etc',
            lazy: async () => ({
              Component: (
                await import('@/pages/toll/toll-collect-traffic/etc-card')
              ).default,
            }),
          },
          {
            path: 'toll/monthly-traffic-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/toll-collect-traffic/monthly-traffic-report'
                )
              ).default,
            }),
          },
          {
            path: 'toll/manual-monthly-traffic-report',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/toll-collect-traffic/manual-monthly-traffic'
                )
              ).default,
            }),
          },
          {
            path: 'toll/exemption-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/toll/special-audit/exemption-report')
              ).default,
            }),
          },
          {
            path: 'toll/top-ten-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/toll/special-audit/top-ten-report')
              ).default,
            }),
          },
          {
            path: 'toll/others',
            lazy: async () => ({
              Component: (await import('@/pages/toll/special-audit/others'))
                .default,
            }),
          },
          {
            path: 'toll/training-and-other',
            lazy: async () => ({
              Component: (await import('@/pages/toll/training-and-other'))
                .default,
            }),
          },
          {
            path: 'toll',
            lazy: async () => ({
              Component: (await import('@/pages/toll/index'))
                .default,
            }),
          },
          {
            path: 'toll/monthly-roster',
            lazy: async () => ({
              Component: (await import('@/pages/toll/monthly-roster')).default,
            }),
          },
          {
            path: 'toll/comparison',
            lazy: async () => ({
              Component: (await import('@/pages/toll/comparison')).default,
            }),
          },
          {
            path: 'toll/kec-manual-data',
            lazy: async () => ({
              Component: (await import('@/pages/toll/kec-manual')).default,
            }),
          },
          {
            path: 'toll/kec-manual-graph',
            lazy: async () => ({
              Component: (await import('@/pages/toll/kec-manual-data-graph'))
                .default,
            }),
          },
          {
            path: 'toll/toll-traffic-ver',
            lazy: async () => ({
              Component: (await import('@/pages/toll/toll-traffic-ver'))
                .default,
            }),
          },
          {
            path: 'toll/vehicle-detect-and-toll',
            lazy: async () => ({
              Component: (await import('@/pages/toll/vehicle-detect-toll'))
                .default,
            }),
          },
          {
            path: 'toll/vehicle-detect-and-toll/:id',
            lazy: async () => ({
              Component: (await import('@/pages/toll/vehicle-detect-lane'))
                .default,
            }),
          },
          {
            path: 'toll/vehicle-detect-and-toll/vehicle-type/:id',
            lazy: async () => ({
              Component: (await import('@/pages/toll/vehicle-detect-vehicle'))
                .default,
            }),
          },
          {
            path: '/toll/toll-collect-traffic/update-delete',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/toll-collect-traffic/toll-collect-modify'
                )
              ).default,
            }),
          },
          {
            path: '/toll/etc/update-delete',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/toll/toll-collect-traffic/etc-card-modify'
                )
              ).default,
            }),
          },
          {
            path: '/toll/exemption-report/update-delete',
            lazy: async () => ({
              Component: (
                await import('@/pages/toll/special-audit/exemption-modify')
              ).default,
            }),
          },

          {
            path: 'users',
            lazy: async () => ({
              Component: (await import('@/components/coming-soon')).default,
            }),
          },
          {
            path: 'analysis',
            lazy: async () => ({
              Component: (await import('@/components/coming-soon')).default,
            }),
          },
          {
            path: 'extra-components',
            lazy: async () => ({
              Component: (await import('@/pages/extra-components')).default,
            }),
          },
        ],
      },

      // {
      //   path: 'settings',
      //   lazy: async () => ({
      //     Component: (await import('./pages/settings')).default,
      //   }),
      //   errorElement: <GeneralError />,
      //   children: [
      //     {
      //       index: true,
      //       lazy: async () => ({
      //         Component: (await import('./pages/settings/profile')).default,
      //       }),
      //     },
      //     {
      //       path: 'account',
      //       lazy: async () => ({
      //         Component: (await import('./pages/settings/account')).default,
      //       }),
      //     },
      //     {
      //       path: 'appearance',
      //       lazy: async () => ({
      //         Component: (await import('./pages/settings/appearance')).default,
      //       }),
      //     },
      //     {
      //       path: 'notifications',
      //       lazy: async () => ({
      //         Component: (await import('./pages/settings/notifications'))
      //           .default,
      //       }),
      //     },
      //     {
      //       path: 'display',
      //       lazy: async () => ({
      //         Component: (await import('./pages/settings/display')).default,
      //       }),
      //     },
      //     {
      //       path: 'error-example',
      //       lazy: async () => ({
      //         Component: (await import('./pages/settings/error-example'))
      //           .default,
      //       }),
      //       errorElement: <GeneralError className='h-[50svh]' minimal />,
      //     },
      //   ],
      // },
    ],
  },
  //rtw
  {
    path: '/rtw',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/index')).default,
    }),
  },
  {
    path: 'rtw/project-overview',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/project-overview')).default,
    }),
  },
  {
    path: 'rtw/material-test-report',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/quality-safety/material-test-report')).default,
    }),
  },
  {
    path: 'rtw/safety',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/quality-safety/safety')).default,
    }),
  },
  {
    path: 'rtw/meeting-minutes',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/communication-correspondence/meeting-minutes')).default,
    }),
  },
  {
    path: 'rtw/letter-and-official-correspondence',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/communication-correspondence/letter-official-correspondence')).default,
    }),
  },
  {
    path: '/rtw/rtw-bills',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/financial-documentation/rtw-bills')).default,
    }),
  },
  {
    path: '/rtw/rtw-drawings',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/technical-documentation/rtw-drawings')).default,
    }),
  },
  {
    path: '/rtw/rtw-drawings',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/technical-documentation/rtw-drawings')).default,
    }),
  },
  {
    path: '/rtw/material-and-equipment',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/technical-documentation/materials-and-equipment')).default,
    }),
  },
  {
    path: '/rtw/rtw-maintenance-manual',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/technical-documentation/rtw-maintenance-manual')).default,
    }),
  },
  {
    path: '/rtw/survey-reports',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/technical-documentation/survey-reports')).default,
    }),
  },
  {
    path: '/rtw/picture-and-videos',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/visual-records/pictures-and-videos')).default,
    }),
  },
  {
    path: '/rtw/monitoring-and-reporting/monthly-reports',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/monitoring-and-reporting/monthly-report')).default,
    }),
  },
  {
    path: '/rtw/monitoring-and-reporting/daily-water-level-records',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/monitoring-and-reporting/daily-water-level-records')).default,
    }),
  },
  {
    path: '/rtw/additional-notes/backup-frequency',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/additional-notes/backup-frequency')).default,
    }),
  },
  {
    path: '/rtw/additional-notes/document-control-manager',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/additional-notes/document-control')).default,
    }),
  },
  {
    path: '/rtw/additional-notes/document-revision-log',
    lazy: async () => ({
      Component: (await import('@/pages/rtw/additional-notes/document-revision-log')).default,
    }),
  },

//extra edms rtw
{
    path: '/edms/rtw',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/index')).default,
    }),
  },
{
    path: '/edms/rtw/project-overview',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/project-overview')).default,
    }),
  },
  {
    path: '/edms/rtw/material-test-report',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/quality-safety/material-test-report')).default,
    }),
  },
  {
    path: '/edms/rtw/safety',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/quality-safety/safety')).default,
    }),
  },
  {
    path: '/edms/rtw/meeting-minutes',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/communication-correspondence/meeting-minutes')).default,
    }),
  },
  {
    path: '/edms/rtw/letter-and-official-correspondence',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/communication-correspondence/letter-official-correspondence')).default,
    }),
  },
  {
    path: '/edms/rtw/rtw-bills',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/financial-documentation/rtw-bills')).default,
    }),
  },
  {
    path: '/edms/rtw/rtw-drawings',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/technical-documentation/rtw-drawings')).default,
    }),
  },
  {
    path: '/edms/rtw/rtw-drawings',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/technical-documentation/rtw-drawings')).default,
    }),
  },
  {
    path: '/edms/rtw/material-and-equipment',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/technical-documentation/materials-and-equipment')).default,
    }),
  },
  {
    path: '/edms/rtw/rtw-maintenance-manual',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/technical-documentation/rtw-maintenance-manual')).default,
    }),
  },
  {
    path: '/edms/rtw/survey-reports',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/technical-documentation/survey-reports')).default,
    }),
  },
  {
    path: '/edms/rtw/picture-and-videos',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/visual-records/pictures-and-videos')).default,
    }),
  },
  {
    path: '/edms/rtw/monitoring-and-reporting/monthly-reports',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/monitoring-and-reporting/monthly-report')).default,
    }),
  },
  {
    path: '/edms/rtw/monitoring-and-reporting/daily-water-level-records',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/monitoring-and-reporting/daily-water-level-records')).default,
    }),
  },
  {
    path: '/edms/rtw/additional-notes/backup-frequency',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/additional-notes/backup-frequency')).default,
    }),
  },
  {
    path: '/edms/rtw/additional-notes/document-control-manager',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/additional-notes/document-control')).default,
    }),
  },
  {
    path: '/edms/rtw/additional-notes/document-revision-log',
    lazy: async () => ({
      Component: (await import('@/pages/rtw-edms/additional-notes/document-revision-log')).default,
    }),
  },



  //main bridge pmis
    {
    path: '/mb-pmis',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/index')).default,
    }),
  },
  {
    path: '/mb-pmis/project-overview',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/project-overview')).default,
    }),
  },

  {
    path: '/mb-pmis/technical-documentation/main-bridge-drawings',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/technical-documentation/main-bridge-drawings')).default,
    }),
  },
  {
    path: '/mb-pmis/technical-documentation/survey-reports',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/technical-documentation/survery-reports')).default,
    }),
  },
  {
    path: '/mb-pmis/technical-documentation/materials-and-equipment',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/technical-documentation/materials-and-equipment')).default,
    }),
  },
  {
    path: '/mb-pmis/technical-documentation/other',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/technical-documentation/others')).default,
    }),
  },
  {
    path: '/mb-pmis/technical-documentation/maintenance-manual',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/technical-documentation/main-bridge-maintenace')).default,
    }),
  },
  {
    path: '/mb-pmis/monitoring-and-reporting',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/monitoring-reporting')).default,
    }),
  },
  {
    path: '/mb-pmis/quality-and-safety/safety',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/quality-safety/safety')).default,
    }),
  },
  {
    path: '/mb-pmis/quality-and-safety/material-test-report',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/quality-safety/material-test-report')).default,
    }),
  },
  {
    path: '/mb-pmis/main-bridge-bills',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/financial-documentation/main-bridge-bills')).default,
    }),
  },
  {
    path: '/mb-pmis/picture-and-videos',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/visual-records')).default,
    }),
  },
  {
    path: '/mb-pmis/letter-and-official-correspondence',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/communication-correspondence/letter-and-correspondence')).default,
    }),
  },

  {
    path: '/mb-pmis/meeting-minutes',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/communication-correspondence/meeting-minutes')).default,
    }),
  },
  {
    path: '/mb-pmis/additional-notes/backup-frequency',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/additional-notes/backup-frequency')).default,
    }),
  },
  {
    path: '/mb-pmis/additional-notes/document-control-manager',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/additional-notes/document-control')).default,
    }),
  },
  {
    path: '/mb-pmis/additional-notes/document-revision-log',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis/additional-notes/document-revision')).default,
    }),
  },
  //extra mb pmis
  {
    path: '/edms/mb-pmis/project-overview',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/project-overview')).default,
    }),
  },
 {
    path: '/edms/mb-pmis',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/index')).default,
    }),
  },

  {
    path: '/edms/mb-pmis/technical-documentation/main-bridge-drawings',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/technical-documentation/main-bridge-drawings')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/technical-documentation/survey-reports',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/technical-documentation/survery-reports')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/technical-documentation/materials-and-equipment',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/technical-documentation/materials-and-equipment')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/technical-documentation/other',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/technical-documentation/others')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/technical-documentation/maintenance-manual',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/technical-documentation/main-bridge-maintenace')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/monitoring-and-reporting',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/monitoring-reporting')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/quality-and-safety/safety',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/quality-safety/safety')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/quality-and-safety/material-test-report',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/quality-safety/material-test-report')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/main-bridge-bills',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/financial-documentation/main-bridge-bills')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/picture-and-videos',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/visual-records')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/letter-and-official-correspondence',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/communication-correspondence/letter-and-correspondence')).default,
    }),
  },

  {
    path: '/edms/mb-pmis/meeting-minutes',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/communication-correspondence/meeting-minutes')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/additional-notes/backup-frequency',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/additional-notes/backup-frequency')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/additional-notes/document-control-manager',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/additional-notes/document-control')).default,
    }),
  },
  {
    path: '/edms/mb-pmis/additional-notes/document-revision-log',
    lazy: async () => ({
      Component: (await import('@/pages/mb-pis-edms/additional-notes/document-revision')).default,
    }),
  },
  //extra edms

  {
    path: '/edms/its/workplan',
    lazy: async () => ({
      Component: (await import('@/pages/its-edms/WorkPlan')).default,
    }),
  },
  {
    path: '/edms/its/monthly-report',
    lazy: async () => ({
      Component: (await import('@/pages/its-edms/MonthlyReport')).default,
    }),
  },
  {
    path: '/edms/its/notice',
    lazy: async () => ({
      Component: (await import('@/pages/its-edms/Notice')).default,
    }),
  },
  {
    path: '/edms/its/system-configure',
    lazy: async () => ({
      Component: (await import('@/pages/its-edms/SystemConfigure')).default,
    }),
  },
  {
    path: '/edms/its/operation-manual',
    lazy: async () => ({
      Component: (await import('@/pages/its-edms/OperationManual')).default,
    }),
  },
  {
    path: '/edms/its/about-its',
    lazy: async () => ({
      Component: (await import('@/pages/its-edms/AboutUs')).default,
    }),
  },
  {
    path: '/edms/its/organization',
    lazy: async () => ({
      Component: (await import('@/pages/its-edms/Organization')).default,
    }),
  },
  {
    path: '/edms/its',
    lazy: async () => ({
      Component: (await import('@/pages/its-edms/index')).default,
    }),
  },
  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
