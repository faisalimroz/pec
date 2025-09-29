import React from 'react'
import { NavLink } from 'react-router-dom'

interface NavLinkItem {
  title: string
  href: string
  logo?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}
interface NewNavbarProps {
  links: NavLinkItem[]
}

// force absolute path + collapse duplicate slashes
const normalizeHref = (href: string) => {
  const h = (href || '').trim().replace(/^\/+/, '') // strip leading slashes
  // If it already starts with "edms/", keep it. Otherwise, prefix it.
  const withBase = h.startsWith('edms/') ? h : `edms/${h}`
  return '/' + withBase.replace(/\/{2,}/g, '/')
}

const NewNavbar: React.FC<NewNavbarProps> = ({ links }) => {
  return (
    <nav className="bg-nav flex items-center h-auto px-10 py-3">
      {links.map((link) => {
        const to = normalizeHref(link.href)
        return (
          <NavLink
            key={link.title}
            to={to}
            className={({ isActive }) =>
              [
                'flex flex-1 items-center rounded-md gap-2 py-2 px-4 text-sm font-semibold text-white hover:bg-shadow',
                isActive ? 'bg-shadow' : '',
              ].join(' ')
            }
          >
            {link.logo && <link.logo className="h-4 w-4" />}
            <span>{link.title}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default NewNavbar
