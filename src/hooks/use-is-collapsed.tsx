import { useEffect } from 'react'
import useLocalStorage from './use-local-storage'
import { useLocation } from 'react-router-dom'
export default function useIsCollapsed() {
  const location = useLocation()
  const isEdmsRoute = location.pathname.startsWith('/edms')

  const [isCollapsed, setIsCollapsed] = useLocalStorage({
    key: 'collapsed-sidebar',
    defaultValue: false,
  })

  useEffect(() => {
    if (isEdmsRoute) {
      // Force collapsed on EDMS
      setIsCollapsed(true)
    } else {
      // Force expanded on all other routes
      setIsCollapsed(false)
    }
  }, [isEdmsRoute, setIsCollapsed])

  // Handle mobile resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [setIsCollapsed])

  return [isCollapsed, setIsCollapsed] as const
}

