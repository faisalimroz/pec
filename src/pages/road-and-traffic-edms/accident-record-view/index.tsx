import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'
import { rntLinks } from '@/data/sidelinks'
import { getFilteredNavLinks, rntTopNav } from '@/data/topNavLinks'
//@ts-ignore

import DemoTable from '@/components/road-traffic/road-safety-traffic/accident-report-view'
import { Link } from 'react-router-dom'
import { Button } from '@/components/custom/button'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/provider/authProvider'

export default function RoadAndTraffic() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  const { roles } = useAuth()
  const userRoles = roles.map((role) => role.title)

  const selectedNav = rntTopNav
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
              <div className='space-y-4'>
                <Link
                  to='/road-and-traffic/road-safety/analysis'
                  className='ml-4'
                >
                  <Button className='bg-gray-600 hover:bg-gray-800'>
                    <ArrowLeft /> Go Back
                  </Button>
                </Link>
                <DemoTable />
              </div>
            </LayoutBody>
          </Layout>
        </div>
      </section>
    </>
  )
}
