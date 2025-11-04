// Function to check if user has a specific role
const hasRole = (userRoles: string[], requiredRoles: string[]) => {
  return userRoles.some((role) => requiredRoles.includes(role))
}


export const adminTopNav = [
  {
    title: 'Administration',
    href: 'edms/administrative',
    isActive: true,
    logo: AdminIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'administration',
  },
  {
    title: 'Road & Traffic',
    href: '/road-and-traffic/about',
    isActive: false,
    logo: RntIcon,
    roles: ['superadmin', 'r&t-manager'],
    uName: 'road-&-traffic',
  },
  {
    title: 'Main Bridge',
    href: '/mb-pmis/project-overview',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'toll',
  },
  {
    title: 'RTW',
    href: '/rtw',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'rtw',
  },
  {
    title: 'Toll Operation',
    href: '/toll/monthly-toll-revenue',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'toll-manager'],
    uName: 'toll',
  },
  {
    title: 'ITS',
    href: '/its/about',
    isActive: false,
    logo: ItsIcon,
    roles: ['superadmin', 'its-manager'],
    uName: 'its',
  },
 
]


export const tollTopNav = [
 
  {
    title: 'Administration',
    href: '/administrative',
    isActive: false,
    logo: AdminIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'administration',
  },
  {
    title: 'Road & Traffic',
    href: '/road-and-traffic/about',
    isActive: false,
    logo: RntIcon,
    roles: ['superadmin', 'r&t-manager'],
    uName: 'road-&-traffic',
  },
  {
    title: 'Main Bridge',
    href: '/mb-pmis/project-overview',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'mb-pmis',
  },
  {
    title: 'RTW',
    href: '/rtw',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'rtw',
  },
  {
    title: 'Toll Operation',
    href: '/toll/monthly-toll-revenue',
    isActive: true,
    logo: edmsIcon,
    roles: ['superadmin', 'toll-manager'],
    uName: 'toll',
  },
  {
    title: 'ITS',
    href: '/its',
    isActive: false,
    logo: ItsIcon,
    roles: ['superadmin', 'its-manager'],
    uName: 'its',
  },
  {
    title: 'EDMS',
    href: '/edms',
    isActive: false,
    logo: edmsIcon,
    roles: ['edms', 'superadmin'],
    uName: 'edms',
  },
]

export const financeTopNav = [
  {
    title: 'General Information',
    href: '/general-information/general-status',
    isActive: false,
    logo: GiIcon,
    roles: ['general-information', 'superadmin'],
    uName: 'general-information',
  },
  {
    title: 'Road & Traffic',
    href: '/road-and-traffic/about',
    isActive: false,
    logo: RntIcon,
    roles: ['superadmin', 'r&t-manager'],
    uName: 'road-&-traffic',
  },
  {
    title: 'ITS',
    href: '/its',
    isActive: false,
    logo: ItsIcon,
    roles: ['superadmin', 'its-manager'],
    uName: 'its',
  },
  {
    title: 'Toll',
    href: '/toll/monthly-toll-revenue',
    isActive: false,
    logo: tollIcon,
    roles: ['superadmin', 'toll-manager'],
    uName: 'toll',
  },
  {
    title: 'Administration',
    href: '/administrative',
    isActive: true,
    logo: AdminIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'administration',
  },
  {
    title: 'EDMS',
    href: '/edms/dispatched',
    isActive: false,
    logo: edmsIcon,
    roles: ['edms', 'superadmin'],
    uName: 'edms',
  },
]

export const itsTopNav = [
  {
    title: 'Administration',
    href: '/administrative',
    isActive: false,
    logo: AdminIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'administration',
  },
  {
    title: 'Road & Traffic',
    href: '/road-and-traffic/about',
    isActive: false,
    logo: RntIcon,
    roles: ['superadmin', 'r&t-manager'],
    uName: 'road-&-traffic',
  },
  {
    title: 'Main Bridge',
    href: '/mb-pmis/project-overview',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'mb-pmis',
  },
  {
    title: 'RTW',
    href: '/rtw',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'rtw',
  },

  {
    title: 'Toll Operation',
    href: '/toll/monthly-toll-revenue',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'toll-manager'],
    uName: 'toll',
  },
  {
    title: 'ITS',
    href: '/its/about',
    isActive: true,
    logo: ItsIcon,
    roles: ['superadmin', 'its-manager'],
    uName: 'its',
  },
  
]

