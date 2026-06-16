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
import { Menu, ExternalLink } from 'lucide-react'
import logo from '@/assets/bba.png'
import { useAuth } from '@/provider/authProvider'

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
  const encoder = new TextEncoder()
  
  const processedLinks = React.useMemo(() => {
    if (!links || !permissions || permissions.length === 0) return links
    const extendedPermissions = permissions as unknown as ExtendedPermission[]

    return links.map((link) => {
      const departmentName = link.uName

      if (!departmentName) return link
      const excludedDepartments = [
        'general-information',
        'edms',
        'administration',
        'finance-&-accounts',
        'clinic',
        'ai-dashboard',
        'mb-pmis-manager',
        'rtw-manager',
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

      const firstChild = department.children[0]
      const bothAuthoritiesTrue = firstChild.view_authority === true
      const dynamicHref = bothAuthoritiesTrue ? link.href : baseHref

      return {
        ...link,
        href: dynamicHref,
      }
    })
  }, [links, permissions])

  async function base64UrlEncodeUint8Array(bytes: Uint8Array) {
    let binary = ''
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i])
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }

  async function base64UrlEncodeString(str: string) {
    const bytes = encoder.encode(str)
    return base64UrlEncodeUint8Array(bytes)
  }

  async function createJWT(payload: Record<string, any>, secret: string) {
    const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' })
    const payloadWithIat = { ...payload, iat: Math.floor(Date.now() / 1000) }
    const headerB64 = await base64UrlEncodeString(header)
    const payloadB64 = await base64UrlEncodeString(JSON.stringify(payloadWithIat))
    const data = `${headerB64}.${payloadB64}`

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
    const sigB64 = await base64UrlEncodeUint8Array(new Uint8Array(signature))
    return `${data}.${sigB64}`
  }

const handlePmbpClick = async () => {
  const popup = window.open("", "_blank")

  try {
    const payload = {
      key: "origin-pmis",
      userInfo: {
        userId: "d2342-234e",
        name: "Faisal",
        role: "super-admin",
        email: "generalmanager@kec.com",
      },
    }

    const secret = "ufeQ1e5AqivijXDXEORRNl"
    const token = await createJWT(payload, secret)

    const url = `http://103.161.47.20:5190/verify-token?token=${encodeURIComponent(token)}`

    if (popup) {
      popup.location.href = url
    } else {
      window.location.href = url
    }
  } catch (error) {
    console.error("PMBP redirect failed:", error)

    if (popup) {
      popup.close()
    }
  }
}

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
              <h3 className='text-xs'>PADMA MULTIPURPOSE<br />BRIDGE O & M</h3>
            </div>
          </Link>
        )}
        {processedLinks.map(({ title, href, isActive, logo: Logo }) => (
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
       <button
  type="button"
  onClick={handlePmbpClick}
  className="font-roboto text-xs font-medium flex items-center gap-1 xl:gap-2 px-2 py-1 rounded-md transition-colors hover:bg-white/10 ml-8 cursor-pointer text-white"
>
  <ExternalLink className="h-5 w-5" /> PMBP
</button>
      </nav>
    </div>
  )
}