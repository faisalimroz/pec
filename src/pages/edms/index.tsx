import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'
import { edmsLinks } from '@/data/sidelinks'
import { edmsTopNav, getFilteredNavLinks } from '@/data/edmsNavLinks'
import { useAuth } from '@/provider/authProvider'
import DynamicEdmsContent from './DynamicContent'
import FileTreeSidebar from './DynamicContent'

export default function EdmsDispatched() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  const { roles, permissions } = useAuth()
  const userRoles = roles.map((role) => role.title)

  const selectedNav = edmsTopNav
  const filteredNavLinks = getFilteredNavLinks(selectedNav, userRoles)

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
            <LayoutHeader>
              <TopNav links={filteredNavLinks} />

              <div className='ml-auto flex items-center space-x-4'>
                <UserNav />
              </div>
            </LayoutHeader>

            <LayoutBody className=' p-0 bg-gray-100'>
          
               <FileTreeSidebar/>
           
            </LayoutBody>
          </Layout>
        </div>
      </section>
    </>
  )
}