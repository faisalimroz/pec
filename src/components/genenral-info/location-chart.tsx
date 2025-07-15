import { useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import ProjectLocation from './location-project'
import OfficeLocation from './location-office'
import TollPlazaLocation from './location-tollplaza'
import '@/styles/table-style.css'

const LocationChart = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const tabButtons = [
    { label: 'Project Location', icon: 'pi pi-map' },
    { label: 'Office Location', icon: 'pi pi-map-marker' },
    { label: 'Toll Plaza Location', icon: 'pi pi-directions' },
  ]

  return (
    <div className='project-info'>
      <div className='flex mb-4 gap-2 justify-content-start ml-3'>
        {tabButtons.map((button, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={
              `flex items-center font-semibold gap-2 px-4 py-2 rounded-md border shadow-sm ` +
              (activeIndex === index
                ? `bg-[#0b1f8f] text-white hover:bg-primary-500`
                : `bg-white text-[#0b1f8f] hover:bg-gray-100`)
            }
          >
            {/* <i className={button.icon} />  */}
            <span>{button.label}</span>
          </button>
        ))}
      </div>

      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
        className='ml-3'
      >
        <TabPanel>
          {/* <div className='flex'>
            <img src={ProjectLocation} alt='' className='w-full' />
          </div> */}
          <ProjectLocation />
        </TabPanel>

        <TabPanel>
          {/* <div className='grid grid-cols-1 items-center gap-8'>
            <img src={OLocation2} alt='' className='w-full' />
            <img src={OLocation} alt='' className='w-full' />
          </div> */}
          <OfficeLocation />
        </TabPanel>

        <TabPanel>
          {/* <div className='grid grid-cols-1 items-center gap-8'>
            <img src={TpLocation2} alt='' className='w-full ' />
            <img src={TpLocation} alt='' className='w-full' />
          </div> */}
          <TollPlazaLocation />
        </TabPanel>
      </TabView>
      {/* <div className='mt-4 flex justify-end'>
        <Button label='Upload Documents' className='p-button-secondary mr-2' />
        <Button label='Download PDF' className='p-button-secondary' />
      </div> */}
    </div>
  )
}

export default LocationChart
