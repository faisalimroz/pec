// import { Navigate, Outlet } from 'react-router-dom'
// import { useAuth } from '../../provider/authProvider'

// export default function ProtectedRoute() {
//   const { token,permissions } = useAuth()
// console.log("permissions in protected route:",permissions);
//   // Check if the user is authenticated
//   if (!token) {
//     // If not authenticated, redirect to the login page
//     return <Navigate to='/' />
//   }

//   // If authenticated, render the child routes
//   return <Outlet />
// }
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../provider/authProvider'

export default function ProtectedRoute() {
  const { token, permissions } = useAuth()
  const location = useLocation()
  

// console.log("permissions in protected route:", permissions);
  // Check if the user is authenticated
  if (!token) {
    return <Navigate to='/' />
  }

  // Get current path and check if it's an EDMS route
  const currentPath = location.pathname
  const isEDMSRoute = currentPath.startsWith('/edms')
  
  // console.log("Current path:", currentPath, "Is EDMS route:", isEDMSRoute)

  // If accessing EDMS route, check EDMS permissions
  if (isEDMSRoute) {
    const hasEDMSAccess = permissions.some(permission => 
      (permission.name === 'edms') && 
      permission.authority === true
    )

    console.log("EDMS access check:", {
      hasEDMSAccess,
      permissions: permissions.map(p => ({
        name: p.name,
        authority: p.authority
      }))
    })

    if (!hasEDMSAccess) {
      console.log("No EDMS access, redirecting to dashboard")
      return <Navigate to='/dashboard' replace />
    }
  }

  return <Outlet />
}