import { useState } from 'react'
import { Toolbar } from 'primereact/toolbar'
import '../../../../styles/table-style.css'
import { TabView, TabPanel } from 'primereact/tabview'
import WorkingTable from './Working'
import PreventiveTable from './Preventive'
import GeneralTable from './General'
import AfterTable from './AfterMaintenance'
import OMActivityElcImplementation from './elec-implementation'

export default function ElectricityOM() {
  const [activeIndex, setActiveIndex] = useState(0)

  const leftToolbarTemplate = () => {
    return (
      <div className='flex items-center gap-3 mb-4'>
        <button
          onClick={() => setActiveIndex(0)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 0 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Preventive Maintenance
        </button>

        <button
          onClick={() => setActiveIndex(1)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 1 ? 'bg-main' : 'bg-gray-600'}`}
        >
          After Maintenance
        </button>

        <button
          onClick={() => setActiveIndex(2)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 2 ? 'bg-main' : 'bg-gray-600'}`}
        >
          General
        </button>

        <button
          onClick={() => setActiveIndex(3)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 3 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Working Pictures
        </button>

        <button
          onClick={() => setActiveIndex(4)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 4 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Implementation
        </button>
      </div>
    )
  }

  return (
    <div className=''>
      <div className='ml-4'>
        <Toolbar
          className='rounded-none border-none p-0 bg-white'
          left={leftToolbarTemplate}
        ></Toolbar>

        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {/* 1st tab  */}
          <TabPanel>
            <PreventiveTable />
          </TabPanel>

          {/* 2nd Tab  */}
          <TabPanel>
            <AfterTable />
          </TabPanel>

          {/* 3rd Tab  */}
          <TabPanel>
            <GeneralTable />
          </TabPanel>

          {/* 4th Tab  */}
          <TabPanel>
            <WorkingTable />
          </TabPanel>

          {/* 5th Tab  */}
          <TabPanel>
            <OMActivityElcImplementation />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}
