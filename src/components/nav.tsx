import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { Button, buttonVariants } from './custom/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { cn } from '@/lib/utils'
import useCheckActiveNav from '@/hooks/use-check-active-nav'
import { SideLink } from '@/data/sidelinks'
import { useState } from 'react'
import { useAuth } from '@/provider/authProvider'

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  links: SideLink[]
  closeNav: () => void
}

export default function Nav({
  links,
  isCollapsed,
  className,
  closeNav,
}: NavProps) {
  const { permissions } = useAuth()

  const allowedUNames = new Set<string>()

  // Check parent permissions before adding their corresponding menu items
  const hasAdminAuthority = permissions.some(
    (p) => p.name === 'admin' && p.authority
  )
  const hasFinanceAuthority = permissions.some(
    (p) => p.name === 'finance-manager' && p.authority
  )
  const hasClinicAuthority = permissions.some(
    (p) => p.name === 'clinic' && p.authority
  )

  // Only add menu items if their parent permissions are active
  if (hasAdminAuthority) {
    allowedUNames.add('administrative')
  }
  if (hasFinanceAuthority) {
    allowedUNames.add('finance-&-accounts')
  }
  if (hasClinicAuthority) {
    allowedUNames.add('clinic-center')
  }

  // Add other permissions based on child authorities
  permissions.forEach((permission) => {
    permission.children.forEach((child) => {
      if (child.view_authority || child.edit_authority) {
        allowedUNames.add(child.name)
      }
    })
  })

  const filteredLinks = links.filter((link) => {
    return !link.uName || allowedUNames.has(link.uName)
  })

  const renderLink = ({ sub, ...rest }: SideLink) => {
    const key = `${rest.title}-${rest.href}`
    if (isCollapsed && sub)
      return (
        <NavLinkIconDropdown
          {...rest}
          sub={sub}
          key={key}
          closeNav={closeNav}
        />
      )

    if (isCollapsed)
      return <NavLinkIcon {...rest} key={key} closeNav={closeNav} />

    if (sub)
      return (
        <NavLinkDropdown {...rest} sub={sub} key={key} closeNav={closeNav} />
      )

    return <NavLink {...rest} key={key} closeNav={closeNav} />
  }
  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        'group border-b bg-background py-2 transition-[max-height,padding] duration-500 data-[collapsed=true]:py-2 md:border-none',
        className
      )}
    >
      <TooltipProvider delayDuration={0}>
        <nav className='grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
          {filteredLinks.map(renderLink)}
        </nav>
      </TooltipProvider>
    </div>
  )
}

interface NavLinkProps extends SideLink {
  subLink?: boolean
  closeNav: () => void
}

