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


export function TopNav({ className, links, ...props }: TopNavProps) {
  const location = useLocation()
  const showLogo = location.pathname === '/dashboard'
  const { permissions } = useAuth()
  
  const processedLinks = React.useMemo(() => {
    if (!links || !permissions || permissions.length === 0) return links
    const extendedPermissions = permissions as unknown as ExtendedPermission[]

    return links.map((link) => {
      const departmentName = link.uName
      console.log(departmentName,'djfosd')

      if (!departmentName) return link
      const excludedDepartments = [
        'general-information',
        'edms',
        'administration',
        'finance-&-accounts',
        'clinic',
        'ai-dashboard',
        'notice',    
      ]


      if (excludedDepartments.includes(departmentName)) {
        return link
      }
      const baseHref = `/${departmentName}`
  const department = extendedPermissions.find(
        (dept) => dept.displayName === departmentName
      )

      
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
 const isEdmsActive = processedLinks.some(link => link.isActive && link.title === 'EDMS');
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
              <img src={logo} alt='Logo' className='h-8 w-auto' />
              <h3 className='text-xs'>PADMA MULTIPURPOSE<br />BRIDGE PROJECT</h3>
            </div>
          </Link>
        )}
        {processedLinks.map(({ title, href, isActive, logo: Logo }) => (
          console.log('Processed Link:', { title, href, isActive }),
          <Link
            key={`${title}-${href}`}
            to={href}
            className={cn(
              'font-roboto text-xs font-medium flex items-center gap-1 xl:gap-2 px-2 py-1 rounded-md transition-colors hover:bg-white/10 ml-8',
              isActive ? 'bg-white/20' : ''
            )}
          >
            {Logo && <Logo className='h-4 w-4' />} {title}
            
          </Link>
          
        ))}
       
      </nav>
     
      {isEdmsActive && (
        <div className="hidden lg:flex flex-grow justify-center items-center">
          <h2 className="text-md font-bold text-white">Electronic Document Management System (EDMS)</h2>
        </div>
      )}
    </div>
  )
}