import React from 'react'
import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from './custom/button'
import { Menu } from 'lucide-react'
import logo from '@/assets/bba.png'
import { useAuth } from '@/provider/authProvider'

// Extended Permission interface to include displayName property
interface ExtendedPermission {
  name: string
  displayName: string
  authority: boolean
  children: {
    name: string
    view_authority: boolean
    edit_authority: boolean
  }[]
}

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string
    href: string
    isActive: boolean
    logo?: React.ComponentType<React.SVGProps<SVGSVGElement>>
    uName?: string
    roles?: string[]
  }[]
}

// We've removed the unused NavItem interface and navItems array

export function TopNav({ className, links, ...props }: TopNavProps) {
  const location = useLocation()
  const showLogo = location.pathname === '/dashboard'
  const { permissions } = useAuth()

  const processedLinks = React.useMemo(() => {
    if (!links || !permissions || permissions.length === 0) return links

    const extendedPermissions = permissions as unknown as ExtendedPermission[]

    return links.map((link) => {
      const departmentName = link.uName

      // If no uName or it's not a department we're tracking, return link as is
      if (!departmentName) return link

      // List of departments to exclude from dynamic href logic
      const excludedDepartments = [
        'general-information',
        'edms',
        'administration',
        'finance-&-accounts',
        'clinic',
        'ai-dashboard',
        'notice',
      ]

      // If the department is in the excluded list, return link as is
      if (excludedDepartments.includes(departmentName)) {
        return link
      }

      // Get the base href (department root)
      const baseHref = `/${departmentName}`

      // Find the department in permissions array
      const department = extendedPermissions.find(
        (dept) => dept.displayName === departmentName
      )

      // If department not found or no children, return with baseHref
      if (
        !department ||
        !department.children ||
        department.children.length === 0
      ) {
        return {
          ...link,
          href: baseHref,
        }
      }

      // Check if the first child has both view and edit authority true
      const firstChild = department.children[0]
      const bothAuthoritiesTrue = firstChild.view_authority === true

      // If both view and edit authority are true, use original href, otherwise use baseHref
      const dynamicHref = bothAuthoritiesTrue ? link.href : baseHref

      return {
        ...link,
        href: dynamicHref,
      }
    })
  }, [links, permissions])

  return (
    <div className='flex items-center justify-between w-full'>
      <div className='lg:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='sm' variant='outline'>
              <Menu className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start'>
            {processedLinks.map(({ title, href, isActive }) => (
              <DropdownMenuItem key={`${title}-${href}`} asChild>
                <Link
                  to={href}
                  className={cn(
                    'text-sm',
                    isActive ? 'font-medium' : 'text-muted-foreground'
                  )}
                >
                  {title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          'hidden lg:flex items-center space-x-1 xl:space-x-2 text-white',
          className
        )}
        {...props}
      >
        {showLogo && (
          <Link to='/dashboard' className='mr-4'>
            <div className='flex gap-4 items-center font-medium'>
              <img src={logo} alt='Logo' className='h-12 w-auto' />
              <h3>PADMA MULTIPURPOSE<br />BRIDGE PROJECT</h3>
            </div>
          </Link>
        )}
        {processedLinks.map(({ title, href, isActive, logo: Logo }) => (
          <Link
            key={`${title}-${href}`}
            to={href}
            className={cn(
              'font-roboto text-xs xl:text-sm font-medium flex items-center gap-1 xl:gap-2 px-2 py-1 rounded-md transition-colors hover:bg-white/10 ml-8',
              isActive ? 'bg-white/20' : ''
            )}
          >
            {Logo && <Logo className='h-4 w-4' />} {title}
          </Link>
        ))}

        {/* {authorizedNavItems.length > 0 && (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger
              asChild
              className='bg-transparent text-white font-roboto text-xs xl:text-sm font-medium flex items-center gap-1 xl:gap-2 px-2 py-1 rounded-md transition-colors hover:bg-white/10 ml-8'
            >
              <Button
                variant='ghost'
                className={cn(
                  'h-auto font-roboto text-xs xl:text-sm font-medium flex items-center gap-1 xl:gap-2 px-2 py-1 rounded-md transition-colors hover:bg-white/10 ml-8 hover:text-white',
                  isActive &&
                    'font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5'
                )}
              >
                <svg
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
                Administration & Finance
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-[200px]'>
              {authorizedNavItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild disabled={isPending}>
                  <Link
                    to={item.href}
                    className={cn(
                      'w-full cursor-pointer',
                      location.pathname.startsWith(item.href) && 'font-bold',
                      isPending && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      handleItemClick(item.href)
                    }}
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )} */}
      </nav>
    </div>
  )
}
