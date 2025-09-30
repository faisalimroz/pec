import { useEffect, useState } from 'react'
import { ChevronLeft, Menu, X } from 'lucide-react'
import { Layout, LayoutHeader } from './custom/layout'
import { Button } from './custom/button'
import Nav from './nav'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import rhdLogo from '@/assets/rhd-logo.png'
import logo from '@/assets/bba.png'

interface SideLink {
  title: string
  href: string
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  sideLinks: SideLink[]
}

export default function Sidebar2({
  className,
  isCollapsed,
  setIsCollapsed,
  sideLinks,
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)

  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [navOpened])

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? 'md:w-16' : 'md:w-60'}`,
        className
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'} w-full bg-black md:hidden`}
      />

      <Layout>
        {/* Header */}
        <LayoutHeader className='sticky top-0 justify-between bg-main px-4 py-3 shadow md:px-1'>
          <div className={`flex items-center ${!isCollapsed ? 'gap-2' : ''}`}>
            <Link to='/dashboard'>
              <img
                src={rhdLogo}
                alt='Logo'
                className={`transition-all ${isCollapsed ? 'h-12 w-12' : 'h-0 w-0'}`}
              />
             
            </Link>

            <div
              className={`flex flex-col justify-end truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
            >
              <Link to='/dashboard' className='mr-4'>
                <div className='flex gap-4 items-center font-medium text-white'>
                  <img src={logo} alt='Logo' className='h-10 w-auto' />
                  <h3 className='text-xs'>PADMA MULTIPURPOSE<br />BRIDGE PROJECT</h3>
                </div>
              </Link>
            </div>
          </div>

          {/* Toggle Button in mobile */}
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            aria-label='Toggle Navigation'
            aria-controls='sidebar-menu'
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <X /> : <Menu />}
          </Button>
        </LayoutHeader>
         
        {/* Navigation links */}
        <Nav
          id='sidebar-menu'
          className={`h-full font-roboto flex-1 overflow-auto ${navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'}`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          // @ts-ignore
          links={sideLinks}
        />

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size='icon'
          variant='outline'
          className='absolute -right-6 top-4 hidden rounded-full md:inline-flex'
        >
          <ChevronLeft
            className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
      </Layout>
    </aside>
  )
}
