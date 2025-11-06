import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'
import { tollLinks } from '@/data/sidelinks'
import { getFilteredNavLinks, tollTopNav } from '@/data/topNavLinks'
import { useState } from 'react'
import { TabPanel, TabView } from 'primereact/tabview'
import MonthlyTrafficTable from '@/components/toll/manual-monthly-traffic'
import { DhaleshwariChart } from '@/components/charts/dhaleshwari-chart'
import { useAuth } from '@/provider/authProvider'

export default function MonthlyTrafficReport() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  const [activeIndex, setActiveIndex] = useState(0)

  const { roles } = useAuth()
  const userRoles = roles.map((role) => role.title)

  const selectedNav = tollTopNav
  const filteredNavLinks = getFilteredNavLinks(selectedNav, userRoles)
  return (
    <>
      <section className='relative h-full overflow-hidden bg-background'>
        <Sidebar2
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          sideLinks={tollLinks}
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
                  Manual Monthly Traffic Report - Dhaleshwari Toll Plaza
                </h1>

                <div className=''>
                  <div className='ml-4'>
                    <div className='flex items-center gap-3 '>
                      {/* <button
                        onClick={() => setActiveIndex(0)}
                        className={`w-[100px] h-[55px] text-lg font-semibold border-t border-r border-l rounded-t ${activeIndex === 0 ? 'bg-main text-white' : 'bg-white text-gray-800'}`}
                      >
                        Report
                      </button> */}

                      {/* <button
                        onClick={() => setActiveIndex(1)}
                        className={`w-[100px] h-[55px] text-lg font-semibold border-t border-r border-l rounded-t ${activeIndex === 1 ? 'bg-main text-white' : 'bg-white text-gray-800'}`}
                      >
                        Graph
                      </button> */}
                    </div>

                    <TabView
                      activeIndex={activeIndex}
                      onTabChange={(e) => setActiveIndex(e.index)}
                    >
                      {/* 1st tab  */}
                      <TabPanel>
                        <MonthlyTrafficTable />
                      </TabPanel>

                      {/* 2nd Tab  */}
                      {/* <TabPanel>
                        <DhaleshwariChart />
                      </TabPanel> */}
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
