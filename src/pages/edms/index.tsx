import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'
import { edmsLinks } from '@/data/sidelinks'
import { edmsSecondNav, edmsTopNav, getFilteredNavLinks } from '@/data/topNavLinks'
import { useAuth } from '@/provider/authProvider'
import NewNavbar from '@/components/edms/new-nav'

export default function EdmsDispatched() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  const { roles, permissions } = useAuth()
  const userRoles = roles.map((role) => role.title)

  const selectedNav = edmsTopNav
  const filteredNavLinks = getFilteredNavLinks(selectedNav, userRoles)
  const secondNav=edmsSecondNav

  return (
    <>
      <section className='relative h-full overflow-hidden bg-background'>
        <Sidebar2
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          sideLinks={edmsLinks}
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
           
             <div>
                <NewNavbar links={secondNav} />
              </div>
            {/* ===== Main ===== */}
             <LayoutBody className='space-y-4 bg-gray-100'>
              <div className='h-[calc(100vh)] flex items-center justify-center '>
                <h1 className='text-4xl font-bold tracking-tight md:text-5xl text-center'>
                  Welcome To EDMS
                </h1>
                
              </div>
            </LayoutBody>
          </Layout>
        </div>
      </section>
    </>
  )
}
