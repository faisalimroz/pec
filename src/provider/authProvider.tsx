import { jwtDecode } from 'jwt-decode'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'

interface PermissionChild {
  name: string
  view_authority: boolean
  edit_authority: boolean
}

interface Permission {
  name: string
  authority: boolean
  children: PermissionChild[]
}

interface DecodedToken {
  role: Role[]
  exp: number
  iat?: number
  email: string
  name: string
  id: string
  permissions: Permission[]
}

interface User {
  email: string
  name: string
  id: string
}

interface Role {
  title: string
}

interface AuthContextType {
  token: string | null
  setToken: (newToken: string | null) => void
  roles: Role[]
  user?: User
  permissions: Permission[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken_] = useState<string | null>(
    localStorage.getItem('token')
  )

  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [user, setUser] = useState<User>({ email: '', name: '', id: '' })

  const setToken = (newToken: string | null) => {
    setToken_(newToken)
  }

  useEffect(() => {
    let logoutTimer: NodeJS.Timeout | undefined

    const logoutUser = () => {
      setToken(null)
      setRoles([])
      setPermissions([])
    }

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token)
        const expiryTime = decodedToken.exp * 1000
        const remainingTime = expiryTime - Date.now()

        if (remainingTime <= 0) {
          logoutUser()
          return
        }

        setRoles(decodedToken.role)
        setPermissions(decodedToken.permissions)
        setUser({
          email: decodedToken.email,
          name: decodedToken.name,
          id: decodedToken.id,
        })

        logoutTimer = setTimeout(logoutUser, remainingTime)

        localStorage.setItem('token', token)
      } catch (error) {
        console.error('Error decoding token:', error)
        logoutUser()
      }
    } else {
      localStorage.removeItem('token')
      setRoles([])
      setPermissions([])
    }

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer)
    }
  }, [token])

  const contextValue = useMemo<AuthContextType>(
    () => ({
      token,
      setToken,
      roles,
      user,
      permissions,
    }),
    [token, roles, user, permissions]
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider
