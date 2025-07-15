import { useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import '@/styles/table-style.css'
import GsSummary from './summary'
import Overview from './overview'
import AboutKec from './about'
import ProjectLayout from './layout'

const ProjectInfo = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const tabButtons = [
    { label: 'Summary', icon: 'pi pi-home' },
    { label: 'Overview', icon: 'pi pi-chart-bar' },
    { label: 'About KEC', icon: 'pi pi-info-circle' },
    { label: 'Layout', icon: 'pi pi-sitemap' },
  ]

  return (
    <div className='project-info'>
      <div className='flex mb-4 gap-2 justify-content-start ml-3'>
        {tabButtons.map((button, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={
              `flex font-semibold items-center gap-2 px-4 py-2 rounded-md border shadow-sm ` +
              (activeIndex === index
                ? `bg-[#0b1f8f] text-white hover:bg-primary-500`
                : `bg-white text-[#0b1f8f] hover:bg-gray-100`)
            }
          >
            {/* <i className={button.icon} /> */}
            <span>{button.label}</span>
          </button>
        ))}
      </div>

      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel>
          <div>
            <GsSummary />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <Overview />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <AboutKec />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <ProjectLayout />
          </div>
        </TabPanel>
      </TabView>
    </div>
  )
}

export default ProjectInfo
