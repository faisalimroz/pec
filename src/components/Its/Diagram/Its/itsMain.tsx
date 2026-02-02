import { useState } from 'react'
import { Toolbar } from 'primereact/toolbar'
import '../../../../styles/table-style.css'
import { TabView, TabPanel } from 'primereact/tabview'
import NetworkTable from './its-network'
import TollPlazaTable from './its-toll-plaza'
import ExpresswayTable from './its-expressway'
import MiscellaneousTable from './its-miscellaneous'

export default function ItsMain() {
  const [activeIndex, setActiveIndex] = useState(0)

  const leftToolbarTemplate = () => {
    return (
      <div className='flex items-center gap-3 mb-4'>
        <button
          onClick={() => setActiveIndex(0)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 0 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Network
        </button>

        <button
          onClick={() => setActiveIndex(1)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 1 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Toll Plaza
        </button>

        <button
          onClick={() => setActiveIndex(2)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 2 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Expressway
        </button>

        <button
          onClick={() => setActiveIndex(3)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 3 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Miscellaneous
        </button>
      </div>
    )
  }

  return (
    <div className=''>
      <div className='ml-4'>
        <Toolbar
          className='rounded-none border-none p-0 bg-backgournd'
          left={leftToolbarTemplate}
        ></Toolbar>

        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {/* 1st tab  */}
          <TabPanel>
            <NetworkTable />
          </TabPanel>

          {/* 2nd Tab  */}
          <TabPanel>
            <TollPlazaTable />
          </TabPanel>

          {/* 3rd Tab  */}
          <TabPanel>
            <ExpresswayTable />
          </TabPanel>

          {/* 4th Tab  */}
          <TabPanel>
            <MiscellaneousTable />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}
