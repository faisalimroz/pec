import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
interface NavLinkItem {
  title: string
  href: string
  logo?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}
interface NewNavbarProps {
  links: NavLinkItem[]
}


const normalizeHref = (href: string) => {
  const h = (href || '').trim().replace(/^\/+/, '')
  const withBase = h.startsWith('edms/') ? h : `edms/${h}`
  return '/' + withBase.replace(/\/{2,}/g, '/')
}

const NewNavbar: React.FC<NewNavbarProps> = ({ links }) => {
  return (
    <nav className="bg-nav flex items-center justify-between h-auto px-10 py-3 ">
      {links.map((link) => {
        const to = normalizeHref(link.href)
        return (
          <NavLink
            key={link.title}
            to={to}
            className={({ isActive }) =>
              [
                // CHANGE gap-2 to gap-3 or gap-4
                'flex  items-center  rounded-md gap-2 py-1 px-2 text-xs font-semibold text-white hover:bg-shadow',
                isActive ? 'bg-shadow' : '',
              ].join(' ')
           
  }
>
        { link.logo && <link.logo className="h-4 w-4" /> }
        <span> { link.title }</span>
</NavLink >
        )
      })}
    </nav >
  )
}

export default NewNavbar