export const rntTopNav = [

  {
    title: 'Administration',
    href: '/administrative',
    isActive: false,
    logo: AdminIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'administration',
  },
  {
    title: 'Road & Traffic',
    href: '/road-and-traffic/organization-organogram',
    isActive: true,
    logo: RntIcon,
    roles: ['superadmin', 'r&t-manager'],
    uName: 'road-&-traffic',
  },
  {
    title: 'Main Bridge',
    href: '/mb-pmis/project-overview',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'mb-pmis',
  },
  {
    title: 'RTW',
    href: '/rtw',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'toll',
  },
  {
    title: 'Toll Operation',
    href: '/toll/monthly-toll-revenue',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'toll-manager'],
    uName: 'toll',
  },
  {
    title: 'ITS',
    href: '/its',
    isActive: false,
    logo: ItsIcon,
    roles: ['superadmin', 'its-manager'],
    uName: 'its',
  },
  {
    title: 'EDMS',
    href: '/edms/dispatched',
    isActive: false,
    logo: edmsIcon,
    roles: ['edms', 'superadmin'],
    uName: 'edms',
  },
]
export const rtwTopNav = [
  {
    title: 'Administration',
    href: '/administrative',
    isActive: false,
    logo: AdminIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'administration',
  },
  {
    title: 'Road & Traffic',
    href: '/road-and-traffic/about',
    isActive: false,
    logo: RntIcon,
    roles: ['superadmin', 'r&t-manager'],
    uName: 'road-&-traffic',
  },
  {
    title: 'Main Bridge',
    href: '/mb-pmis/project-overview',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'mb-pmis',
  },
  {
    title: 'RTW',
    href: '/rtw',
    isActive: true,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'rtw',
  },
  {
    title: 'Toll Operation',
    href: '/toll/monthly-toll-revenue',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'toll-manager'],
    uName: 'toll',
  },
  {
    title: 'ITS',
    href: '/its',
    isActive: false,
    logo: ItsIcon,
    roles: ['superadmin', 'its-manager'],
    uName: 'its',
  },
  {
    title: 'EDMS',
    href: '/edms/dispatched',
    isActive: false,
    logo: edmsIcon,
    roles: ['edms', 'superadmin'],
    uName: 'edms',
  },
]

export const pmisTopNav = [
  {
    title: 'Administration',
    href: '/administrative',
    isActive: false,
    logo: AdminIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'administration',
  },
  {
    title: 'Road & Traffic',
    href: '/road-and-traffic/about',
    isActive: false,
    logo: RntIcon,
    roles: ['superadmin', 'r&t-manager'],
    uName: 'road-&-traffic',
  },
  {
    title: 'Main Bridge',
    href: '/mb-pmis/project-overview',
    isActive: true,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'mb-pmis',
  },
  {
    title: 'RTW',
    href: '/rtw',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'rtw',
  },
  
  {
    title: 'Toll Operation',
    href: '/toll/monthly-toll-revenue',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'toll-manager'],
    uName: 'toll',
  },
  {
    title: 'ITS',
    href: '/its',
    isActive: false,
    logo: ItsIcon,
    roles: ['superadmin', 'its-manager'],
    uName: 'its',
  },
  {
    title: 'EDMS',
    href: '/edms/dispatched',
    isActive: false,
    logo: edmsIcon,
    roles: ['edms', 'superadmin'],
    uName: 'edms',
  },
]
export const edmsSecondNav=[
   {
    title: 'Administration',
    href: 'administrative',
    isActive: false,
    logo: AdminIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'administration',
  },
  {
    title: 'Road & Traffic',
    href: '/road-and-traffic',
    isActive: false,
    logo: RntIcon,
    roles: ['superadmin', 'r&t-manager'],
    uName: 'road-&-traffic',
  },
  {
    title: 'Main Bridge',
    href: '/mb-pmis/project-overview',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'mb-pmis',
  },
  {
    title: 'RTW',
    href: '/rtw',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'admin', 'finance-manager', 'clinic'],
    uName: 'rtw',
  },

  {
    title: 'Toll Operation',
    href: '/toll/monthly-toll-revenue',
    isActive: false,
    logo: edmsIcon,
    roles: ['superadmin', 'toll-manager'],
    uName: 'toll',
  },
  {
    title: 'ITS',
    href: '/its',
    isActive: true,
    logo: ItsIcon,
    roles: ['superadmin', 'its-manager'],
    uName: 'its',
  },
]
export const edmsTopNav = [
  {
    title: 'EDMS',
    href: '/edms/dispatched',
    isActive: true,
    logo: edmsIcon,
    roles: ['edms', 'superadmin'],
    uName: 'edms',
  },
]

