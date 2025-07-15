import { useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import '@/styles/table-style.css'
import ArialVideo from './arialvideo'
import ArialImage from './arialimage'

const ArialMain = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const tabButtons = [
    { label: 'Image', icon: 'pi pi-home' },
    { label: 'Video', icon: 'pi pi-chart-bar' },
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
            <ArialImage />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <ArialVideo />
          </div>
        </TabPanel>
      </TabView>
    </div>
  )
}

export default ArialMain
