import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'
import { rtwLinks } from '@/data/sidelinks'
import { getFilteredNavLinks, rtwTopNav } from '@/data/topNavLinks'
// import DemoTable from '@/components/road-traffic/road-safety-traffic/accident-report-view'
import { Link } from 'react-router-dom'
import { useAuth } from '@/provider/authProvider'
import Projectoverview from '@/components/rtw/project-overview'

export default function RoadAndTraffic() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  const { roles } = useAuth()
  const userRoles = roles.map((role) => role.title)
  const selectedNav = rtwTopNav
  const filteredNavLinks = getFilteredNavLinks(selectedNav, userRoles)
  return (
    <>
      <section className='relative h-full overflow-hidden bg-background'>
        <Sidebar2
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          sideLinks={rtwLinks}
        />
        <div
          id='content'
          className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-52'} h-full`}
        >
          <Layout>
            {/* ===== Top Heading ===== */}
            <LayoutHeader>
              <TopNav links={filteredNavLinks} />
              <div className='ml-auto flex items-center space-x-4'>
                <UserNav />
              </div>
            </LayoutHeader>

            {/* ===== Main ===== */}
            <LayoutBody className='space-y-4'>
              <div className='space-y-2'>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl pl-4'>
                  Project Overview
                </h1>
                <button className='px-2 py-2 bg-main text-sm font-semibold text-white rounded-lg ml-4'>
                  Document List
                </button>

                <Projectoverview />
              </div>
            </LayoutBody>
          </Layout>
        </div>
      </section>
    </>
  )
}
