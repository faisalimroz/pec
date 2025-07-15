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
            path: 'administrative/business-report',
            lazy: async () => ({
              Component: (
                await import('@/pages/admin/planning/business-report')
              ).default,
            }),
          },
          {
            path: 'administrative/meeting-report',
            lazy: async () => ({
              Component: (await import('@/pages/admin/planning/meeting-report'))
                .default,
            }),
          },
          {
            path: 'administrative/monthly-report',
            lazy: async () => ({
              Component: (await import('@/pages/admin/planning/monthly-report'))
                .default,
            }),
          },
          {
            path: 'administrative/monthly-roster',
            lazy: async () => ({
              Component: (await import('@/pages/admin/planning/monthly-roster'))
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
                await import('@/pages/admin/hr/employee-personal-profile')
              ).default,
            }),
          },
          {
            path: 'administrative/employee-personal-profile/:id',
            lazy: async () => ({
              Component: (await import('@/pages/admin/hr/em-personal-detail'))
                .default,
            }),
          },
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
            path: 'administrative/status-personnel',
            lazy: async () => ({
              Component: (
                await import('@/pages/admin/greetings/status-personnel')
              ).default,
            }),
          },
          {
            path: 'administrative/greetings',
            lazy: async () => ({
              Component: (await import('@/pages/admin/greetings/greetings'))
                .default,
            }),
          },
          {
            path: 'administrative/recruitment',
            lazy: async () => ({
              Component: (await import('@/pages/admin/greetings/recruitment'))
                .default,
            }),
          },
          {
            path: 'administrative/recruitment/:id',
            lazy: async () => ({
              Component: (
                await import('@/pages/admin/greetings/recruitment-detail')
              ).default,
            }),
          },
          {
            path: 'administrative/application-of-employees',
            lazy: async () => ({
              Component: (
                await import('@/pages/admin/greetings/application-employees')
              ).default,
            }),
          },
          {
            path: 'administrative/commodity-management',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/admin/general-management/commodity-management'
                )
              ).default,
            }),
          },
          {
            path: 'administrative/utility-consumption-info',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/admin/general-management/utility-consumption'
                )
              ).default,
            }),
          },
          {
            path: 'administrative/labor-management',
            lazy: async () => ({
              Component: (await import('@/pages/admin/labor-management'))
                .default,
            }),
          },
          {
            path: 'administrative/all-salary',
            lazy: async () => ({
              Component: (await import('@/pages/admin/salary')).default,
            }),
          },
          {
            path: 'administrative/accommodation-facilities',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/admin/other-facilities/accommodation-facility'
                )
              ).default,
            }),
          },
          {
            path: 'administrative/restaurant-management',
            lazy: async () => ({
              Component: (
                await import(
                  '@/pages/admin/other-facilities/restaurant-management'
                )
              ).default,
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
            path: 'administrative/notice',
            lazy: async () => ({
              Component: (await import('@/pages/admin/notice')).default,
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
            path: 'road-and-traffic/building-maintenance',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/building-maintenance')
              ).default,
            }),
          },
          {
            path: 'road-and-traffic/monthly-roaster',
            lazy: async () => ({
              Component: (
                await import('@/pages/road-and-traffic/monthly-roaster')
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
            path: 'its/overview',
            lazy: async () => ({
              Component: (await import('@/pages/its/Staff/overview')).default,
            }),
          },
          {
            path: 'its/staff-summary',
            lazy: async () => ({
              Component: (await import('@/pages/its/Staff/staff-summary'))
                .default,
            }),
          },
          {
            path: 'its/duty-roster',
            lazy: async () => ({
              Component: (await import('@/pages/its/Staff/duty-roster'))
                .default,
            }),
          },
          {
            path: 'its/report/monitoring',
            lazy: async () => ({
              Component: (await import('@/pages/its/Report/Monitoring'))
                .default,
            }),
          },
          {
            path: 'its/report/to-rhd',
            lazy: async () => ({
              Component: (await import('@/pages/its/Report/ToRhd')).default,
            }),
          },
          {
            path: 'its/internal-letter/announce',
            lazy: async () => ({
              Component: (await import('@/pages/its/OfficialLetter/rhd'))
                .default,
            }),
          },
          {
            path: 'its/official-letter/miscellaneous',
            lazy: async () => ({
              Component: (
                await import('@/pages/its/OfficialLetter/Miscellaneous')
              ).default,
            }),
          },
          {
            path: 'its/procurement/quotation',
            lazy: async () => ({
              Component: (
                await import('@/pages/its/ProcurementDetails/Quotation')
              ).default,
            }),
          },
          {
            path: 'its/procurement/invoice',
            lazy: async () => ({
              Component: (
                await import('@/pages/its/ProcurementDetails/Invoice')
              ).default,
            }),
          },
          {
            path: 'its/procurement/working-order',
            lazy: async () => ({
              Component: (
                await import('@/pages/its/ProcurementDetails/WorkingOrder')
              ).default,
            }),
          },
          {
            path: 'its/procurement/requisition',
            lazy: async () => ({
              Component: (
                await import('@/pages/its/ProcurementDetails/Requisition')
              ).default,
            }),
          },
          {
            path: 'its/procurement/paid-service',
            lazy: async () => ({
              Component: (
                await import('@/pages/its/ProcurementDetails/PaidService')
              ).default,
            }),
          },
          {
            path: 'its/training/manual',
            lazy: async () => ({
              Component: (await import('@/pages/its/Training')).default,
            }),
          },
          {
            path: 'its/om-activities/its',
            lazy: async () => ({
              Component: (await import('@/pages/its/OMActivity/Its')).default,
            }),
          },
          {
            path: 'its/om-activities/electricity',
            lazy: async () => ({
              Component: (await import('@/pages/its/OMActivity/Electricity'))
                .default,
            }),
          },
          {
            path: 'its/inventory/its',
            lazy: async () => ({
              Component: (await import('@/pages/its/Inventory/Its')).default,
            }),
          },
          {
            path: 'its/inventory/electricity',
            lazy: async () => ({
              Component: (await import('@/pages/its/Inventory/Electricity'))
                .default,
            }),
          },
          {
            path: 'its/diagram/its',
            lazy: async () => ({
              Component: (await import('@/pages/its/Diagram/Its')).default,
            }),
          },
          {
            path: 'its/diagram/electricity',
            lazy: async () => ({
              Component: (await import('@/pages/its/Diagram/Electricity'))
                .default,
            }),
          },
          {
            path: 'its/warranty/product-list',
            lazy: async () => ({
              Component: (await import('@/pages/its/Warranty/ProductList'))
                .default,
            }),
          },
          {
            path: 'its/warranty/claim-report',
            lazy: async () => ({
              Component: (await import('@/pages/its/Warranty/ClaimReport'))
                .default,
            }),
          },
          {
            path: 'its/vehicle-detect',
            lazy: async () => ({
              Component: (await import('@/pages/its/VehicleDetect')).default,
            }),
          },

          {
            path: 'toll',
            lazy: async () => ({
              Component: (await import('@/pages/toll')).default,
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
            path: 'toll/monthly-toll-revenue',
            lazy: async () => ({
              Component: (await import('@/pages/toll/monthly-toll-revenue'))
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

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
