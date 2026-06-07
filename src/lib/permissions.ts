export interface PermissionChild {
  name: string
  view_authority: boolean
  edit_authority: boolean
}

export interface Permission {
  name: string
  authority: boolean
  displayName?: string
  children: PermissionChild[]
}

export interface Role {
  title: string
}

/** Maps top-nav uName to permission module name(s) in JWT / admin record */
export const UNAME_TO_PERMISSION_MODULES: Record<string, string[]> = {
  administration: ['admin'],
  'road-&-traffic': ['r&t-manager'],
  'mb-pmis': ['mb-pmis-manager'],
  rtw: ['rtw-manager'],
  toll: ['toll-manager'],
  its: ['its-manager'],
  edms: ['edms'],
  'finance-&-accounts': ['finance-manager'],
  'clinic-center': ['clinic'],
  'general-information': ['general-information'],
  notice: ['notice'],
  'ai-dashboard': ['ai-dashboard'],
}

const hasRole = (userRoles: string[], requiredRoles: string[]) =>
  userRoles.some((role) => requiredRoles.includes(role))

export const isSuperAdminRole = (userRoles: string[]) =>
  userRoles.includes('superadmin')

export const hasModuleAuthority = (
  permissions: Permission[],
  moduleName: string
) =>
  permissions.some((p) => p.name === moduleName && p.authority === true)

export const hasChildPermission = (
  permissions: Permission[],
  moduleName: string,
  childName: string,
  accessType: 'view' | 'edit' = 'view'
) => {
  const modulePerm = permissions.find((p) => p.name === moduleName)
  if (!modulePerm?.authority) return false
  const child = modulePerm.children?.find((c) => c.name === childName)
  if (!child) return false
  return accessType === 'edit' ? child.edit_authority : child.view_authority
}

export const hasNavAccess = (
  uName: string | undefined,
  userRoles: string[],
  permissions: Permission[]
) => {
  if (!uName) return true
  if (isSuperAdminRole(userRoles)) return true

  const moduleNames = UNAME_TO_PERMISSION_MODULES[uName]
  if (moduleNames?.length) {
    const hasPermission = moduleNames.some((mod) =>
      hasModuleAuthority(permissions, mod)
    )
    if (hasPermission) return true
  }

  if (moduleNames?.length) {
    return hasRole(userRoles, moduleNames)
  }

  return false
}

export const getFilteredNavLinks = (
  navLinks: { roles?: string[]; uName?: string }[],
  userRoles: string[],
  permissions: Permission[] = []
) =>
  navLinks.filter((link) => {
    if (link.roles?.includes('all')) return true
    if (isSuperAdminRole(userRoles)) return true

    if (link.uName && permissions.length > 0 && hasNavAccess(link.uName, userRoles, permissions)) {
      return true
    }

    if (link.roles?.length) {
      return hasRole(userRoles, link.roles)
    }

    return false
  })

export const EDMS_CHILD_NAMES = ['dispatched', 'received', 'others'] as const
export type EdmsChildName = (typeof EDMS_CHILD_NAMES)[number]

export const getEdmsChildFromPath = (pathname: string): EdmsChildName | null => {
  const match = pathname.match(/^\/edms\/(dispatched|received|others)(?:\/|$)/)
  return match ? (match[1] as EdmsChildName) : null
}

export const canAccessEdms = (
  permissions: Permission[],
  userRoles: string[],
  childName?: string,
  accessType: 'view' | 'edit' = 'view'
) => {
  if (isSuperAdminRole(userRoles) || hasRole(userRoles, ['edms'])) return true
  if (childName) {
    return hasChildPermission(permissions, 'edms', childName, accessType)
  }
  return hasModuleAuthority(permissions, 'edms')
}

export const canEditEdmsChild = (
  permissions: Permission[],
  userRoles: string[],
  childName: EdmsChildName
) => canAccessEdms(permissions, userRoles, childName, 'edit')

export const hasAnyEdmsAccess = (
  permissions: Permission[],
  userRoles: string[]
) =>
  canAccessEdms(permissions, userRoles) ||
  EDMS_CHILD_NAMES.some((child) =>
    canAccessEdms(permissions, userRoles, child, 'view')
  )

export const getFilteredEdmsSideLinks = <T extends { uName?: string }>(
  links: T[],
  userRoles: string[],
  permissions: Permission[] = []
): T[] =>
  links.filter((link) => {
    if (!link.uName) return true
    if (link.uName === 'edms') {
      return hasAnyEdmsAccess(permissions, userRoles)
    }
    if (EDMS_CHILD_NAMES.includes(link.uName as EdmsChildName)) {
      return canAccessEdms(permissions, userRoles, link.uName, 'view')
    }
    return true
  })
