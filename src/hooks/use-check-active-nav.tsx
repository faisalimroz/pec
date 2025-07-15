import { useLocation } from 'react-router-dom'

export default function useCheckActiveNav() {
  const { pathname } = useLocation()

  const checkActiveNav = (nav: string) => {
    if (nav === '/') return pathname === '/'
    return pathname.startsWith(nav)
  }

  return { checkActiveNav }
}
