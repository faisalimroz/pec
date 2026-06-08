import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'
import { tollLinks } from '@/data/sidelinks'
import { tollTopNav } from '@/data/topNavLinks'
import DemoTable from '@/components/toll/vehicle-detect-vehicle'
import { useParams } from 'react-router-dom'

export default function VehicleDetectVehicle() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  const { id } = useParams()
  return (
    <>
      <section className='relative h-full overflow-hidden bg-background'>
        

        <div
          id='content'
          className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 h-full`}
        >
          <Layout>
            {/* ===== Top Heading ===== */}
            <LayoutHeader>
              <TopNav links={tollTopNav} />
              <div className='ml-auto flex items-center space-x-4'>
                <UserNav />
              </div>
            </LayoutHeader>

            {/* ===== Main ===== */}
            <LayoutBody className='space-y-4'>
              <div className='space-y-2'>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl pl-4 mb-6'>
                  {id &&
                    id.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, function (a) {
                      return a.toUpperCase()
                    })}{' '}
                  - Vehicle Movement Details
                </h1>

                {id && <DemoTable id={id} />}
              </div>
            </LayoutBody>
          </Layout>
        </div>
      </section>
    </>
  )
}