// Function to filter navigation links based on user roles
export const getFilteredNavLinks = (navLinks: any[], userRoles: string[]) => {
  return navLinks.filter((link) => {
    if (link.roles.includes('all')) return true
    return hasRole(userRoles, link.roles)
  })
}

function GiIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className='w-5 h-5'
      viewBox='0 0 22 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2.059 16.468H6.176V8.234H2.059V16.468ZM8.235 16.468H12.352V2.059H8.234L8.235 16.468ZM14.411 16.468H18.528V10.293H14.41L14.411 16.468ZM0 18.527V6.176H6.176V0H14.41V8.234H20.586V18.527H0Z'
        fill='white'
      />
    </svg>
  )
}

function AdminIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      className='icon icon-tabler icon-tabler-user-shield h-5 w-5'
      viewBox='0 0 24 24'
      strokeWidth='2'
      stroke='white'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M6 21v-2a4 4 0 0 1 4 -4h2' />
      <path d='M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5z' />
      <path d='M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0' />
    </svg>
  )
}

function RntIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      version='1.1'
      id='Layer_1'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      x='0px'
      y='0px'
      viewBox='0 0 24 24'
      className='h-5 w-5'
      strokeWidth='0.5'
      stroke='white'
      xmlSpace='preserve'
    >
      <style
        type='text/css'
        dangerouslySetInnerHTML={{ __html: '\n\t.st0{fill:#FFFFFF;}\n' }}
      />
      <path
        className='st0'
        d='M21,22.7c-6,0-12,0-18.1,0c-0.3-0.2-0.3-0.3-0.2-0.6c0.4-1.4,0.7-2.8,1.1-4.1c0-0.1,0-0.1,0-0.2
	c-0.3,0-0.6,0-0.9,0c-0.4,0-0.6-0.2-0.6-0.6c0-0.5,0-1,0-1.5c0-1.2,0-2.5,0-3.7c0-0.1,0-0.2-0.1-0.2c-0.3-0.1-0.4-0.3-0.4-0.6
	c0-0.3,0-0.6,0-0.9c-0.3,0-0.5,0-0.6-0.2c0-0.7,0-1.3,0-2c0.1-0.2,0.3-0.3,0.5-0.3c0.2,0,0.3,0,0.5,0c0-0.5,0-1,0-1.5
	c-0.2,0-0.3,0-0.5,0c-0.2,0-0.4-0.1-0.5-0.2c0-0.4,0-0.8,0-1.2c0.1-0.2,0.3-0.2,0.5-0.2c1.7,0,3.5,0,5.2,0c0.1,0,0.2,0,0.3-0.2
	C7.5,3.5,7.8,2.6,8,1.6c0-0.2,0.1-0.3,0.3-0.4c2.5,0,5,0,7.4,0C15.9,1.3,16,1.5,16,1.6c0.2,0.9,0.5,1.8,0.7,2.8
	c0,0.2,0.1,0.2,0.3,0.2c1.7,0,3.5,0,5.2,0c0.2,0,0.4,0,0.5,0.2c0,0.4,0,0.8,0,1.2c-0.1,0.2-0.3,0.3-0.5,0.2c-0.2,0-0.3,0-0.5,0
	c0,0.5,0,1,0,1.5c0.2,0,0.3,0,0.5,0c0.2,0,0.4,0.1,0.5,0.3c0,0.7,0,1.3,0,2c-0.1,0.2-0.3,0.3-0.6,0.2c0,0.4,0,0.7,0,1
	c0,0.3-0.1,0.4-0.4,0.5c-0.1,0-0.1,0.1-0.1,0.2c0,0.3,0,0.6,0,0.8c0,0.2-0.1,0.3-0.3,0.3c-0.2,0-0.3-0.1-0.3-0.3c0-0.1,0-0.2,0-0.2
	c0-0.3,0-0.5,0-0.8c-0.3,0-0.7,0-1,0c0,1.8,0,3.5,0,5.3c0.3,0,0.7,0,1,0c0-0.9,0-1.8,0-2.6c0-0.1,0-0.2,0-0.3c0-0.2,0.1-0.3,0.3-0.3
	c0.2,0,0.3,0.1,0.3,0.3c0,0.1,0,0.1,0,0.2c0,0.9,0,1.8,0,2.7c0,0.5-0.2,0.7-0.7,0.7c-0.3,0-0.5,0-0.8,0c0,0.1,0,0.1,0,0.2
	c0.4,1.4,0.7,2.7,1.1,4.1C21.3,22.4,21.3,22.5,21,22.7z M13.5,22c0-0.1,0-0.1,0-0.1c0-1.1-0.1-2.3-0.1-3.4c-0.1-1.7-0.1-3.4-0.2-5.2
	c0-0.2,0.1-0.4,0.3-0.4c0.2,0,0.3,0.1,0.3,0.4c0,0.4,0,0.9,0,1.3c0.1,2,0.1,3.9,0.2,5.8c0,0.5,0,1,0.1,1.6c2.1,0,4.3,0,6.4,0
	c-1-3.9-2-7.9-3-11.8c-1.3,0-2.6,0-3.8,0c0,0.1,0,0.2,0,0.3c0,0.4,0,0.8,0,1.2c0,0.2-0.1,0.3-0.3,0.3c-0.2,0-0.3-0.1-0.3-0.3
	c0-0.2,0-0.3,0-0.5c0-0.4,0-0.7,0-1.1c-0.3,0-0.5,0-0.7,0c0,3.9,0,7.8,0,11.8C12.7,22,13.1,22,13.5,22z M9.8,22
	c0.2-3.9,0.3-7.9,0.5-11.8c-1.3,0-2.6,0-3.9,0c-1,3.9-2,7.8-3,11.8C5.6,22,7.7,22,9.8,22z M1.9,9.6c6.7,0,13.4,0,20.1,0
	c0-0.4,0-0.8,0-1.2c-6.7,0-13.4,0-20.1,0C1.9,8.8,1.9,9.2,1.9,9.6z M16.5,6.3c-0.1,0-0.2,0-0.3,0c-2.2,0-4.4,0-6.6,0
	c-0.1,0-0.2,0-0.2,0C9.2,6.2,9.1,6.1,9.1,6c0-0.2,0.1-0.3,0.3-0.3c0.1,0,0.2,0,0.2,0c4.1,0,8.1,0,12.2,0c0.1,0,0.2,0,0.3,0
	c0-0.2,0-0.3,0-0.4c-6.7,0-13.4,0-20.1,0c0,0.1,0,0.3,0,0.4c0.1,0,0.2,0,0.3,0c1.4,0,2.7,0,4.1,0c0.6,0,1.1,0,1.7,0
	c0.2,0,0.3,0.1,0.3,0.3c0,0.2-0.1,0.3-0.3,0.3c-0.1,0-0.2,0-0.4,0c0,0.5,0,1,0,1.5c3,0,6,0,8.9,0C16.5,7.3,16.5,6.8,16.5,6.3z
	 M11.7,22c0-3.9,0-7.9,0-11.8c-0.3,0-0.5,0-0.8,0c-0.2,3.9-0.3,7.9-0.5,11.8C10.9,22,11.3,22,11.7,22z M10.6,1.9c-0.7,0-1.4,0-2,0
	C8.3,2.8,8.1,3.7,7.9,4.6c0.9,0,1.7,0,2.6,0C10.5,3.7,10.6,2.8,10.6,1.9z M16.1,4.6c-0.2-0.9-0.5-1.8-0.7-2.7c-0.7,0-1.4,0-2,0
	c0,0.9,0.1,1.8,0.1,2.7C14.4,4.6,15.2,4.6,16.1,4.6z M4,17.1c0-1.8,0-3.5,0-5.3c-0.3,0-0.6,0-1,0c0,1.8,0,3.5,0,5.3
	C3.3,17.1,3.7,17.1,4,17.1z M6.9,7.8c0-0.5,0-1,0-1.5c-1,0-1.9,0-2.9,0c0,0.5,0,1,0,1.5C5,7.8,5.9,7.8,6.9,7.8z M20,6.3
	c-1,0-1.9,0-2.9,0c0,0.5,0,1,0,1.4c1,0,1.9,0,2.9,0C20,7.3,20,6.8,20,6.3z M4.6,14.6C4.6,14.6,4.7,14.6,4.6,14.6
	c0.4-1.4,0.8-2.9,1.2-4.3c-0.2,0-0.4,0-0.7,0c0,0.3,0,0.6,0,1c0,0.3-0.1,0.5-0.4,0.5c-0.1,0-0.2,0.1-0.2,0.2c0,0.6,0,1.2,0,1.8
	C4.6,14,4.6,14.3,4.6,14.6z M18.9,10.2c-0.2,0-0.4,0-0.7,0c0.4,1.5,0.7,2.9,1.1,4.3c0-0.9,0.1-1.8,0-2.7c0,0,0-0.1-0.1-0.1
	c-0.3-0.1-0.4-0.3-0.4-0.6C18.9,10.8,18.9,10.5,18.9,10.2z M4.5,11.1c0-0.3,0-0.6,0-0.9c-0.7,0-1.3,0-2,0c0,0.3,0,0.6,0,0.9
	C3.2,11.1,3.8,11.1,4.5,11.1z M21.5,10.2c-0.7,0-1.3,0-2,0c0,0.3,0,0.6,0,0.9c0.7,0,1.3,0,2,0C21.5,10.8,21.5,10.5,21.5,10.2z
	 M11.2,1.9c0,0.9-0.1,1.8-0.1,2.7c0.2,0,0.4,0,0.5,0c0-0.9,0-1.8,0-2.7C11.5,1.9,11.4,1.9,11.2,1.9z M12.3,4.6c0.1,0,0.3,0,0.4,0
	c0.1,0,0.2,0,0.1-0.2c0-0.7-0.1-1.4-0.1-2c0-0.2,0-0.4,0-0.5c-0.2,0-0.3,0-0.4,0C12.3,2.8,12.3,3.7,12.3,4.6z M2.9,6.3
	c0,0.5,0,1,0,1.5c0.1,0,0.3,0,0.4,0c0-0.5,0-1,0-1.5C3.2,6.3,3.1,6.3,2.9,6.3z M21.1,6.3c-0.1,0-0.3,0-0.4,0c0,0.5,0,1,0,1.4
	c0.1,0,0.3,0,0.4,0C21.1,7.3,21.1,6.8,21.1,6.3z'
      />
    </svg>
  )
}

function FinanceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      className='w-5 h-5'
      viewBox='0 0 24 24'
    >
      <path
        id='mdi--finance'
        d='M6.556,19,3,22.489V12.484H6.556m5.927,4.339-1.861-1.588L8.927,16.8V7.742h3.556m5.927,7.113-3.556,3.556V3h3.556m3.331,11.629L19.6,12.484h5.927v5.927L23.4,16.289l-8.547,8.476-4.113-3.58L6.26,25.523H3l7.67-7.516,4.185,3.533'
        transform='translate(-3 -3)'
        fill='#fff'
      />
    </svg>
  )
}

function ItsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon icon-tabler icons-tabler-outline icon-tabler-device-imac w-5 h-5'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M3 4a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-12z' />
      <path d='M3 13h18' />
      <path d='M8 21h8' />
      <path d='M10 17l-.5 4' />
      <path d='M14 17l.5 4' />
    </svg>
  )
}

function tollIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='250'
      height='250'
      viewBox='0 0 12 12'
    >
      <path
        fill='currentColor'
        d='M2.5 1a.5.5 0 0 0-.5.5V13h-.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1H7v-2.901l6.776-4.553a.5.5 0 0 0 .136-.694l-.279-.415a.5.5 0 0 0-.693-.136L7 8.29V2h.5a.5.5 0 0 0 0-1h-5ZM3 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-4Z'
      />
    </svg>
  )
}

function edmsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon icon-tabler icons-tabler-outline icon-tabler-report-search w-5 h-5'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697' />
      <path d='M18 12v-5a2 2 0 0 0 -2 -2h-2' />
      <path d='M8 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z' />
      <path d='M8 11h4' />
      <path d='M8 15h3' />
      <path d='M16.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0' />
      <path d='M18.5 19.5l2.5 2.5' />
    </svg>
  )
}