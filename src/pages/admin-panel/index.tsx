import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, UserCircleIcon } from 'lucide-react'
// import logo from '@/assets/rhd.png'
import logo from '@/assets/rhd-logo.png'
import kecLogo from '@/assets/ex-pic.png'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useAuth } from '@/provider/authProvider'
import { Toaster } from 'sonner'
import '@/index.css'
import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = window.location.pathname
  const { roles, setToken } = useAuth()

  const isSuperAdminOrAdmin = roles.some((role) =>
    ['superadmin'].includes(role.title)
  )

  const noticeBoard = roles.some((role) =>
    ['superadmin', 'notice'].includes(role.title)
  )

  const renderNavLink = (to: any, text: any) => (
    <Link
      to={to}
      className={`
        ${pathname === to ? 'border-zinc-400 border-b-2' : 'border-transparent text-white'}
        inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
      `}
    >
      {text}
    </Link>
  )

  return (
    <>
      <PrimeReactProvider>
        <nav className='bg-main shadow-sm text-white'>
          <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-6'>
            <div className='flex justify-between py-2'>
              <div className='flex items-center'>
                <Link to='/dashboard' className='mr-4'>
                  <div className='flex gap-4 items-center font-medium'>
                    <img src={logo} alt='Logo' className='h-12 w-auto' />
                    <h3>PADMA MULTIPURPOSE<br />BRIDGE PROJECT</h3>
                  </div>
                </Link>
                <div className='hidden sm:ml-6 sm:flex sm:space-x-8 text-white'>
                  {isSuperAdminOrAdmin && (
                    <>
                      {renderNavLink(
                        '/admin-panel/create-roles',
                        'Role Creation'
                      )}

                      {renderNavLink('/admin-panel/update-user', 'Update User')}
                      {renderNavLink('/admin-panel/toll-amount', 'Toll Amount')}
                    </>
                  )}
                  {noticeBoard && (
                    <>
                      {renderNavLink(
                        '/admin-panel/notice-board',
                        'Notice Board'
                      )}
                    </>
                  )}
                  {isSuperAdminOrAdmin && (
                    <>{renderNavLink('/admin-panel/user-log', 'User Log')}</>
                  )}
                  {renderNavLink(
                    '/admin-panel/password-reset',
                    'Reset Password'
                  )}
                </div>
              </div>
              <div className='hidden sm:ml-6 sm:flex sm:items-center'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className='relative rounded-full bg-main p-1 text-white hover:bg-main'>
                      <span className='absolute -inset-1.5' />
                      <span className='sr-only'>Open user menu</span>
                      <UserCircleIcon className='h-8 w-8 rounded-full text-white stroke-1' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={() => setToken(null)}
                      className='cursor-pointer text-red-500 font-semibold hover:bg-red-500 hover:text-white'
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className='ml-2'>
                  <img className='w-auto h-10' src={kecLogo} alt='Logo' />
                </div>
              </div>
              <div className='mr-2 flex items-center sm:hidden'>
                <Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-red-600 focus:ring-0 focus:ring-offset-0'>
                  <span className='sr-only'>Open main menu</span>
                  <Menu className='block h-6 w-6' aria-hidden='true' />
                </Button>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <Toaster position='bottom-right' richColors closeButton />
      </PrimeReactProvider>
    </>
  )
}
