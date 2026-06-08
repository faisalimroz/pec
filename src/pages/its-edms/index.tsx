import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'


import DemoTable from '@/components/Its/its-staff-staffSummary'
import { useAuth } from '@/provider/authProvider'
import { edmsTopNav, edmsSecondNav, getFilteredNavLinks } from '@/data/edmsNavLinks'
import NewNavbar from '@/components/edms/new-nav'
import { itsLinks } from '@/data/sidelinks-edms'
export default function ItsMain() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  const { roles } = useAuth()
  const userRoles = roles.map((role) => role.title)

  const selectedNav = edmsTopNav
  const filteredNavLinks = getFilteredNavLinks(selectedNav, userRoles)
  return (
    <>
      <section className='relative h-full overflow-hidden bg-gray-100'>
        

        <div
          id='content'
          className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 h-full`}
        >
          <Layout>
            {/* ===== Top Heading ===== */}
            
  <div>
                <NewNavbar links={edmsSecondNav} />
              </div>
            {/* ===== Main ===== */}
            <LayoutBody className='space-y-4'>
              <div className='h-[calc(100vh)] flex items-center justify-center '>
                <h1 className='text-4xl font-bold tracking-tight md:text-5xl text-center'>
                  Welcome To Intelligent Transport System Department
                </h1>

                {/* <DemoTable /> */}
              </div>
            </LayoutBody>
          </Layout>
        </div>
      </section>
    </>
  )
}
