import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'
import { tollLinks } from '@/data/sidelinks'
import { getFilteredNavLinks, tollTopNav } from '@/data/topNavLinks'
import { useState } from 'react'
import { TabPanel, TabView } from 'primereact/tabview'
import TopTenTable from '@/components/toll/top-ten-organization'
import TopTenVehicle from '@/components/toll/top-ten-vehicle'
import { useAuth } from '@/provider/authProvider'
import TopTenAllOrgTable from '@/components/toll/top-ten-all-org'
import TopAllTable from '@/components/toll/top-ten-all-all'

export default function TopTenReport() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  const [activeIndex, setActiveIndex] = useState(0)

  const { roles } = useAuth()
  const userRoles = roles.map((role) => role.title)

  const selectedNav = tollTopNav
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
                  {activeIndex === 0
                    ? 'Top Ten Organization - Dhaleshwari'
                    : activeIndex === 1
                      ? 'Top Ten Vehicle - Dhaleshwari'
                      : activeIndex === 2
                        ? 'All Organization - Dhaleshwari'
                        : 'All - Dhaleshwari'}
                </h1>

                <div className=''>
                  <div className='ml-4'>
                    <div className='flex items-center gap-3 '>
                      <button
                        onClick={() => setActiveIndex(0)}
                        className={`w-[200px] h-[55px] font-semibold border-t border-r border-l rounded-t ${activeIndex === 0 ? 'bg-main text-white' : 'bg-white text-gray-800'}`}
                      >
                        Top Ten Organization
                      </button>

                      <button
                        onClick={() => setActiveIndex(1)}
                        className={`w-[200px] h-[55px] font-semibold border-t border-r border-l rounded-t ${activeIndex === 1 ? 'bg-main text-white' : 'bg-white text-gray-800'}`}
                      >
                        Top Ten Vehicle
                      </button>

                      <button
                        onClick={() => setActiveIndex(2)}
                        className={`w-[200px] h-[55px] font-semibold border-t border-r border-l rounded-t ${activeIndex === 2 ? 'bg-main text-white' : 'bg-white text-gray-800'}`}
                      >
                        All Organization
                      </button>

                      <button
                        onClick={() => setActiveIndex(3)}
                        className={`w-[200px] h-[55px] font-semibold border-t border-r border-l rounded-t ${activeIndex === 3 ? 'bg-main text-white' : 'bg-white text-gray-800'}`}
                      >
                        All
                      </button>
                    </div>

                    <TabView
                      activeIndex={activeIndex}
                      onTabChange={(e) => setActiveIndex(e.index)}
                    >
                      {/* 1st tab  */}
                      <TabPanel>
                        <TopTenTable />
                      </TabPanel>

                      {/* 2nd Tab  */}
                      <TabPanel>
                        <TopTenVehicle />
                      </TabPanel>

                      {/* 3rd Tab */}
                      <TabPanel>
                        <TopTenAllOrgTable />
                      </TabPanel>

                      {/* 4th Tab */}
                      <TabPanel>
                        <TopAllTable />
                      </TabPanel>
                    </TabView>
                  </div>
                </div>
              </div>
            </LayoutBody>
          </Layout>
        </div>
      </section>
    </>
  )
}
