import { useEffect, useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'
import { genInfoLinks } from '@/data/sidelinks'
import { genInfoTopNav, getFilteredNavLinks } from '@/data/topNavLinks'
import { useAuth } from '@/provider/authProvider'
import DemoTable from '@/components/arial_photography/main'

export default function AerialPhoto() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  const { roles } = useAuth()
  const userRoles = roles.map((role) => role.title)
  const selectedNav = genInfoTopNav
  const filteredNavLinks = getFilteredNavLinks(selectedNav, userRoles)


  return (
    <section className='relative h-full overflow-hidden bg-background'>
      <Sidebar2
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        sideLinks={genInfoLinks}
      />
      <div
        id='content'
        className={`overflow-x-hidden transition-[margin] ${isCollapsed ? 'md:ml-14' : 'md:ml-52'} h-full`}
      >
        <Layout>
          <LayoutHeader>
            <TopNav links={filteredNavLinks} />
            <div className='ml-auto flex items-center space-x-4'>
              <UserNav />
            </div>
          </LayoutHeader>
          <LayoutBody className='space-y-4'>
            <div className='space-y-2 px-4'>
              <h1 className='text-2xl font-bold tracking-tight md:text-3xl mb-4'>
                Aerial Photography
              </h1>
              

              <DemoTable />


            </div>
          </LayoutBody>
        </Layout>
      </div>
    </section>
  )
}
