import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'
import { administrationLinks } from '@/data/sidelinks'
import { adminTopNav, getFilteredNavLinks } from '@/data/topNavLinks'
import DemoTable from '@/components/admin/hr/em-personal-detail'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/provider/authProvider'

export default function EmployeePersonalProfile() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  const { id } = useParams()

  const { roles } = useAuth()
  const userRoles = roles.map((role) => role.title)

  const selectedNav = adminTopNav
  const filteredNavLinks = getFilteredNavLinks(selectedNav, userRoles)
  return (
    <>
      <section className='relative h-full overflow-hidden bg-background'>
        

        <div
          id='content'
          className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 h-full`}
        >
          <Layout>
            {/* ===== Top Heading ===== */}
         

            {/* ===== Main ===== */}
            <LayoutBody className='space-y-4'>
              {id && <DemoTable id={id} />}
            </LayoutBody>
          </Layout>
        </div>
      </section>
    </>
  )
}