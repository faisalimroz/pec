import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'
import { tollLinks } from '@/data/sidelinks'
import { getFilteredNavLinks, tollTopNav } from '@/data/topNavLinks'
import DemoTable from '@/components/toll/comparison-table'
import { useAuth } from '@/provider/authProvider'

export default function Comparison() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

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
                 Daily Toll & Traffic Data Comparison
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
