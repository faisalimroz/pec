import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'

import DemoTable from '@/components/admin/it-electronics-communication/it-elctronics-tools'
import { useAuth } from '@/provider/authProvider'
import { edmsTopNav, edmsSecondNav, getFilteredNavLinks } from '@/data/edmsNavLinks'
import NewNavbar from '@/components/edms/new-nav'
import { administrationLinks } from '@/data/sidelinks-edms'
export default function AssetManagement() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  const { roles } = useAuth()
  const userRoles = roles.map((role) => role.title)

  const selectedNav = edmsTopNav
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
              <div className='space-y-2'>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl pl-4'>
                 Tools
                </h1>
                 
                <DemoTable />
              </div>
            </LayoutBody>
          </Layout>
        </div>
      </section>
    </>
  )
}
