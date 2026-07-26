import { useRef } from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/custom/button'
import { Menu } from 'primereact/menu'
import { useAuth } from '@/provider/authProvider'
import { useNavigate } from 'react-router-dom'
import avatar from '@/assets/avatar.svg'
import kecLogo from '@/assets/ex-pic.png'
import eManualPdf from "@/assets/e-manual.pdf"
import { BookOpen } from 'lucide-react'
export function UserNav() {
  const { setToken, roles, user } = useAuth()
  const navigate = useNavigate()
  const menu = useRef<Menu>(null)

  const isSuperAdminOrAdmin = roles.some((role) =>
    ['superadmin'].includes(role.title)
  )

  const isAiDashboard = roles.some((role) => role.title === 'ai-dashboard')
  const isGuest = roles.some((role) => role.title === 'general-manager')

  const isNotice = roles.some((role) =>
    ['superadmin', 'notice'].includes(role.title)
  )

  // @ts-ignore
  const CustomMenuItem = ({ label, onClick, className = '' }) => (
    <div
      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${className}`}
      onClick={onClick}
    >
      {label}
    </div>
  )

  const items = [
    {
      template: () => (
        <div className='p-2'>
          <p className='text-sm font-medium text-gray-900'>{user?.name}</p>
          <p className='text-xs text-gray-500'>{user?.email}</p>
        </div>
      ),
    },
    { separator: true },

    ...(isAiDashboard
      ? [
        // {
        //   template: () => (
        //     <CustomMenuItem
        //       label='AI Dashboard'
        //       onClick={() => navigate('/ai-dashboard')}
        //     />
        //   ),
        // },
      ]
      : []),

    ...(isGuest
      ? [
        // {
        //   template: () => (
        //     <CustomMenuItem
        //       label='AI Dashboard'
        //       onClick={() => navigate('/ai-dashboard')}
        //     />
        //   ),
        // },
      ]
      : []),

    ...(isSuperAdminOrAdmin
      ? [
        // {
        //   template: () => (
        //     <CustomMenuItem
        //       label='AI Dashboard'
        //       onClick={() => navigate('/ai-dashboard')}
        //     />
        //   ),
        // },
        {
          template: () => (
            <CustomMenuItem
              label='Admin Panel'
              onClick={() => navigate('/admin-panel/create-roles')}
            />
          ),
        },
        {
          template: () => (
            <CustomMenuItem
              label='User Log'
              onClick={() => navigate('/admin-panel/user-log')}
            />
          ),
        },
      ]
      : []),
    ...(isNotice
      ? [
        {
          template: () => (
            <CustomMenuItem
              label='Notice Board'
              onClick={() => navigate('/admin-panel/notice-board')}
            />
          ),
        },
      ]
      : []),
    {
      template: () => (
        <CustomMenuItem
          label='Reset Password'
          onClick={() => navigate('/admin-panel/password-reset')}
        />
      ),
    },
    { separator: true },
    {
      template: () => (
        <CustomMenuItem
          label='Log out'
          onClick={() => {
            setToken(null)
            localStorage.removeItem('token')
            sessionStorage.clear()
            navigate('/', { replace: true })
            window.location.href = '/'
          }}
          className='text-red-600 hover:text-red-700'
        />
      ),
    }
  ]

  return (
    // <div className='flex items-center space-x-2 relative'>
    //   <Menu model={items} popup ref={menu} />
    //   <Button
    //     className='relative h-8 w-8 rounded-full focus:outline-none'
    //     onClick={(e) => menu.current?.toggle(e)}
    //   >
    //     <Avatar className='h-8 w-8 bg-main'>
    //       <AvatarImage src={avatar} alt='@shadcn' />
    //     </Avatar>
    //   </Button>
    //   {/* <div className='ml-4'>
    //     <img src={kecLogo} alt='Logo' className='w-auto h-auto' />
    //   </div> */}
    // </div>
    <div className="relative flex items-center space-x-3">
    
      <a
  href={eManualPdf}
  download="PMBP-e-Manual.pdf"
  title="Download e-Manual"
  className="
    inline-flex h-8 shrink-0 items-center
    gap-1.5 whitespace-nowrap rounded-md
    px-3 text-xs font-medium text-white
    transition hover:bg-white/10
  "
>
  <BookOpen className="h-4 w-4 shrink-0" />
  <span className="whitespace-nowrap">e-Manual</span>
</a>

      {/* Avatar menu */}
      <Menu model={items} popup ref={menu} />

      <Button
        type="button"
        className="relative h-8 w-8 rounded-full focus:outline-none"
        onClick={(e) => menu.current?.toggle(e)}
      >
        <Avatar className="h-8 w-8 bg-main">
          <AvatarImage src={avatar} alt="User avatar" />
        </Avatar>
      </Button>
    </div>
  )
}
