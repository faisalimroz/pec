import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'
import { itsLinks } from '@/data/sidelinks-edms'
import { getFilteredNavLinks, itsTopNav, rntTopNav } from '@/data/edmsNavLinks'
import DemoTable from '@/components/Its/SystemConfigure/system-configure'
import { useAuth } from '@/provider/authProvider'
import NewNavbar from '@/components/edms/new-nav'
import {  edmsSecondNav, edmsTopNav} from '@/data/topNavLinks'
export default function AccidentReport() {
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
                  System configure
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