function NavLink({
  title,
  icon,
  label,
  href,
  closeNav,
  subLink = false,
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  const isActive = checkActiveNav(href)

  const isDisabled = href === ''

  return (
    <>
      <Link
        to={href}
        onClick={isDisabled ? undefined : closeNav}
        className={cn(
          buttonVariants({
            variant: 'ghost',
            size: 'lg',
          }),
          'h-12 justify-start text-wrap rounded-none px-6 text-xs text-black',
          subLink &&
            'h-10 w-full border-l border-l-slate-500 px-2 text-[#4E4E4E] text-xs',
          isDisabled &&
            'cursor-default opacity-80 border-b border-t border-dashed border-slate-500'
        )}
        aria-current={isActive && !isDisabled ? 'page' : undefined}
      >
        <div className='mr-2'>{icon}</div>
        <span
          className={cn(
            isActive && !isDisabled && 'text-main underline underline-offset-4',
            isDisabled &&
              'text-[12px] uppercase tracking-wider opacity-70 font-semibold pl-6 select-none cursor-default'
          )}
        >
          {title}
        </span>

        {label && (
          <div className='ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground'>
            {label}
          </div>
        )}
      </Link>
    </>
  )
}

// function NavLinkDropdown({ title, icon, label, sub, closeNav }: NavLinkProps) {
//   const { checkActiveNav } = useCheckActiveNav()

//   /* Open collapsible by default
//    * if one of child element is active */
//   const [isOpen, setIsOpen] = useState(
//     !!sub?.find((s) => checkActiveNav(s.href))
//   )

//   const handleClick = () => {
//     setIsOpen(!isOpen)
//   }
//   const isChildActive = !!sub?.find((s) => checkActiveNav(s.href))
//   // use this in the Collapsible if you want to open by default  "defaultOpen = { isChildActive }"

//   return (
//     <Collapsible open={isOpen} onOpenChange={setIsOpen}>
//       <CollapsibleTrigger
//         className={cn(
//           buttonVariants({ variant: 'ghost', size: 'lg' }),
//           'group h-12 w-full justify-start rounded-none px-6 text-xs text-black'
//         )}
//         onClick={handleClick}
//       >
//         <div className='mr-2'>{icon}</div>
//         {title}
//         <span
//           className={cn(
//             'ml-auto transition-all group-data-[state="open"]:-rotate-180'
//           )}
//         >
//           <ChevronDown />
//         </span>
//       </CollapsibleTrigger>
//       <CollapsibleContent className='collapsibleDropdown' asChild>
//         <ul>
//           {sub!.map((sublink) => (
//             <li key={sublink.title} className='my-1 ml-8'>
//               <NavLink {...sublink} subLink closeNav={() => setIsOpen(false)} />
//               {/* <NavLink {...sublink} subLink closeNav={closeNav} /> */}
//             </li>
//           ))}
//         </ul>
//       </CollapsibleContent>
//     </Collapsible>
//   )
// }
function NavLinkDropdown({ title, icon, label, sub, closeNav }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()

  /* Open collapsible by default
   * if one of child element is active */
  const [isOpen, setIsOpen] = useState(
    !!sub?.find((s) => checkActiveNav(s.href))
  )

  const handleClick = () => {
    setIsOpen(!isOpen)
  }
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href))

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'lg' }),
          // 1. Changed h-12 to "h-auto min-h-12 py-3" to allow expansion
          // 2. Added "items-center" to ensure vertical alignment
          'group h-auto min-h-12 w-full justify-start items-center rounded-none px-6 text-xs text-black py-3'
        )}
        onClick={handleClick}
      >
        {/* 3. Added shrink-0 to prevent icon from squashing */}
        <div className='mr-2 shrink-0'>{icon}</div>
        
        {/* 4. Wrapped title in a span to handle wrapping and take up available space */}
        <span className='flex-1 text-left whitespace-normal leading-tight'>
          {title}
        </span>

        <span
          className={cn(
            // 5. Added shrink-0 to ensure chevron is always visible
            'ml-2 shrink-0 transition-all group-data-[state="open"]:-rotate-180'
          )}
        >
          <ChevronDown />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className='collapsibleDropdown' asChild>
        <ul>
          {sub!.map((sublink) => (
            <li key={sublink.title} className='my-1 ml-8'>
              <NavLink {...sublink} subLink closeNav={() => setIsOpen(false)} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
function NavLinkIcon({ title, icon, label, href }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          to={href}
          className={cn(
            buttonVariants({
              variant: checkActiveNav(href) ? 'secondary' : 'ghost',
              size: 'icon',
            }),
            'h-12 w-12'
          )}
        >
          {icon}
          <span className='sr-only'>{title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side='right' className='flex items-center gap-4'>
        {title}
        {label && (
          <span className='ml-auto text-muted-foreground'>{label}</span>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function NavLinkIconDropdown({ title, icon, label, sub }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()

  /* Open collapsible by default
   * if one of child element is active */
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href))

  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant={isChildActive ? 'secondary' : 'ghost'}
              size='icon'
              className='h-12 w-12'
            >
              {icon}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side='right' className='flex items-center gap-4'>
          {title}{' '}
          {label && (
            <span className='ml-auto text-muted-foreground'>{label}</span>
          )}
          <ChevronDown size={18} className='-rotate-90 text-muted-foreground' />
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side='right' align='start' sideOffset={4}>
        <DropdownMenuLabel>
          {title} {label ? `(${label})` : ''}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sub!.map(({ title, icon, label, href }) => (
          <DropdownMenuItem key={`${title}-${href}`} asChild>
            <Link
              to={href}
              className={`${checkActiveNav(href) ? 'bg-secondary' : ''}`}
            >
              {icon} <span className='ml-2 max-w-52 text-wrap'>{title}</span>
              {label && <span className='ml-auto text-xs'>{label}</span>}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
